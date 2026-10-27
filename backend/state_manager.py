"""
State Manager and Persistence Adapter for AI Campus Companion.
Synchronizes data with MongoDB when available, and provides high-availability
in-memory caching for isolated student sessions.
"""

from typing import Dict, Any, List, Optional
from database import (
    get_database,
    check_database_connection,
    COLLECTION_STUDENTS,
    COLLECTION_ACADEMICS,
    COLLECTION_SKILLS,
    COLLECTION_ASSESSMENTS,
    COLLECTION_STUDY_TASKS
)

# Initial Seed State for Student Demo (Alex Morgan)
DEFAULT_STUDENT_ID = "STD-2024-8842"

INITIAL_STUDENT_PROFILE = {
    "student_id": DEFAULT_STUDENT_ID,
    "id": DEFAULT_STUDENT_ID,
    "name": "Alex Morgan",
    "email": "alex.morgan@campus.edu",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    "department": "Computer Science & Engineering",
    "semester": "6th Semester",
    "year": "3rd Year (6th Semester)",
    "college": "Institute of Technology & AI Research",
    "cgpa": 7.8,
    "targetRole": "Software Developer",
    "target_career_role": "Software Developer",
    "careerGoal": "Full-Stack Software Engineer at top-tier product tech enterprise",
    "availableStudyHoursPerWeek": 18,
    "learningStreakDays": 14,
    "completedTasksCount": 48,
    "totalAssessmentsTaken": 12,
    "assessmentConfidenceScore": 68,
    "projectsScore": 64,
    "certificationsScore": 82
}

INITIAL_ACADEMIC_RECORDS = [
    {"student_id": DEFAULT_STUDENT_ID, "subject": "Data Structures & Algorithms", "marks": 62.0, "max_marks": 100.0, "credits": 4, "attendance": 84.0, "semester": "5th Semester"},
    {"student_id": DEFAULT_STUDENT_ID, "subject": "Database Management Systems", "marks": 78.0, "max_marks": 100.0, "credits": 4, "attendance": 90.0, "semester": "5th Semester"},
    {"student_id": DEFAULT_STUDENT_ID, "subject": "Operating Systems", "marks": 71.0, "max_marks": 100.0, "credits": 3, "attendance": 82.0, "semester": "5th Semester"},
    {"student_id": DEFAULT_STUDENT_ID, "subject": "Computer Networks", "marks": 83.0, "max_marks": 100.0, "credits": 3, "attendance": 92.0, "semester": "5th Semester"},
    {"student_id": DEFAULT_STUDENT_ID, "subject": "Java Enterprise Programming", "marks": 68.0, "max_marks": 100.0, "credits": 4, "attendance": 85.0, "semester": "5th Semester"},
    {"student_id": DEFAULT_STUDENT_ID, "subject": "Discrete Mathematics & Graph Theory", "marks": 74.0, "max_marks": 100.0, "credits": 3, "attendance": 81.0, "semester": "5th Semester"}
]

INITIAL_SKILLS = [
    {"id": "skill-dsa", "skill_name": "Data Structures & Algorithms", "short_name": "DSA", "current_score": 42.0, "target_score": 80.0, "target_role": "Software Developer"},
    {"id": "skill-java", "skill_name": "Java Core & OOP", "short_name": "Java", "current_score": 68.0, "target_score": 80.0, "target_role": "Software Developer"},
    {"id": "skill-sql", "skill_name": "SQL & Relational Databases", "short_name": "SQL", "current_score": 74.0, "target_score": 75.0, "target_role": "Software Developer"},
    {"id": "skill-react", "skill_name": "React & Frontend Architecture", "short_name": "React", "current_score": 61.0, "target_score": 75.0, "target_role": "Software Developer"},
    {"id": "skill-git", "skill_name": "Git & Version Control", "short_name": "Git", "current_score": 82.0, "target_score": 70.0, "target_role": "Software Developer"},
    {"id": "skill-python", "skill_name": "Python Programming", "short_name": "Python", "current_score": 71.0, "target_score": 75.0, "target_role": "Software Developer"},
    {"id": "skill-springboot", "skill_name": "Spring Boot & Microservices", "short_name": "Spring Boot", "current_score": 30.0, "target_score": 75.0, "target_role": "Software Developer"},
    {"id": "skill-systemdesign", "skill_name": "System Design & Architecture", "short_name": "System Design", "current_score": 25.0, "target_score": 65.0, "target_role": "Software Developer"}
]

INITIAL_ATTEMPTS = [
    {"assessment_id": "assess-dsa-diagnostic", "assessment_title": "DSA Basics Diagnostic", "score": 42.0, "date": "2024-05-14", "total_marks": 100},
    {"assessment_id": "assess-sql-1", "assessment_title": "SQL Basics & Schema Design", "score": 74.0, "date": "2024-05-22", "total_marks": 100},
    {"assessment_id": "assess-java-1", "assessment_title": "Java OOP Concepts", "score": 68.0, "date": "2024-06-02", "total_marks": 100}
]

INITIAL_STUDY_TASKS = [
    {"student_id": DEFAULT_STUDENT_ID, "title": "Arrays & Searching Techniques", "related_skill": "DSA", "priority": "HIGH", "estimated_hours": 0.5, "completed": False, "completion_status": "In Progress"},
    {"student_id": DEFAULT_STUDENT_ID, "title": "Java OOP & Polymorphism Refresher", "related_skill": "Java", "priority": "MEDIUM", "estimated_hours": 0.5, "completed": False, "completion_status": "Pending"},
    {"student_id": DEFAULT_STUDENT_ID, "title": "SQL Complex Joins & Subqueries", "related_skill": "SQL", "priority": "MEDIUM", "estimated_hours": 0.35, "completed": True, "completion_status": "Completed"}
]

# In-memory storage for active demo sessions
_memory_store: Dict[str, Dict[str, Any]] = {
    DEFAULT_STUDENT_ID: {
        "profile": dict(INITIAL_STUDENT_PROFILE),
        "academics": [dict(a) for a in INITIAL_ACADEMIC_RECORDS],
        "skills": [dict(s) for s in INITIAL_SKILLS],
        "attempts": [dict(att) for att in INITIAL_ATTEMPTS],
        "tasks": [dict(t) for t in INITIAL_STUDY_TASKS]
    }
}


def get_student_data(student_id: str = DEFAULT_STUDENT_ID) -> Dict[str, Any]:
    """Retrieves full student state from MongoDB or in-memory fallback."""
    db_check = check_database_connection()
    if db_check["connected"]:
        try:
            db = get_database()
            if db is not None:
                profile = db[COLLECTION_STUDENTS].find_one({"student_id": student_id})
                academics = list(db[COLLECTION_ACADEMICS].find({"student_id": student_id}))
                skills = list(db[COLLECTION_SKILLS].find({"student_id": student_id}))
                attempts = list(db[COLLECTION_ASSESSMENTS].find({"student_id": student_id}))
                tasks = list(db[COLLECTION_STUDY_TASKS].find({"student_id": student_id}))

                if profile:
                    return {
                        "profile": profile,
                        "academics": academics or INITIAL_ACADEMIC_RECORDS,
                        "skills": skills or INITIAL_SKILLS,
                        "attempts": attempts or INITIAL_ATTEMPTS,
                        "tasks": tasks or INITIAL_STUDY_TASKS
                    }
        except Exception:
            pass

    # In-memory fallback
    if student_id not in _memory_store:
        _memory_store[student_id] = {
            "profile": {**INITIAL_STUDENT_PROFILE, "student_id": student_id, "id": student_id},
            "academics": [dict(a) for a in INITIAL_ACADEMIC_RECORDS],
            "skills": [dict(s) for s in INITIAL_SKILLS],
            "attempts": [dict(att) for att in INITIAL_ATTEMPTS],
            "tasks": [dict(t) for t in INITIAL_STUDY_TASKS]
        }
    return _memory_store[student_id]


def persist_skill_update(student_id: str, skill_id: str, new_score: float) -> None:
    """Updates the skill in MongoDB and in-memory store."""
    data = get_student_data(student_id)
    for s in data["skills"]:
        if s.get("id") == skill_id or s.get("skill_id") == skill_id or "dsa" in s.get("skill_name", "").lower():
            s["current_score"] = new_score
            s["current"] = new_score
            s["gap"] = max(0.0, round(float(s.get("target_score", 80.0)) - new_score, 1))

    db_check = check_database_connection()
    if db_check["connected"]:
        try:
            db = get_database()
            if db is not None:
                db[COLLECTION_SKILLS].update_one(
                    {"student_id": student_id, "$or": [{"id": skill_id}, {"skill_name": {"$regex": "data structures", "$options": "i"}}]},
                    {"$set": {"current_score": new_score}},
                    upsert=True
                )
        except Exception:
            pass


def persist_assessment_attempt(student_id: str, attempt_record: Dict[str, Any]) -> None:
    """Saves assessment attempt to MongoDB and memory store."""
    data = get_student_data(student_id)
    data["attempts"].insert(0, attempt_record)

    db_check = check_database_connection()
    if db_check["connected"]:
        try:
            db = get_database()
            if db is not None:
                db[COLLECTION_ASSESSMENTS].insert_one({**attempt_record, "student_id": student_id})
        except Exception:
            pass
