import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Icon } from "../components/Icons";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { ProgressBar } from "../components/ProgressBar";
import { Modal } from "../components/Modal";

export const SkillGap = () => {
  const { skills, student, setActivePage } = useApp();
  const [selectedSkill, setSelectedSkill] = useState(null);

  const targetRequired = 85;
  const currentReadiness = student.placementReadinessScore || 74;
  const overallGap = Math.max(0, targetRequired - currentReadiness);

  const dsaSkill = skills.find(s => s.shortName === "DSA");

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Skill Gap Analysis</h1>
          <p className="page-subtitle">Differential analysis between current competencies and target role requirements.</p>
        </div>

        <div className="page-actions-group">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActivePage("competency-map")}
          >
            <Icon name="competency" size={16} />
            Visual Competency Map
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setActivePage("learning-path")}
          >
            <Icon name="learning-path" size={16} />
            Start Learning Path
          </button>
        </div>
      </div>

      {/* Target Role Readiness Header Banner */}
      <div className="card mb-6" style={{ background: "linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.9))", borderColor: "var(--surface-border)" }}>
        <div className="grid grid-4 gap-4">
          <div className="p-3 bg-alt border rounded">
            <span className="text-xs text-muted font-bold uppercase">Target Job Role</span>
            <div className="text-lg font-bold text-primary">{student.targetRole}</div>
            <div className="text-xs text-muted mt-1">Tier-1 Product Placement</div>
          </div>

          <div className="p-3 bg-alt border rounded">
            <span className="text-xs text-muted font-bold uppercase">Current Readiness</span>
            <div className="text-2xl font-bold text-primary">{currentReadiness}%</div>
            <ProgressBar value={currentReadiness} variant="primary" size="thin" className="mt-1" />
          </div>

          <div className="p-3 bg-alt border rounded">
            <span className="text-xs text-muted font-bold uppercase">Required Threshold</span>
            <div className="text-2xl font-bold text-success">{targetRequired}%</div>
            <ProgressBar value={targetRequired} variant="success" size="thin" className="mt-1" />
          </div>

          <div className="p-3 bg-alt border rounded">
            <span className="text-xs text-muted font-bold uppercase">Total Skill Gap</span>
            <div className="text-2xl font-bold text-danger">{overallGap}%</div>
            <div className="text-xs text-secondary mt-1">
              {overallGap <= 10 ? "Close to threshold!" : "Immediate focus required"}
            </div>
          </div>
        </div>
      </div>

      {/* Main Skill Gap Matrix Table */}
      <Card
        title="Software Developer Competency Gap Matrix"
        subtitle="Click any row to inspect underlying evidence, prerequisite dependencies, and actionable next steps"
      >
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Skill Domain</th>
                <th>Current Level</th>
                <th>Required Level</th>
                <th>Skill Gap</th>
                <th>Priority Level</th>
                <th>Diagnostic Evidence</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill) => (
                <tr
                  key={skill.id}
                  className="clickable-row"
                  onClick={() => setSelectedSkill(skill)}
                >
                  <td>
                    <strong className="text-primary">{skill.name}</strong>
                    <div className="text-xs text-muted">{skill.category}</div>
                  </td>
                  <td>
                    <strong style={{ color: skill.current >= 75 ? "var(--success)" : skill.current >= 55 ? "var(--warning)" : "var(--danger)" }}>
                      {skill.current}%
                    </strong>
                  </td>
                  <td>{skill.target}%</td>
                  <td>
                    <span className="font-semibold text-secondary">
                      {skill.gap > 0 ? `${skill.gap}%` : "None"}
                    </span>
                  </td>
                  <td>
                    <Badge variant={skill.priority}>{skill.priority}</Badge>
                  </td>
                  <td>
                    <span className="text-xs text-muted">
                      Score: {skill.assessmentScore}% • Consistency: {skill.practiceConsistency}%
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSkill(skill);
                      }}
                    >
                      Inspect
                      <Icon name="arrow-right" size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Skill Detail Deep-Dive Modal */}
      {selectedSkill && (
        <Modal
          isOpen={!!selectedSkill}
          onClose={() => setSelectedSkill(null)}
          title={`Skill Deep-Dive: ${selectedSkill.name}`}
          footer={
            <>
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedSkill(null)}
              >
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setSelectedSkill(null);
                  setActivePage("learning-path");
                }}
              >
                Start Learning Path
                <Icon name="arrow-right" size={16} />
              </button>
            </>
          }
        >
          <div className="grid grid-3 gap-3 mb-4">
            <div className="evidence-metric-box">
              <span className="text-xs text-muted uppercase font-bold">Current Score</span>
              <span className="text-2xl font-bold text-primary">{selectedSkill.current}%</span>
              <ProgressBar value={selectedSkill.current} variant="auto" size="thin" />
            </div>

            <div className="evidence-metric-box">
              <span className="text-xs text-muted uppercase font-bold">Required Score</span>
              <span className="text-2xl font-bold text-success">{selectedSkill.target}%</span>
              <div className="text-xs text-muted">Industry Benchmark</div>
            </div>

            <div className="evidence-metric-box">
              <span className="text-xs text-muted uppercase font-bold">Calculated Gap</span>
              <span className="text-2xl font-bold text-danger">
                {selectedSkill.gap > 0 ? `${selectedSkill.gap}%` : "0%"}
              </span>
              <Badge variant={selectedSkill.priority}>{selectedSkill.priority} PRIORITY</Badge>
            </div>
          </div>

          <div className="p-3 bg-alt border rounded mb-4">
            <h4 className="text-xs font-bold text-muted uppercase mb-2">Diagnostic Evidence</h4>
            <div className="grid grid-3 gap-2 text-xs">
              <div>Assessment Score: <strong>{selectedSkill.assessmentScore}%</strong></div>
              <div>Problem Solving: <strong>{selectedSkill.problemSolving}%</strong></div>
              <div>Practice Consistency: <strong>{selectedSkill.practiceConsistency}%</strong></div>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-xs font-bold text-muted uppercase mb-1">Impact on Target Role</h4>
            <p className="text-sm font-semibold text-primary">{selectedSkill.impact}</p>
          </div>

          <div className="mb-4">
            <h4 className="text-xs font-bold text-muted uppercase mb-2">Prerequisite Dependencies</h4>
            <div className="dependency-chain">
              {selectedSkill.dependencies?.map((dep, idx) => (
                <React.Fragment key={dep}>
                  <span className="dependency-node">{dep}</span>
                  {idx < selectedSkill.dependencies.length - 1 && (
                    <span className="dependency-arrow">➔</span>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="text-xs text-secondary mt-1">
              Next recommended topic: <strong className="text-primary">{selectedSkill.nextTopic}</strong>
            </div>
          </div>

          <div className="p-3 bg-alt border rounded" style={{ borderLeft: "4px solid var(--primary)" }}>
            <div className="text-xs text-primary font-bold uppercase mb-1">AI Recommendation</div>
            <p className="text-sm text-secondary">{selectedSkill.recommendation}</p>
          </div>
        </Modal>
      )}
    </div>
  );
};
