import React from "react";
import { useApp } from "../context/AppContext";
import { Icon } from "./Icons";

export const Sidebar = () => {
  const {
    activePage,
    setActivePage,
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileMenuOpen,
    setMobileMenuOpen,
    student,
    skills
  } = useApp();

  const dsaSkill = skills.find(s => s.shortName === "DSA");
  const isDsaHighPriority = dsaSkill?.priority === "HIGH";

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "academic-audit", label: "Academic Audit", icon: "academic" },
    { id: "performance", label: "Performance", icon: "performance" },
    { id: "skills", label: "My Skills", icon: "skills" },
    { id: "skill-gap", label: "Skill Gap", icon: "skill-gap", badge: isDsaHighPriority ? "Gap Alert" : null, badgeVariant: "danger" },
    { id: "competency-map", label: "Competency Map", icon: "competency" },
    { id: "learning-path", label: "Learning Path", icon: "learning-path" },
    { id: "study-planner", label: "Study Planner", icon: "study-planner" },
    { id: "assessments", label: "Assessments", icon: "assessments", badge: "Quiz", badgeVariant: "primary" },
    { id: "documents", label: "Documents", icon: "documents" },
    { id: "resume-analysis", label: "Resume Analysis", icon: "resume" },
    { id: "interview-readiness", label: "Interview Readiness", icon: "interview" },
    { id: "ai-companion", label: "AI Companion", icon: "ai-companion", badge: "AI", badgeVariant: "primary" },
    { id: "progress", label: "Progress", icon: "progress" },
    { id: "digital-twin", label: "Digital Twin", icon: "digital-twin" },
    { id: "profile", label: "Profile", icon: "profile" },
    { id: "settings", label: "Settings", icon: "settings" }
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <div
        className={`sidebar-overlay ${mobileMenuOpen ? "active" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      />
      <aside
        className={`sidebar ${sidebarCollapsed ? "collapsed" : ""} ${mobileMenuOpen ? "mobile-open" : ""}`}
      >
        <div className="sidebar-header">
          {!sidebarCollapsed ? (
            <div className="brand-logo" onClick={() => handleNavClick("dashboard")}>
              <div className="brand-icon-wrapper">
                🧠
              </div>
              <div>
                <div className="brand-title">AI Campus</div>
                <div className="brand-subtitle">Companion</div>
              </div>
            </div>
          ) : (
            <div className="brand-icon-wrapper" onClick={() => handleNavClick("dashboard")}>
              🧠
            </div>
          )}

          <button
            className="sidebar-toggle-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            aria-label="Toggle Sidebar"
          >
            <Icon name={sidebarCollapsed ? "chevron-right" : "chevron-left"} size={18} />
          </button>
        </div>

        <div className="sidebar-nav-section">
          {!sidebarCollapsed && (
            <div className="nav-section-title">Academic & Career AI</div>
          )}

          <ul className="nav-list">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <li key={item.id}>
                  <button
                    className={`nav-item-btn ${isActive ? "active" : ""}`}
                    onClick={() => handleNavClick(item.id)}
                    title={sidebarCollapsed ? item.label : ""}
                  >
                    <span className="nav-item-icon">
                      <Icon name={item.icon} size={18} />
                    </span>
                    {!sidebarCollapsed && (
                      <>
                        <span className="nav-item-text">{item.label}</span>
                        {item.badge && (
                          <span
                            className={`nav-item-badge ${item.badgeVariant === "danger" ? "badge-danger-pill" : "badge-primary-pill"}`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="sidebar-footer">
          {!sidebarCollapsed ? (
            <div className="student-mini-card" onClick={() => handleNavClick("profile")} style={{ cursor: "pointer" }}>
              <img
                src={student.avatar}
                alt={student.name}
                className="student-mini-avatar"
              />
              <div className="student-mini-info">
                <div className="student-mini-name">{student.name}</div>
                <div className="student-mini-role">{student.targetRole}</div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center" onClick={() => handleNavClick("profile")} style={{ cursor: "pointer" }}>
              <img
                src={student.avatar}
                alt={student.name}
                className="student-mini-avatar"
              />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
