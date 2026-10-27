import React from "react";
import { useApp } from "../context/AppContext";
import { Icon } from "../components/Icons";
import { Card } from "../components/Card";
import { SkillCard } from "../components/SkillCard";
import { Modal } from "../components/Modal";
import { ProgressBar } from "../components/ProgressBar";
import { Badge } from "../components/Badge";

export const Skills = () => {
  const {
    skills,
    student,
    selectedSkillModal,
    setSelectedSkillModal,
    setActivePage
  } = useApp();

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title-group">
          <h1>My Skills</h1>
          <p className="page-subtitle">Track individual technical competencies against industry and placement standards.</p>
        </div>

        <div className="page-actions-group">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActivePage("competency-map")}
          >
            <Icon name="competency" size={16} />
            Competency Map
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setActivePage("skill-gap")}
          >
            <Icon name="skill-gap" size={16} />
            Skill Gap Matrix
          </button>
        </div>
      </div>

      {/* Overall Skill Readiness Banner */}
      <div className="card mb-6" style={{ background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.08))", borderColor: "rgba(99, 102, 241, 0.3)" }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Aggregate Readiness Index</span>
            <div className="flex items-baseline gap-3 my-1">
              <h2 className="text-3xl font-extrabold text-primary">{student.technicalSkillsScore}%</h2>
              <span className="text-sm text-secondary">Target Threshold: 80%</span>
            </div>
            <p className="text-sm text-secondary">
              Calculated across 8 core computer science and engineering skill domains.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="p-3 bg-alt border rounded text-center">
              <div className="text-xs text-muted">Skills Tracked</div>
              <div className="text-lg font-bold text-primary">{skills.length} Domains</div>
            </div>
            <div className="p-3 bg-alt border rounded text-center">
              <div className="text-xs text-muted">Immediate Bottleneck</div>
              <div className="text-lg font-bold text-danger">
                {skills.find(s => s.priority === "HIGH")?.shortName || "DSA"}
              </div>
            </div>
          </div>
        </div>
        <ProgressBar value={student.technicalSkillsScore} variant="primary" size="thin" className="mt-4" />
      </div>

      {/* Skills Grid */}
      <div className="skills-grid">
        {skills.map((skill) => (
          <SkillCard
            key={skill.id}
            skill={skill}
            onClick={() => setSelectedSkillModal(skill)}
          />
        ))}
      </div>

      {/* Skill Detail Modal */}
      {selectedSkillModal && (
        <Modal
          isOpen={!!selectedSkillModal}
          onClose={() => setSelectedSkillModal(null)}
          title={`${selectedSkillModal.name} (${selectedSkillModal.shortName})`}
          footer={
            <>
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedSkillModal(null)}
              >
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setSelectedSkillModal(null);
                  setActivePage("assessments");
                }}
              >
                Take Diagnostic Drill
                <Icon name="arrow-right" size={16} />
              </button>
            </>
          }
        >
          <div className="skill-detail-grid">
            <div className="evidence-metric-box">
              <span className="text-xs text-muted font-bold uppercase">Current Competency</span>
              <div className="text-2xl font-bold text-primary">{selectedSkillModal.current}%</div>
              <ProgressBar value={selectedSkillModal.current} variant="auto" size="thin" />
            </div>

            <div className="evidence-metric-box">
              <span className="text-xs text-muted font-bold uppercase">Placement Target</span>
              <div className="text-2xl font-bold text-success">{selectedSkillModal.target}%</div>
              <div className="text-xs text-muted">Gap: {selectedSkillModal.gap > 0 ? `${selectedSkillModal.gap}%` : "None"}</div>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-bold text-primary mb-2">Detailed Topic Mastery Breakdown</h4>
            <div className="flex flex-col gap-2">
              {selectedSkillModal.topics?.map((topic, i) => (
                <div key={i} className="p-2 bg-alt border rounded flex items-center justify-between">
                  <span className="text-sm font-semibold">{topic.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted">{topic.mastery}%</span>
                    <Badge variant={topic.status}>{topic.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-bold text-primary mb-1">Prerequisite Dependencies</h4>
            <div className="dependency-chain">
              {selectedSkillModal.dependencies?.map((dep, idx) => (
                <React.Fragment key={dep}>
                  <span className="dependency-node">{dep}</span>
                  {idx < selectedSkillModal.dependencies.length - 1 && (
                    <span className="dependency-arrow">➔</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="p-3 bg-alt border rounded">
            <div className="text-xs text-primary font-bold uppercase mb-1">AI Recommendation</div>
            <p className="text-sm text-secondary">{selectedSkillModal.recommendation}</p>
          </div>
        </Modal>
      )}
    </div>
  );
};
