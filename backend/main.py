"""
AI Campus Companion – Adaptive Academic & Career Intelligence Platform (Student Digital Twin)
Phase 3 & 4: Intelligence Engine & Assessment Feedback Loop

This service implements:
  - GET /api/health                           : Differentiated API & Database Health Check
  - GET /api/student/demo                     : Preserved Phase 1 Demo Student Profile
  - GET /api/academics/audit                  : Credit-weighted academic audit (SGPA, CGPA, Attendance)
  - GET /api/skills/gaps                      : Role-based skill gap diagnosis (Software Developer benchmark)
  - GET /api/recommendations                 : Prerequisite-aware priority recommendations
  - GET /api/digital-twin                     : 360-degree synthesized Student Digital Twin indicators
  - GET /api/assessments/catalog              : Client-ready test catalog (without answer key)
  - GET /api/assessments/{assessment_id}      : Client-ready assessment question set
  - POST /api/assessments/submit              : Server-side graded assessment submission & EMA feedback loop
  - Standard CRUD endpoints for Students, Academics, Skills, Attempts, and Tasks
"""

import platform
from contextlib import asynccontextmanager
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException, Header, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from config import settings
from database import (
    get_database,
    check_database_connection,
    init_indexes
)
import crud
import state_manager
from state_manager import DEFAULT_STUDENT_ID, get_student_data, persist_skill_update, persist_assessment_attempt
from assessment_catalog import ASSESSMENT_CATALOG, get_client_assessment
from academic_engine import perform_academic_audit
from priority_engine import evaluate_skill_gaps_and_priorities
from digital_twin_engine import build_student_digital_twin
from assessment_service import evaluate_and_process_submission

from schemas import (
    StudentProfileCreate,
    StudentProfileResponse,
    AcademicRecordCreate,
    AcademicRecordResponse,
    SkillRecordCreate,
    SkillRecordResponse,
    AssessmentAttemptCreate,
    AssessmentAttemptResponse,
    StudyTaskCreate,
    StudyTaskResponse
)
from ml.schemas import (
    AcademicRiskPredictionRequest,
    AcademicRiskPredictionResponse
)
from ml.service import (
    predict_academic_risk,
    predict_for_student_profile,
    get_model_info,
    load_model_artifacts
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown events."""
    init_indexes()
    try:
        from state_manager import seed_initial_data_if_empty
        seed_initial_data_if_empty()
    except Exception:
        pass
    try:
        load_model_artifacts()
    except Exception:
        pass
    yield


# ---------------------------------------------------------------------------
# FastAPI Application Initialization
# ---------------------------------------------------------------------------
app = FastAPI(
    title="AI Campus Companion API",
    description="Adaptive Academic & Career Intelligence Platform (Student Digital Twin) - Backend Service",
    version="0.4.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# ---------------------------------------------------------------------------
# CORS Configuration (Local development, Vercel deployments & customizable origins)
# ---------------------------------------------------------------------------
raw_origins = [o.strip() for o in settings.ALLOWED_ORIGINS.split(",") if o.strip()]
has_wildcard = "*" in raw_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if has_wildcard else raw_origins,
    allow_origin_regex=r"https://.*\.vercel\.app" if not has_wildcard else None,
    allow_credentials=not has_wildcard,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Helper Dependency: Student Identity Isolation
# ---------------------------------------------------------------------------
def resolve_student_id(x_student_id: Optional[str] = Header(None), student_id: Optional[str] = Query(None)) -> str:
    """
    Enforces student data isolation. Uses header or query parameter,
    defaulting safely to the demo student STD-2024-8842.
    """
    if x_student_id and x_student_id.strip():
        return x_student_id.strip()
    if student_id and student_id.strip():
        return student_id.strip()
    return DEFAULT_STUDENT_ID


# ---------------------------------------------------------------------------
# Request & Response Models
# ---------------------------------------------------------------------------
class WelcomeResponse(BaseModel):
    message: str = Field(..., description="Greeting and service introduction")
    project: str = Field(..., description="Project name")
    version: str = Field(..., description="Current API version")
    docs_url: str = Field(..., description="Interactive Swagger documentation endpoint")
    status: str = Field(..., description="Operational status")


class DatabaseHealth(BaseModel):
    connected: bool
    database_name: str
    message: str


class HealthResponse(BaseModel):
    status: str
    service: str = "ai-campus-companion-backend"
    api_status: str = "online"
    phase: str = "Phase 4: Assessment Integration & Digital Twin Loop"
    python_version: str
    platform: str
    database: DatabaseHealth
    ml_models_loaded: bool = False


class AssessmentSubmissionRequest(BaseModel):
    student_id: Optional[str] = Field(None, description="Optional student ID (defaults to active session)")
    assessment_id: str = Field(..., min_length=1, description="ID of assessment in catalog")
    answers: Dict[str, int] = Field(..., description="Mapping of question ID to chosen option index (0-based)")
    submission_token: Optional[str] = Field(None, description="Client idempotency token to prevent duplicate scoring")


# Legacy Demo Models (Phase 1 Preserved)
class StudentScores(BaseModel):
    overallReadiness: int
    academicHealthScore: int
    technicalSkillsScore: int
    placementReadinessScore: int
    learningConsistencyScore: int
    projectsScore: int
    certificationsScore: int
    assessmentConfidenceScore: int


class StudentDemoProfile(BaseModel):
    id: str
    name: str
    email: str
    avatar: str
    department: str
    year: str
    college: str
    cgpa: float
    targetRole: str
    careerGoal: str
    availableStudyHoursPerWeek: int
    learningStreakDays: int
    completedTasksCount: int
    totalAssessmentsTaken: int
    scores: StudentScores


class DemoStudentResponse(BaseModel):
    is_demo: bool = True
    data_source: str = "temporary_mock_data"
    notice: str
    student: StudentDemoProfile


# ---------------------------------------------------------------------------
# 1. System & Health Diagnostics
# ---------------------------------------------------------------------------

@app.get("/", response_model=WelcomeResponse, tags=["Root"])
def root():
    return WelcomeResponse(
        message="Welcome to the AI Campus Companion Backend API!",
        project="AI Campus Companion - Adaptive Academic & Career Intelligence Platform (Student Digital Twin)",
        version="0.4.0",
        docs_url="/docs",
        status="active"
    )


@app.get("/api/health", response_model=HealthResponse, tags=["Diagnostics"])
def health_check():
    db_check = check_database_connection()
    overall_status = "healthy" if db_check["connected"] else "degraded"
    return HealthResponse(
        status=overall_status,
        service="ai-campus-companion-backend",
        api_status="online",
        phase="Phase 4: Assessment Integration & Digital Twin Loop",
        python_version=platform.python_version(),
        platform=platform.system(),
        database=DatabaseHealth(
            connected=db_check["connected"],
            database_name=db_check["database_name"],
            message=db_check["message"]
        ),
        ml_models_loaded=False
    )


@app.get("/api/student/demo", response_model=DemoStudentResponse, tags=["Student"])
def get_demo_student():
    data = get_student_data(DEFAULT_STUDENT_ID)
    profile = data["profile"]
    return DemoStudentResponse(
        is_demo=True,
        data_source="temporary_mock_data",
        notice="TEMPORARY SAMPLE DATA: Preserved Phase 1 baseline for UI preview.",
        student=StudentDemoProfile(
            id=profile.get("id", DEFAULT_STUDENT_ID),
            name=profile.get("name", "Alex Morgan"),
            email=profile.get("email", "alex.morgan@campus.edu"),
            avatar=profile.get("avatar", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"),
            department=profile.get("department", "Computer Science & Engineering"),
            year=profile.get("year", "3rd Year (6th Semester)"),
            college=profile.get("college", "Institute of Technology & AI Research"),
            cgpa=float(profile.get("cgpa", 7.8)),
            targetRole=profile.get("targetRole", "Software Developer"),
            careerGoal=profile.get("careerGoal", "Full-Stack Software Engineer at top-tier product tech enterprise"),
            availableStudyHoursPerWeek=int(profile.get("availableStudyHoursPerWeek", 18)),
            learningStreakDays=int(profile.get("learningStreakDays", 14)),
            completedTasksCount=int(profile.get("completedTasksCount", 48)),
            totalAssessmentsTaken=int(profile.get("totalAssessmentsTaken", 12)),
            scores=StudentScores(
                overallReadiness=74,
                academicHealthScore=78,
                technicalSkillsScore=71,
                placementReadinessScore=74,
                learningConsistencyScore=86,
                projectsScore=64,
                certificationsScore=82,
                assessmentConfidenceScore=68
            )
        )
    )


# ---------------------------------------------------------------------------
# 2. Phase 3: Academic Audit, Skill Gaps, Priority & Digital Twin
# ---------------------------------------------------------------------------

@app.get("/api/academics/audit", tags=["Academic Intelligence"])
def get_academic_audit(student_id: str = Query(DEFAULT_STUDENT_ID)):
    """
    Computes a credit-weighted academic audit (SGPA, cumulative CGPA, credits, attendance).
    Uses a configurable 10-point university grading scale.
    """
    data = get_student_data(student_id)
    return perform_academic_audit(data["academics"])


@app.get("/api/skills/gaps", tags=["Skill Intelligence"])
def get_skill_gaps(
    role: str = Query("software-developer", description="Target industry role benchmark"),
    student_id: str = Query(DEFAULT_STUDENT_ID)
):
    """
    Evaluates student proficiency against the role benchmark.
    Computes gap = max(0, target - current), categorizes mastery, and ranks by priority.
    """
    data = get_student_data(student_id)
    return evaluate_skill_gaps_and_priorities(data["skills"], role)


@app.get("/api/recommendations", tags=["Skill Intelligence"])
def get_recommendations(
    role: str = Query("software-developer"),
    student_id: str = Query(DEFAULT_STUDENT_ID)
):
    """
    Returns prioritized learning interventions ranked using gap size,
    role importance, and prerequisite readiness.
    """
    data = get_student_data(student_id)
    analysis = evaluate_skill_gaps_and_priorities(data["skills"], role)
    return {
        "student_id": student_id,
        "target_role": analysis["role"],
        "recommendations": analysis["recommendations"]
    }


@app.get("/api/digital-twin", tags=["Digital Twin"])
def get_digital_twin(student_id: str = Query(DEFAULT_STUDENT_ID)):
    """
    Returns the holistic 360-degree Student Digital Twin synthesis.
    Harmonizes academic health, technical skills, assessment history, and consistency.
    Includes Phase 5 explainable ML early academic risk advisory indicator.
    """
    data = get_student_data(student_id)
    dt = build_student_digital_twin(
        student_profile=data["profile"],
        academic_records=data["academics"],
        skills=data["skills"],
        assessments_history=data["attempts"],
        study_tasks=data["tasks"]
    )
    try:
        risk_prediction = predict_for_student_profile(student_id, data)
        dt["ml_academic_risk_advisory"] = risk_prediction.model_dump()
    except Exception:
        dt["ml_academic_risk_advisory"] = None
    return dt


# ---------------------------------------------------------------------------
# 3. Phase 4: Assessment Integration & Feedback Loop
# ---------------------------------------------------------------------------

@app.get("/api/assessments/catalog", tags=["Assessments"])
def get_assessments_catalog():
    """Lists all available diagnostic assessments without correct answer keys."""
    catalog = []
    for a_id in ASSESSMENT_CATALOG:
        client_view = get_client_assessment(a_id)
        if client_view:
            catalog.append(client_view)
    return catalog


@app.get("/api/assessments/{assessment_id}", tags=["Assessments"])
def get_assessment_by_id(assessment_id: str):
    """Fetches a specific diagnostic quiz with sanitized questions (no answers exposed)."""
    quiz = get_client_assessment(assessment_id)
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Assessment '{assessment_id}' was not found in catalog."
        )
    return quiz


@app.post("/api/assessments/submit", tags=["Assessments"])
def submit_assessment(submission: AssessmentSubmissionRequest):
    """
    Evaluates assessment submission:
      1. Validates assessment ID, question IDs, and answer ranges.
      2. Scores answers server-side against secure answer key.
      3. Prevents duplicate scoring via idempotency check.
      4. Updates skill proficiency using the documented Exponential Moving Average formula.
      5. Persists the attempt and updates the Student Digital Twin feedback loop.
    """
    student_id = submission.student_id or DEFAULT_STUDENT_ID
    data = get_student_data(student_id)

    # Process and evaluate submission
    result = evaluate_and_process_submission(
        student_id=student_id,
        assessment_id=submission.assessment_id,
        submitted_answers=submission.answers,
        submission_token=submission.submission_token,
        current_skills=data["skills"],
        student_profile=data["profile"],
        academic_records=data["academics"],
        past_attempts=data["attempts"],
        study_tasks=data["tasks"]
    )

    # If not a duplicate, persist the updated skill and attempt record
    if not result.get("duplicate", False):
        persist_skill_update(student_id, result["skill_id"], result["new_skill_score"])
        persist_assessment_attempt(student_id, {
            "assessment_id": submission.assessment_id,
            "assessment_title": result["assessment_title"],
            "score": result["score_percentage"],
            "date": result["submitted_at"][:10],
            "timestamp": result["submitted_at"]
        })

    return result


# ---------------------------------------------------------------------------
# 4. Standard CRUD Endpoints (Preserved for MongoDB)
# ---------------------------------------------------------------------------

@app.post("/api/students", response_model=StudentProfileResponse, status_code=status.HTTP_201_CREATED, tags=["Student Profiles"])
def save_student_profile(profile: StudentProfileCreate):
    db_check = check_database_connection()
    if db_check["connected"]:
        db = get_database()
        if db is not None:
            return crud.create_or_update_student_profile(db, profile)
    # In-memory save fallback
    data = get_student_data(profile.student_id)
    data["profile"].update(profile.model_dump())
    return StudentProfileResponse(**data["profile"])


@app.get("/api/students/{student_id}", response_model=StudentProfileResponse, tags=["Student Profiles"])
def get_student_profile_by_id(student_id: str):
    db_check = check_database_connection()
    if db_check["connected"]:
        db = get_database()
        if db is not None:
            doc = crud.get_student_profile(db, student_id)
            if doc:
                return doc
    data = get_student_data(student_id)
    return StudentProfileResponse(**data["profile"])


@app.post("/api/academic-records", response_model=AcademicRecordResponse, status_code=status.HTTP_201_CREATED, tags=["Academic Records"])
def create_academic_record(record: AcademicRecordCreate):
    db_check = check_database_connection()
    if db_check["connected"]:
        db = get_database()
        if db is not None:
            return crud.create_academic_record(db, record)
    data = get_student_data(record.student_id)
    new_doc = record.model_dump()
    new_doc["id"] = f"acad-{len(data['academics']) + 1}"
    data["academics"].append(new_doc)
    return AcademicRecordResponse(**new_doc)


@app.get("/api/academic-records/{student_id}", response_model=List[AcademicRecordResponse], tags=["Academic Records"])
def get_academic_records_for_student(student_id: str):
    data = get_student_data(student_id)
    return [AcademicRecordResponse(**a) for a in data["academics"]]


@app.post("/api/skills", response_model=SkillRecordResponse, status_code=status.HTTP_201_CREATED, tags=["Skill Records"])
def save_skill_record(skill: SkillRecordCreate):
    data = get_student_data(skill.student_id)
    updated = False
    for s in data["skills"]:
        if s.get("skill_name") == skill.skill_name or s.get("name") == skill.skill_name:
            s.update(skill.model_dump())
            updated = True
            break
    if not updated:
        data["skills"].append(skill.model_dump())
    return SkillRecordResponse(**skill.model_dump())


@app.get("/api/skills/{student_id}", response_model=List[SkillRecordResponse], tags=["Skill Records"])
def get_skills_for_student(student_id: str):
    data = get_student_data(student_id)
    return [SkillRecordResponse(**s) for s in data["skills"]]


# ---------------------------------------------------------------------------
# 5. Phase 5: Machine Learning Academic Risk Prediction Endpoints
# ---------------------------------------------------------------------------

@app.get("/api/ml/model-info", tags=["Machine Learning"])
def get_ml_model_metadata():
    """
    Returns active ML model metadata, architecture, version, evaluation metrics,
    baseline comparisons, dataset provenance, and ethical disclaimers.
    """
    return get_model_info()


@app.post(
    "/api/ml/predict-academic-risk",
    response_model=AcademicRiskPredictionResponse,
    tags=["Machine Learning"]
)
def predict_risk_from_features(payload: AcademicRiskPredictionRequest):
    """
    Predicts early academic at-risk status based on verified academic effort features.
    Strictly excludes sensitive personal attributes (gender, age, family, religion).
    Output is advisory and must not be used for automated high-stakes academic decisions.
    """
    return predict_academic_risk(payload)


@app.get(
    "/api/ml/student/academic-risk",
    response_model=AcademicRiskPredictionResponse,
    tags=["Machine Learning"]
)
def predict_risk_for_student(
    student_id: str = Query(DEFAULT_STUDENT_ID)
):
    """
    Maps student's current recorded academic marks, attendance, and study hours
    into the trained ML pipeline and returns an explainable advisory evaluation.
    """
    data = get_student_data(student_id)
    return predict_for_student_profile(student_id, data)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.API_HOST, port=settings.API_PORT, reload=True)
