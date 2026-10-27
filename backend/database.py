"""
Reusable MongoDB Database Connection Module for AI Campus Companion.
Supports both local MongoDB and cloud MongoDB Atlas instances.
Handles connection failures gracefully with fail-fast timeouts.
"""

import logging
from typing import Optional, Dict, Any
from pymongo import MongoClient
from pymongo.database import Database
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError, PyMongoError
from config import settings

logger = logging.getLogger("ai_campus_companion.database")

# Global client cache
_mongo_client: Optional[MongoClient] = None

# Collection names constants
COLLECTION_STUDENTS = "students"
COLLECTION_ACADEMICS = "academic_records"
COLLECTION_SKILLS = "skills"
COLLECTION_ASSESSMENTS = "assessment_attempts"
COLLECTION_STUDY_TASKS = "study_tasks"


def get_client() -> MongoClient:
    """
    Returns an initialized PyMongo client.
    Uses a 2000ms server selection timeout so that disconnected states fail fast
    without blocking API requests.
    """
    global _mongo_client
    if _mongo_client is None:
        try:
            _mongo_client = MongoClient(
                settings.MONGODB_URI,
                serverSelectionTimeoutMS=2000,
                connectTimeoutMS=2000,
                appname="ai_campus_companion_backend"
            )
        except Exception as e:
            logger.warning(f"Could not initialize MongoClient with {settings.get_masked_uri()}: {e}")
            raise
    return _mongo_client


def get_database() -> Optional[Database]:
    """
    Returns the target MongoDB database object, or None if client creation fails.
    """
    try:
        client = get_client()
        return client[settings.DATABASE_NAME]
    except Exception as e:
        logger.error(f"Failed to access database '{settings.DATABASE_NAME}': {e}")
        return None


def check_database_connection() -> Dict[str, Any]:
    """
    Performs an active ping check against the MongoDB server.
    Strictly verifies connection before returning True.
    Returns a status dictionary distinguishing connectivity state.
    """
    try:
        client = get_client()
        # Ping the admin database to verify live cluster / server responsiveness
        client.admin.command("ping")
        return {
            "connected": True,
            "database_name": settings.DATABASE_NAME,
            "message": "Successfully connected and pinged MongoDB."
        }
    except (ConnectionFailure, ServerSelectionTimeoutError) as err:
        return {
            "connected": False,
            "database_name": settings.DATABASE_NAME,
            "message": f"MongoDB server unreachable at configured URI ({settings.get_masked_uri()}). Details: {str(err)}"
        }
    except PyMongoError as err:
        return {
            "connected": False,
            "database_name": settings.DATABASE_NAME,
            "message": f"PyMongo operational error: {str(err)}"
        }
    except Exception as err:
        return {
            "connected": False,
            "database_name": settings.DATABASE_NAME,
            "message": f"Unexpected database error: {str(err)}"
        }


def init_indexes():
    """
    Sets up helpful indexes for performance and data integrity
    if the database is accessible. Fails silently if DB is not reachable.
    """
    db_status = check_database_connection()
    if not db_status["connected"]:
        logger.info("Skipping database index creation (MongoDB is currently offline).")
        return False

    try:
        db = get_database()
        if db is not None:
            # Ensure unique student_id in students collection
            db[COLLECTION_STUDENTS].create_index("student_id", unique=True)
            # Index student_id in other collections for fast queries
            db[COLLECTION_ACADEMICS].create_index("student_id")
            db[COLLECTION_SKILLS].create_index([("student_id", 1), ("skill_name", 1)])
            db[COLLECTION_ASSESSMENTS].create_index("student_id")
            db[COLLECTION_STUDY_TASKS].create_index("student_id")
            logger.info("MongoDB collections and indexes successfully verified.")
            return True
    except Exception as e:
        logger.warning(f"Index creation warning: {e}")
        return False
