"""
Integration and Endpoint Tests for AI Campus Companion FastAPI Backend.
Uses FastAPI TestClient to test routing, health checks, demo endpoints,
and error handling when MongoDB is disconnected.
"""

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "project" in data
    assert data["docs_url"] == "/docs"
    assert data["status"] == "active"


def test_demo_student_endpoint_preserved():
    response = client.get("/api/student/demo")
    assert response.status_code == 200
    data = response.json()
    assert data["is_demo"] is True
    assert "notice" in data
    assert data["student"]["name"] == "Alex Morgan"
    assert data["student"]["targetRole"] == "Software Developer"
    assert data["student"]["scores"]["overallReadiness"] == 74


def test_health_endpoint_structure():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["api_status"] == "online"
    assert "Phase" in data["phase"]
    assert "database" in data
    assert "connected" in data["database"]
    assert "database_name" in data["database"]
    assert "message" in data["database"]


def test_post_invalid_student_profile_returns_422():
    # Missing required 'target_career_role' and 'weekly_available_study_hours'
    payload = {
        "student_id": "STD-001",
        "name": "Jane Doe"
    }
    response = client.post("/api/students", json=payload)
    assert response.status_code == 422


def test_post_invalid_academic_record_marks_returns_422():
    # Marks (110) exceed max_marks (100)
    payload = {
        "student_id": "STD-001",
        "subject": "Mathematics",
        "marks": 110.0,
        "max_marks": 100.0,
        "credits": 3,
        "attendance": 90.0,
        "semester": "5th"
    }
    response = client.post("/api/academic-records", json=payload)
    assert response.status_code == 422
