import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Icon } from "../components/Icons";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";

export const Settings = () => {
  const { theme, toggleTheme, addToast, setIsAuthenticated, setActivePage } = useApp();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [skillGapAlerts, setSkillGapAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [preferredPace, setPreferredPace] = useState("Balanced");

  const handleSaveSettings = () => {
    addToast("Preferences Saved", "Your application settings have been stored.", "success");
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Platform Settings</h1>
          <p className="page-subtitle">Configure theme appearance, notification frequency, and adaptive learning preferences.</p>
        </div>
      </div>

      <div className="grid grid-2 gap-6 mb-6">
        {/* Appearance Settings */}
        <Card
          title="Theme & Visual Appearance"
          subtitle="Customize interface theme and contrast preferences"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-3 bg-alt border rounded">
              <div>
                <strong className="text-sm text-primary">Interface Theme</strong>
                <p className="text-xs text-muted">Toggle between Dark Navy and Light Slate mode</p>
              </div>

              <button
                className="btn btn-secondary btn-sm flex items-center gap-2"
                onClick={toggleTheme}
              >
                <Icon name={theme === "dark" ? "moon" : "sun"} size={16} />
                {theme === "dark" ? "Dark Mode (Active)" : "Light Mode (Active)"}
              </button>
            </div>

            <div className="p-3 bg-alt border rounded">
              <span className="text-xs text-muted uppercase font-bold">Palette Profile</span>
              <div className="text-sm font-semibold text-primary mt-1">
                Deep Navy • Indigo • Violet • Emerald Green
              </div>
            </div>
          </div>
        </Card>

        {/* Notification Preferences */}
        <Card
          title="Notification Triggers"
          subtitle="Manage autonomous AI alerts and daily schedule nudges"
        >
          <div className="flex flex-col gap-3">
            <label className="flex items-center justify-between p-3 bg-alt border rounded cursor-pointer">
              <div>
                <span className="text-sm font-bold text-primary">Skill Gap Critical Alerts</span>
                <p className="text-xs text-muted">Notify when a skill drops below placement threshold</p>
              </div>
              <input
                type="checkbox"
                checked={skillGapAlerts}
                onChange={(e) => setSkillGapAlerts(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-alt border rounded cursor-pointer">
              <div>
                <span className="text-sm font-bold text-primary">Daily Adaptive Study Reminders</span>
                <p className="text-xs text-muted">Receive morning briefing for scheduled focus tasks</p>
              </div>
              <input
                type="checkbox"
                checked={dailyReminders}
                onChange={(e) => setDailyReminders(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-alt border rounded cursor-pointer">
              <div>
                <span className="text-sm font-bold text-primary">Weekly AI Digest</span>
                <p className="text-xs text-muted">Receive summary of skill acceleration & streak</p>
              </div>
              <input
                type="checkbox"
                checked={weeklyDigest}
                onChange={(e) => setWeeklyDigest(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
            </label>
          </div>
        </Card>
      </div>

      {/* Learning Preferences & Account Actions */}
      <div className="grid grid-2 gap-6">
        <Card
          title="Adaptive Learning Preferences"
          subtitle="Tune how the recommendation engine schedules study sessions"
        >
          <div className="form-group mb-4">
            <label className="form-label">Learning Pace Strategy</label>
            <select
              className="form-input"
              value={preferredPace}
              onChange={(e) => setPreferredPace(e.target.value)}
            >
              <option value="Accelerated">Accelerated Placement Sprint (25+ hrs/week)</option>
              <option value="Balanced">Balanced Coursework + Skills (15-20 hrs/week)</option>
              <option value="Foundations">Fundamentals First (10-14 hrs/week)</option>
            </select>
          </div>

          <button className="btn btn-primary" onClick={handleSaveSettings}>
            <Icon name="check" size={16} /> Save Learning Preferences
          </button>
        </Card>

        <Card
          title="Account Security & Session"
          subtitle="Manage active session or reset profile model"
        >
          <div className="flex flex-col gap-3">
            <div className="p-3 bg-alt border rounded flex items-center justify-between">
              <div>
                <strong className="text-sm text-primary">Active Session ID</strong>
                <p className="text-xs text-muted font-mono">STD-2024-8842 (Encrypted)</p>
              </div>
              <Badge variant="success">SECURE</Badge>
            </div>

            <button
              className="btn btn-danger btn-block"
              onClick={() => {
                setIsAuthenticated(false);
                setActivePage("login");
                addToast("Logged Out", "You have been safely signed out.", "info");
              }}
            >
              <Icon name="logout" size={16} /> Sign Out of Platform
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
