"""
Rule-Based Recommendation and Skill Prioritization Engine.
NOTE: This engine uses an explicit, deterministic heuristic ranking formula.
It is NOT machine learning and does not make black-box probabilistic predictions.
"""

from typing import List, Dict, Any
from benchmarks import get_role_benchmark, categorize_skill_status


def evaluate_skill_gaps_and_priorities(
    student_skills: List[Dict[str, Any]],
    role_slug: str = "software-developer"
) -> Dict[str, Any]:
    """
    Evaluates student skills against target role benchmarks, computes gaps,
    and applies a deterministic prerequisite-aware ranking formula to prioritize interventions.

    Scoring Formula:
      raw_gap = max(0.0, target_score - current_score)
      gap_ratio = raw_gap / 100.0
      prereq_multiplier = 1.0 if prerequisites satisfied (score >= 60) else 0.65
      blocker_boost = 0.25 if this skill is a prerequisite blocking other skills with gaps
      foundational_boost = 0.15 if is_foundational

      Priority Metric = (gap_ratio * importance_weight * prereq_multiplier) + blocker_boost + foundational_boost
    """
    benchmark = get_role_benchmark(role_slug)
    benchmark_skills = benchmark["skills"]

    # Map existing student skills by normalized name/id
    student_skill_map: Dict[str, float] = {}
    for s in student_skills:
        name_key = s.get("skill_name", s.get("name", "")).strip().lower()
        score = float(s.get("current_score", s.get("current", 0.0)))
        student_skill_map[name_key] = score
        # Also store short name mapping if available
        short_key = s.get("short_name", s.get("shortName", "")).strip().lower()
        if short_key:
            student_skill_map[short_key] = score

    analyzed_skills = []

    # First pass: Determine baseline gaps
    for skill_id, b_meta in benchmark_skills.items():
        name_lower = b_meta["name"].lower()
        short_lower = b_meta["short_name"].lower()

        current_score = student_skill_map.get(
            name_lower,
            student_skill_map.get(short_lower, 0.0)
        )
        target_score = float(b_meta["target_score"])
        gap = max(0.0, round(target_score - current_score, 1))
        status = categorize_skill_status(current_score, target_score)

        analyzed_skills.append({
            "id": skill_id,
            "name": b_meta["name"],
            "short_name": b_meta["short_name"],
            "current_score": current_score,
            "target_score": target_score,
            "gap": gap,
            "status": status,
            "importance_weight": b_meta["importance_weight"],
            "prerequisites": b_meta["prerequisites"],
            "is_foundational": b_meta["is_foundational"],
            "topics": b_meta.get("topics", [])
        })

    # Second pass: Evaluate prerequisites and blockers
    recommendations = []
    for skill in analyzed_skills:
        current_score = skill["current_score"]
        gap = skill["gap"]
        weight = skill["importance_weight"]

        # Check prerequisites
        prereqs_satisfied = True
        unsatisfied_prereqs = []
        for prereq in skill["prerequisites"]:
            prereq_score = student_skill_map.get(prereq.lower(), 0.0)
            if prereq_score < 60.0:
                prereqs_satisfied = False
                unsatisfied_prereqs.append(prereq)

        # Check if this skill is blocking other downstream skills
        is_blocking_others = False
        blocked_skills = []
        for other in analyzed_skills:
            if skill["name"] in other["prerequisites"] and skill["current_score"] < 60.0 and other["gap"] > 0:
                is_blocking_others = True
                blocked_skills.append(other["name"])

        # Compute priority metric
        gap_ratio = gap / 100.0
        prereq_multiplier = 1.0 if prereqs_satisfied else 0.65
        blocker_boost = 0.25 if is_blocking_others else 0.0
        foundational_boost = 0.15 if (skill["is_foundational"] and gap > 0) else 0.0

        if gap == 0.0:
            priority_metric = 0.0
            priority_level = "LOW"
            explanation = f"Benchmark target met ({current_score}% / {skill['target_score']}%). Maintain consistency."
        else:
            priority_metric = round(
                (gap_ratio * weight * prereq_multiplier) + blocker_boost + foundational_boost,
                3
            )
            if priority_metric >= 0.45 or gap >= 35.0:
                priority_level = "HIGH"
            elif priority_metric >= 0.20:
                priority_level = "MEDIUM"
            else:
                priority_level = "LOW"

            if is_blocking_others:
                explanation = (
                    f"{skill['name']} has a {gap}% gap and is a prerequisite blocking {', '.join(blocked_skills)}. "
                    "Master this foundation first."
                )
            elif not prereqs_satisfied:
                explanation = (
                    f"{skill['name']} has a {gap}% gap, but prerequisite(s) ({', '.join(unsatisfied_prereqs)}) "
                    "require review before advancing."
                )
            else:
                explanation = (
                    f"{skill['name']} has a {gap}% deficit against the {skill['target_score']}% role benchmark. "
                    f"Directly impacts {benchmark['role_name']} placement qualification."
                )

        skill["priority"] = priority_level
        skill["priority_metric"] = priority_metric
        skill["explanation"] = explanation

        if gap > 0.0:
            recommendations.append({
                "id": f"rec-{skill['id']}",
                "skill_id": skill["id"],
                "skill_name": skill["name"],
                "short_name": skill["short_name"],
                "priority": priority_level,
                "priority_metric": priority_metric,
                "gap": gap,
                "current_score": current_score,
                "target_score": skill["target_score"],
                "metric_display": f"{int(current_score)}% / {int(skill['target_score'])}%",
                "title": f"{skill['name']} Competency Gap",
                "description": explanation,
                "action_text": "Launch Assessment" if skill["short_name"] == "DSA" else "Open Learning Path",
                "target_route": "assessments" if skill["short_name"] == "DSA" else "learning-path"
            })

    # Sort skills and recommendations by priority metric descending
    analyzed_skills.sort(key=lambda x: x["priority_metric"], reverse=True)
    recommendations.sort(key=lambda x: x["priority_metric"], reverse=True)

    return {
        "role": benchmark["role_name"],
        "role_slug": role_slug,
        "skills": analyzed_skills,
        "recommendations": recommendations,
        "summary": {
            "total_skills_audited": len(analyzed_skills),
            "mastered_count": sum(1 for s in analyzed_skills if s["status"] == "Mastered"),
            "moderate_count": sum(1 for s in analyzed_skills if s["status"] == "Moderate"),
            "weak_count": sum(1 for s in analyzed_skills if s["status"] == "Weak"),
            "missing_count": sum(1 for s in analyzed_skills if s["status"] == "Missing"),
            "high_priority_count": sum(1 for s in analyzed_skills if s["priority"] == "HIGH")
        }
    }
