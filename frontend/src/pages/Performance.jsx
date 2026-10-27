import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Icon } from "../components/Icons";
import { Card } from "../components/Card";
import { ProgressBar } from "../components/ProgressBar";
import { Badge } from "../components/Badge";

export const Performance = () => {
  const { performanceHistory, completedAssessments } = useApp();
  const [activeFilter, setActiveFilter] = useState("All");

  const filterOptions = ["All", "Semester", "Subject", "Assessment"];

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Performance History</h1>
          <p className="page-subtitle">Longitudinal analytics tracking academic progression, diagnostic tests, and consistency.</p>
        </div>

        <div className="filter-tabs-row">
          {filterOptions.map((filter) => (
            <button
              key={filter}
              className={`filter-tab-btn ${activeFilter === filter ? "active" : ""}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter} View
            </button>
          ))}
        </div>
      </div>

      {/* CGPA Trend Chart Section */}
      {(activeFilter === "All" || activeFilter === "Semester") && (
        <Card
          title="CGPA Progression Across Semesters"
          subtitle="Steady upward trajectory: Semester 3 (7.1) → Semester 4 (7.5) → Semester 5 (7.8)"
          className="mb-6"
        >
          <div className="chart-container-card" style={{ border: "none", padding: 0 }}>
            <div className="bar-chart-flex">
              {performanceHistory.cgpaTrend.map((item, idx) => {
                // Scale height: max 10.0 -> 200px
                const heightPercent = (item.cgpa / 10.0) * 100;
                return (
                  <div key={item.semester} className="chart-bar-column">
                    <span className="chart-bar-value-label">{item.cgpa}</span>
                    <div
                      className="chart-bar-pillar"
                      style={{
                        height: `${heightPercent}%`,
                        background: idx === performanceHistory.cgpaTrend.length - 1
                          ? "linear-gradient(180deg, var(--success), #34d399)"
                          : undefined
                      }}
                    />
                    <span className="chart-bar-x-label">{item.semester}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-xs text-muted mt-4">
              <span>Baseline: 6.8 (Sem 1)</span>
              <span className="text-success font-semibold">Current CGPA: 7.8 (Sem 5) • Positive Acceleration</span>
            </div>
          </div>
        </Card>
      )}

      {/* Subject Trends Matrix */}
      {(activeFilter === "All" || activeFilter === "Subject") && (
        <div className="grid grid-2 gap-4 mb-6">
          <Card
            title="Key Subject Evolution (Sem 3 → Sem 5)"
            subtitle="Tracking individual subject mastery across academic terms"
          >
            <div className="flex flex-col gap-3">
              {performanceHistory.subjectTrends.map((st) => (
                <div key={st.subject} className="p-3 bg-alt border rounded">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-sm text-primary">{st.subject}</strong>
                    <div className="text-xs text-muted flex gap-2">
                      <span>Sem 3: {st.s3}%</span>
                      <span>➔</span>
                      <span>Sem 4: {st.s4}%</span>
                      <span>➔</span>
                      <strong className="text-success">Sem 5: {st.s5}%</strong>
                    </div>
                  </div>
                  <ProgressBar value={st.s5} variant="auto" size="thin" />
                </div>
              ))}
            </div>
          </Card>

          {/* Attendance Trend */}
          <Card
            title="Monthly Attendance Consistency"
            subtitle="Classroom and lab presence across the semester"
          >
            <div className="flex flex-col gap-3">
              {performanceHistory.attendanceTrend.map((att) => (
                <div key={att.month} className="p-3 bg-alt border rounded">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold">{att.month} 2024</span>
                    <strong className={att.attendance >= 85 ? "text-success" : "text-warning"}>
                      {att.attendance}%
                    </strong>
                  </div>
                  <ProgressBar value={att.attendance} variant={att.attendance >= 85 ? "success" : "warning"} size="thin" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Assessment Performance History */}
      {(activeFilter === "All" || activeFilter === "Assessment") && (
        <Card
          title="Diagnostic & Skill Assessment Log"
          subtitle="Verifiable problem solving and diagnostic evaluation records"
        >
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Assessment Title</th>
                  <th>Category</th>
                  <th>Date Taken</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Feedback Summary</th>
                </tr>
              </thead>
              <tbody>
                {completedAssessments.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <strong>{a.title}</strong>
                    </td>
                    <td><span className="text-xs font-semibold text-secondary">{a.category}</span></td>
                    <td><span className="text-xs text-muted font-mono">{a.date}</span></td>
                    <td>
                      <strong style={{ color: a.score >= 65 ? "var(--success)" : "var(--danger)", fontSize: "1rem" }}>
                        {a.score}%
                      </strong>
                    </td>
                    <td>
                      <Badge variant={a.status}>{a.status}</Badge>
                    </td>
                    <td>
                      <span className="text-xs text-secondary">{a.feedback}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
