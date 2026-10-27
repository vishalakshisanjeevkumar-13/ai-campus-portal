import React from "react";
import { useApp } from "../context/AppContext";
import { Icon } from "../components/Icons";
import { Card } from "../components/Card";
import { ProgressBar } from "../components/ProgressBar";
import { Badge } from "../components/Badge";

export const Progress = () => {
  const { progressHistory, student, skills, setActivePage } = useApp();

  const dsaSkill = skills.find(s => s.shortName === "DSA");

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Learning Progress & Growth Analytics</h1>
          <p className="page-subtitle">Longitudinal tracking of skill acceleration, active study streaks, and milestones.</p>
        </div>

        <div className="page-actions-group">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActivePage("study-planner")}
          >
            <Icon name="calendar" size={16} />
            Study Planner
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setActivePage("assessments")}
          >
            <Icon name="assessments" size={16} />
            Diagnostic Assessments
          </button>
        </div>
      </div>

      {/* 4 KPI Progress Cards */}
      <div className="grid grid-4 gap-4 mb-6">
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted uppercase font-bold">Active Streak</span>
            <Icon name="zap" size={18} color="var(--warning)" />
          </div>
          <div className="text-2xl font-bold text-warning mb-1">{progressHistory.streak} Days 🔥</div>
          <div className="text-xs text-muted">Personal Best: {progressHistory.streakBest} Days</div>
          <ProgressBar value={(progressHistory.streak / 30) * 100} variant="warning" size="thin" className="mt-3" />
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted uppercase font-bold">Tasks Completed</span>
            <Icon name="check-circle" size={18} color="var(--success)" />
          </div>
          <div className="text-2xl font-bold text-success mb-1">{student.completedTasksCount} Tasks</div>
          <div className="text-xs text-muted">Across 8 weekly study modules</div>
          <ProgressBar value={75} variant="success" size="thin" className="mt-3" />
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted uppercase font-bold">Assessments Taken</span>
            <Icon name="assessments" size={18} color="var(--primary)" />
          </div>
          <div className="text-2xl font-bold text-primary mb-1">{student.totalAssessmentsTaken} Tests</div>
          <div className="text-xs text-muted">Calibrated with verified tests</div>
          <ProgressBar value={student.totalAssessmentsTaken * 8} variant="primary" size="thin" className="mt-3" />
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted uppercase font-bold">Hours Invested</span>
            <Icon name="clock" size={18} color="var(--secondary)" />
          </div>
          <div className="text-2xl font-bold text-secondary mb-1">{progressHistory.totalHoursStudied} Hours</div>
          <div className="text-xs text-muted">Average 18 hrs/week</div>
          <ProgressBar value={82} variant="secondary" size="thin" className="mt-3" />
        </Card>
      </div>

      {/* Monthly Skill Progression Timeline */}
      <Card
        title="Monthly Skill Growth Timeline"
        subtitle="Tracking the trajectory of core skills over the last quarter"
        className="mb-6"
      >
        <div className="grid grid-3 gap-4">
          {progressHistory.monthlySkillTimeline.map((item) => (
            <div key={item.month} className="p-4 bg-alt border rounded flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <strong className="text-base text-primary">{item.month} 2024</strong>
                <Badge variant="primary">Overall: {item.overall}%</Badge>
              </div>

              <div className="flex flex-col gap-2">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-secondary font-semibold">DSA Competency</span>
                    <strong style={{ color: item.dsa >= 65 ? "var(--success)" : item.dsa >= 50 ? "var(--warning)" : "var(--danger)" }}>
                      {item.dsa}%
                    </strong>
                  </div>
                  <ProgressBar value={item.dsa} variant="auto" size="thin" />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-secondary font-semibold">Java OOP</span>
                    <strong>{item.java}%</strong>
                  </div>
                  <ProgressBar value={item.java} variant="auto" size="thin" />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-secondary font-semibold">SQL & Databases</span>
                    <strong>{item.sql}%</strong>
                  </div>
                  <ProgressBar value={item.sql} variant="auto" size="thin" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Milestones Timeline */}
      <Card
        title="Recent Verified Milestones"
        subtitle="Chronological log of academic and skill certifications"
      >
        <div className="flex flex-col gap-3">
          {progressHistory.recentMilestones.map((m, idx) => (
            <div key={idx} className="p-3 bg-alt border rounded flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-surface border rounded text-success">
                  <Icon name="check-circle" size={18} />
                </div>
                <div>
                  <div className="font-bold text-sm text-primary">{m.title}</div>
                  <div className="text-xs text-muted">Category: {m.category}</div>
                </div>
              </div>
              <span className="text-xs text-muted font-mono">{m.date}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
