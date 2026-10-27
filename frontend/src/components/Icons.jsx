import React from "react";
import {
  LayoutDashboard,
  GraduationCap,
  TrendingUp,
  BrainCircuit,
  Target,
  GitFork,
  Route,
  Calendar,
  ClipboardCheck,
  FileText,
  FileSearch,
  Users,
  Bot,
  Activity,
  UserCheck,
  User,
  Settings,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  UploadCloud,
  Check,
  ChevronDown,
  Award,
  Zap,
  Briefcase,
  Layers,
  BookOpen,
  Filter,
  BarChart3,
  Cpu,
  RefreshCw,
  LogOut,
  ExternalLink
} from "lucide-react";

export const Icon = ({ name, size = 18, className = "", color }) => {
  const iconProps = { size, className, color };
  
  switch (name) {
    case "dashboard": return <LayoutDashboard {...iconProps} />;
    case "academic": return <GraduationCap {...iconProps} />;
    case "performance": return <TrendingUp {...iconProps} />;
    case "skills": return <BrainCircuit {...iconProps} />;
    case "skill-gap": return <Target {...iconProps} />;
    case "competency": return <GitFork {...iconProps} />;
    case "learning-path": return <Route {...iconProps} />;
    case "study-planner": return <Calendar {...iconProps} />;
    case "assessments": return <ClipboardCheck {...iconProps} />;
    case "documents": return <FileText {...iconProps} />;
    case "resume": return <FileSearch {...iconProps} />;
    case "interview": return <Users {...iconProps} />;
    case "ai-companion": return <Bot {...iconProps} />;
    case "progress": return <Activity {...iconProps} />;
    case "digital-twin": return <UserCheck {...iconProps} />;
    case "profile": return <User {...iconProps} />;
    case "settings": return <Settings {...iconProps} />;
    case "search": return <Search {...iconProps} />;
    case "bell": return <Bell {...iconProps} />;
    case "sun": return <Sun {...iconProps} />;
    case "moon": return <Moon {...iconProps} />;
    case "chevron-left": return <ChevronLeft {...iconProps} />;
    case "chevron-right": return <ChevronRight {...iconProps} />;
    case "check-circle": return <CheckCircle2 {...iconProps} />;
    case "alert-circle": return <AlertCircle {...iconProps} />;
    case "alert-triangle": return <AlertTriangle {...iconProps} />;
    case "info": return <Info {...iconProps} />;
    case "clock": return <Clock {...iconProps} />;
    case "sparkles": return <Sparkles {...iconProps} />;
    case "arrow-right": return <ArrowRight {...iconProps} />;
    case "arrow-up-right": return <ArrowUpRight {...iconProps} />;
    case "menu": return <Menu {...iconProps} />;
    case "close": return <X {...iconProps} />;
    case "upload": return <UploadCloud {...iconProps} />;
    case "check": return <Check {...iconProps} />;
    case "chevron-down": return <ChevronDown {...iconProps} />;
    case "award": return <Award {...iconProps} />;
    case "zap": return <Zap {...iconProps} />;
    case "briefcase": return <Briefcase {...iconProps} />;
    case "layers": return <Layers {...iconProps} />;
    case "book": return <BookOpen {...iconProps} />;
    case "filter": return <Filter {...iconProps} />;
    case "chart": return <BarChart3 {...iconProps} />;
    case "cpu": return <Cpu {...iconProps} />;
    case "refresh": return <RefreshCw {...iconProps} />;
    case "logout": return <LogOut {...iconProps} />;
    case "external-link": return <ExternalLink {...iconProps} />;
    default: return <Sparkles {...iconProps} />;
  }
};
