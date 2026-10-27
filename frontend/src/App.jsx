import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { ToastContainer } from "./components/Toast";

// Import All 21 Pages
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Onboarding } from "./pages/Onboarding";
import { Dashboard } from "./pages/Dashboard";
import { AcademicAudit } from "./pages/AcademicAudit";
import { Performance } from "./pages/Performance";
import { Skills } from "./pages/Skills";
import { SkillGap } from "./pages/SkillGap";
import { CompetencyMap } from "./pages/CompetencyMap";
import { LearningPath } from "./pages/LearningPath";
import { StudyPlanner } from "./pages/StudyPlanner";
import { Assessments } from "./pages/Assessments";
import { Assessment } from "./pages/Assessment";
import { Documents } from "./pages/Documents";
import { ResumeAnalysis } from "./pages/ResumeAnalysis";
import { InterviewReadiness } from "./pages/InterviewReadiness";
import { AICompanion } from "./pages/AICompanion";
import { Progress } from "./pages/Progress";
import { DigitalTwin } from "./pages/DigitalTwin";
import { Profile } from "./pages/Profile";
import { Settings } from "./pages/Settings";

// Import Modular CSS Design Files
import "./styles/global.css";
import "./styles/layout.css";
import "./styles/cards.css";
import "./styles/forms.css";
import "./styles/dashboard.css";
import "./styles/skills.css";
import "./styles/academic.css";
import "./styles/assessment.css";
import "./styles/chat.css";
import "./styles/responsive.css";

const MainLayout = () => {
  const { activePage, isAuthenticated, sidebarCollapsed } = useApp();

  // If on Auth or Onboarding screens, render without main sidebar
  if (!isAuthenticated || activePage === "login") {
    return <Login />;
  }

  if (activePage === "register") {
    return <Register />;
  }

  if (activePage === "onboarding") {
    return <Onboarding />;
  }

  const renderActivePage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "academic-audit":
        return <AcademicAudit />;
      case "performance":
        return <Performance />;
      case "skills":
        return <Skills />;
      case "skill-gap":
        return <SkillGap />;
      case "competency-map":
        return <CompetencyMap />;
      case "learning-path":
        return <LearningPath />;
      case "study-planner":
        return <StudyPlanner />;
      case "assessments":
        return <Assessments />;
      case "assessment-quiz":
        return <Assessment />;
      case "documents":
        return <Documents />;
      case "resume-analysis":
        return <ResumeAnalysis />;
      case "interview-readiness":
        return <InterviewReadiness />;
      case "ai-companion":
        return <AICompanion />;
      case "progress":
        return <Progress />;
      case "digital-twin":
        return <DigitalTwin />;
      case "profile":
        return <Profile />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className={`main-wrapper ${sidebarCollapsed ? "expanded" : ""}`}>
        <Navbar />
        <main>{renderActivePage()}</main>
      </div>
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
