"""
Unit and Integration Tests for Phase 3: Academic Audit, Role-Based Skill Gaps,
Priority Engine, and Student Digital Twin Synthesis.
"""

from fastapi.testclient import TestClient
from main import app
from academic_engine import perform_academic_audit, score_to_grade
from priority_engine import evaluate_skill_gaps_and_priorities
from digital_twin_engine import build_student_digital_twin

client = TestClient(app)


# ==============================================================================
# Feature A: Academic Audit Tests
# ==============================================================================

def test_academic_audit_credit_weighted_sgpa():
    # CS501: 4 credits, 80% (Grade A+, point 9) -> 36 points
    # CS502: 4 credits, 60% (Grade B+, point 7) -> 28 points
    # Total points = 64, Total credits = 8 -> SGPA = 8.0
    records = [
        {"subject": "CS501", "marks": 80.0, "max_marks": 100.0, "credits": 4, "attendance": 90.0, "semester": "Sem 5"},
        {"subject": "CS502", "marks": 60.0, "max_marks": 100.0, "credits": 4, "attendance": 80.0, "semester": "Sem 5"}
    ]
    audit = perform_academic_audit(records)
    assert audit["status"] == "complete"
    assert audit["cgpa"] == 8.0
    assert audit["completed_credits"] == 8
    assert audit["average_attendance"] == 85.0
    assert audit["semesters"]["Sem 5"]["sgpa"] == 8.0


def test_academic_audit_empty_records_clear_message():
    audit = perform_academic_audit([])
    assert audit["status"] == "incomplete"
    assert "No academic records found" in audit["message"]
    assert audit["cgpa"] == 0.0


def test_score_to_grade_tiers():
    assert score_to_grade(95.0)["grade"] == "O"
    assert score_to_grade(85.0)["grade"] == "A+"
    assert score_to_grade(75.0)["grade"] == "A"
    assert score_to_grade(65.0)["grade"] == "B+"
    assert score_to_grade(45.0)["grade"] == "F"


# ==============================================================================
# Feature B & C: Skill Gaps and Priority Engine Tests
# ==============================================================================

def test_skill_gap_below_target():
    skills = [
        {"name": "Data Structures & Algorithms", "short_name": "DSA", "current_score": 42.0}
    ]
    result = evaluate_skill_gaps_and_priorities(skills, "software-developer")
    dsa = next(s for s in result["skills"] if s["short_name"] == "DSA")
    assert dsa["target_score"] == 80.0
    assert dsa["gap"] == 38.0
    assert dsa["priority"] == "HIGH"
    assert "deficit against the 80.0% role benchmark" in dsa["explanation"]


def test_skill_gap_above_target():
    skills = [
        {"name": "Git & Version Control", "short_name": "Git", "current_score": 85.0}
    ]
    result = evaluate_skill_gaps_and_priorities(skills, "software-developer")
    git = next(s for s in result["skills"] if s["short_name"] == "Git")
    assert git["gap"] == 0.0
    assert git["status"] == "Mastered"
    assert git["priority"] == "LOW"
    assert "target met" in git["explanation"]


def test_prerequisite_blocking_boosts_priority():
    # Spring Boot depends on Java OOP. If Java OOP is weak, it flags as a blocker.
    skills = [
        {"name": "Java Core & OOP", "short_name": "Java", "current_score": 40.0},
        {"name": "Spring Boot & Microservices", "short_name": "Spring Boot", "current_score": 20.0}
    ]
    result = evaluate_skill_gaps_and_priorities(skills, "software-developer")
    java_skill = next(s for s in result["skills"] if s["short_name"] == "Java")
    assert "prerequisite blocking" in java_skill["explanation"]


# ==============================================================================
# Feature D & E: API Endpoints Tests
# ==============================================================================

def test_api_academics_audit_endpoint():
    response = client.get("/api/academics/audit")
    assert response.status_code == 200
    data = response.json()
    assert "cgpa" in data
    assert "average_attendance" in data
    assert "completed_credits" in data


def test_api_skills_gaps_endpoint():
    response = client.get("/api/skills/gaps?role=software-developer")
    assert response.status_code == 200
    data = response.json()
    assert data["role"] == "Software Developer"
    assert len(data["skills"]) >= 8
    assert "recommendations" in data


def test_api_digital_twin_endpoint():
    response = client.get("/api/digital-twin")
    assert response.status_code == 200
    data = response.json()
    assert "readiness_indicators" in data
    indicators = data["readiness_indicators"]
    assert "overall_readiness" in indicators
    assert "academic_health_score" in indicators
    assert "technical_skills_score" in indicators
    assert "disclaimer" in data
