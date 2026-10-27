"""
Automated Test Suite for Phase 5: Machine Learning Academic Risk Prediction.
Verifies model inference, held-out test predictions, schema validation,
advisory explanations, and digital twin synthesis integration.
"""

import pytest
from fastapi.testclient import TestClient
from main import app
from ml.service import predict_academic_risk, get_model_info
from ml.schemas import AcademicRiskPredictionRequest

client = TestClient(app)


def test_model_metadata_endpoint():
    """Verifies that model metadata endpoint returns genuine training provenance and metrics."""
    response = client.get("/api/ml/model-info")
    assert response.status_code == 200
    data = response.json()

    assert data["model_version"] == "v1.0.0"
    assert "UCI Student Performance Dataset" in data["dataset"]["name"]
    assert "Creative Commons Attribution 4.0" in data["dataset"]["license"]
    assert "performance_comparison" in data

    # Verify baseline vs random forest metrics
    perf = data["performance_comparison"]
    assert "baseline_dummy" in perf
    assert "random_forest_production" in perf
    assert perf["random_forest_production"]["accuracy"] > perf["baseline_dummy"]["accuracy"]
    assert perf["random_forest_production"]["f1_at_risk"] > 0.65


def test_inference_on_track_student():
    """Tests inference on a profile with high academic attainment and regular study habits."""
    payload = {
        "g1_score": 16.5,
        "studytime": 3,
        "failures": 0,
        "absences": 2,
        "schoolsup": 0,
        "paid": 0,
        "student_id": "TEST-STUDENT-HIGH"
    }
    response = client.post("/api/ml/predict-academic-risk", json=payload)
    assert response.status_code == 200
    result = response.json()

    assert result["prediction"] == "On-Track"
    assert result["risk_level"] in ("Low", "Moderate")
    assert result["risk_probability"] < 0.40
    assert result["confidence_score"] > 60.0
    assert len(result["top_contributing_factors"]) >= 3
    assert "Advisory AI Notice" in result["disclaimer"]


def test_inference_at_risk_student():
    """Tests inference on a profile with low baseline marks, past failures, and high absenteeism."""
    payload = {
        "g1_score": 6.0,
        "studytime": 1,
        "failures": 2,
        "absences": 22,
        "schoolsup": 1,
        "paid": 0,
        "student_id": "TEST-STUDENT-AT-RISK"
    }
    response = client.post("/api/ml/predict-academic-risk", json=payload)
    assert response.status_code == 200
    result = response.json()

    assert result["prediction"] == "At-Risk"
    assert result["risk_level"] in ("Moderate", "High")
    assert result["risk_probability"] >= 0.50
    assert "Early intervention recommended" in result["advisory_recommendation"]


def test_validation_rejects_negative_g1_score():
    """Ensures input validation strictly rejects out-of-range negative scores."""
    payload = {
        "g1_score": -4.0,
        "studytime": 2,
        "failures": 0,
        "absences": 2,
        "schoolsup": 0,
        "paid": 0
    }
    response = client.post("/api/ml/predict-academic-risk", json=payload)
    assert response.status_code == 422


def test_validation_rejects_g1_score_above_maximum():
    """Ensures input validation strictly rejects scores beyond the 20.0 scale maximum."""
    payload = {
        "g1_score": 25.5,
        "studytime": 2,
        "failures": 0,
        "absences": 2,
        "schoolsup": 0,
        "paid": 0
    }
    response = client.post("/api/ml/predict-academic-risk", json=payload)
    assert response.status_code == 422


def test_validation_rejects_invalid_studytime_tier():
    """Ensures input validation rejects study time tiers outside 1-4."""
    payload = {
        "g1_score": 12.0,
        "studytime": 5,
        "failures": 0,
        "absences": 2,
        "schoolsup": 0,
        "paid": 0
    }
    response = client.post("/api/ml/predict-academic-risk", json=payload)
    assert response.status_code == 422


def test_student_academic_risk_endpoint():
    """Tests that the student risk endpoint evaluates the active platform student."""
    response = client.get("/api/ml/student/academic-risk?student_id=STD-2024-8842")
    assert response.status_code == 200
    result = response.json()

    assert result["student_id"] == "STD-2024-8842"
    assert result["prediction"] in ("On-Track", "At-Risk")
    assert 0.0 <= result["risk_probability"] <= 1.0


def test_digital_twin_incorporates_ml_advisory_without_breaking():
    """
    Verifies that GET /api/digital-twin includes the ML advisory indicator
    while keeping the placement readiness heuristic completely rule-based and unbroken.
    """
    response = client.get("/api/digital-twin?student_id=STD-2024-8842")
    assert response.status_code == 200
    data = response.json()

    # Core rule-based digital twin indicators remain preserved
    assert "readiness_indicators" in data
    assert "overall_readiness" in data["readiness_indicators"]
    assert "placement_readiness_score" in data["readiness_indicators"]
    assert "academic_health_score" in data["readiness_indicators"]

    # Phase 5 ML advisory field is present and non-empty
    assert "ml_academic_risk_advisory" in data
    advisory = data["ml_academic_risk_advisory"]
    assert advisory is not None
    assert advisory["prediction"] in ("On-Track", "At-Risk")
    assert "model_version" in advisory
