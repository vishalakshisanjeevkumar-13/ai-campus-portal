import React from "react";
import { useApp } from "../context/AppContext";
import { Icon } from "../components/Icons";
import { Card } from "../components/Card";
import { ProgressBar } from "../components/ProgressBar";
import { Badge } from "../components/Badge";
import { RecommendationCard } from "../components/RecommendationCard";
import { TaskCard } from "../components/TaskCard";

export const Dashboard = () => {
  const {
    student,
    skills,
    recommendations,
    weeklyTasks,
    setActivePage,
    setSelectedSkillModal
  } = useApp();

  const dsaSkill = skills.find(s => s.shortName === "DSA");
  const isDsaUpdated = dsaSkill?.current > 50;

  // Filter today's tasks (Monday/In-progress tasks for demo)
  const todaysTasks = weeklyTasks.filter(t => t.day === "Monday" || (!t.completed && (t.status === "In Progress" || t.priority === "HIGH"))).slice(0, 3);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Good Morning, {student.name.split(" ")[0]} 👋</h1>
          <p className="page-subtitle">Here’s your current academic and career intelligence.</p>
        </div>

        <div className="page-actions-group">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActivePage("study-planner")}
          >
            <Icon name="calendar" size={16} />
            Weekly Schedule
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

      {/* 4 Intelligence KPI Cards */}
      <div className="intelligence-kpi-grid">
        {/* Academic Health */}
        <div className="kpi-card" style={{ "--accent-bar": "var(--success)" }}>
          <div className="kpi-top">
            <div>
              <span className="text-xs text-muted uppercase font-bold tracking-wider">Academic Health</span>
              <div className="kpi-score-row">
                <span className="kpi-score-large">{student.academicHealthScore}</span>
                <span className="kpi-score-unit">%</span>
              </div>
            </div>
            <div className="kpi-icon-bubble" style={{ background: "var(--success-light)", color: "var(--success)" }}>
              <Icon name="academic" size={22} />
            </div>
          </div>
          <span className="kpi-trend-pill positive">
            <Icon name="trending-up" size={13} /> +8% vs Sem 4
          </span>
          <p className="kpi-explanation">Consistent 7.8 CGPA across 98 completed credits with 86% attendance.</p>
          <ProgressBar value={student.academicHealthScore} variant="success" size="thin" className="mt-2" />
        </div>

        {/* Skill Readiness */}
        <div className="kpi-card" style={{ "--accent-bar": "var(--primary)" }}>
          <div className="kpi-top">
            <div>
              <span className="text-xs text-muted uppercase font-bold tracking-wider">Skill Readiness</span>
              <div className="kpi-score-row">
                <span className="kpi-score-large">{student.technicalSkillsScore}</span>
                <span className="kpi-score-unit">%</span>
              </div>
            </div>
            <div className="kpi-icon-bubble" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
              <Icon name="skills" size={22} />
            </div>
          </div>
          <span className={`kpi-trend-pill ${isDsaUpdated ? "positive" : "warning"}`}>
            <Icon name="trending-up" size={13} /> {isDsaUpdated ? "+5% after DSA quiz" : "Target: 80%"}
          </span>
          <p className="kpi-explanation">Weighted average across core programming, data structures, and tools.</p>
          <ProgressBar value={student.technicalSkillsScore} variant="primary" size="thin" className="mt-2" />
        </div>

        {/* Placement Readiness */}
        <div className="kpi-card" style={{ "--accent-bar": "var(--secondary)" }}>
          <div className="kpi-top">
            <div>
              <span className="text-xs text-muted uppercase font-bold tracking-wider">Placement Readiness</span>
              <div className="kpi-score-row">
                <span className="kpi-score-large">{student.placementReadinessScore}</span>
                <span className="kpi-score-unit">%</span>
              </div>
            </div>
            <div className="kpi-icon-bubble" style={{ background: "var(--secondary-light)", color: "var(--secondary)" }}>
              <Icon name="briefcase" size={22} />
            </div>
          </div>
          <span className={`kpi-trend-pill ${isDsaUpdated ? "positive" : "warning"}`}>
            <Icon name="arrow-up-right" size={13} /> Required: 85%
          </span>
          <p className="kpi-explanation">Readiness benchmark for {student.targetRole} campus recruitment drives.</p>
          <ProgressBar value={student.placementReadinessScore} variant="auto" size="thin" className="mt-2" />
        </div>

        {/* Learning Consistency */}
        <div className="kpi-card" style={{ "--accent-bar": "var(--warning)" }}>
          <div className="kpi-top">
            <div>
              <span className="text-xs text-muted uppercase font-bold tracking-wider">Learning Consistency</span>
              <div className="kpi-score-row">
                <span className="kpi-score-large">{student.learningConsistencyScore}</span>
                <span className="kpi-score-unit">%</span>
              </div>
            </div>
            <div className="kpi-icon-bubble" style={{ background: "var(--warning-light)", color: "var(--warning)" }}>
              <Icon name="zap" size={22} />
            </div>
          </div>
          <span className="kpi-trend-pill positive">
            <Icon name="sparkles" size={13} /> {student.learningStreakDays} Day Streak 🔥
          </span>
          <p className="kpi-explanation">48 completed tasks with consistent daily execution over 14 active days.</p>
          <ProgressBar value={student.learningConsistencyScore} variant="warning" size="thin" className="mt-2" />
        </div>
      </div>

      {/* Intelligence Pipeline Banner */}
      <div className="intelligence-pipeline-card mt-6">
        <div className="pipeline-header">
          <div className="pipeline-title">
            <span className="pipeline-pulse-dot" />
            Live Student Intelligence Pipeline
          </div>
          <span className="text-xs text-muted font-mono">AUTONOMOUS DIAGNOSTIC ENGINE</span>
        </div>

        <div className="pipeline-flow-container">
          <div className="pipeline-node" onClick={() => setActivePage("academic-audit")}>
            <span className="pipeline-node-icon">📚</span>
            <span className="pipeline-node-name">Student Data</span>
          </div>
          <div className="pipeline-arrow">➔</div>

          <div className="pipeline-node" onClick={() => setActivePage("digital-twin")}>
            <span className="pipeline-node-icon">👤</span>
            <span className="pipeline-node-name">Digital Twin</span>
          </div>
          <div className="pipeline-arrow">➔</div>

          <div className="pipeline-node" onClick={() => setActivePage("competency-map")}>
            <span className="pipeline-node-icon">🗺️</span>
            <span className="pipeline-node-name">Competency Map</span>
          </div>
          <div className="pipeline-arrow">➔</div>

          <div className="pipeline-node active" onClick={() => setActivePage("skill-gap")}>
            <span className="pipeline-node-icon">🎯</span>
            <span className="pipeline-node-name">Skill Gap Detection</span>
          </div>
          <div className="pipeline-arrow">➔</div>

          <div className="pipeline-node" onClick={() => setActivePage("learning-path")}>
            <span className="pipeline-node-icon">💡</span>
            <span className="pipeline-node-name">Priority Rec</span>
          </div>
          <div className="pipeline-arrow">➔</div>

          <div className="pipeline-node" onClick={() => setActivePage("study-planner")}>
            <span className="pipeline-node-icon">📅</span>
            <span className="pipeline-node-name">Learning Plan</span>
          </div>
          <div className="pipeline-arrow">➔</div>

          <div className="pipeline-node" onClick={() => setActivePage("assessments")}>
            <span className="pipeline-node-icon">📝</span>
            <span className="pipeline-node-name">Assessment</span>
          </div>
          <div className="pipeline-arrow">➔</div>

          <div className="pipeline-node" onClick={() => setActivePage("progress")}>
            <span className="pipeline-node-icon">🔄</span>
            <span className="pipeline-node-name">Profile Update</span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Two-Column Grid */}
      <div className="dashboard-grid-main">
        {/* Left Column: Priority Areas + Today's Plan */}
        <div className="dashboard-left-col">
          {/* Priority Areas */}
          <Card
            title="Priority Areas"
            subtitle="Immediate high-impact items generated by AI gap diagnosis"
          >
            <div className="priority-list">
              {recommendations.map((rec) => (
                <RecommendationCard key={rec.id} recommendation={rec} />
              ))}
            </div>
          </Card>

          {/* Today's Adaptive Plan */}
          <Card
            title="Today's Plan"
            subtitle="Scheduled high-yield micro-sessions"
            action={
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setActivePage("study-planner")}
              >
                View 7-Day Plan
              </button>
            }
          >
            <div className="tasks-stack">
              {todaysTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Skill Snapshot + Career Readiness */}
        <div className="dashboard-right-col">
          {/* Career Readiness Box */}
          <div className="career-target-box">
            <span className="target-role-badge">Target Role Benchmark</span>
            <h3 className="target-role-title">{student.targetRole}</h3>

            <div className="target-comparison-bars">
              <div>
                <div className="comparison-row mb-1">
                  <span>Current Readiness</span>
                  <strong className="text-primary">{student.placementReadinessScore}%</strong>
                </div>
                <ProgressBar value={student.placementReadinessScore} variant="primary" size="normal" />
              </div>

              <div>
                <div className="comparison-row mb-1">
                  <span className="text-muted">Target Threshold</span>
                  <strong className="text-success">85%</strong>
                </div>
                <ProgressBar value={85} variant="success" size="thin" />
              </div>
            </div>

            <div className="text-xs text-muted font-semibold mt-3">High Priority Skills to Bridge:</div>
            <div className="missing-skills-tags">
              <span className="missing-tag">{dsaSkill?.name || "DSA"} ({dsaSkill?.current}%)</span>
              <span className="missing-tag">Spring Boot (30%)</span>
              <span className="missing-tag">REST APIs (45%)</span>
              <span className="missing-tag">System Design (25%)</span>
            </div>

            <button
              className="btn btn-primary btn-block btn-sm"
              onClick={() => setActivePage("skill-gap")}
            >
              View Full Gap Analysis
              <Icon name="arrow-right" size={14} />
            </button>
          </div>

          {/* Skill Snapshot Widget */}
          <Card
            title="Skill Snapshot"
            subtitle="Live competency distribution"
            action={
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setActivePage("skills")}
              >
                All Skills
              </button>
            }
          >
            <div className="skill-snapshot-list">
              {skills.slice(0, 6).map((skill) => (
                <div
                  key={skill.id}
                  className="skill-snapshot-item"
                  onClick={() => {
                    setSelectedSkillModal(skill);
                    setActivePage("skills");
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div className="skill-snapshot-top">
                    <span className="skill-snapshot-name">{skill.shortName}</span>
                    <span className="skill-snapshot-scores">
                      <strong>{skill.current}%</strong> / {skill.target}%
                    </span>
                  </div>
                  <ProgressBar value={skill.current} variant="auto" size="thin" />
                  <div className="skill-snapshot-footer">
                    <span style={{ color: skill.current >= 75 ? "var(--success)" : skill.current >= 55 ? "var(--warning)" : "var(--danger)" }}>
                      {skill.status}
                    </span>
                    <span>{skill.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
