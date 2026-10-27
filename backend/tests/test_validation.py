"""
Unit Tests for Pydantic Data Structures and Field Validations.
These tests run independently of an active database connection.
"""

import pytest
from pydantic import ValidationError
from schemas import (
    StudentProfileCreate,
    StudentProfileResponse,
    AcademicRecordCreate,
    AcademicRecordResponse,
    SkillRecordCreate,
    SkillRecordResponse,
    AssessmentAttemptCreate,
    StudyTaskCreate
)


# ==============================================================================
# 1. Student Profile Validation Tests
# ==============================================================================

def test_valid_student_profile():
    profile = StudentProfileCreate(
        student_id="STD-2024-8842",
        name="Alex Morgan",
        semester="6th Semester",
        target_career_role="Software Developer",
        weekly_available_study_hours=18.0,
        cgpa=7.8
    )
    assert profile.student_id == "STD-2024-8842"
    assert profile.weekly_available_study_hours == 18.0
    assert profile.cgpa == 7.8


def test_student_profile_empty_fields_fail():
    with pytest.raises(ValidationError):
        StudentProfileCreate(
            student_id="   ",
            name="Alex",
            semester="6th",
            target_career_role="SDE",
            weekly_available_study_hours=10
        )


def test_student_profile_negative_hours_fail():
    with pytest.raises(ValidationError):
        StudentProfileCreate(
            student_id="STD-001",
            name="Alex",
            semester="6th",
            target_career_role="SDE",
            weekly_available_study_hours=-5.0
        )


def test_student_profile_excessive_hours_fail():
    with pytest.raises(ValidationError):
        StudentProfileCreate(
            student_id="STD-001",
            name="Alex",
            semester="6th",
            target_career_role="SDE",
            weekly_available_study_hours=200.0  # More than 168 hours in a week
        )


def test_student_profile_invalid_cgpa_fail():
    with pytest.raises(ValidationError):
        StudentProfileCreate(
            student_id="STD-001",
            name="Alex",
            semester="6th",
            target_career_role="SDE",
            weekly_available_study_hours=15.0,
            cgpa=11.5  # CGPA maximum is 10.0
        )


# ==============================================================================
# 2. Academic Record Validation Tests
# ==============================================================================

def test_valid_academic_record_percentage():
    record = AcademicRecordCreate(
        student_id="STD-2024-8842",
        subject="Data Structures & Algorithms",
        marks=75.0,
        max_marks=100.0,
        credits=4,
        attendance=88.5,
        semester="5th Semester"
    )
    assert record.marks == 75.0
    assert record.credits == 4

    # Test computed percentage in response model
    response = AcademicRecordResponse(**record.model_dump())
    assert response.percentage == 75.0


def test_academic_record_marks_exceed_max_marks_fails():
    with pytest.raises(ValidationError) as exc_info:
        AcademicRecordCreate(
            student_id="STD-2024-8842",
            subject="Algorithms",
            marks=105.0,  # Invalid: greater than max_marks
            max_marks=100.0,
            credits=4,
            attendance=90.0,
            semester="5th Semester"
        )
    assert "cannot exceed maximum marks" in str(exc_info.value)


def test_academic_record_negative_marks_fails():
    with pytest.raises(ValidationError):
        AcademicRecordCreate(
            student_id="STD-2024-8842",
            subject="Algorithms",
            marks=-10.0,
            max_marks=100.0,
            credits=4,
            attendance=90.0,
            semester="5th Semester"
        )


def test_academic_record_invalid_attendance_fails():
    with pytest.raises(ValidationError):
        AcademicRecordCreate(
            student_id="STD-2024-8842",
            subject="Algorithms",
            marks=80.0,
            max_marks=100.0,
            credits=4,
            attendance=115.0,  # Invalid: cannot exceed 100%
            semester="5th Semester"
        )


# ==============================================================================
# 3. Skill Record Validation & Gap Tests
# ==============================================================================

def test_valid_skill_gap_calculation():
    skill = SkillRecordCreate(
        student_id="STD-2024-8842",
        skill_name="Data Structures & Algorithms",
        current_score=42.0,
        target_score=80.0,
        target_role="Software Developer"
    )
    response = SkillRecordResponse(**skill.model_dump())
    assert response.gap == 38.0


def test_skill_current_exceeds_target_gap_is_zero():
    skill = SkillRecordCreate(
        student_id="STD-2024-8842",
        skill_name="Git & Version Control",
        current_score=85.0,
        target_score=70.0,
        target_role="Software Developer"
    )
    response = SkillRecordResponse(**skill.model_dump())
    assert response.gap == 0.0


def test_skill_score_range_fails():
    with pytest.raises(ValidationError):
        SkillRecordCreate(
            student_id="STD-2024-8842",
            skill_name="Python",
            current_score=120.0,  # Out of range 0-100
            target_score=80.0,
            target_role="Software Developer"
        )


# ==============================================================================
# 4. Assessment Attempt Validation Tests
# ==============================================================================

def test_valid_assessment_attempt():
    attempt = AssessmentAttemptCreate(
        student_id="STD-2024-8842",
        assessment_id="assess-dsa-1",
        answers={"q1": 2, "q2": 1, "q3": 0},
        score=67.0
    )
    assert attempt.score == 67.0
    assert attempt.assessment_id == "assess-dsa-1"


def test_assessment_negative_score_fails():
    with pytest.raises(ValidationError):
        AssessmentAttemptCreate(
            student_id="STD-2024-8842",
            assessment_id="assess-dsa-1",
            answers={},
            score=-5.0
        )


# ==============================================================================
# 5. Study Task Validation Tests
# ==============================================================================

def test_valid_study_task():
    task = StudyTaskCreate(
        student_id="STD-2024-8842",
        title="Arrays & Two Pointers Drill",
        related_skill="DSA",
        priority="HIGH",
        estimated_hours=1.5,
        completion_status="In Progress"
    )
    assert task.priority == "HIGH"
    assert task.estimated_hours == 1.5


def test_study_task_invalid_priority_fails():
    with pytest.raises(ValidationError):
        StudyTaskCreate(
            student_id="STD-2024-8842",
            title="Invalid Task",
            related_skill="DSA",
            priority="URGENT",  # Only HIGH, MEDIUM, LOW permitted
            estimated_hours=1.0
        )
