"""
Academic Audit Intelligence Engine.
Calculates subject percentages, credit-weighted SGPA, cumulative CGPA,
and attendance indicators using a configurable university grading policy.
"""

from typing import List, Dict, Any, Optional

# Configurable 10-point university grading scale
DEFAULT_GRADING_SCALE = [
    {"min_percent": 90.0, "grade": "O",  "grade_point": 10.0, "status": "Outstanding"},
    {"min_percent": 80.0, "grade": "A+", "grade_point": 9.0,  "status": "Excellent"},
    {"min_percent": 70.0, "grade": "A",  "grade_point": 8.0,  "status": "Very Good"},
    {"min_percent": 60.0, "grade": "B+", "grade_point": 7.0,  "status": "Good"},
    {"min_percent": 55.0, "grade": "B",  "grade_point": 6.0,  "status": "Above Average"},
    {"min_percent": 50.0, "grade": "C",  "grade_point": 5.0,  "status": "Pass"},
    {"min_percent": 0.0,  "grade": "F",  "grade_point": 0.0,  "status": "Fail"}
]


def score_to_grade(percentage: float, scale=None) -> Dict[str, Any]:
    """Maps a percentage score to a grade, grade point, and description."""
    grading_scale = scale or DEFAULT_GRADING_SCALE
    for tier in grading_scale:
        if percentage >= tier["min_percent"]:
            return tier
    return {"grade": "F", "grade_point": 0.0, "status": "Fail"}


def perform_academic_audit(records: List[Dict[str, Any]], total_degree_credits: int = 140) -> Dict[str, Any]:
    """
    Performs full academic audit on a student's course records.
    Explicitly uses credit-weighted calculations:
      SGPA = Sum(grade_point * credits) / Sum(credits) for semester
      CGPA = Sum(grade_point * credits) / Sum(all credits)
    """
    if not records:
        return {
            "status": "incomplete",
            "message": "No academic records found for this student. Please add semester course grades to compute audit.",
            "completed_credits": 0,
            "total_degree_credits": total_degree_credits,
            "credit_completion_percent": 0.0,
            "cgpa": 0.0,
            "average_attendance": 0.0,
            "semesters": {}
        }

    semesters_map: Dict[str, List[Dict[str, Any]]] = {}
    total_credit_points = 0.0
    total_earned_credits = 0
    total_attendance_accum = 0.0
    valid_courses_count = 0

    audited_courses = []

    for r in records:
        marks = float(r.get("marks", 0))
        max_marks = float(r.get("max_marks", 100))
        credits = int(r.get("credits", 3))
        attendance = float(r.get("attendance", 0.0))
        semester = str(r.get("semester", "Current Semester")).strip()

        if max_marks <= 0:
            continue

        pct = round((marks / max_marks) * 100.0, 1)
        grade_info = score_to_grade(pct)

        course_summary = {
            "subject": r.get("subject", "Unknown Course"),
            "marks": marks,
            "max_marks": max_marks,
            "percentage": pct,
            "grade": grade_info["grade"],
            "grade_point": grade_info["grade_point"],
            "credits": credits,
            "attendance": attendance,
            "status": grade_info["status"]
        }

        audited_courses.append(course_summary)
        semesters_map.setdefault(semester, []).append(course_summary)

        # Cumulative accumulators
        total_credit_points += (grade_info["grade_point"] * credits)
        total_earned_credits += credits
        total_attendance_accum += attendance
        valid_courses_count += 1

    if valid_courses_count == 0 or total_earned_credits == 0:
        return {
            "status": "incomplete",
            "message": "Academic records contained invalid marks or zero credits.",
            "completed_credits": 0,
            "total_degree_credits": total_degree_credits,
            "credit_completion_percent": 0.0,
            "cgpa": 0.0,
            "average_attendance": 0.0,
            "semesters": {}
        }

    # Calculate per-semester SGPA
    semester_audits = {}
    for sem_name, courses in semesters_map.items():
        sem_credits = sum(c["credits"] for c in courses)
        sem_points = sum(c["grade_point"] * c["credits"] for c in courses)
        sem_attendance = round(sum(c["attendance"] for c in courses) / len(courses), 1)
        sgpa = round(sem_points / sem_credits, 2) if sem_credits > 0 else 0.0

        semester_audits[sem_name] = {
            "sgpa": sgpa,
            "total_credits": sem_credits,
            "average_attendance": sem_attendance,
            "courses_count": len(courses),
            "courses": courses
        }

    overall_cgpa = round(total_credit_points / total_earned_credits, 2)
    overall_attendance = round(total_attendance_accum / valid_courses_count, 1)
    credit_completion_pct = round((total_earned_credits / total_degree_credits) * 100.0, 1)

    return {
        "status": "complete",
        "message": "Academic audit successfully computed.",
        "cgpa": overall_cgpa,
        "completed_credits": total_earned_credits,
        "total_degree_credits": total_degree_credits,
        "credit_completion_percent": credit_completion_pct,
        "average_attendance": overall_attendance,
        "attendance_status": "Healthy" if overall_attendance >= 75.0 else "Attendance Shortage Alert",
        "total_courses_audited": valid_courses_count,
        "semesters": semester_audits
    }
