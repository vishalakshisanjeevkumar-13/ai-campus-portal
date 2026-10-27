import React from "react";
import { useApp } from "../context/AppContext";
import { Icon } from "../components/Icons";
import { Card } from "../components/Card";
import { RadarChart } from "../components/RadarChart";
import { Badge } from "../components/Badge";
import { ProgressBar } from "../components/ProgressBar";

export const InterviewReadiness = () => {
  const { interviewReadiness, setActivePage } = useApp();

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Interview Readiness Benchmark</h1>
          <p className="page-subtitle">Multidimensional evaluation covering technical whiteboarding, CS fundamentals, system design, and communication.</p>
        </div>

        <div className="page-actions-group">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActivePage("ai-companion")}
          >
            <Icon name="ai-companion" size={16} />
            AI Mock Interview
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setActivePage("assessments")}
          >
            <Icon name="assessments" size={16} />
            Take Diagnostic Drill
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout: Radar Visualization + Dimension Scores */}
      <div className="grid grid-2 gap-6 mb-6">
        {/* Radar Chart Card */}
        <Card
          title="Interview Competency Radar"
          subtitle="8-dimensional capability profile vs target Software Developer standard"
          className="flex flex-col items-center justify-center"
        >
          <div className="text-center mb-2">
            <span className="text-xs text-muted font-bold uppercase">Overall Interview Readiness</span>
            <div className="text-3xl font-extrabold text-primary">
              {interviewReadiness.overallReadiness}%
            </div>
            <div className="text-xs text-secondary">Benchmark Threshold: {interviewReadiness.benchmarkTarget}%</div>
          </div>

          <RadarChart data={interviewReadiness.domains} size={330} />
        </Card>

        {/* 8 Domains Metric Bars */}
        <Card
          title="Domain Mastery Breakdown"
          subtitle="Real-time calibration based on verified assessment scores"
        >
          <div className="flex flex-col gap-3">
            {interviewReadiness.domains.map((dom) => (
              <div key={dom.name} className="p-2.5 bg-alt border rounded">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-primary">{dom.name}</span>
                    <Badge variant={dom.status}>{dom.status}</Badge>
                  </div>
                  <span className="text-sm font-bold" style={{ color: dom.score >= 75 ? "var(--success)" : dom.score >= 60 ? "var(--warning)" : "var(--danger)" }}>
                    {dom.score}%
                  </span>
                </div>
                <ProgressBar value={dom.score} variant="auto" size="thin" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Strong Areas vs Weak Areas vs Recommended Drills */}
      <div className="grid grid-3 gap-6">
        <Card
          title="Demonstrated Strengths"
          subtitle="Validated round-clearing advantages"
        >
          <ul className="flex flex-col gap-2">
            {interviewReadiness.strongAreas.map((sa, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-secondary">
                <Icon name="check-circle" size={14} color="var(--success)" className="mt-0.5 flex-shrink-0" />
                <span>{sa}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card
          title="High-Priority Weaknesses"
          subtitle="Areas likely to fail technical screenings"
        >
          <ul className="flex flex-col gap-2">
            {interviewReadiness.weakAreas.map((wa, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-secondary">
                <Icon name="alert-circle" size={14} color="var(--danger)" className="mt-0.5 flex-shrink-0" />
                <span>{wa}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card
          title="Targeted Interview Drills"
          subtitle="Recommended preparation exercises"
        >
          <ul className="flex flex-col gap-2">
            {interviewReadiness.recommendedDrills.map((drill, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-secondary">
                <Icon name="sparkles" size={14} color="var(--primary)" className="mt-0.5 flex-shrink-0" />
                <span>{drill}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};
