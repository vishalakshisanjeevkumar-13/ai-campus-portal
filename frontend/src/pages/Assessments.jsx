import React from "react";
import { useApp } from "../context/AppContext";
import { Icon } from "../components/Icons";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";

export const Assessments = () => {
  const { assessmentsCatalog, completedAssessments, setActivePage } = useApp();

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Assessments & Diagnostics</h1>
          <p className="page-subtitle">Standardized problem solving tests and diagnostic benchmarks that calibrate your Student Digital Twin.</p>
        </div>

        <div className="page-actions-group">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setActivePage("assessment-quiz")}
          >
            <Icon name="assessments" size={16} />
            Start DSA Fundamentals (10 Qs)
          </button>
        </div>
      </div>

      {/* Recommended Assessments Section */}
      <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
        <Icon name="sparkles" size={18} color="var(--primary)" />
        AI Recommended Diagnostic Drills
      </h2>

      <div className="grid grid-3 gap-4 mb-8">
        {assessmentsCatalog.map((assess) => (
          <Card key={assess.id} className="flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-2">
                <Badge variant={assess.badgeColor}>{assess.status}</Badge>
                <span className="text-xs text-muted font-semibold">{assess.difficulty}</span>
              </div>

              <h3 className="text-base font-bold text-primary mb-1">{assess.title}</h3>
              <p className="text-xs text-secondary mb-3">{assess.description}</p>

              <div className="flex flex-wrap gap-1 mb-4">
                {assess.topics.map((t) => (
                  <span key={t} className="px-2 py-0.5 bg-alt border rounded text-xs text-muted">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-top" style={{ borderTop: "1px solid var(--surface-border)" }}>
              <div className="flex items-center justify-between text-xs text-muted mb-3">
                <span className="flex items-center gap-1">
                  <Icon name="clock" size={12} /> {assess.durationMinutes} Mins
                </span>
                <span>{assess.questionsCount} Questions</span>
              </div>

              <button
                className="btn btn-primary btn-block btn-sm"
                onClick={() => setActivePage("assessment-quiz")}
              >
                Start Assessment
                <Icon name="arrow-right" size={14} />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Completed Assessments Log */}
      <Card
        title="Completed Assessments History"
        subtitle="Verifiable problem solving benchmarks and historical diagnostic records"
      >
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Assessment</th>
                <th>Category</th>
                <th>Date Taken</th>
                <th>Score</th>
                <th>Status</th>
                <th>Diagnostic Feedback</th>
              </tr>
            </thead>
            <tbody>
              {completedAssessments.map((a) => (
                <tr key={a.id}>
                  <td>
                    <strong className="text-primary">{a.title}</strong>
                  </td>
                  <td><span className="text-xs font-semibold text-secondary">{a.category}</span></td>
                  <td><span className="text-xs text-muted font-mono">{a.date}</span></td>
                  <td>
                    <strong style={{ color: a.score >= 65 ? "var(--success)" : "var(--danger)", fontSize: "1.05rem" }}>
                      {a.score}%
                    </strong>
                  </td>
                  <td><Badge variant={a.status}>{a.status}</Badge></td>
                  <td><span className="text-xs text-secondary">{a.feedback}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
