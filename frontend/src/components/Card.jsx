import React from "react";

export const Card = ({
  children,
  title,
  subtitle,
  action,
  interactive = false,
  className = "",
  onClick
}) => {
  return (
    <div
      className={`card ${interactive ? "card-interactive" : ""} ${className}`}
      onClick={onClick}
    >
      {(title || subtitle || action) && (
        <div className="card-header">
          <div className="card-title-group">
            <div>
              {title && <h3 className="card-title">{title}</h3>}
              {subtitle && <p className="card-subtitle">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="card-action">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
