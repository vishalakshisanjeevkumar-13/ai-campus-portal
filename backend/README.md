# AI Campus Companion — Backend API (FastAPI + MongoDB + Intelligence Engine + ML)

Adaptive Academic & Career Intelligence Platform (Student Digital Twin)  
**Phases 1–5: Backend, Database, Intelligence Engine, Assessment Feedback Loop & Machine Learning Integration**

---

## 📌 System Overview

The **AI Campus Companion Backend** provides the explainable intelligence engine, reactive feedback loop, and predictive machine learning module for the student digital twin platform.

Key capabilities:
1. **Academic Audit**: Computes credit-weighted SGPA and cumulative CGPA using a configurable 10-point university grading scale, tracking credit completion and attendance health.
2. **Role-Based Skill Gap Analysis**: Measures student competencies against decoupled industry benchmarks (initially *Software Developer*), classifying mastery into Mastered, Moderate, Weak, and Missing tiers.
3. **Prerequisite-Aware Priority Engine**: Uses a deterministic heuristic formula (not machine learning) to rank intervention priorities, ensuring foundational prerequisites (e.g., Java OOP before Spring Boot) are addressed first.
4. **Student Digital Twin Synthesis**: Combines academic health, technical skills, assessment history, and study habits into explainable readiness indicators with explicit disclaimers.
5. **Assessment Integration & Feedback Loop**: Server-side grading of diagnostic tests against secure answer keys, idempotent submission protection, and dynamic Bayesian Exponential Moving Average (EMA) skill updates.
6. **Predictive Academic At-Risk Warning (Phase 5 ML)**: A genuinely trained, versioned scikit-learn RandomForest model predicting early academic difficulty from study effort and prior attainment without sensitive personal attributes.

---

## 🤖 Phase 5: Machine Learning Academic Risk Warning

### 1. Dataset Provenance & Task Definition
- **Dataset**: UCI Machine Learning Repository — *Student Performance Dataset (Mathematics Course)*
- **Citation**: P. Cortez and A. Silva (2008). *Using Data Mining to Predict Secondary School Student Performance*. FUBUTEC 2008, pp. 5–12.
- **Source**: [https://archive.ics.uci.edu/dataset/320/student+performance](https://archive.ics.uci.edu/dataset/320/student+performance)
- **License**: Creative Commons Attribution 4.0 International (CC BY 4.0).
- **Task**: Binary Classification for Early Academic At-Risk Detection (`1 = At-Risk [G3 < 10]`, `0 = On-Track [G3 >= 10]`).
- **Features Used (Strictly Academic & Behavioral Effort)**:
  - `g1_score`: Baseline first-period assessment score (0–20 scale).
  - `studytime`: Weekly study hours (1: <2h, 2: 2–5h, 3: 5–10h, 4: >10h).
  - `failures`: Past course failures (0–4).
  - `absences`: Missed educational sessions (0–93).
  - `schoolsup`: Institutional remedial tutoring (binary 0/1).
  - `paid`: Supplementary subject tutoring (binary 0/1).
- **Target Leakage Prevention**: `G3` (final exam grade) is dropped as it is the target source; `G2` (second period final exam) is excluded to preserve an authentic early intervention warning rather than late-stage trivial prediction.
- **Ethical AI / Non-Discrimination**: Strictly excludes demographic, gender, geographic, and familial personal attributes.

### 2. Measured Evaluation Results (Test Set N=99, Stratified Split)

| Model | Accuracy | At-Risk Precision | At-Risk Recall | At-Risk F1 | Macro F1 | ROC-AUC |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Baseline (Dummy Most Frequent)** | 66.7% | 0.00 | 0.00 | 0.00 | 0.40 | 0.5000 |
| **Logistic Regression** | 79.8% | 0.697 | 0.697 | 0.697 | 0.77 | 0.9178 |
| **RandomForestClassifier (Production v1.0.0)** | **79.8%** | **0.644** | **0.879** | **0.744** | **0.78** | **0.9242** |

- **RandomForest Confusion Matrix**:
  - True Negatives (`On-Track` correctly predicted): **50**
  - False Positives (`On-Track` flagged as at-risk): **16**
  - False Negatives (`At-Risk` missed): **4** (High Recall: 87.9% of at-risk students successfully identified)
  - True Positives (`At-Risk` correctly caught): **29** out of 33
- **Feature Importance Breakdown**:
  - `g1_score` (Prior attainment): **70.8%**
  - `failures` (Past failure history): **11.8%**
  - `absences` (Attendance health): **9.7%**
  - `schoolsup` (Institutional support): **3.5%**
  - `studytime` (Weekly study effort): **2.5%**
  - `paid` (Tutoring participation): **1.7%**

### 3. Model Artifacts & Reproducibility
- Preprocessor: `ColumnTransformer` (StandardScaler fitted strictly on training data).
- Artifacts:
  - `backend/ml/artifacts/academic_risk_pipeline_v1.joblib`
  - `backend/ml/artifacts/model_metadata_v1.json`
- Retraining Command:
  ```powershell
  python ml/download_dataset.py
  python ml/train_academic_risk_model.py
  ```

---

## 📐 Documented Intelligence Formulas

### 1. Credit-Weighted GPA & CGPA (Academic Audit)
$$\text{SGPA} = \frac{\sum (\text{Grade Point} \times \text{Credits})}{\sum \text{Credits}}$$
$$\text{CGPA} = \frac{\sum_{\text{all semesters}} (\text{Grade Point} \times \text{Credits})}{\sum_{\text{all semesters}} \text{Credits}}$$

### 2. Skill Calibration Rule (Exponential Moving Average)
When an assessment is evaluated on the backend:
$$\text{New Skill Score} = \text{round}(0.55 \times \text{Current Skill Score} + 0.45 \times \text{Quiz Percentage}, 1)$$
*Note: A single quiz attempt never equates to permanent 100% mastery. Consistency over time progressively builds verified confidence.*

### 3. Prerequisite-Aware Priority Metric
$$\text{Priority Score} = (\text{Normalized Gap} \times \text{Role Weight} \times \text{Prereq Multiplier}) + \text{Blocker Boost} + \text{Foundational Boost}$$
- **Prereq Multiplier**: `1.0` if prerequisites are satisfied; `0.65` if prerequisites are missing (prevents jumping to advanced topics prematurely).
- **Blocker Boost**: `+0.25` if this skill is blocking other downstream skills with gaps.
- **Foundational Boost**: `+0.15` for core foundational skills (like DSA).

### 4. Digital Twin Placement Readiness Indicator
$$\text{Readiness} = (0.55 \times \text{Technical Skills}) + (0.25 \times \text{Academic Health}) + (0.20 \times \text{Assessment Confidence})$$
*Disclaimer: This is an explainable heuristic based on curricular and benchmark criteria, not a scientifically guaranteed employment probability.*

---

## 🚀 Setup & Execution (Windows)

```powershell
# 1. Navigate to backend directory
cd backend

# 2. Activate virtual environment
.\.venv\Scripts\Activate.ps1

# 3. Run automated test suite (47 unit, integration & ML tests)
pytest -v tests/

# 4. Start the FastAPI development server
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The API is accessible at **`http://127.0.0.1:8000`**  
Interactive Swagger Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 📡 API Endpoints Reference

### Diagnostics & Root
- `GET /` — API welcome message & metadata.
- `GET /api/health` — Differentiated service status (API online + MongoDB cluster ping).
- `GET /api/student/demo` — Preserved Phase 1 demo student profile.

### Intelligence & Digital Twin
- `GET /api/academics/audit` — Credit-weighted audit, SGPA, CGPA, and attendance indicators.
- `GET /api/skills/gaps?role=software-developer` — Gap diagnosis against target role.
- `GET /api/recommendations` — Prerequisite-ranked intervention priorities with human-readable rationales.
- `GET /api/digital-twin` — 360-degree synthesized Digital Twin readiness state (with advisory ML indicator).

### Machine Learning (Phase 5)
- `GET /api/ml/model-info` — Returns ML architecture, version, performance comparison, feature definitions, and disclaimers.
- `POST /api/ml/predict-academic-risk` — Evaluates arbitrary academic effort features and returns advisory risk classification.
- `GET /api/ml/student/academic-risk` — Maps current student record into model feature space for explainable early warning.

### Assessment Integration
- `GET /api/assessments/catalog` — Available tests without answers.
- `GET /api/assessments/{assessment_id}` — Test questions sanitized for client rendering.
- `POST /api/assessments/submit` — Server-side graded assessment submission, EMA skill update, and feedback loop.

### Standard Persistence (MongoDB)
- `POST /api/students` & `GET /api/students/{student_id}`
- `POST /api/academic-records` & `GET /api/academic-records/{student_id}`
- `POST /api/skills` & `GET /api/skills/{student_id}`
- `POST /api/assessments/attempts` & `GET /api/assessments/attempts/{student_id}`
- `POST /api/study-tasks` & `GET /api/study-tasks/{student_id}`
