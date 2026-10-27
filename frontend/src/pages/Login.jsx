import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Icon } from "../components/Icons";

export const Login = () => {
  const { setIsAuthenticated, setActivePage, addToast } = useApp();
  const [email, setEmail] = useState("alex.morgan@campus.edu");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast("Missing Fields", "Please enter both email and password.", "danger");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setIsAuthenticated(true);
      setActivePage("dashboard");
      addToast("Welcome back!", "Successfully logged in as Alex Morgan.", "success");
      setLoading(false);
    }, 600);
  };

  const handleGoogleLogin = () => {
    setIsAuthenticated(true);
    setActivePage("dashboard");
    addToast("Google Sign-In", "Authenticated via Campus Google SSO.", "success");
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
            Understand your skills. <span>Discover your gaps.</span> Build your future.
          </h1>
          <p className="auth-hero-quote">
            Adaptive AI modeling that transforms academic coursework, technical skills, and assessment diagnostic data into a personalized career readiness engine.
          </p>

          <div className="auth-feature-pills">
            <div className="feature-pill">
              <Icon name="target" size={16} color="var(--primary)" />
              Skill Gap Diagnosis
            </div>
            <div className="feature-pill">
              <Icon name="competency" size={16} color="var(--secondary)" />
              Competency Mapping
            </div>
            <div className="feature-pill">
              <Icon name="calendar" size={16} color="var(--success)" />
              Adaptive Study Planner
            </div>
            <div className="feature-pill">
              <Icon name="digital-twin" size={16} color="var(--info)" />
              Student Digital Twin
            </div>
          </div>
        </div>

        <div className="auth-footer-tagline">
          Empowering 50,000+ engineering students with personalized career intelligence.
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card animate-fade-in">
          <div className="auth-header">
            <h2 className="auth-title">Welcome back</h2>
            <p className="auth-subtitle">Enter your student credentials to access your intelligence dashboard</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Campus Email</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.morgan@campus.edu"
                required
              />
            </div>

            <div className="form-group">
              <div className="flex items-center justify-between">
                <label className="form-label">Password</label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    addToast("Password Reset", "A mock reset link was sent to your email.", "info");
                  }}
                  className="text-xs text-primary font-semibold"
                >
                  Forgot Password?
                </a>
              </div>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Sign In to Dashboard"}
              <Icon name="arrow-right" size={18} />
            </button>
          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <button
            type="button"
            className="social-auth-btn"
            onClick={handleGoogleLogin}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Continue with Campus Google SSO
          </button>

          <p className="auth-switch-prompt">
            Don't have an account?
            <span
              className="auth-switch-link"
              onClick={() => setActivePage("register")}
            >
              Create Account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
