import React from "react";
import { useApp } from "../context/AppContext";
import { Icon } from "../components/Icons";
import { Card } from "../components/Card";
import { ProgressBar } from "../components/ProgressBar";
import { Badge } from "../components/Badge";

export const AcademicAudit = () => {
  const { academicData, setActivePage } = useApp();

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Academic Audit</h1>
          <p className="page-subtitle">Coursework evaluation, credits audit, and subject competency tracking.</p>
        </div>

        <div className="page-actions-group">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActivePage("performance")}
          >
            <Icon name="chart" size={16} />
            Historical Trends
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setActivePage("documents")}
          >
            <Icon name="upload" size={16} />
            Upload Grade Card
          </button>
        </div>
      </div>

      {/* Academic Score Large Banner */}
      <div className="academic-score-banner">
        <div className="academic-score-main">
          <div className="academic-score-circle">
            <span className="academic-score-num">{academicData.academicHealth}</span>
            <span className="academic-score-sub">/ 100</span>
          </div>
          <div>
            <Badge variant="success" className="mb-2">Audited & Verified</Badge>
            <h2 className="text-xl font-bold">Academic Health Index: Solid (78/100)</h2>
            <p className="text-sm text-secondary max-w-xl">
              Calculated from cumulative credit performance, theory vs lab distributions, and semester consistency across 98 earned credits.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="p-3 bg-alt border rounded text-center">
            <div className="text-xs text-muted">Completed Credits</div>
            <div className="text-lg font-bold text-primary">{academicData.creditsCompleted} / {academicData.totalCredits}</div>
          </div>
          <div className="p-3 bg-alt border rounded text-center">
            <div className="text-xs text-muted">Active Backlogs</div>
            <div className="text-lg font-bold text-success">0 Clear</div>
          </div>
        </div>
      </div>

      {/* 4 Overview Metric Cards */}
      <div className="grid grid-4 gap-4 mb-6">
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted uppercase font-bold">Cumulative CGPA</span>
            <Icon name="academic" size={18} color="var(--primary)" />
          </div>
          <div className="text-2xl font-bold text-primary mb-1">{academicData.cgpa}</div>
          <div className="text-xs text-muted">Scale of 10.0 • Top 15% in CSE</div>
          <ProgressBar value={(academicData.cgpa / 10) * 100} variant="primary" size="thin" className="mt-3" />
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted uppercase font-bold">Overall Attendance</span>
            <Icon name="check-circle" size={18} color="var(--success)" />
          </div>
          <div className="text-2xl font-bold text-success mb-1">{academicData.attendance}%</div>
          <div className="text-xs text-muted">Eligible for all exams (&gt;75% required)</div>
          <ProgressBar value={academicData.attendance} variant="success" size="thin" className="mt-3" />
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted uppercase font-bold">Average Exam Score</span>
            <Icon name="chart" size={18} color="var(--secondary)" />
          </div>
          <div className="text-2xl font-bold text-secondary mb-1">{academicData.averageScore}%</div>
          <div className="text-xs text-muted">Midterms, quizzes & finals aggregate</div>
          <ProgressBar value={academicData.averageScore} variant="secondary" size="thin" className="mt-3" />
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted uppercase font-bold">Semester Trajectory</span>
            <Icon name="trending-up" size={18} color="var(--warning)" />
          </div>
          <div className="text-2xl font-bold text-warning mb-1">{academicData.improvement}</div>
          <div className="text-xs text-muted">Up from 7.1 in Sem 3 to 7.8 in Sem 5</div>
          <ProgressBar value={78} variant="warning" size="thin" className="mt-3" />
        </Card>
      </div>

      {/* Subject Performance Breakdown */}
      <Card
        title="Subject Performance & Competency Breakdown"
        subtitle="Individual semester course audits, grade distributions, and attendance metrics"
      >
        <div className="subject-perf-grid">
          {academicData.subjects.map((sub) => (
            <div key={sub.id} className="subject-perf-item">
              <div className="subject-perf-top">
                <div className="flex items-center gap-2">
                  <span className="subject-code-badge">{sub.code}</span>
                  <span className="subject-name-txt">{sub.name}</span>
                </div>
                <Badge variant={sub.status}>{sub.grade} Grade</Badge>
              </div>

              <div className="my-1">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-secondary">Course Mastery Score</span>
                  <strong className="text-primary">{sub.score}%</strong>
                </div>
                <ProgressBar value={sub.score} variant="auto" size="thin" />
              </div>

              <div className="subject-meta-line">
                <span>Faculty: {sub.faculty}</span>
                <span>Credits: {sub.credits}</span>
                <span className={sub.attendance >= 85 ? "text-success" : "text-warning"}>
                  Attendance: {sub.attendance}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
