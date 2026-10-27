import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Icon } from "../components/Icons";

export const Register = () => {
  const { setIsAuthenticated, setActivePage, updateStudentProfile, addToast } = useApp();
  const [formData, setFormData] = useState({
    fullName: "Alex Morgan",
    email: "alex.morgan@campus.edu",
    password: "password123",
    confirmPassword: "password123",
    department: "Computer Science & Engineering",
    year: "3rd Year (6th Semester)"
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = "Full name is required";
    if (!formData.email.trim() || !formData.email.includes("@")) errs.email = "Valid campus email is required";
    if (formData.password.length < 6) errs.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      addToast("Validation Error", "Please resolve highlighted form errors.", "danger");
      return;
    }

    updateStudentProfile({
      name: formData.fullName,
      email: formData.email,
      department: formData.department,
      year: formData.year
    });

    setIsAuthenticated(true);
    setActivePage("onboarding");
    addToast("Account Created!", "Let's personalize your Student Intelligence Profile.", "success");
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-brand-side">
        <div className="auth-brand-logo">
          <div className="brand-icon-wrapper">🧠</div>
          <div>
            <div className="brand-title" style={{ fontSize: "1.25rem", color: "#fff" }}>AI Campus Companion</div>
            <div className="brand-subtitle">Student Intelligence Platform</div>
          </div>
        </div>

        <div className="auth-brand-content">
          <h1 className="auth-hero-headline">
            Start your journey with <span>Autonomous Intelligence</span>.
          </h1>
          <p className="auth-hero-quote">
            Join thousands of ambitious students tracking technical readiness, eliminating skill gaps, and securing top software engineering offers.
          </p>

          <div className="auth-feature-pills">
            <div className="feature-pill">
              <Icon name="check-circle" size={16} color="var(--success)" />
              Automated Skill Gap Detection
            </div>
            <div className="feature-pill">
              <Icon name="check-circle" size={16} color="var(--primary)" />
              Real-time Dynamic Career Roadmaps
            </div>
          </div>
        </div>

        <div className="auth-footer-tagline">
          Zero clutter. 100% focused on student outcome and mastery.
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card animate-fade-in" style={{ maxWidth: "480px" }}>
          <div className="auth-header">
            <h2 className="auth-title">Create Account</h2>
            <p className="auth-subtitle">Set up your AI campus profile to begin</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Alex Morgan"
              />
              {errors.fullName && <span className="form-error-msg">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Campus Email</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="alex.morgan@campus.edu"
              />
              {errors.email && <span className="form-error-msg">{errors.email}</span>}
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Department</label>
                <select
                  className="form-input"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                >
                  <option>Computer Science & Engineering</option>
                  <option>Information Technology</option>
                  <option>Data Science & AI</option>
                  <option>Electronics & Communication</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Academic Year</label>
                <select
                  className="form-input"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                >
                  <option>1st Year (1st-2nd Sem)</option>
                  <option>2nd Year (3rd-4th Sem)</option>
                  <option>3rd Year (5th-6th Sem)</option>
                  <option>4th Year (7th-8th Sem)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                />
                {errors.password && <span className="form-error-msg">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && <span className="form-error-msg">{errors.confirmPassword}</span>}
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: "10px" }}>
              Proceed to Personalization
              <Icon name="arrow-right" size={18} />
            </button>
          </form>

          <p className="auth-switch-prompt">
            Already have an account?
            <span
              className="auth-switch-link"
              onClick={() => setActivePage("login")}
            >
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
