import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Icon } from "../components/Icons";
import { ProgressBar } from "../components/ProgressBar";

export const Onboarding = () => {
  const { setActivePage, student, updateStudentProfile, addToast } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  // Form State
  const [profileData, setProfileData] = useState({
    name: student.name || "Alex Morgan",
    department: student.department || "Computer Science & Engineering",
    year: student.year || "3rd Year (6th Semester)",
    college: student.college || "Institute of Technology & AI Research",
    cgpa: student.cgpa || 7.8,
    selectedSkills: ["DSA", "Java", "SQL", "Git", "React"],
    careerGoal: student.careerGoal || "Full-Stack Software Engineer at top-tier product tech enterprise",
    targetRole: "Software Developer",
    studyHours: 18
  });

  const availableSkillsList = [
    "DSA", "Java", "SQL", "React", "Python", "Git",
    "Spring Boot", "System Design", "Node.js", "Docker", "AWS", "Kubernetes"
  ];

  const targetRolesList = [
    { id: "sde", name: "Software Developer", desc: "Core algorithms, backend APIs, DBMS, OOP & system scaling" },
    { id: "frontend", name: "Frontend Engineer", desc: "Modern UI/UX, React architectures, performance, state design" },
    { id: "backend", name: "Backend Engineer", desc: "Distributed microservices, cloud pipelines, databases, caching" },
    { id: "data-ai", name: "Data / AI Engineer", desc: "Machine learning pipelines, SQL analytics, Python ecosystems" }
  ];

  const toggleSkill = (skill) => {
    setProfileData(prev => {
      const exists = prev.selectedSkills.includes(skill);
      return {
        ...prev,
        selectedSkills: exists
          ? prev.selectedSkills.filter(s => s !== skill)
          : [...prev.selectedSkills, skill]
      };
    });
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finalize and save
      updateStudentProfile({
        name: profileData.name,
        department: profileData.department,
        year: profileData.year,
        college: profileData.college,
        cgpa: parseFloat(profileData.cgpa),
        careerGoal: profileData.careerGoal,
        targetRole: profileData.targetRole,
        availableStudyHoursPerWeek: profileData.studyHours
      });
      setCurrentStep(7); // Show final intelligence generation card
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const finishOnboarding = () => {
    setActivePage("dashboard");
    addToast("Intelligence Activated", "Your personalized student model is running live.", "success");
  };

  return (
    <div className="onboarding-page-container">
      <div className="onboarding-card animate-fade-in">
        {currentStep <= 6 ? (
          <>
            <div className="onboarding-progress-header">
              <div className="onboarding-step-indicator">
                <span>Step {currentStep} of {totalSteps}</span>
                <span>{Math.round((currentStep / totalSteps) * 100)}% Completed</span>
              </div>
              <ProgressBar value={(currentStep / totalSteps) * 100} size="thin" />
            </div>

            <div className="onboarding-body">
              {/* Step 1: Personal Info */}
              {currentStep === 1 && (
                <div className="animate-fade-in">
                  <h2 className="onboarding-step-title">Personal Information</h2>
                  <p className="onboarding-step-desc">Confirm your identity and basic contact profile.</p>

                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">College / University</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profileData.college}
                      onChange={(e) => setProfileData({ ...profileData, college: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Academic Info */}
              {currentStep === 2 && (
                <div className="animate-fade-in">
                  <h2 className="onboarding-step-title">Academic Information</h2>
                  <p className="onboarding-step-desc">Help us analyze your coursework and academic trajectory.</p>

                  <div className="grid grid-2">
                    <div className="form-group">
                      <label className="form-label">Department</label>
                      <select
                        className="form-input"
                        value={profileData.department}
                        onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                      >
                        <option>Computer Science & Engineering</option>
                        <option>Information Technology</option>
                        <option>Data Science & AI</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Academic Year</label>
                      <select
                        className="form-input"
                        value={profileData.year}
                        onChange={(e) => setProfileData({ ...profileData, year: e.target.value })}
                      >
                        <option>3rd Year (6th Semester)</option>
                        <option>3rd Year (5th Semester)</option>
                        <option>4th Year (7th Semester)</option>
                        <option>2nd Year (4th Semester)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Current Cumulative CGPA (out of 10.0)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="10.0"
                      className="form-input"
                      value={profileData.cgpa}
                      onChange={(e) => setProfileData({ ...profileData, cgpa: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Current Skills */}
              {currentStep === 3 && (
                <div className="animate-fade-in">
                  <h2 className="onboarding-step-title">Current Skills</h2>
                  <p className="onboarding-step-desc">Select the programming languages and technical concepts you are familiar with.</p>

                  <div className="skill-chips-selector">
                    {availableSkillsList.map((skill) => {
                      const isSelected = profileData.selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          className={`skill-chip-toggle ${isSelected ? "active" : ""}`}
                          onClick={() => toggleSkill(skill)}
                        >
                          {isSelected && <Icon name="check" size={14} />} {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 4: Career Goal */}
              {currentStep === 4 && (
                <div className="animate-fade-in">
                  <h2 className="onboarding-step-title">Career Goal</h2>
                  <p className="onboarding-step-desc">What is your long-term aspiration or dream career milestone?</p>

                  <div className="form-group">
                    <label className="form-label">Career Aspiration Statement</label>
                    <textarea
                      rows={3}
                      className="form-input"
                      value={profileData.careerGoal}
                      onChange={(e) => setProfileData({ ...profileData, careerGoal: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Target Job Role */}
              {currentStep === 5 && (
                <div className="animate-fade-in">
                  <h2 className="onboarding-step-title">Target Job Role</h2>
                  <p className="onboarding-step-desc">Select the role you are targeting for upcoming placements and internships.</p>

                  <div className="role-selection-grid">
                    {targetRolesList.map((role) => (
                      <div
                        key={role.id}
                        className={`role-option-card ${profileData.targetRole === role.name ? "selected" : ""}`}
                        onClick={() => setProfileData({ ...profileData, targetRole: role.name })}
                      >
                        <h4 className="role-card-title">{role.name}</h4>
                        <p className="role-card-desc">{role.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 6: Available Study Hours */}
              {currentStep === 6 && (
                <div className="animate-fade-in">
                  <h2 className="onboarding-step-title">Available Study Hours</h2>
                  <p className="onboarding-step-desc">How many hours per week can you dedicate to skill refinement?</p>

                  <div className="hours-slider-wrapper">
                    <div className="hours-large-display">{profileData.studyHours} hrs/week</div>
                    <p className="text-xs text-muted">~{Math.round(profileData.studyHours / 7 * 10) / 10} hours of adaptive daily learning</p>
                    <input
                      type="range"
                      min="5"
                      max="40"
                      value={profileData.studyHours}
                      onChange={(e) => setProfileData({ ...profileData, studyHours: parseInt(e.target.value) })}
                      className="range-input-styled"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="onboarding-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                <Icon name="chevron-left" size={16} /> Back
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNext}
              >
                {currentStep === totalSteps ? "Generate Profile" : "Continue"}
                <Icon name="arrow-right" size={16} />
              </button>
            </div>
          </>
        ) : (
          /* Step 7: Completion Screen */
          <div className="p-8 text-center animate-fade-in">
            <div className="result-celebration-badge" style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}>
              <Icon name="sparkles" size={40} />
            </div>

            <h2 className="text-2xl font-bold mb-2">Your Student Intelligence Profile is Ready.</h2>
            <p className="text-secondary text-sm max-width-md mx-auto mb-6" style={{ maxWidth: "460px", margin: "0 auto 24px" }}>
              We've synthesized your academic metrics, identified skill gap baselines, mapped your Software Developer competency tree, and prepared your adaptive weekly schedule.
            </p>

            <div className="grid grid-3 gap-3 mb-6 text-left">
              <div className="p-3 bg-alt border rounded">
                <div className="text-xs text-muted">Target Role</div>
                <div className="font-bold text-sm text-primary">{profileData.targetRole}</div>
              </div>
              <div className="p-3 bg-alt border rounded">
                <div className="text-xs text-muted">Academic Health</div>
                <div className="font-bold text-sm text-success">78 / 100</div>
              </div>
              <div className="p-3 bg-alt border rounded">
                <div className="text-xs text-muted">Initial Priority</div>
                <div className="font-bold text-sm text-danger">DSA Gap (42%)</div>
              </div>
            </div>

            <button
              className="btn btn-primary btn-lg btn-block"
              onClick={finishOnboarding}
            >
              Enter Dashboard
              <Icon name="arrow-right" size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
