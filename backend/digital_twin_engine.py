"""
Student Digital Twin Synthesis Engine.
Harmonizes academic performance, verified skill competencies,
assessment diagnostic results, and study habit consistency into a unified Digital Twin state.
"""

from datetime import datetime, timezone
from typing import Dict, Any, List
from academic_engine import perform_academic_audit
from priority_engine import evaluate_skill_gaps_and_priorities


def build_student_digital_twin(
    student_profile: Dict[str, Any],
    academic_records: List[Dict[str, Any]],
    skills: List[Dict[str, Any]],
    assessments_history: List[Dict[str, Any]],
    study_tasks: List[Dict[str, Any]],
    role_slug: str = "software-developer"
) -> Dict[str, Any]:
    """
    Computes holistic 360-degree Student Digital Twin readiness indicators.

    Formulas:
      1. Academic Health (0-100) = (0.65 * CGPA * 10) + (0.35 * Average Attendance)
      2. Technical Skills (0-100) = Mean of all evaluated technical skill scores
      3. Assessment Confidence (0-100) = Mean of verified assessment attempt scores (or baseline)
      4. Placement Readiness (0-100) = (0.55 * Tech Skills) + (0.25 * Academic Health) + (0.20 * Assessment Confidence)
      5. Learning Consistency (0-100) = (0.5 * min(100, streak * 6.5)) + (0.5 * task_completion_pct)
    """
    # 1. Academic Audit
    academic_audit = perform_academic_audit(academic_records)
    cgpa = academic_audit.get("cgpa", float(student_profile.get("cgpa", 7.5)))
    attendance = academic_audit.get("average_attendance", 85.0)
    academic_health = round(min(100.0, max(0.0, (0.65 * cgpa * 10.0) + (0.35 * attendance))), 1)

    # 2. Skill Gap & Priority Evaluation
    skills_evaluation = evaluate_skill_gaps_and_priorities(skills, role_slug)
    evaluated_skills = skills_evaluation["skills"]

    if evaluated_skills:
        tech_score = round(sum(s["current_score"] for s in evaluated_skills) / len(evaluated_skills), 1)
    else:
        tech_score = 65.0

    # 3. Assessment History
    if assessments_history:
        recent_scores = [float(a.get("score", 70.0)) for a in assessments_history]
        assessment_confidence = round(sum(recent_scores) / len(recent_scores), 1)
    else:
        assessment_confidence = float(student_profile.get("assessmentConfidenceScore", 68.0))

    # 4. Study Habit Consistency
    streak_days = int(student_profile.get("learningStreakDays", student_profile.get("learning_streak_days", 14)))
    if study_tasks:
        completed_tasks = sum(1 for t in study_tasks if t.get("completed", False) or t.get("completion_status") == "Completed")
        task_ratio = (completed_tasks / len(study_tasks)) * 100.0
    else:
        task_ratio = 75.0

    streak_factor = min(100.0, streak_days * 6.5)
    learning_consistency = round((0.5 * streak_factor) + (0.5 * task_ratio), 1)

    # 5. Composite Placement Readiness Indicator
    placement_readiness = round(
        (0.55 * tech_score) + (0.25 * academic_health) + (0.20 * assessment_confidence),
        1
    )

    return {
        "student_id": student_profile.get("student_id", student_profile.get("id", "STD-2024-8842")),
        "student_name": student_profile.get("name", "Student Learner"),
        "target_role": skills_evaluation["role"],
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "disclaimer": (
            "Explainable Heuristic Notice: Placement readiness and competency scores are calculated "
            "using explicit curricular weights and industry target criteria. They represent relative "
            "preparation progress and do NOT constitute a scientifically guaranteed probability of employment."
        ),
        "readiness_indicators": {
            "overall_readiness": int(round(placement_readiness)),
            "placement_readiness_score": int(round(placement_readiness)),
            "academic_health_score": int(round(academic_health)),
            "technical_skills_score": int(round(tech_score)),
            "assessment_confidence_score": int(round(assessment_confidence)),
            "learning_consistency_score": int(round(learning_consistency)),
            "projects_score": int(round(student_profile.get("projectsScore", 64))),
            "certifications_score": int(round(student_profile.get("certificationsScore", 82)))
        },
        "academic_summary": {
            "cgpa": cgpa,
            "average_attendance": attendance,
            "completed_credits": academic_audit.get("completed_credits", 98),
            "total_degree_credits": academic_audit.get("total_degree_credits", 140)
        },
        "skills_summary": skills_evaluation["summary"],
        "top_recommendations": skills_evaluation["recommendations"][:5]
    }
