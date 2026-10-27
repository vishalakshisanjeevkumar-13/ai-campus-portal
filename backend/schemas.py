"""
Pydantic Schemas and Validation Models for AI Campus Companion.
Defines required entities, field constraints, range checks, and custom validators:
  1. Student Profile
  2. Academic Record
  3. Skill Record
  4. Assessment Attempt
  5. Study Task
"""

from datetime import datetime, timezone
from typing import Optional, Dict, Any, List, Literal
from pydantic import BaseModel, Field, field_validator, model_validator


# ==============================================================================
# 1. Student Profile Schemas
# ==============================================================================

class StudentProfileBase(BaseModel):
    student_id: str = Field(..., min_length=1, max_length=50, description="Unique student identifier (e.g., STD-2024-8842)")
    name: str = Field(..., min_length=1, max_length=100, description="Full legal name of the student")
    semester: str = Field(..., min_length=1, max_length=50, description="Current semester (e.g., '6th Semester')")
    target_career_role: str = Field(..., min_length=1, max_length=100, description="Target career role (e.g., 'Software Developer')")
    weekly_available_study_hours: float = Field(
        ...,
        ge=0.0,
        le=168.0,
        description="Available self-study hours per week (must be between 0 and 168)"
    )

    # Optional complementary profile details for Digital Twin compatibility
    email: Optional[str] = Field(None, max_length=120, description="Campus email address")
    department: Optional[str] = Field(None, max_length=100, description="Academic department")
    college: Optional[str] = Field(None, max_length=150, description="College or university name")
    cgpa: Optional[float] = Field(None, ge=0.0, le=10.0, description="Cumulative Grade Point Average (0.0 to 10.0)")

    @field_validator("student_id", "name", "semester", "target_career_role", mode="before")
    @classmethod
    def strip_and_validate_non_empty(cls, value: Any) -> str:
        if isinstance(value, str):
            cleaned = value.strip()
            if not cleaned:
                raise ValueError("Field cannot be empty or pure whitespace.")
            return cleaned
        return str(value)


class StudentProfileCreate(StudentProfileBase):
    pass


class StudentProfileResponse(StudentProfileBase):
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


# ==============================================================================
# 2. Academic Record Schemas
# ==============================================================================

class AcademicRecordBase(BaseModel):
    student_id: str = Field(..., min_length=1, description="Associated student ID")
    subject: str = Field(..., min_length=1, max_length=100, description="Course or subject name (e.g., Data Structures)")
    marks: float = Field(..., ge=0.0, description="Obtained marks (must be non-negative)")
    max_marks: float = Field(..., gt=0.0, description="Maximum possible marks (must be greater than 0)")
    credits: int = Field(..., gt=0, le=30, description="Course credit weight (positive integer, max 30)")
    attendance: float = Field(..., ge=0.0, le=100.0, description="Attendance percentage (0.0 to 100.0)")
    semester: str = Field(..., min_length=1, max_length=50, description="Academic semester (e.g., '5th Semester')")

    @field_validator("student_id", "subject", "semester", mode="before")
    @classmethod
    def clean_strings(cls, value: Any) -> str:
        if isinstance(value, str):
            cleaned = value.strip()
            if not cleaned:
                raise ValueError("Field cannot be empty or pure whitespace.")
            return cleaned
        return str(value)

    @model_validator(mode="after")
    def validate_marks_within_maximum(self):
        if self.marks > self.max_marks:
            raise ValueError(
                f"Marks obtained ({self.marks}) cannot exceed maximum marks ({self.max_marks})."
            )
        return self


class AcademicRecordCreate(AcademicRecordBase):
    pass


class AcademicRecordResponse(AcademicRecordBase):
    id: Optional[str] = None
    percentage: float = 0.0

    @model_validator(mode="after")
    def calculate_percentage(self):
        if self.max_marks > 0:
            self.percentage = round((self.marks / self.max_marks) * 100.0, 2)
        return self


# ==============================================================================
# 3. Skill Record Schemas
# ==============================================================================

class SkillRecordBase(BaseModel):
    student_id: str = Field(..., min_length=1, description="Associated student ID")
    skill_name: str = Field(..., min_length=1, max_length=100, description="Name of the skill (e.g., 'DSA', 'Spring Boot')")
    current_score: float = Field(..., ge=0.0, le=100.0, description="Current proficiency score (0.0 to 100.0)")
    target_score: float = Field(..., ge=0.0, le=100.0, description="Target score required for the target role (0.0 to 100.0)")
    target_role: str = Field(..., min_length=1, max_length=100, description="Target career role")

    @field_validator("student_id", "skill_name", "target_role", mode="before")
    @classmethod
    def clean_skill_strings(cls, value: Any) -> str:
        if isinstance(value, str):
            cleaned = value.strip()
            if not cleaned:
                raise ValueError("Field cannot be empty or pure whitespace.")
            return cleaned
        return str(value)


class SkillRecordCreate(SkillRecordBase):
    pass


class SkillRecordResponse(SkillRecordBase):
    id: Optional[str] = None
    gap: float = 0.0

    @model_validator(mode="after")
    def calculate_gap(self):
        self.gap = max(0.0, round(self.target_score - self.current_score, 2))
        return self


# ==============================================================================
# 4. Assessment Attempt Schemas
# ==============================================================================

class AssessmentAttemptBase(BaseModel):
    student_id: str = Field(..., min_length=1, description="Associated student ID")
    assessment_id: str = Field(..., min_length=1, description="Unique test or drill ID (e.g., 'assess-dsa-1')")
    answers: Dict[str, Any] = Field(default_factory=dict, description="Dictionary of submitted question-answer pairs")
    score: float = Field(..., ge=0.0, le=100.0, description="Assessment score percentage (0.0 to 100.0)")
    submission_timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Timestamp when assessment was finalized"
    )

    @field_validator("student_id", "assessment_id", mode="before")
    @classmethod
    def clean_attempt_strings(cls, value: Any) -> str:
        if isinstance(value, str):
            cleaned = value.strip()
            if not cleaned:
                raise ValueError("Field cannot be empty.")
            return cleaned
        return str(value)


class AssessmentAttemptCreate(AssessmentAttemptBase):
    pass


class AssessmentAttemptResponse(AssessmentAttemptBase):
    id: Optional[str] = None


# ==============================================================================
# 5. Study Task Schemas
# ==============================================================================

class StudyTaskBase(BaseModel):
    student_id: str = Field(..., min_length=1, description="Associated student ID")
    title: str = Field(..., min_length=1, max_length=200, description="Task title (e.g., 'Arrays & Two Pointers')")
    related_skill: str = Field(..., min_length=1, max_length=100, description="Associated technical competency")
    priority: Literal["HIGH", "MEDIUM", "LOW"] = Field("MEDIUM", description="Task urgency")
    estimated_hours: float = Field(..., ge=0.0, le=100.0, description="Estimated study duration in hours")
    completion_status: Literal["Pending", "In Progress", "Completed"] = Field(
        "Pending",
        description="Current state of completion"
    )
    completed: bool = Field(False, description="Quick boolean toggle for completion")

    @field_validator("student_id", "title", "related_skill", mode="before")
    @classmethod
    def clean_task_strings(cls, value: Any) -> str:
        if isinstance(value, str):
            cleaned = value.strip()
            if not cleaned:
                raise ValueError("Field cannot be empty.")
            return cleaned
        return str(value)


class StudyTaskCreate(StudyTaskBase):
    pass


class StudyTaskResponse(StudyTaskBase):
    id: Optional[str] = None
