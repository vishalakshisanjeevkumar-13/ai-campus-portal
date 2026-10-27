import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Icon } from "../components/Icons";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";

export const Profile = () => {
  const { student, updateStudentProfile, skills, projects, certifications } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: student.name,
    department: student.department,
    year: student.year,
    cgpa: student.cgpa,
    targetRole: student.targetRole,
    careerGoal: student.careerGoal,
    availableStudyHoursPerWeek: student.availableStudyHoursPerWeek
  });

  const handleSave = (e) => {
    e.preventDefault();
    updateStudentProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Student Profile</h1>
          <p className="page-subtitle">Personal academic credentials, verified skills, and career aspirations.</p>
        </div>

        <div className="page-actions-group">
          {!isEditing ? (
            <button className="btn btn-primary btn-sm" onClick={() => setIsEditing(true)}>
              <Icon name="profile" size={16} /> Edit Profile
            </button>
          ) : (
            <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Main Profile Info Card */}
      <Card className="mb-6">
        {!isEditing ? (
          <div className="flex items-start justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-24 h-24 rounded-full border-4 border-primary object-cover"
                style={{ width: "96px", height: "96px", borderRadius: "50%", border: "3px solid var(--primary)" }}
              />

              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-primary">{student.name}</h2>
                  <Badge variant="success">Active Student</Badge>
                </div>
                <p className="text-sm text-secondary mt-1">
                  {student.department} • {student.year}
                </p>
                <p className="text-xs text-muted mt-0.5">
                  {student.college} • ID: {student.id}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3 bg-alt border rounded text-center">
                <span className="text-xs text-muted uppercase font-bold">Target Role</span>
                <div className="text-base font-bold text-primary">{student.targetRole}</div>
              </div>
              <div className="p-3 bg-alt border rounded text-center">
                <span className="text-xs text-muted uppercase font-bold">Cumulative CGPA</span>
                <div className="text-base font-bold text-success">{student.cgpa} / 10.0</div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="animate-fade-in">
            <h3 className="text-base font-bold mb-4">Edit Profile Information</h3>
            <div className="grid grid-2 gap-4 mb-4">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Role</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Academic Year</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cumulative CGPA</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={formData.cgpa}
                  onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Available Study Hours/Week</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.availableStudyHoursPerWeek}
                  onChange={(e) => setFormData({ ...formData, availableStudyHoursPerWeek: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="form-group mb-4">
              <label className="form-label">Career Goal Statement</label>
              <textarea
                rows={2}
                className="form-input"
                value={formData.careerGoal}
                onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              <Icon name="check" size={16} /> Save Profile Changes
            </button>
          </form>
        )}
      </Card>

      {/* Portfolio Projects & Verified Certifications */}
      <div className="grid grid-2 gap-6 mb-6">
        {/* Projects */}
        <Card
          title="Portfolio Projects"
          subtitle="Verifiable software engineering implementations"
        >
          <div className="flex flex-col gap-3">
            {projects.map((p) => (
              <div key={p.id} className="p-3 bg-alt border rounded">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-primary">{p.title}</h4>
                  <Badge variant={p.status}>{p.status}</Badge>
                </div>
                <p className="text-xs text-secondary mb-2">{p.description}</p>
                <div className="flex flex-wrap gap-1">
                  {p.techStack.map((tech) => (
                    <span key={tech} className="px-2 py-0.5 bg-surface border rounded text-xs text-muted">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Certifications */}
        <Card
          title="Verified Certifications"
          subtitle="Accredited certifications indexed in your Digital Twin"
        >
          <div className="flex flex-col gap-3">
            {certifications.map((c) => (
              <div key={c.id} className="p-3 bg-alt border rounded flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-surface border rounded text-warning">
                    <Icon name="award" size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-primary">{c.name}</h4>
                    <div className="text-xs text-muted">{c.issuer} • Issued: {c.issueDate}</div>
                  </div>
                </div>

                <Badge variant="success">VERIFIED</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
