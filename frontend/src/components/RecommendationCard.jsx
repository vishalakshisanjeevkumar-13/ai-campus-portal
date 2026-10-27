import React from "react";
import { Badge } from "./Badge";
import { Icon } from "./Icons";
import { useApp } from "../context/AppContext";

export const RecommendationCard = ({ recommendation }) => {
  const { setActivePage } = useApp();

  let priorityClass = "priority-low";
  if (recommendation.priority === "HIGH") priorityClass = "priority-high";
  if (recommendation.priority === "MEDIUM") priorityClass = "priority-medium";

  return (
    <div className={`priority-rec-card ${priorityClass}`}>
      <div className="priority-rec-main">
        <div className="priority-rec-header">
          <Badge variant={recommendation.priority}>{recommendation.priority} PRIORITY</Badge>
          <span className="text-xs text-muted font-medium">{recommendation.category}</span>
        </div>
        <h4 className="priority-rec-title">{recommendation.title}</h4>
        <p className="priority-rec-desc">{recommendation.description}</p>
      </div>

      <button
        className="btn btn-secondary btn-sm"
        onClick={() => {
          if (recommendation.targetRoute) {
            setActivePage(recommendation.targetRoute);
          }
        }}
      >
        {recommendation.actionText}
        <Icon name="arrow-right" size={14} />
      </button>
    </div>
  );
};
