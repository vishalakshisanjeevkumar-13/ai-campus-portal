import React from "react";

export const Badge = ({ variant = "primary", children, className = "" }) => {
  let badgeClass = "badge badge-primary";
  
  if (variant === "success" || variant === "STRONG" || variant === "Mastered" || variant === "Passed") {
    badgeClass = "badge badge-success";
  } else if (variant === "warning" || variant === "MEDIUM" || variant === "Moderate" || variant === "Review Needed") {
    badgeClass = "badge badge-warning";
  } else if (variant === "danger" || variant === "HIGH" || variant === "Weak" || variant === "Needs Improvement") {
    badgeClass = "badge badge-danger";
  } else if (variant === "secondary" || variant === "Missing" || variant === "Upcoming") {
    badgeClass = "badge badge-neutral";
  }

  return (
    <span className={`${badgeClass} ${className}`}>
      {children}
    </span>
  );
};
