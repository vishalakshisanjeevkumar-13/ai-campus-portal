"""
Assessment Submission and Skill Recalibration Service.
Evaluates submitted quizzes against server-side answer keys,
applies the documented skill update rule, prevents duplicates,
and recalculates skill gaps and Digital Twin readiness.
"""

from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from fastapi import HTTPException, status
import hashlib
import json

from assessment_catalog import get_assessment
from priority_engine import evaluate_skill_gaps_and_priorities
from digital_twin_engine import build_student_digital_twin

# In-memory deduplication and recent attempt cache
_recent_submission_cache: Dict[str, Dict[str, Any]] = {}

# Configurable Skill Learning Rate (Alpha)
# 0.55 historical confidence weight + 0.45 new assessment weight
SKILL_UPDATE_ALPHA = 0.55


def compute_submission_hash(student_id: str, assessment_id: str, answers: Dict[str, Any], token: Optional[str]) -> str:
    """Generates an idempotency hash to detect and prevent duplicate submissions."""
    if token:
        raw = f"{student_id}:{assessment_id}:{token}"
    else:
        # Sort answers by question key for deterministic representation
        sorted_answers = sorted([(str(k), str(v)) for k, v in answers.items()])
        raw = f"{student_id}:{assessment_id}:{json.dumps(sorted_answers)}"
    return hashlib.sha256(raw.encode()).hexdigest()


def evaluate_and_process_submission(
    student_id: str,
    assessment_id: str,
    submitted_answers: Dict[str, Any],
    submission_token: Optional[str],
    current_skills: List[Dict[str, Any]],
    student_profile: Dict[str, Any],
    academic_records: List[Dict[str, Any]],
    past_attempts: List[Dict[str, Any]],
    study_tasks: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Evaluates assessment submission:
      1. Validates assessment ID and question IDs
      2. Scores answers server-side against secure answer key
      3. Checks for duplicate submissions to avoid double-bumping scores
      4. Updates target skill using documented Exponential Moving Average formula
      5. Re-evaluates skill gaps, recommendations, and Student Digital Twin state
    """
    # 1. Validate assessment exists
    assessment = get_assessment(assessment_id)
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Assessment '{assessment_id}' not found in server catalog."
        )

    # 2. Check for duplicate submission within session
    sub_hash = compute_submission_hash(student_id, assessment_id, submitted_answers, submission_token)
    if sub_hash in _recent_submission_cache:
        cached = _recent_submission_cache[sub_hash]
        cached_result = dict(cached)
        cached_result["duplicate"] = True
        cached_result["notice"] = "Duplicate submission detected: Returned previously evaluated result without double-modifying skills."
        return cached_result

    questions = assessment["questions"]
    total_questions = len(questions)

    # 3. Validate answers and grade server-side
    correct_count = 0
    question_results = []

    # Map question IDs to question definitions
    q_map = {q["id"]: q for q in questions}

    for q_id, q_data in q_map.items():
        # User answer can be keyed as int or string in JSON
        user_choice = submitted_answers.get(q_id, submitted_answers.get(str(q_id)))

        # Validate answer value if provided
        if user_choice is not None:
            if not isinstance(user_choice, int) or user_choice < 0 or user_choice >= len(q_data["options"]):
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=f"Invalid option index '{user_choice}' for Question ID {q_id}."
                )

        is_correct = (user_choice is not None and user_choice == q_data["correct_index"])
        if is_correct:
            correct_count += 1

        user_text = q_data["options"][user_choice] if user_choice is not None else "No Answer"
        correct_text = q_data["options"][q_data["correct_index"]]

        question_results.append({
            "question_id": q_id,
            "question_text": q_data["question"],
            "user_choice_index": user_choice,
            "user_choice_text": user_text,
            "correct_choice_index": q_data["correct_index"],
            "correct_choice_text": correct_text,
            "is_correct": is_correct,
            "explanation": q_data["explanation"]
        })

    score_percentage = round((correct_count / total_questions) * 100.0, 1)

    # 4. Identify Target Skill to Update
    target_skill_name = assessment.get("skill_name", "Data Structures & Algorithms")
    target_skill_id = assessment.get("skill_id", "skill-dsa")

    # Locate current skill score
    current_skill_score = 42.0  # Baseline default for Alex Morgan
    updated_skills_list = []
    found_skill = False

    for s in current_skills:
        s_name = s.get("skill_name", s.get("name", ""))
        s_id = s.get("id", s.get("skill_id", ""))
        if s_id == target_skill_id or "data structures" in s_name.lower() or "dsa" in s_name.lower():
            current_skill_score = float(s.get("current_score", s.get("current", 42.0)))
            found_skill = True
            break

    # 5. Apply Documented Skill Update Rule (EMA)
    # New Score = round(ALPHA * Current_Score + (1 - ALPHA) * Quiz_Score, 1)
    new_skill_score = round(
        (SKILL_UPDATE_ALPHA * current_skill_score) + ((1.0 - SKILL_UPDATE_ALPHA) * score_percentage),
        1
    )
    # Ensure score stays in valid 0-100 range
    new_skill_score = min(100.0, max(0.0, new_skill_score))

    # Reconstruct updated skills list
    for s in current_skills:
        s_copy = dict(s)
        s_name = s_copy.get("skill_name", s_copy.get("name", ""))
        s_id = s_copy.get("id", s_copy.get("skill_id", ""))
        if s_id == target_skill_id or "data structures" in s_name.lower() or "dsa" in s_name.lower():
            s_copy["current_score"] = new_skill_score
            s_copy["current"] = new_skill_score
            s_copy["gap"] = max(0.0, round(float(s_copy.get("target_score", s_copy.get("target", 80.0))) - new_skill_score, 1))
            s_copy["assessmentScore"] = score_percentage
            s_copy["status"] = "Mastered" if new_skill_score >= 80.0 else "Moderate" if new_skill_score >= 50.0 else "Weak"
            updated_skills_list.append(s_copy)
        else:
            updated_skills_list.append(s_copy)

    if not found_skill:
        updated_skills_list.append({
            "id": target_skill_id,
            "skill_name": target_skill_name,
            "name": target_skill_name,
            "short_name": "DSA",
            "current_score": new_skill_score,
            "current": new_skill_score,
            "target_score": 80.0,
            "target": 80.0,
            "gap": max(0.0, round(80.0 - new_skill_score, 1)),
            "status": "Moderate" if new_skill_score >= 50.0 else "Weak"
        })

    # 6. Recalculate Skill Gaps, Priorities, and Digital Twin State
    role_slug = student_profile.get("targetRole", "software-developer")
    gaps_and_priorities = evaluate_skill_gaps_and_priorities(updated_skills_list, role_slug)

    # Append this new attempt to past attempts for history calculation
    new_attempt_record = {
        "assessment_id": assessment_id,
        "assessment_title": assessment["title"],
        "student_id": student_id,
        "score": score_percentage,
        "total_marks": 100,
        "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    updated_attempts = [new_attempt_record] + past_attempts

    updated_digital_twin = build_student_digital_twin(
        student_profile=student_profile,
        academic_records=academic_records,
        skills=updated_skills_list,
        assessments_history=updated_attempts,
        study_tasks=study_tasks,
        role_slug=role_slug
    )

    result = {
        "student_id": student_id,
        "assessment_id": assessment_id,
        "assessment_title": assessment["title"],
        "skill_id": target_skill_id,
        "skill_name": target_skill_name,
        "total_questions": total_questions,
        "correct_count": correct_count,
        "score_percentage": score_percentage,
        "previous_skill_score": current_skill_score,
        "new_skill_score": new_skill_score,
        "skill_improvement": round(new_skill_score - current_skill_score, 1),
        "update_rule": (
            f"Exponential Moving Average: New Score = ({SKILL_UPDATE_ALPHA} * {current_skill_score}) + "
            f"({round(1 - SKILL_UPDATE_ALPHA, 2)} * {score_percentage}) = {new_skill_score}%"
        ),
        "question_results": question_results,
        "updated_skills": gaps_and_priorities["skills"],
        "updated_recommendations": gaps_and_priorities["recommendations"],
        "digital_twin": updated_digital_twin,
        "submitted_at": datetime.now(timezone.utc).isoformat(),
        "duplicate": False
    }

    # Store in deduplication cache
    _recent_submission_cache[sub_hash] = result
    return result
