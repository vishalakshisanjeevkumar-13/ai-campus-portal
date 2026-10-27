import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Icon } from "./Icons";

export const Navbar = () => {
  const {
    theme,
    toggleTheme,
    student,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    searchQuery,
    setSearchQuery,
    setMobileMenuOpen,
    setActivePage,
    setIsAuthenticated
  } = useApp();

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="mobile-menu-trigger"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open mobile menu"
        >
          <Icon name="menu" size={22} />
        </button>

        <div className="search-box-wrapper">
          <span className="search-icon-pos">
            <Icon name="search" size={16} />
          </span>
          <input
            type="text"
            className="navbar-search-input"
            placeholder="Search skills, assessments, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="navbar-right">
        {/* Theme Toggle */}
        <button
          className="nav-icon-action-btn"
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle theme"
        >
          <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
        </button>

        {/* Notifications Button */}
        <div style={{ position: "relative" }}>
          <button
            className="nav-icon-action-btn"
            onClick={() => {
              setNotifDropdownOpen(!notifDropdownOpen);
              setProfileDropdownOpen(false);
            }}
            title="Notifications"
            aria-label="Notifications"
          >
            <Icon name="bell" size={18} />
            {unreadCount > 0 && <span className="notif-unread-dot" />}
          </button>

          {/* Notifications Dropdown Panel */}
          {notifDropdownOpen && (
            <div className="dropdown-panel">
              <div className="dropdown-header">
                <span className="dropdown-title">
                  Notifications ({unreadCount} unread)
                </span>
                {unreadCount > 0 && (
                  <button
                    className="mark-all-read-btn"
                    onClick={markAllNotificationsRead}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="notif-list-container">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted text-sm">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`notif-item ${!n.read ? "unread" : ""}`}
                      onClick={() => markNotificationRead(n.id)}
                    >
                      <div className="notif-icon-bubble">
                        <Icon
                          name={n.type === "alert" ? "alert-circle" : n.type === "success" ? "check-circle" : "info"}
                          size={16}
                          color={n.type === "alert" ? "var(--danger)" : n.type === "success" ? "var(--success)" : "var(--primary)"}
                        />
                      </div>
                      <div className="notif-item-content">
                        <div className="notif-item-title">{n.title}</div>
                        <div className="notif-item-desc">{n.message}</div>
                        <div className="notif-item-time">{n.time}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Dropdown */}
        <div style={{ position: "relative" }}>
          <button
            className="profile-pill-btn"
            onClick={() => {
              setProfileDropdownOpen(!profileDropdownOpen);
              setNotifDropdownOpen(false);
            }}
            aria-label="User profile options"
          >
            <img
              src={student.avatar}
              alt={student.name}
              className="navbar-user-avatar"
            />
            <span className="navbar-user-name">{student.name.split(" ")[0]}</span>
            <Icon name="chevron-down" size={14} />
          </button>

          {profileDropdownOpen && (
            <div className="dropdown-panel" style={{ width: "220px" }}>
              <div className="p-3 border-bottom" style={{ borderBottom: "1px solid var(--surface-border)" }}>
                <div className="font-semibold text-sm">{student.name}</div>
                <div className="text-xs text-muted">{student.email}</div>
              </div>
              <div className="flex flex-col p-1">
                <button
                  className="nav-item-btn text-sm"
                  onClick={() => {
                    setActivePage("profile");
                    setProfileDropdownOpen(false);
                  }}
                >
                  <Icon name="profile" size={16} />
                  My Profile
                </button>
                <button
                  className="nav-item-btn text-sm"
                  onClick={() => {
                    setActivePage("settings");
                    setProfileDropdownOpen(false);
                  }}
                >
                  <Icon name="settings" size={16} />
                  Settings
                </button>
                <button
                  className="nav-item-btn text-sm text-danger"
                  onClick={() => {
                    setIsAuthenticated(false);
                    setActivePage("login");
                    setProfileDropdownOpen(false);
                  }}
                >
                  <Icon name="logout" size={16} />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
