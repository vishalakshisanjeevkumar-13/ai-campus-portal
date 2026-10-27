"""
Machine Learning Inference Service for Early Academic Risk Prediction.
Phase 5: Machine Learning Integration for AI Campus Companion.

Loads versioned scikit-learn pipeline, validates features,
and produces explainable, advisory risk assessments.
"""

import json
import logging
import threading
from pathlib import Path
from typing import Dict, Any, Optional, List
import joblib
import pandas as pd
from ml.schemas import AcademicRiskPredictionRequest, AcademicRiskPredictionResponse, ContributingFactor

logger = logging.getLogger("ai_campus_companion.ml_service")

BASE_DIR = Path(__file__).resolve().parent
ARTIFACTS_DIR = BASE_DIR / "artifacts"
PIPELINE_FILE = ARTIFACTS_DIR / "academic_risk_pipeline_v1.joblib"
METADATA_FILE = ARTIFACTS_DIR / "model_metadata_v1.json"

_lock = threading.Lock()
_pipeline = None
_metadata = None


def load_model_artifacts():
    """
    Safely loads the trained scikit-learn pipeline and metadata.
    Uses singleton caching to avoid reloading or retraining per request.
    """
    global _pipeline, _metadata
    if _pipeline is None:
        with _lock:
            if _pipeline is None:
                if not PIPELINE_FILE.exists():
                    raise FileNotFoundError(
                        f"Model artifact not found at {PIPELINE_FILE}. "
                        "Please run train_academic_risk_model.py first."
                    )
                logger.info(f"Loading ML pipeline from {PIPELINE_FILE}...")
                _pipeline = joblib.load(PIPELINE_FILE)

                if METADATA_FILE.exists():
                    with open(METADATA_FILE, "r", encoding="utf-8") as f:
                        _metadata = json.load(f)
                else:
                    _metadata = {"model_version": "v1.0.0"}
                logger.info("ML pipeline and metadata successfully loaded into memory.")
    return _pipeline, _metadata


def get_model_info() -> Dict[str, Any]:
    """Returns the full metadata and evaluation report of the active model."""
    _, metadata = load_model_artifacts()
    return metadata or {}


def _interpret_contributing_factors(features: Dict[str, Any]) -> List[ContributingFactor]:
    """Generates explainable factor interpretations for the prediction."""
    factors = []

    # 1. Baseline Grade (G1 Score on 0-20 scale)
    g1 = features["g1_score"]
    if g1 >= 14.0:
        factors.append(ContributingFactor(
            feature="G1 Baseline Grade",
            value=f"{g1} / 20",
            interpretation="Strong prior academic assessment score (Good/Distinction).",
            impact="protective"
        ))
    elif g1 >= 10.0:
        factors.append(ContributingFactor(
            feature="G1 Baseline Grade",
            value=f"{g1} / 20",
            interpretation="Satisfactory baseline grade, within passing threshold.",
            impact="neutral"
        ))
    else:
        factors.append(ContributingFactor(
            feature="G1 Baseline Grade",
            value=f"{g1} / 20",
            interpretation="Baseline grade is below the 10.0 passing threshold, indicating foundational difficulty.",
            impact="risk_increasing"
        ))

    # 2. Past Failures
    failures = features["failures"]
    if failures == 0:
        factors.append(ContributingFactor(
            feature="Past Course Failures",
            value=failures,
            interpretation="Zero past subject failures shows consistent curricular completion.",
            impact="protective"
        ))
    else:
        factors.append(ContributingFactor(
            feature="Past Course Failures",
            value=failures,
            interpretation=f"{failures} past subject failures indicates recurring academic hurdles.",
            impact="risk_increasing"
        ))

    # 3. Absences
    absences = features["absences"]
    if absences <= 4:
        factors.append(ContributingFactor(
            feature="Recorded Absences",
            value=absences,
            interpretation="High attendance consistency with minimal missed sessions.",
            impact="protective"
        ))
    elif absences <= 12:
        factors.append(ContributingFactor(
            feature="Recorded Absences",
            value=absences,
            interpretation="Moderate absences; attendance remains within acceptable limits.",
            impact="neutral"
        ))
    else:
        factors.append(ContributingFactor(
            feature="Recorded Absences",
            value=absences,
            interpretation=f"{absences} missed educational sessions poses an attendance continuity risk.",
            impact="risk_increasing"
        ))

    # 4. Weekly Study Time Tier
    studytime = features["studytime"]
    studytime_labels = {1: "< 2 hours/week", 2: "2-5 hours/week", 3: "5-10 hours/week", 4: "> 10 hours/week"}
    if studytime >= 3:
        factors.append(ContributingFactor(
            feature="Weekly Study Effort",
            value=studytime_labels.get(studytime, str(studytime)),
            interpretation="Dedicated weekly study investment supports academic resilience.",
            impact="protective"
        ))
    elif studytime == 2:
        factors.append(ContributingFactor(
            feature="Weekly Study Effort",
            value=studytime_labels.get(studytime, str(studytime)),
            interpretation="Average self-study commitment.",
            impact="neutral"
        ))
    else:
        factors.append(ContributingFactor(
            feature="Weekly Study Effort",
            value=studytime_labels.get(studytime, str(studytime)),
            interpretation="Minimal weekly self-study (<2 hrs) increases vulnerability during midterms.",
            impact="risk_increasing"
        ))

    return factors


def predict_academic_risk(request: AcademicRiskPredictionRequest) -> AcademicRiskPredictionResponse:
    """
    Executes model inference on validated academic effort features.
    Returns advisory risk classification, probability, and explainable guidance.
    """
    pipeline, metadata = load_model_artifacts()

    feature_dict = {
        "g1_score": float(request.g1_score),
        "studytime": int(request.studytime),
        "failures": int(request.failures),
        "absences": int(request.absences),
        "schoolsup": int(request.schoolsup),
        "paid": int(request.paid)
    }

    # Prepare DataFrame matching exact feature pipeline schema
    df_input = pd.DataFrame([feature_dict])

    # Run inference
    pred_class = int(pipeline.predict(df_input)[0])
    probabilities = pipeline.predict_proba(df_input)[0]

    prob_at_risk = round(float(probabilities[1]), 3)
    prob_on_track = round(float(probabilities[0]), 3)

    if prob_at_risk >= 0.65:
        risk_level = "High"
    elif prob_at_risk >= 0.40:
        risk_level = "Moderate"
    else:
        risk_level = "Low"

    prediction_label = "At-Risk" if pred_class == 1 else "On-Track"
    confidence_score = round(max(prob_at_risk, prob_on_track) * 100.0, 1)

    top_factors = _interpret_contributing_factors(feature_dict)

    if prediction_label == "At-Risk":
        advisory_rec = (
            "Early intervention recommended: Focus on prerequisite core subject concepts, "
            "attend supplemental tutoring sessions, and increase weekly structured self-study time."
        )
    else:
        advisory_rec = (
            "Academic indicators show solid progress: Maintain consistent study routines "
            "and continue monitoring attendance health."
        )

    disclaimer = (
        "Advisory AI Notice: This risk prediction is an educational advisory indicator generated by "
        f"a trained RandomForest model ({metadata.get('model_version', 'v1.0.0')}) based on academic and effort patterns. "
        "It does NOT represent a guarantee of academic failure or success, nor does it determine university standing."
    )

    return AcademicRiskPredictionResponse(
        student_id=request.student_id,
        prediction=prediction_label,
        risk_status="Needs Academic Support" if prediction_label == "At-Risk" else "Satisfactory Academic Progress",
        risk_probability=prob_at_risk,
        risk_level=risk_level,
        confidence_score=confidence_score,
        model_version=metadata.get("model_version", "v1.0.0"),
        top_contributing_factors=top_factors,
        advisory_recommendation=advisory_rec,
        disclaimer=disclaimer
    )


def predict_for_student_profile(student_id: str, student_data: Dict[str, Any]) -> AcademicRiskPredictionResponse:
    """
    Adapter that maps a student's existing platform academic records into
    the model's input feature space.
    """
    profile = student_data.get("profile", {})
    academics = student_data.get("academics", [])

    # 1. Map Subject Marks / CGPA to 0-20 Portuguese-equivalent G1 scale
    if academics:
        avg_percentage = sum(float(a.get("marks", 70.0)) / float(a.get("max_marks", 100.0)) * 100.0 for a in academics) / len(academics)
        avg_attendance = sum(float(a.get("attendance", 85.0)) for a in academics) / len(academics)
        failed_courses = sum(1 for a in academics if (float(a.get("marks", 70.0)) / float(a.get("max_marks", 100.0))) < 0.40)
    else:
        cgpa = float(profile.get("cgpa", 7.5))
        avg_percentage = cgpa * 9.5
        avg_attendance = 85.0
        failed_courses = 0

    g1_score = round(min(20.0, max(0.0, (avg_percentage / 100.0) * 20.0)), 1)

    # 2. Map Attendance to Absences (100% attendance -> 0 absences, 85% -> ~6 absences)
    absences = int(round(max(0.0, min(93.0, (100.0 - avg_attendance) * 0.4))))

    # 3. Map Available Weekly Study Hours to Studytime Category (1-4)
    hours = float(profile.get("availableStudyHoursPerWeek", profile.get("weekly_available_study_hours", 18.0)))
    if hours > 10.0:
        studytime_tier = 4
    elif hours >= 5.0:
        studytime_tier = 3
    elif hours >= 2.0:
        studytime_tier = 2
    else:
        studytime_tier = 1

    req = AcademicRiskPredictionRequest(
        g1_score=g1_score,
        studytime=studytime_tier,
        failures=min(4, failed_courses),
        absences=absences,
        schoolsup=0,
        paid=0,
        student_id=student_id
    )

    return predict_academic_risk(req)
