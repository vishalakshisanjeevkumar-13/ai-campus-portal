import React from "react";
import { useApp } from "../context/AppContext";
import { Icon } from "../components/Icons";
import { Card } from "../components/Card";
import { ProgressBar } from "../components/ProgressBar";
import { Badge } from "../components/Badge";

export const DigitalTwin = () => {
  const { student, setActivePage } = useApp();

  const satelliteNodes = [
    { id: "academic", label: "Academic Health", score: student.academicHealthScore, unit: "%", icon: "academic", color: "var(--success)", targetRoute: "academic-audit", top: "10%", left: "15%" },
    { id: "technical", label: "Technical Skills", score: student.technicalSkillsScore, unit: "%", icon: "skills", color: "var(--primary)", targetRoute: "skills", top: "10%", right: "15%" },
    { id: "career", label: "Career Readiness", score: student.placementReadinessScore, unit: "%", icon: "briefcase", color: "var(--secondary)", targetRoute: "skill-gap", top: "45%", right: "4%" },
    { id: "projects", label: "Projects Impact", score: student.projectsScore, unit: "%", icon: "layers", color: "var(--info)", targetRoute: "profile", bottom: "10%", right: "15%" },
    { id: "certifications", label: "Certifications", score: student.certificationsScore, unit: "%", icon: "award", color: "var(--warning)", targetRoute: "documents", bottom: "10%", left: "15%" },
    { id: "consistency", label: "Learning Consistency", score: student.learningConsistencyScore, unit: "%", icon: "zap", color: "var(--warning)", targetRoute: "progress", top: "45%", left: "4%" },
    { id: "confidence", label: "Assessment Confidence", score: student.assessmentConfidenceScore, unit: "%", icon: "assessments", color: "var(--primary)", targetRoute: "assessments", bottom: "3%", left: "42%" }
  ];

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Student Digital Twin</h1>
          <p className="page-subtitle">A dynamic, multidimensional AI model reflecting your real-time academic and technical readiness.</p>
        </div>

        <div className="page-actions-group">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActivePage("ai-companion")}
          >
            <Icon name="ai-companion" size={16} />
            Ask AI Companion
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setActivePage("assessments")}
          >
            <Icon name="assessments" size={16} />
            Calibrate with Assessment
          </button>
        </div>
      </div>

      {/* Main Digital Twin Nexus Canvas */}
      <div className="digital-twin-wrapper mb-6">
        <div className="twin-orbit-ring" />

        {/* Center Student Avatar Nexus */}
        <div className="twin-center-avatar-box">
          <img
            src={student.avatar}
            alt={student.name}
            className="twin-center-avatar-img"
          />
        </div>

        {/* 7 Orbiting Satellites */}
        {satelliteNodes.map((node) => (
          <div
            key={node.id}
            className="twin-node-satellite animate-fade-in"
            style={{
              top: node.top,
              bottom: node.bottom,
              left: node.left,
              right: node.right
            }}
            onClick={() => setActivePage(node.targetRoute)}
          >
            <div className="kpi-icon-bubble" style={{ background: "rgba(255,255,255,0.08)", color: node.color, width: "36px", height: "36px" }}>
              <Icon name={node.icon} size={18} />
            </div>
            <div>
              <div className="satellite-score" style={{ color: node.color }}>
                {node.score}{node.unit}
              </div>
              <div className="satellite-label">{node.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Intelligence Pipeline Architecture Section */}
      <Card
        title="Student Intelligence Computation Pipeline"
        subtitle="How your Digital Twin continually recalibrates based on verified signals"
      >
        <div className="grid grid-4 gap-4">
          <div className="p-3 bg-alt border rounded">
            <Badge variant="primary" className="mb-2">Phase 1</Badge>
            <h4 className="text-sm font-bold text-primary mb-1">Data Ingestion</h4>
            <p className="text-xs text-secondary">
              Parses marksheet transcripts, course attendance, and project documents.
            </p>
          </div>

          <div className="p-3 bg-alt border rounded">
            <Badge variant="warning" className="mb-2">Phase 2</Badge>
            <h4 className="text-sm font-bold text-warning mb-1">Competency Mapping</h4>
            <p className="text-xs text-secondary">
              Cross-references syllabus mastery with target Software Developer benchmarks.
            </p>
          </div>

          <div className="p-3 bg-alt border rounded">
            <Badge variant="danger" className="mb-2">Phase 3</Badge>
            <h4 className="text-sm font-bold text-danger mb-1">Gap Diagnosis</h4>
            <p className="text-xs text-secondary">
              Isolates foundational bottlenecks (e.g. DSA, Spring Boot) and schedules drills.
            </p>
          </div>

          <div className="p-3 bg-alt border rounded">
            <Badge variant="success" className="mb-2">Phase 4</Badge>
            <h4 className="text-sm font-bold text-success mb-1">Adaptive Execution</h4>
            <p className="text-xs text-secondary">
              Rebalances daily study tasks and recalibrates Digital Twin upon quiz completion.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
