"""
Training and Evaluation Pipeline for Academic At-Risk Warning Model.
Phase 5: Machine Learning Integration for AI Campus Companion.

Dataset: UCI Student Performance Dataset (Mathematics Course)
Source: P. Cortez and A. Silva (2008), University of Minho, Portugal.
        UCI Machine Learning Repository.
License: Creative Commons Attribution 4.0 International (CC BY 4.0)
Task: Binary Classification of Early Academic At-Risk Status (1 = At-Risk, 0 = On-Track)
"""

import json
import logging
from datetime import datetime, timezone
from pathlib import Path
import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.dummy import DummyClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("academic_risk_training")

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "student-mat.csv"
ARTIFACTS_DIR = BASE_DIR / "artifacts"
ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)

MODEL_VERSION = "v1.0.0"
PIPELINE_PATH = ARTIFACTS_DIR / f"academic_risk_pipeline_{MODEL_VERSION.split('.')[0]}.joblib"
METADATA_PATH = ARTIFACTS_DIR / f"model_metadata_{MODEL_VERSION.split('.')[0]}.json"

FEATURE_COLUMNS = ["G1", "studytime", "failures", "absences", "schoolsup", "paid"]
NUMERIC_SCALE_COLS = ["G1", "absences"]
PASSTHROUGH_COLS = ["studytime", "failures", "schoolsup", "paid"]


def load_and_prepare_dataset(csv_path: Path):
    """
    Loads raw CSV, performs feature validation and maps labels.
    Strictly excludes sensitive personal attributes (gender, age, address, family status, alcohol).
    Target: G3 < 10 -> At-Risk (1), G3 >= 10 -> On-Track (0) on Portuguese 20-point scale.
    """
    if not csv_path.exists():
        raise FileNotFoundError(f"Dataset not found at {csv_path}. Run download_dataset.py first.")

    df = pd.read_csv(csv_path, sep=";")
    logger.info(f"Loaded dataset from {csv_path}. Raw records: {len(df)}")

    # Features selected strictly for academic effort & prior attainment
    X = df[FEATURE_COLUMNS].copy()
    
    # Binary encoding of categorical effort indicators
    X["schoolsup"] = (X["schoolsup"].str.strip().str.lower() == "yes").astype(int)
    X["paid"] = (X["paid"].str.strip().str.lower() == "yes").astype(int)

    # Ground truth target: G3 < 10 defines academic failure / high risk of non-completion
    y = (df["G3"] < 10).astype(int)

    # Rename G1 to descriptive g1_score
    X = X.rename(columns={"G1": "g1_score"})

    return X, y


def train_and_evaluate():
    logger.info(f"Starting Phase 5 ML Model Training (Version: {MODEL_VERSION})...")
    X, y = load_and_prepare_dataset(DATA_PATH)

    class_counts = y.value_counts().to_dict()
    total_samples = len(y)
    class_balance = {
        "on_track_0": int(class_counts.get(0, 0)),
        "on_track_pct": round(float(class_counts.get(0, 0) / total_samples * 100), 1),
        "at_risk_1": int(class_counts.get(1, 0)),
        "at_risk_pct": round(float(class_counts.get(1, 0) / total_samples * 100), 1)
    }
    logger.info(f"Class Distribution: {class_balance}")

    # Stratified Train/Test Split (75% train, 25% test) to prevent distribution drift
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )
    logger.info(f"Train set: {len(X_train)} samples | Test set: {len(X_test)} samples")

    # Define Preprocessing: Fit scaler ONLY on X_train to avoid target/data leakage
    numeric_feature_names = ["g1_score", "absences"]
    passthrough_feature_names = ["studytime", "failures", "schoolsup", "paid"]

    preprocessor = ColumnTransformer(
        transformers=[
            ("num_scaler", StandardScaler(), numeric_feature_names),
            ("passthrough", "passthrough", passthrough_feature_names)
        ],
        remainder="drop"
    )

    # -------------------------------------------------------------------------
    # 1. Baseline Model (Dummy Most-Frequent Classifier)
    # -------------------------------------------------------------------------
    dummy = DummyClassifier(strategy="most_frequent")
    dummy.fit(X_train, y_train)
    y_pred_dummy = dummy.predict(X_test)

    baseline_metrics = {
        "model_name": "DummyClassifier (Most Frequent)",
        "accuracy": round(float(accuracy_score(y_test, y_pred_dummy)), 4),
        "precision_at_risk": round(float(precision_score(y_test, y_pred_dummy, zero_division=0)), 4),
        "recall_at_risk": round(float(recall_score(y_test, y_pred_dummy, zero_division=0)), 4),
        "f1_at_risk": round(float(f1_score(y_test, y_pred_dummy, zero_division=0)), 4),
        "macro_f1": round(float(f1_score(y_test, y_pred_dummy, average="macro", zero_division=0)), 4)
    }

    # -------------------------------------------------------------------------
    # 2. Linear Comparison Model (Logistic Regression)
    # -------------------------------------------------------------------------
    lr_pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("classifier", LogisticRegression(random_state=42, max_iter=200))
    ])
    lr_pipeline.fit(X_train, y_train)
    y_pred_lr = lr_pipeline.predict(X_test)
    y_prob_lr = lr_pipeline.predict_proba(X_test)[:, 1]

    lr_metrics = {
        "model_name": "Logistic Regression",
        "accuracy": round(float(accuracy_score(y_test, y_pred_lr)), 4),
        "precision_at_risk": round(float(precision_score(y_test, y_pred_lr, zero_division=0)), 4),
        "recall_at_risk": round(float(recall_score(y_test, y_pred_lr, zero_division=0)), 4),
        "f1_at_risk": round(float(f1_score(y_test, y_pred_lr, zero_division=0)), 4),
        "macro_f1": round(float(f1_score(y_test, y_pred_lr, average="macro", zero_division=0)), 4),
        "roc_auc": round(float(roc_auc_score(y_test, y_prob_lr)), 4)
    }

    # -------------------------------------------------------------------------
    # 3. Primary Production Model (Random Forest Classifier)
    # -------------------------------------------------------------------------
    rf_pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("classifier", RandomForestClassifier(
            n_estimators=100,
            max_depth=4,
            min_samples_split=4,
            min_samples_leaf=2,
            random_state=42,
            class_weight="balanced"
        ))
    ])
    rf_pipeline.fit(X_train, y_train)
    y_pred_rf = rf_pipeline.predict(X_test)
    y_prob_rf = rf_pipeline.predict_proba(X_test)[:, 1]

    cm = confusion_matrix(y_test, y_pred_rf)
    tn, fp, fn, tp = cm.ravel()

    rf_model = rf_pipeline.named_steps["classifier"]
    ordered_feature_names = numeric_feature_names + passthrough_feature_names
    importances = {
        name: round(float(val), 4)
        for name, val in zip(ordered_feature_names, rf_model.feature_importances_)
    }

    rf_metrics = {
        "model_name": "RandomForestClassifier",
        "hyperparameters": {
            "n_estimators": 100,
            "max_depth": 4,
            "min_samples_split": 4,
            "min_samples_leaf": 2,
            "class_weight": "balanced",
            "random_state": 42
        },
        "accuracy": round(float(accuracy_score(y_test, y_pred_rf)), 4),
        "precision_at_risk": round(float(precision_score(y_test, y_pred_rf, zero_division=0)), 4),
        "recall_at_risk": round(float(recall_score(y_test, y_pred_rf, zero_division=0)), 4),
        "f1_at_risk": round(float(f1_score(y_test, y_pred_rf, zero_division=0)), 4),
        "macro_f1": round(float(f1_score(y_test, y_pred_rf, average="macro", zero_division=0)), 4),
        "weighted_f1": round(float(f1_score(y_test, y_pred_rf, average="weighted", zero_division=0)), 4),
        "roc_auc": round(float(roc_auc_score(y_test, y_prob_rf)), 4),
        "confusion_matrix": {
            "true_negatives": int(tn),
            "false_positives": int(fp),
            "false_negatives": int(fn),
            "true_positives": int(tp)
        },
        "feature_importances": importances
    }

    logger.info("=== EVALUATION SUMMARY ===")
    logger.info(f"Baseline (Dummy) Accuracy: {baseline_metrics['accuracy']} | At-Risk F1: {baseline_metrics['f1_at_risk']}")
    logger.info(f"Logistic Reg Accuracy:     {lr_metrics['accuracy']} | At-Risk F1: {lr_metrics['f1_at_risk']} | ROC-AUC: {lr_metrics['roc_auc']}")
    logger.info(f"Random Forest Accuracy:    {rf_metrics['accuracy']} | At-Risk F1: {rf_metrics['f1_at_risk']} | ROC-AUC: {rf_metrics['roc_auc']}")
    logger.info(f"Confusion Matrix (RF): TN={tn}, FP={fp}, FN={fn}, TP={tp}")
    logger.info(f"Feature Importances: {importances}")

    # -------------------------------------------------------------------------
    # Save Versioned Model Pipeline & Comprehensive Metadata
    # -------------------------------------------------------------------------
    joblib.dump(rf_pipeline, PIPELINE_PATH)
    logger.info(f"Saved model pipeline artifact to: {PIPELINE_PATH}")

    metadata = {
        "model_version": MODEL_VERSION,
        "artifact_file": PIPELINE_PATH.name,
        "trained_at_utc": datetime.now(timezone.utc).isoformat(),
        "task_type": "Binary Classification (Early Academic At-Risk Warning)",
        "dataset": {
            "name": "UCI Student Performance Dataset (Mathematics Course)",
            "citation": "Cortez, P., & Silva, A. (2008). Using data mining to predict secondary school student performance. FUBUTEC 2008, pp. 5-12.",
            "source_url": "https://archive.ics.uci.edu/dataset/320/student+performance",
            "license": "Creative Commons Attribution 4.0 International (CC BY 4.0)",
            "total_instances": total_samples,
            "train_instances": len(X_train),
            "test_instances": len(X_test),
            "class_distribution": class_balance
        },
        "features": {
            "g1_score": {
                "type": "float",
                "range": [0.0, 20.0],
                "description": "First period academic assessment grade on a 0-20 scale."
            },
            "studytime": {
                "type": "int",
                "range": [1, 4],
                "description": "Weekly study time category: 1 (<2h), 2 (2-5h), 3 (5-10h), 4 (>10h)."
            },
            "failures": {
                "type": "int",
                "range": [0, 4],
                "description": "Count of past subject failures (0 to 4)."
            },
            "absences": {
                "type": "int",
                "range": [0, 93],
                "description": "Recorded school absence sessions."
            },
            "schoolsup": {
                "type": "int (binary)",
                "range": [0, 1],
                "description": "1 if receiving remedial institutional academic support, else 0."
            },
            "paid": {
                "type": "int (binary)",
                "range": [0, 1],
                "description": "1 if enrolled in supplementary subject tutoring, else 0."
            }
        },
        "target": {
            "name": "at_risk",
            "classes": {
                "0": "On-Track (G3 >= 10 on 20-point scale)",
                "1": "At-Risk (G3 < 10 on 20-point scale)"
            }
        },
        "performance_comparison": {
            "baseline_dummy": baseline_metrics,
            "logistic_regression": lr_metrics,
            "random_forest_production": rf_metrics
        },
        "limitations_and_ethics": {
            "non_discrimination_statement": "Strictly excludes demographic and personal attributes (sex, age, address, family cohabitation, alcohol, relationships) to prevent bias and ensure ethical alignment.",
            "domain_transfer_limitation": "Trained on secondary school mathematics records in Portugal (0-20 grade scale). College/university grade systems (e.g. 10.0 CGPA scale) require mapped approximations.",
            "advisory_status": "This model is strictly advisory and must NOT be used to make automated high-stakes academic decisions or determine career placement outcomes."
        }
    }

    with open(METADATA_PATH, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    logger.info(f"Saved metadata to: {METADATA_PATH}")
    return metadata


if __name__ == "__main__":
    train_and_evaluate()
