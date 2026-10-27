import React from "react";
import { useApp } from "../context/AppContext";
import { Icon } from "./Icons";

export const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let iconName = "info";
        let iconColor = "var(--primary)";

        if (toast.type === "success") {
          iconName = "check-circle";
          iconColor = "var(--success)";
        } else if (toast.type === "warning") {
          iconName = "alert-triangle";
          iconColor = "var(--warning)";
        } else if (toast.type === "danger") {
          iconName = "alert-circle";
          iconColor = "var(--danger)";
        }

        return (
          <div key={toast.id} className={`toast-item ${toast.type}`}>
            <Icon name={iconName} size={20} color={iconColor} />
            <div className="toast-body">
              <div className="toast-title">{toast.title}</div>
              <div className="toast-message">{toast.message}</div>
            </div>
            <button
              className="toast-close-btn"
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss toast"
            >
              <Icon name="close" size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
