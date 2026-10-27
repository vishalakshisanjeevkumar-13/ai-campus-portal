import React from "react";
import { Badge } from "./Badge";
import { ProgressBar } from "./ProgressBar";
import { Icon } from "./Icons";

export const SkillCard = ({ skill, onClick }) => {
  return (
    <div className="skill-card-item" onClick={onClick}>
      <div className="skill-card-top">
        <div>
          <h4 className="skill-card-title">{skill.name}</h4>
          <span className="skill-card-cat">{skill.category}</span>
        </div>
        <Badge variant={skill.priority}>{skill.priority} PRIORITY</Badge>
      </div>

      <div className="skill-stat-grid">
        <div>
          <div className="stat-cell-label">Current</div>
          <div className="stat-cell-value" style={{ color: skill.current >= 75 ? "var(--success)" : skill.current >= 55 ? "var(--warning)" : "var(--danger)" }}>
            {skill.current}%
          </div>
        </div>
        <div>
          <div className="stat-cell-label">Target</div>
          <div className="stat-cell-value">{skill.target}%</div>
        </div>
        <div>
          <div className="stat-cell-label">Gap</div>
          <div className="stat-cell-value text-secondary">
            {skill.gap > 0 ? `${skill.gap}%` : "0%"}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-secondary">Readiness Gauge</span>
          <span className="font-semibold text-primary">{skill.status}</span>
        </div>
        <ProgressBar value={skill.current} variant="auto" size="thin" />
      </div>

      <div className="flex items-center justify-between text-xs text-muted pt-2 border-top">
        <span>{skill.trend}</span>
        <span className="text-primary font-semibold flex items-center gap-1">
          Details <Icon name="arrow-right" size={12} />
        </span>
      </div>
    </div>
  );
};
