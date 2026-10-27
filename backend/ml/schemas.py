"""
Pydantic Schemas for Phase 5 Machine Learning Inference Service.
Validates academic effort features, range constraints, and prediction responses.
"""

from typing import Optional, Dict, Any, List, Literal
from pydantic import BaseModel, Field, field_validator


class AcademicRiskPredictionRequest(BaseModel):
    """
    Feature payload for Early Academic At-Risk Warning prediction.
    Strictly restricted to academic performance & study effort metrics.
    Excludes sensitive personal/demographic attributes.
    """
    g1_score: float = Field(
        ...,
        ge=0.0,
        le=20.0,
        description="First-period or baseline academic assessment grade on a 0-20 scale."
    )
    studytime: int = Field(
        ...,
        ge=1,
        le=4,
        description="Weekly study time tier: 1 (<2h), 2 (2-5h), 3 (5-10h), 4 (>10h)."
    )
    failures: int = Field(
        ...,
        ge=0,
        le=4,
        description="Number of past academic subject failures (0 to 4)."
    )
    absences: int = Field(
        ...,
        ge=0,
        le=93,
        description="Number of recorded missed/absent educational sessions (0 to 93)."
    )
    schoolsup: int = Field(
        default=0,
        ge=0,
        le=1,
        description="1 if receiving institutional remedial tutoring/support, 0 otherwise."
    )
    paid: int = Field(
        default=0,
        ge=0,
        le=1,
        description="1 if enrolled in supplementary subject tutoring, 0 otherwise."
    )
    student_id: Optional[str] = Field(
        default=None,
        description="Optional student identifier for audit tracking."
    )

    @field_validator("schoolsup", "paid", mode="before")
    @classmethod
    def convert_bool_or_str_to_int(cls, v: Any) -> int:
        if isinstance(v, bool):
            return 1 if v else 0
        if isinstance(v, str):
            cleaned = v.strip().lower()
            if cleaned in ("yes", "true", "1"):
                return 1
            if cleaned in ("no", "false", "0"):
                return 0
        try:
            val = int(v)
            if val in (0, 1):
                return val
        except (ValueError, TypeError):
            pass
        raise ValueError("Must be a binary indicator: 0/1, True/False, or 'yes'/'no'.")


class ContributingFactor(BaseModel):
    feature: str
    value: Any
    interpretation: str
    impact: Literal["protective", "risk_increasing", "neutral"]


class AcademicRiskPredictionResponse(BaseModel):
    """
    Response schema for Academic At-Risk prediction.
    Includes classification, probability, explainable factors, and ethical disclaimer.
    """
    student_id: Optional[str] = None
    prediction: Literal["At-Risk", "On-Track"]
    risk_status: str
    risk_probability: float = Field(..., ge=0.0, le=1.0)
    risk_level: Literal["Low", "Moderate", "High"]
    confidence_score: float = Field(..., ge=0.0, le=100.0)
    model_version: str
    top_contributing_factors: List[ContributingFactor]
    advisory_recommendation: str
    disclaimer: str
