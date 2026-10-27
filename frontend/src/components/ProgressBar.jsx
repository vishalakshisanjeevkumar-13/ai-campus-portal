import React from "react";

export const ProgressBar = ({
  value = 0,
  max = 100,
  variant = "primary",
  size = "normal", // 'thin' | 'normal' | 'thick'
  showLabel = false,
  className = ""
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  
  let fillVariant = variant;
  if (variant === "auto") {
    if (percentage >= 75) fillVariant = "success";
    else if (percentage >= 50) fillVariant = "warning";
    else fillVariant = "danger";
  }

  return (
    <div className={`progress-bar-wrapper ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs font-semibold mb-1">
          <span className="text-secondary">Progress</span>
          <span className="text-primary">{percentage}%</span>
        </div>
      )}
      <div className={`progress-bar-track ${size !== "normal" ? size : ""}`}>
        <div
          className={`progress-bar-fill ${fillVariant}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
