"""
Machine Learning package for AI Campus Companion.
Provides model training, versioned artifacts, and isolated inference service.
"""

from ml.service import predict_academic_risk, predict_for_student_profile, get_model_info
from ml.schemas import AcademicRiskPredictionRequest, AcademicRiskPredictionResponse

__all__ = [
    "predict_academic_risk",
    "predict_for_student_profile",
    "get_model_info",
    "AcademicRiskPredictionRequest",
    "AcademicRiskPredictionResponse"
]
