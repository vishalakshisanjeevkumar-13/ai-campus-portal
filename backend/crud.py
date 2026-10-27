"""
Reusable Database CRUD Operations for AI Campus Companion.
Provides isolated, student-scoped persistence and retrieval operations
for Student Profiles, Academic Records, Skill Records, Assessments, and Tasks.
"""

from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from pymongo.database import Database
from pymongo.errors import PyMongoError
from database import (
    COLLECTION_STUDENTS,
    COLLECTION_ACADEMICS,
    COLLECTION_SKILLS,
    COLLECTION_ASSESSMENTS,
    COLLECTION_STUDY_TASKS
)
from schemas import (
    StudentProfileCreate,
    AcademicRecordCreate,
    SkillRecordCreate,
    AssessmentAttemptCreate,
    StudyTaskCreate
)


class DatabaseOperationError(Exception):
    """Custom exception raised when a MongoDB operation fails."""
    pass


def _format_doc(doc: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """Converts MongoDB ObjectId to a string id and formats output."""
    if not doc:
        return None
    doc_copy = dict(doc)
    if "_id" in doc_copy:
        doc_copy["id"] = str(doc_copy.pop("_id"))
    return doc_copy


# ==============================================================================
# 1. Student Profile CRUD
# ==============================================================================

def create_or_update_student_profile(db: Database, profile_data: StudentProfileCreate) -> Dict[str, Any]:
    """
    Creates a new student profile or updates an existing profile by student_id.
    Ensures student records remain strictly isolated and identifiable.
    """
    try:
        now = datetime.now(timezone.utc)
        payload = profile_data.model_dump()
        payload["updated_at"] = now

        result = db[COLLECTION_STUDENTS].find_one_and_update(
            {"student_id": profile_data.student_id},
            {
                "$set": payload,
                "$setOnInsert": {"created_at": now}
            },
            upsert=True,
            return_document=True
        )
        return _format_doc(result)
    except PyMongoError as err:
        raise DatabaseOperationError(f"Failed to save student profile: {str(err)}") from err


def get_student_profile(db: Database, student_id: str) -> Optional[Dict[str, Any]]:
    """Retrieves a single student profile by unique student_id."""
    try:
        doc = db[COLLECTION_STUDENTS].find_one({"student_id": student_id.strip()})
        return _format_doc(doc)
    except PyMongoError as err:
        raise DatabaseOperationError(f"Failed to query student profile: {str(err)}") from err


# ==============================================================================
# 2. Academic Record CRUD
# ==============================================================================

def create_academic_record(db: Database, record_data: AcademicRecordCreate) -> Dict[str, Any]:
    """Inserts a verified academic semester course record for a student."""
    try:
        payload = record_data.model_dump()
        payload["created_at"] = datetime.now(timezone.utc)
        inserted = db[COLLECTION_ACADEMICS].insert_one(payload)
        payload["id"] = str(inserted.inserted_id)
        if "_id" in payload:
            del payload["_id"]
        return payload
    except PyMongoError as err:
        raise DatabaseOperationError(f"Failed to insert academic record: {str(err)}") from err


def get_academic_records(db: Database, student_id: str) -> List[Dict[str, Any]]:
    """Retrieves all academic records belonging to a specific student."""
    try:
        cursor = db[COLLECTION_ACADEMICS].find({"student_id": student_id.strip()})
        return [_format_doc(doc) for doc in cursor]
    except PyMongoError as err:
        raise DatabaseOperationError(f"Failed to fetch academic records: {str(err)}") from err


# ==============================================================================
# 3. Skill Record CRUD
# ==============================================================================

def create_or_update_skill_record(db: Database, skill_data: SkillRecordCreate) -> Dict[str, Any]:
    """Creates or updates a skill benchmark proficiency entry for a student."""
    try:
        now = datetime.now(timezone.utc)
        payload = skill_data.model_dump()
        payload["updated_at"] = now

        result = db[COLLECTION_SKILLS].find_one_and_update(
            {"student_id": skill_data.student_id, "skill_name": skill_data.skill_name},
            {
                "$set": payload,
                "$setOnInsert": {"created_at": now}
            },
            upsert=True,
            return_document=True
        )
        return _format_doc(result)
    except PyMongoError as err:
        raise DatabaseOperationError(f"Failed to save skill record: {str(err)}") from err


def get_skill_records(db: Database, student_id: str) -> List[Dict[str, Any]]:
    """Retrieves all skill records belonging to a specific student."""
    try:
        cursor = db[COLLECTION_SKILLS].find({"student_id": student_id.strip()})
        return [_format_doc(doc) for doc in cursor]
    except PyMongoError as err:
        raise DatabaseOperationError(f"Failed to fetch skill records: {str(err)}") from err


# ==============================================================================
# 4. Assessment Attempt CRUD
# ==============================================================================

def create_assessment_attempt(db: Database, attempt_data: AssessmentAttemptCreate) -> Dict[str, Any]:
    """Records an assessment submission attempt."""
    try:
        payload = attempt_data.model_dump()
        inserted = db[COLLECTION_ASSESSMENTS].insert_one(payload)
        payload["id"] = str(inserted.inserted_id)
        if "_id" in payload:
            del payload["_id"]
        return payload
    except PyMongoError as err:
        raise DatabaseOperationError(f"Failed to log assessment attempt: {str(err)}") from err


def get_assessment_attempts(db: Database, student_id: str) -> List[Dict[str, Any]]:
    """Retrieves all assessment attempts submitted by a student."""
    try:
        cursor = db[COLLECTION_ASSESSMENTS].find({"student_id": student_id.strip()}).sort("submission_timestamp", -1)
        return [_format_doc(doc) for doc in cursor]
    except PyMongoError as err:
        raise DatabaseOperationError(f"Failed to retrieve assessment attempts: {str(err)}") from err


# ==============================================================================
# 5. Study Task CRUD
# ==============================================================================

def create_study_task(db: Database, task_data: StudyTaskCreate) -> Dict[str, Any]:
    """Creates a new study schedule task for a student."""
    try:
        payload = task_data.model_dump()
        payload["created_at"] = datetime.now(timezone.utc)
        inserted = db[COLLECTION_STUDY_TASKS].insert_one(payload)
        payload["id"] = str(inserted.inserted_id)
        if "_id" in payload:
            del payload["_id"]
        return payload
    except PyMongoError as err:
        raise DatabaseOperationError(f"Failed to create study task: {str(err)}") from err


def get_study_tasks(db: Database, student_id: str) -> List[Dict[str, Any]]:
    """Retrieves all study tasks for a student."""
    try:
        cursor = db[COLLECTION_STUDY_TASKS].find({"student_id": student_id.strip()})
        return [_format_doc(doc) for doc in cursor]
    except PyMongoError as err:
        raise DatabaseOperationError(f"Failed to fetch study tasks: {str(err)}") from err
