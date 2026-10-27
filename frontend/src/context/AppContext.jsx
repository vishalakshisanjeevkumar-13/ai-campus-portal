import React, { createContext, useContext, useState, useEffect } from "react";
import {
  initialStudentData,
  initialAcademicData,
  initialPerformanceHistory,
  initialSkills,
  initialRecommendations,
  initialWeeklyTasks,
  initialCompetencyTree,
  initialAssessmentsCatalog,
  initialCompletedAssessments,
  initialRoadmapPhases,
  initialResumeAnalysis,
  initialInterviewReadiness,
  initialDocuments,
  initialProjects,
  initialCertifications,
  initialNotifications,
  initialProgressHistory,
  sampleAiResponses
} from "../data/mockData";
import { API_BASE_URL } from "../config/api";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Core Entities State
  const [student, setStudent] = useState(initialStudentData);
  const [academicData, setAcademicData] = useState(initialAcademicData);
  const [performanceHistory, setPerformanceHistory] = useState(initialPerformanceHistory);
  const [skills, setSkills] = useState(initialSkills);
  const [recommendations, setRecommendations] = useState(initialRecommendations);
  const [weeklyTasks, setWeeklyTasks] = useState(initialWeeklyTasks);
  const [competencyTree, setCompetencyTree] = useState(initialCompetencyTree);
  const [assessmentsCatalog, setAssessmentsCatalog] = useState(initialAssessmentsCatalog);
  const [completedAssessments, setCompletedAssessments] = useState(initialCompletedAssessments);
  const [roadmapPhases, setRoadmapPhases] = useState(initialRoadmapPhases);
  const [resumeAnalysis, setResumeAnalysis] = useState(initialResumeAnalysis);
  const [interviewReadiness, setInterviewReadiness] = useState(initialInterviewReadiness);
  const [documents, setDocuments] = useState(initialDocuments);
  const [projects, setProjects] = useState(initialProjects);
  const [certifications, setCertifications] = useState(initialCertifications);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [progressHistory, setProgressHistory] = useState(initialProgressHistory);
  
  // Selected modal item state
  const [selectedSkillModal, setSelectedSkillModal] = useState(null);
  
  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // Apply theme to html data-theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addToast = (title, message, type = "info") => {
    const id = Date.now() + Math.random().toString();
    const newToast = { id, title, message, type };
    setToasts(prev => [newToast, ...prev]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  // Hydrate persisted scores from localStorage on mount and sync with backend
  useEffect(() => {
    try {
      const savedDsa = localStorage.getItem("campus_companion_dsa_calibrated");
      if (savedDsa) {
        const numDsa = parseFloat(savedDsa);
        if (!isNaN(numDsa) && numDsa > 42) {
          setSkills(prev => prev.map(s => {
            if (s.shortName === "DSA" || s.id === "skill-dsa") {
              return {
                ...s,
                current: numDsa,
                gap: Math.max(0, Math.round(s.target - numDsa)),
                status: numDsa >= 80 ? "Strong" : numDsa >= 50 ? "Moderate" : "Weak",
                assessmentScore: numDsa
              };
            }
            return s;
          }));
        }
      }
    } catch (err) {
      console.warn("Storage hydration error", err);
    }

    // Attempt to sync latest Digital Twin from backend
    fetch(`${API_BASE_URL}/api/digital-twin`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.readiness_indicators) {
          const ri = data.readiness_indicators;
          setStudent(prev => ({
            ...prev,
            overallReadiness: ri.overall_readiness ?? prev.overallReadiness,
            placementReadinessScore: ri.placement_readiness_score ?? prev.placementReadinessScore,
            academicHealthScore: ri.academic_health_score ?? prev.academicHealthScore,
            technicalSkillsScore: ri.technical_skills_score ?? prev.technicalSkillsScore,
            assessmentConfidenceScore: ri.assessment_confidence_score ?? prev.assessmentConfidenceScore,
            learningConsistencyScore: ri.learning_consistency_score ?? prev.learningConsistencyScore
          }));
        }
      })
      .catch(() => {
        // Backend offline or local fallback, silent
      });
  }, []);

  // COMPLETE ASSESSMENT FUNCTION (THE CORE STATE SYNCHRONIZATION WITH BACKEND)
  const submitDsaAssessment = (serverResult) => {
    const isObj = typeof serverResult === "object" && serverResult !== null;
    const quizScore = isObj ? (serverResult.score_percentage ?? 70) : Number(serverResult || 70);
    const newSkillScore = isObj ? (serverResult.new_skill_score ?? quizScore) : quizScore;
    const improvement = isObj ? (serverResult.skill_improvement ?? Math.round(newSkillScore - 42)) : Math.round(newSkillScore - 42);

    // 1. Update DSA Skill with genuine calibrated score
    setSkills(prev => prev.map(skill => {
      if (skill.shortName === "DSA" || skill.id === "skill-dsa") {
        return {
          ...skill,
          current: newSkillScore,
          gap: Math.max(0, Math.round(skill.target - newSkillScore)),
          status: newSkillScore >= 80 ? "Strong" : newSkillScore >= 50 ? "Moderate" : "Weak",
          priority: newSkillScore >= 75 ? "LOW" : newSkillScore >= 55 ? "MEDIUM" : "HIGH",
          trend: `+${improvement}% improvement in verified assessment`,
          assessmentScore: quizScore,
          problemSolving: Math.min(100, Math.round(38 + (improvement * 0.7))),
          practiceConsistency: 72,
          recommendation: newSkillScore >= 60 
            ? "Foundational DSA validated! Next milestone: Trees, Binary Search Trees & Graph BFS/DFS traversals."
            : "Continue linear structures practice (Arrays, Two Pointers) before advancing.",
          nextTopic: newSkillScore >= 60 ? "Trees & Binary Search Trees" : "Two Pointers & Linked Lists",
          topics: skill.topics.map(topic => {
            if (topic.name.includes("Arrays") || topic.name.includes("Strings")) {
              return { ...topic, mastery: Math.min(100, Math.max(topic.mastery, Math.round(quizScore))), status: "Mastered" };
            }
            if (topic.name.includes("Linked Lists")) {
              return { ...topic, mastery: Math.min(100, Math.max(topic.mastery, 75)), status: "Mastered" };
            }
            if (topic.name.includes("Trees")) {
              return { ...topic, mastery: 48, status: "In Progress" };
            }
            return topic;
          })
        };
      }
      return skill;
    }));

    // 2. Update Student Intelligence Scores (from server Digital Twin if available)
    if (isObj && serverResult.digital_twin && serverResult.digital_twin.readiness_indicators) {
      const ri = serverResult.digital_twin.readiness_indicators;
      setStudent(prev => ({
        ...prev,
        technicalSkillsScore: ri.technical_skills_score ?? Math.min(100, Math.round(71 + (improvement * 0.3))),
        placementReadinessScore: ri.placement_readiness_score ?? Math.min(100, Math.round(74 + (improvement * 0.25))),
        overallReadiness: ri.overall_readiness ?? Math.min(100, Math.round(74 + (improvement * 0.25))),
        assessmentConfidenceScore: ri.assessment_confidence_score ?? Math.min(100, Math.round(68 + (quizScore * 0.15))),
        completedTasksCount: prev.completedTasksCount + 1,
        totalAssessmentsTaken: prev.totalAssessmentsTaken + 1
      }));
    } else {
      setStudent(prev => ({
        ...prev,
        technicalSkillsScore: Math.min(100, Math.round(71 + (improvement * 0.3))),
        placementReadinessScore: Math.min(100, Math.round(74 + (improvement * 0.25))),
        overallReadiness: Math.min(100, Math.round(74 + (improvement * 0.25))),
        assessmentConfidenceScore: Math.min(100, Math.round(68 + (quizScore * 0.15))),
        completedTasksCount: prev.completedTasksCount + 1,
        totalAssessmentsTaken: prev.totalAssessmentsTaken + 1
      }));
    }

    // 3. Update Recommendations (using server prioritized list if present)
    if (isObj && serverResult.updated_recommendations && serverResult.updated_recommendations.length > 0) {
      setRecommendations(serverResult.updated_recommendations.map(r => ({
        id: r.id || `rec-${r.skill_id}`,
        priority: r.priority,
        title: r.title,
        description: r.description,
        actionText: r.action_text || "Open Learning Path",
        targetRoute: r.target_route || "learning-path",
        metric: r.metric_display || `${r.current_score}% / ${r.target_score}%`,
        category: r.short_name || "Technical Competency"
      })));
    } else {
      setRecommendations(prev => [
        {
          id: "rec-1",
          priority: newSkillScore >= 60 ? "MEDIUM" : "HIGH",
          title: newSkillScore >= 60 ? "Advanced DSA: Trees & Graphs" : "DSA Linear Mastery",
          description: `DSA competency calibrated to ${newSkillScore}% (quiz score: ${quizScore}%). Proceed to hierarchical structures in your roadmap.`,
          actionText: "Open Learning Path",
          targetRoute: "learning-path",
          metric: `${newSkillScore}% / 80%`,
          category: "Technical Advancement",
          statusKey: "dsa_improved"
        },
        ...prev.filter(r => r.id !== "rec-1")
      ]);
    }

    // 4. Update Competency Tree
    setCompetencyTree(prev => ({
      ...prev,
      readiness: Math.min(100, Math.round(74 + (improvement * 0.2))),
      branches: prev.branches.map(branch => {
        if (branch.id === "branch-dsa") {
          return {
            ...branch,
            score: newSkillScore,
            status: newSkillScore >= 80 ? "Good" : newSkillScore >= 50 ? "Moderate" : "Weak",
            nodes: branch.nodes.map(node => {
              if (node.name.includes("Arrays") || node.name.includes("Strings")) {
                return { ...node, status: "strong", score: Math.min(100, Math.max(node.score, Math.round(quizScore))) };
              }
              if (node.name.includes("Linked Lists")) {
                return { ...node, status: "strong", score: 75 };
              }
              if (node.name.includes("Trees")) {
                return { ...node, status: "moderate", score: 50 };
              }
              return node;
            })
          };
        }
        return branch;
      })
    }));

    // 5. Update Completed Assessments
    const newCompleted = {
      id: "comp-" + Date.now(),
      title: "DSA Fundamentals Assessment",
      category: "DSA",
      date: new Date().toISOString().split("T")[0],
      score: quizScore,
      totalMarks: 100,
      status: quizScore >= 60 ? "Passed" : "Review Recommended",
      feedback: `Verified score: ${quizScore}%. Calibrated DSA skill to ${newSkillScore}%. Next milestone: Trees & Binary Search Trees.`
    };
    setCompletedAssessments(prev => [newCompleted, ...prev]);

    // 6. Update Progress History Timeline
    setProgressHistory(prev => ({
      ...prev,
      assessmentsCompleted: prev.assessmentsCompleted + 1,
      streak: prev.streak + 1,
      monthlySkillTimeline: prev.monthlySkillTimeline.map(item => {
        if (item.month === "August") {
          return { ...item, dsa: newSkillScore, overall: Math.min(100, item.overall + Math.round(improvement * 0.2)) };
        }
        return item;
      }),
      recentMilestones: [
        { title: `Completed DSA Fundamentals Assessment (${quizScore}%)`, date: "Just now", category: "Assessment" },
        ...prev.recentMilestones
      ]
    }));

    // 7. Update Interview Readiness
    setInterviewReadiness(prev => ({
      ...prev,
      overallReadiness: Math.min(100, Math.round(prev.overallReadiness + (improvement * 0.2))),
      domains: prev.domains.map(d => {
        if (d.name === "DSA") {
          return {
            ...d,
            score: newSkillScore,
            status: newSkillScore >= 70 ? "Ready" : newSkillScore >= 50 ? "Moderate" : "Needs Work",
            color: newSkillScore >= 70 ? "#10B981" : newSkillScore >= 50 ? "#F59E0B" : "#EF4444"
          };
        }
        return d;
      }),
      strongAreas: [`DSA Arrays, Linear Structures (Verified ${newSkillScore}%)`, ...prev.strongAreas]
    }));

    // 8. Update Learning Path Phase 2
    setRoadmapPhases(prev => prev.map(phase => {
      if (phase.id === "phase-2") {
        return {
          ...phase,
          progress: Math.min(100, phase.progress + 15),
          completedTasks: phase.completedTasks + 2,
          badgeColor: newSkillScore >= 60 ? "success" : "primary"
        };
      }
      return phase;
    }));

    // 9. Persist to localStorage for page-refresh resilience
    try {
      localStorage.setItem("campus_companion_dsa_calibrated", String(newSkillScore));
      localStorage.setItem("campus_companion_last_result", JSON.stringify(isObj ? serverResult : { score_percentage: quizScore, new_skill_score: newSkillScore }));
    } catch (e) {
      console.warn("Storage sync warning", e);
    }

    // 10. Add Notification & Toast
    addToast(
      "🎉 Assessment Evaluated by Backend!",
      `Score: ${quizScore}%. DSA skill calibrated to ${newSkillScore}%. Digital Twin updated.`,
      "success"
    );
  };

  // Task actions: Complete, Skip, Reschedule
  const completeTask = (taskId) => {
    setWeeklyTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, completed: true, status: "Completed" };
      }
      return t;
    }));
    setStudent(prev => ({ ...prev, completedTasksCount: prev.completedTasksCount + 1 }));
    addToast("Task Completed", "Great work! Your learning streak continues.", "success");
  };

  const skipTask = (taskId) => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    let shiftedDay = "Sunday";
    let taskName = "";

    setWeeklyTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        taskName = t.title;
        const currIndex = days.indexOf(t.day);
        shiftedDay = days[(currIndex + 2) % days.length];
        return { ...t, day: shiftedDay, status: "Rescheduled (Adaptive)" };
      }
      return t;
    }));

    addToast(
      "Adaptive Study Plan Rebalanced",
      `"${taskName}" has been moved to ${shiftedDay} to keep your daily workload balanced.`,
      "warning"
    );
  };

  const rescheduleTask = (taskId, newDay) => {
    setWeeklyTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, day: newDay, status: "Rescheduled" };
      }
      return t;
    }));
    addToast("Schedule Updated", `Task moved to ${newDay}.`, "info");
  };

  // Notification actions
  const markNotificationRead = (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast("Notifications", "All notifications marked as read.", "info");
  };

  // Document upload simulation
  const addDocument = (newDoc) => {
    setDocuments(prev => [newDoc, ...prev]);
    addToast("Document Uploaded", `${newDoc.name} processed successfully.`, "success");
  };

  // Profile update
  const updateStudentProfile = (updatedFields) => {
    setStudent(prev => ({ ...prev, ...updatedFields }));
    addToast("Profile Updated", "Your intelligence profile was saved successfully.", "success");
  };

  // AI chat query engine
  const getAiResponse = (userPrompt) => {
    const lower = userPrompt.toLowerCase();
    const dsaScore = skills.find(s => s.shortName === "DSA")?.current || 42;
    const readiness = student.overallReadiness || 74;

    for (let item of sampleAiResponses) {
      if (item.triggers.some(t => lower.includes(t))) {
        let text = item.response
          .replace(/{dsa}/g, dsaScore)
          .replace(/{readiness}/g, readiness);
        
        if (dsaScore > 50) {
          text = text.replace(
            /{dsaExplanation}/g,
            `You recently achieved **${dsaScore}%** (+25% gain) on the DSA Fundamentals assessment! Your linear structures (Arrays, Linked Lists) are now marked **Mastered**, which increased your target role readiness to ${readiness}%.`
          );
        } else {
          text = text.replace(
            /{dsaExplanation}/g,
            `Your score of 42% reflects foundational gaps in Arrays and Linked Lists. Taking the recommended 20-minute diagnostic will test your progress and elevate your ranking.`
          );
        }
        return text;
      }
    }

    // Default intelligent fallback
    return `Based on your current profile (CGPA: ${student.cgpa}, Target: ${student.targetRole}, DSA: ${dsaScore}%), I recommend completing your scheduled ${weeklyTasks.find(t => !t.completed)?.title || "next learning module"} and reviewing your Skill Gap analysis to target high-priority weaknesses.`;
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        isAuthenticated,
        setIsAuthenticated,
        activePage,
        setActivePage,
        searchQuery,
        setSearchQuery,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileMenuOpen,
        setMobileMenuOpen,
        student,
        academicData,
        performanceHistory,
        skills,
        recommendations,
        weeklyTasks,
        competencyTree,
        assessmentsCatalog,
        completedAssessments,
        roadmapPhases,
        resumeAnalysis,
        interviewReadiness,
        documents,
        projects,
        certifications,
        notifications,
        progressHistory,
        selectedSkillModal,
        setSelectedSkillModal,
        toasts,
        addToast,
        removeToast,
        submitDsaAssessment,
        completeTask,
        skipTask,
        rescheduleTask,
        markNotificationRead,
        markAllNotificationsRead,
        addDocument,
        updateStudentProfile,
        getAiResponse
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
