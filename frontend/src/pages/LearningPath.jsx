import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Icon } from "../components/Icons";
import { Card } from "../components/Card";
import { ProgressBar } from "../components/ProgressBar";
import { Badge } from "../components/Badge";

export const LearningPath = () => {
  const { roadmapPhases, student, setActivePage } = useApp();
  const [expandedPhases, setExpandedPhases] = useState(["phase-2"]); // Phase 2 open by default

  const togglePhase = (id) => {
    setExpandedPhases(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Curated Learning Path</h1>
          <p className="page-subtitle">Multi-phase milestone roadmap engineered for the {student.targetRole} role benchmark.</p>
        </div>

        <div className="page-actions-group">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActivePage("study-planner")}
          >
            <Icon name="calendar" size={16} />
            Weekly Study Planner
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

      {/* Roadmap Summary Card */}
      <div className="card mb-6" style={{ background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.08))", borderColor: "rgba(99, 102, 241, 0.3)" }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <Badge variant="primary" className="mb-2">Roadmap Target: {student.targetRole}</Badge>
            <h2 className="text-xl font-bold">5-Phase Placement Acceleration Path</h2>
            <p className="text-sm text-secondary">
              Master fundamentals, conquer DSA patterns, build enterprise microservices, and simulate technical interviews.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="p-3 bg-alt border rounded text-center">
              <div className="text-xs text-muted">Overall Progress</div>
              <div className="text-lg font-bold text-primary">58% Completed</div>
            </div>
            <div className="p-3 bg-alt border rounded text-center">
              <div className="text-xs text-muted">Total Hours</div>
              <div className="text-lg font-bold text-success">~120 Hours</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Expandable Phases Stack */}
      <div className="flex flex-col gap-4">
        {roadmapPhases.map((phase) => {
          const isExpanded = expandedPhases.includes(phase.id);
          return (
            <Card key={phase.id} className="p-0 overflow-hidden">
              <div
                className="p-4 flex items-center justify-between cursor-pointer"
                style={{ background: isExpanded ? "var(--surface-hover)" : "var(--surface)" }}
                onClick={() => togglePhase(phase.id)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{
                      background: phase.progress === 100 ? "var(--success)" : "var(--primary-light)",
                      color: phase.progress === 100 ? "#fff" : "var(--primary)",
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%"
                    }}
                  >
                    {phase.progress === 100 ? <Icon name="check" size={16} /> : phase.name.split(":")[0].replace("Phase ", "#")}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-primary">{phase.name}</h3>
                      <Badge variant={phase.badgeColor}>{phase.status}</Badge>
                    </div>
                    <div className="text-xs text-muted">
                      Est. Duration: {phase.duration} • {phase.completedTasks} / {phase.tasksCount} Micro-Tasks Complete
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-32 hidden sm:block">
                    <ProgressBar value={phase.progress} variant="auto" size="thin" />
                    <div className="text-xs text-right text-muted mt-1 font-semibold">{phase.progress}%</div>
                  </div>
                  <Icon name={isExpanded ? "close" : "chevron-down"} size={18} color="var(--text-muted)" />
                </div>
              </div>

              {isExpanded && (
                <div className="p-4 border-top animate-fade-in" style={{ borderTop: "1px solid var(--surface-border)", background: "var(--background-alt)" }}>
                  <p className="text-sm text-secondary mb-4">{phase.description}</p>

                  <div className="mb-4">
                    <span className="text-xs text-muted uppercase font-bold">Skills In This Phase</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {phase.skills.map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-surface border rounded text-xs font-semibold text-primary">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted">
                      Status: <strong className="text-primary">{phase.status}</strong>
                    </span>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setActivePage("assessments")}
                    >
                      {phase.progress === 100 ? "Review Milestone" : "Start Next Phase Task"}
                      <Icon name="arrow-right" size={14} />
                    </button>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
