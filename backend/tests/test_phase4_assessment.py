"""
Unit and Integration Tests for Phase 4: Assessment Integration,
Server-Side Scoring, Skill Update Rule, and Feedback Loop.
"""

from fastapi.testclient import TestClient
from main import app
from assessment_catalog import ASSESSMENT_CATALOG

client = TestClient(app)

# The real correct answers from server answer key for assess-dsa-1:
# Q1: 2, Q2: 1, Q3: 0, Q4: 1, Q5: 2, Q6: 1, Q7: 1, Q8: 1, Q9: 1, Q10: 2
ALL_CORRECT_ANSWERS = {
    "1": 2, "2": 1, "3": 0, "4": 1, "5": 2,
    "6": 1, "7": 1, "8": 1, "9": 1, "10": 2
}

ALL_INCORRECT_ANSWERS = {
    "1": 0, "2": 0, "3": 1, "4": 0, "5": 0,
    "6": 0, "7": 0, "8": 0, "9": 0, "10": 0
}


def test_assessment_catalog_endpoints():
    response = client.get("/api/assessments/catalog")
    assert response.status_code == 200
    catalog = response.json()
    assert len(catalog) >= 1
    assert catalog[0]["id"] == "assess-dsa-1"
    # Verify answers are NOT leaked to the client
    assert "correct_index" not in catalog[0]["questions"][0]


def test_assessment_get_by_id():
    response = client.get("/api/assessments/assess-dsa-1")
    assert response.status_code == 200
    quiz = response.json()
    assert quiz["id"] == "assess-dsa-1"
    assert len(quiz["questions"]) == 10
    assert "correct_index" not in quiz["questions"][0]


def test_assessment_submit_all_correct():
    payload = {
        "student_id": "STD-TEST-PERFECT",
        "assessment_id": "assess-dsa-1",
        "answers": ALL_CORRECT_ANSWERS,
        "submission_token": "token-perfect-1"
    }
    response = client.post("/api/assessments/submit", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["correct_count"] == 10
    assert data["score_percentage"] == 100.0
    # Formula check: (0.55 * 42.0) + (0.45 * 100.0) = 23.1 + 45.0 = 68.1%
    assert data["new_skill_score"] == 68.1
    assert data["duplicate"] is False
    assert len(data["question_results"]) == 10
    assert all(q["is_correct"] is True for q in data["question_results"])


def test_assessment_submit_all_incorrect():
    payload = {
        "student_id": "STD-TEST-FAIL",
        "assessment_id": "assess-dsa-1",
        "answers": ALL_INCORRECT_ANSWERS,
        "submission_token": "token-fail-1"
    }
    response = client.post("/api/assessments/submit", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["correct_count"] == 0
    assert data["score_percentage"] == 0.0
    # Formula check: (0.55 * 42.0) + (0.45 * 0.0) = 23.1%
    assert data["new_skill_score"] == 23.1


def test_assessment_submit_partial_correct():
    # 7 correct out of 10 (Q1..Q7 correct, Q8..Q10 incorrect)
    answers = {
        "1": 2, "2": 1, "3": 0, "4": 1, "5": 2,
        "6": 1, "7": 1, "8": 0, "9": 0, "10": 0
    }
    payload = {
        "student_id": "STD-TEST-PARTIAL",
        "assessment_id": "assess-dsa-1",
        "answers": answers,
        "submission_token": "token-partial-1"
    }
    response = client.post("/api/assessments/submit", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["correct_count"] == 7
    assert data["score_percentage"] == 70.0
    # Formula check: (0.55 * 42.0) + (0.45 * 70.0) = 23.1 + 31.5 = 54.6%
    assert data["new_skill_score"] == 54.6


def test_assessment_submit_empty_answers():
    payload = {
        "student_id": "STD-TEST-EMPTY",
        "assessment_id": "assess-dsa-1",
        "answers": {},
        "submission_token": "token-empty-1"
    }
    response = client.post("/api/assessments/submit", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["correct_count"] == 0
    assert data["score_percentage"] == 0.0


def test_assessment_invalid_id_returns_404():
    payload = {
        "student_id": "STD-001",
        "assessment_id": "non-existent-quiz-xyz",
        "answers": {}
    }
    response = client.post("/api/assessments/submit", json=payload)
    assert response.status_code == 404


def test_assessment_invalid_option_index_returns_422():
    # Option 99 is out of range (options are 0..3)
    payload = {
        "student_id": "STD-001",
        "assessment_id": "assess-dsa-1",
        "answers": {"1": 99}
    }
    response = client.post("/api/assessments/submit", json=payload)
    assert response.status_code == 422


def test_assessment_duplicate_submission_prevention():
    payload = {
        "student_id": "STD-TEST-DUP",
        "assessment_id": "assess-dsa-1",
        "answers": ALL_CORRECT_ANSWERS,
        "submission_token": "unique-dup-token-123"
    }
    # First submission
    res1 = client.post("/api/assessments/submit", json=payload)
    assert res1.status_code == 200
    assert res1.json()["duplicate"] is False

    # Second immediate submission with same token
    res2 = client.post("/api/assessments/submit", json=payload)
    assert res2.status_code == 200
    assert res2.json()["duplicate"] is True
    assert "Duplicate submission detected" in res2.json()["notice"]
