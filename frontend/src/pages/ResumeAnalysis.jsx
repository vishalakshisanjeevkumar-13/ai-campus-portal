import React from "react";
import { useApp } from "../context/AppContext";
import { Icon } from "../components/Icons";
import { Card } from "../components/Card";
import { ProgressBar } from "../components/ProgressBar";
import { Badge } from "../components/Badge";

export const ResumeAnalysis = () => {
  const { resumeAnalysis, student, setActivePage } = useApp();

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Resume Intelligence & ATS Analysis</h1>
          <p className="page-subtitle">AI parsing of your CV against {resumeAnalysis.targetRole} screening algorithms.</p>
        </div>

        <div className="page-actions-group">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActivePage("documents")}
          >
            <Icon name="upload" size={16} />
            Upload New Resume
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setActivePage("interview-readiness")}
          >
            <Icon name="interview" size={16} />
            Interview Readiness
          </button>
        </div>
      </div>

      {/* Match Score Hero Card */}
      <div className="card mb-6" style={{ background: "linear-gradient(135deg, rgba(99, 102, 241, 0.18), rgba(139, 92, 246, 0.1))", borderColor: "rgba(99, 102, 241, 0.3)" }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6">
            <div className="academic-score-circle" style={{ borderColor: "var(--primary)" }}>
              <span className="academic-score-num text-primary">{resumeAnalysis.matchScore}%</span>
              <span className="academic-score-sub">ATS MATCH</span>
            </div>

            <div>
              <Badge variant="warning" className="mb-2">{resumeAnalysis.atsStatus}</Badge>
              <h2 className="text-xl font-bold">Target Role: {resumeAnalysis.targetRole}</h2>
              <p className="text-sm text-secondary max-w-xl">
                {resumeAnalysis.summary}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 text-right">
            <span className="text-xs text-muted font-bold uppercase">ATS Benchmark</span>
            <strong className="text-success text-lg">&gt; 85% for Tier-1 Shortlists</strong>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setActivePage("learning-path")}
            >
              Bridge Missing Skills
            </button>
          </div>
        </div>
      </div>

      {/* Two Columns: Matched Skills vs Missing Skills */}
      <div className="grid grid-2 gap-6 mb-6">
        {/* Matched Skills */}
        <Card
          title="Matched Skills & Competencies"
          subtitle="Keywords and technical competencies successfully parsed by ATS"
        >
          <div className="flex flex-col gap-3">
            {resumeAnalysis.matchedSkills.map((s, idx) => (
              <div key={idx} className="p-3 bg-alt border rounded flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="check-circle" size={16} color="var(--success)" />
                  <span className="font-bold text-sm text-primary">{s.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted">{s.category}</span>
                  <Badge variant="success">MATCHED ({s.score}%)</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Missing Skills */}
        <Card
          title="Missing Skills & Placement Gaps"
          subtitle="Required keywords absent or under-represented in your current resume"
        >
          <div className="flex flex-col gap-3">
            {resumeAnalysis.missingSkills.map((ms, idx) => (
              <div key={idx} className="p-3 bg-alt border rounded flex flex-col gap-1" style={{ borderLeft: "3px solid var(--danger)" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="alert-triangle" size={16} color="var(--danger)" />
                    <span className="font-bold text-sm text-danger">{ms.name}</span>
                  </div>
                  <Badge variant="danger">{ms.impact} Impact</Badge>
                </div>
                <p className="text-xs text-secondary mt-1">{ms.advice}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Strengths & ATS Optimization Recommendations */}
      <div className="grid grid-2 gap-6">
        <Card
          title="Identified Profile Strengths"
          subtitle="Key differentiators that stand out to tech recruiters"
        >
          <ul className="flex flex-col gap-2">
            {resumeAnalysis.strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-secondary">
                <Icon name="check" size={16} color="var(--success)" className="mt-0.5 flex-shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card
          title="Actionable Resume Recommendations"
          subtitle="Direct high-impact edits to boost match percentage"
        >
          <ul className="flex flex-col gap-2">
            {resumeAnalysis.actionableFixes.map((fix, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-secondary">
                <Icon name="sparkles" size={16} color="var(--primary)" className="mt-0.5 flex-shrink-0" />
                <span>{fix}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};
