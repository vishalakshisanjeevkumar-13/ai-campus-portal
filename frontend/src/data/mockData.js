// Centralized Mock Data for AI Campus Companion
export const initialStudentData = {
  id: "STD-2024-8842",
  name: "Alex Morgan",
  email: "alex.morgan@campus.edu",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
  department: "Computer Science & Engineering",
  year: "3rd Year (6th Semester)",
  college: "Institute of Technology & AI Research",
  cgpa: 7.8,
  targetRole: "Software Developer",
  careerGoal: "Full-Stack Software Engineer at top-tier product tech enterprise",
  availableStudyHoursPerWeek: 18,
  learningStreakDays: 14,
  completedTasksCount: 48,
  totalAssessmentsTaken: 12,
  overallReadiness: 74,
  academicHealthScore: 78,
  technicalSkillsScore: 71,
  placementReadinessScore: 74,
  learningConsistencyScore: 86,
  projectsScore: 64,
  certificationsScore: 82,
  assessmentConfidenceScore: 68
};

export const initialAcademicData = {
  academicHealth: 78,
  cgpa: 7.8,
  attendance: 86,
  averageScore: 74,
  improvement: "+8%",
  creditsCompleted: 98,
  totalCredits: 140,
  subjects: [
    { id: "sub-1", code: "CS501", name: "Data Structures & Algorithms", score: 62, grade: "B", attendance: 84, faculty: "Dr. R. Sharma", credits: 4, status: "Needs Improvement" },
    { id: "sub-2", code: "CS502", name: "Database Management Systems", score: 78, grade: "A", attendance: 90, faculty: "Prof. S. Sengupta", credits: 4, status: "Good" },
    { id: "sub-3", code: "CS503", name: "Operating Systems", score: 71, grade: "B+", attendance: 82, faculty: "Dr. K. Iyer", credits: 3, status: "Good" },
    { id: "sub-4", code: "CS504", name: "Computer Networks", score: 83, grade: "A+", attendance: 92, faculty: "Prof. M. Patel", credits: 3, status: "Excellent" },
    { id: "sub-5", code: "CS505", name: "Java Enterprise Programming", score: 68, grade: "B", attendance: 85, faculty: "Dr. V. Nambiar", credits: 4, status: "Moderate" },
    { id: "sub-6", code: "MA501", name: "Discrete Mathematics & Graph Theory", score: 74, grade: "A", attendance: 81, faculty: "Dr. A. Verma", credits: 3, status: "Good" }
  ]
};

export const initialPerformanceHistory = {
  cgpaTrend: [
    { semester: "Semester 1", cgpa: 6.8, credits: 22, percentage: 68 },
    { semester: "Semester 2", cgpa: 7.0, credits: 24, percentage: 70 },
    { semester: "Semester 3", cgpa: 7.1, credits: 24, percentage: 71 },
    { semester: "Semester 4", cgpa: 7.5, credits: 26, percentage: 75 },
    { semester: "Semester 5", cgpa: 7.8, credits: 26, percentage: 78 }
  ],
  subjectTrends: [
    { subject: "DSA", s3: 54, s4: 58, s5: 62 },
    { subject: "DBMS", s3: 65, s4: 72, s5: 78 },
    { subject: "OS", s3: 60, s4: 68, s5: 71 },
    { subject: "Networks", s3: 70, s4: 76, s5: 83 },
    { subject: "Java", s3: 58, s4: 63, s5: 68 }
  ],
  attendanceTrend: [
    { month: "Jan", attendance: 88 },
    { month: "Feb", attendance: 85 },
    { month: "Mar", attendance: 89 },
    { month: "Apr", attendance: 83 },
    { month: "May", attendance: 86 }
  ]
};

export const initialSkills = [
  {
    id: "skill-dsa",
    name: "Data Structures & Algorithms",
    shortName: "DSA",
    category: "Core Technical",
    current: 42,
    target: 80,
    gap: 38,
    status: "Weak",
    priority: "HIGH",
    trend: "+2% this month",
    color: "#EF4444",
    assessmentScore: 42,
    problemSolving: 38,
    practiceConsistency: 46,
    impact: "HIGH impact on Software Developer readiness",
    dependencies: ["Arrays", "Strings", "Linked Lists"],
    nextTopic: "Trees & Binary Search Trees",
    recommendation: "Complete Arrays and Linked Lists before moving to Trees.",
    topics: [
      { name: "Arrays & Searching", mastery: 65, status: "Mastered" },
      { name: "Strings Manipulation", mastery: 60, status: "Mastered" },
      { name: "Linked Lists", mastery: 55, status: "Review Needed" },
      { name: "Trees & BST", mastery: 28, status: "Weak" },
      { name: "Dynamic Programming", mastery: 15, status: "Missing" },
      { name: "Graphs & BFS/DFS", mastery: 20, status: "Missing" }
    ]
  },
  {
    id: "skill-java",
    name: "Java Core & OOP",
    shortName: "Java",
    category: "Programming Languages",
    current: 68,
    target: 80,
    gap: 12,
    status: "Moderate",
    priority: "MEDIUM",
    trend: "+6% this month",
    color: "#F59E0B",
    assessmentScore: 68,
    problemSolving: 65,
    practiceConsistency: 72,
    impact: "HIGH impact on backend engineering interviews",
    dependencies: ["Core Syntax", "OOP Concepts", "Collections Framework"],
    nextTopic: "Multithreading & Concurrency",
    recommendation: "Build hands-on concurrency exercises and deepen JVM memory model.",
    topics: [
      { name: "OOP Principles", mastery: 85, status: "Mastered" },
      { name: "Collections Framework", mastery: 72, status: "Good" },
      { name: "Exception Handling", mastery: 80, status: "Mastered" },
      { name: "Streams & Lambdas", mastery: 60, status: "Review Needed" },
      { name: "Multithreading", mastery: 45, status: "Weak" }
    ]
  },
  {
    id: "skill-sql",
    name: "SQL & Relational Databases",
    shortName: "SQL",
    category: "Data & Storage",
    current: 74,
    target: 75,
    gap: 1,
    status: "Good",
    priority: "LOW",
    trend: "-3% in last quiz",
    color: "#10B981",
    assessmentScore: 74,
    problemSolving: 76,
    practiceConsistency: 70,
    impact: "MEDIUM impact on database design and backend tests",
    dependencies: ["Schema Design", "Complex Joins", "Aggregation"],
    nextTopic: "Query Optimization & Indexing",
    recommendation: "SQL performance has slightly declined in recent assessments. Take a refresher drill on indexing.",
    topics: [
      { name: "Complex Joins & Subqueries", mastery: 82, status: "Mastered" },
      { name: "Normalization & Schema", mastery: 78, status: "Mastered" },
      { name: "Indexing & Query Plans", mastery: 55, status: "Review Needed" },
      { name: "Transactions & ACID", mastery: 70, status: "Good" }
    ]
  },
  {
    id: "skill-react",
    name: "React & Frontend Architecture",
    shortName: "React",
    category: "Frontend Development",
    current: 61,
    target: 75,
    gap: 14,
    status: "Moderate",
    priority: "MEDIUM",
    trend: "+8% this month",
    color: "#6366F1",
    assessmentScore: 61,
    problemSolving: 64,
    practiceConsistency: 68,
    impact: "MEDIUM impact on full stack versatility",
    dependencies: ["JavaScript ES6+", "Component State", "Hooks"],
    nextTopic: "State Management & Custom Hooks",
    recommendation: "Build a modular full-stack dashboard to reinforce component lifecycle and performance.",
    topics: [
      { name: "Components & Props", mastery: 88, status: "Mastered" },
      { name: "Hooks (useState, useEffect)", mastery: 75, status: "Mastered" },
      { name: "Context API & State", mastery: 58, status: "Review Needed" },
      { name: "Routing & Performance", mastery: 48, status: "Weak" }
    ]
  },
  {
    id: "skill-git",
    name: "Git & Version Control",
    shortName: "Git",
    category: "Engineering Tools",
    current: 82,
    target: 70,
    gap: -12,
    status: "Strong",
    priority: "STRONG",
    trend: "+4% this month",
    color: "#10B981",
    assessmentScore: 82,
    problemSolving: 85,
    practiceConsistency: 80,
    impact: "LOW (Requirement already met)",
    dependencies: ["Branching", "Pull Requests", "Merge Conflict Resolution"],
    nextTopic: "CI/CD GitHub Actions",
    recommendation: "Demonstrate open-source contributions and maintain clean commit history.",
    topics: [
      { name: "Branching & Merging", mastery: 90, status: "Mastered" },
      { name: "Rebase & Conflict Fixes", mastery: 80, status: "Mastered" },
      { name: "Workflows & Remotes", mastery: 85, status: "Mastered" }
    ]
  },
  {
    id: "skill-python",
    name: "Python Programming",
    shortName: "Python",
    category: "Programming Languages",
    current: 71,
    target: 75,
    gap: 4,
    status: "Moderate",
    priority: "LOW",
    trend: "+5% this month",
    color: "#3B82F6",
    assessmentScore: 71,
    problemSolving: 72,
    practiceConsistency: 70,
    impact: "MEDIUM impact on algorithmic prototyping",
    dependencies: ["OOP Python", "Data Structures", "Libraries"],
    nextTopic: "FastAPI / Backend microservices",
    recommendation: "Use Python for scripting and rapid algorithmic problem prototyping.",
    topics: [
      { name: "Built-in Data Structures", mastery: 84, status: "Mastered" },
      { name: "OOP & Modules", mastery: 75, status: "Mastered" },
      { name: "File I/O & Scripting", mastery: 70, status: "Good" }
    ]
  },
  {
    id: "skill-springboot",
    name: "Spring Boot & Microservices",
    shortName: "Spring Boot",
    category: "Backend Development",
    current: 30,
    target: 75,
    gap: 45,
    status: "Missing",
    priority: "HIGH",
    trend: "New Skill",
    color: "#EF4444",
    assessmentScore: 30,
    problemSolving: 25,
    practiceConsistency: 20,
    impact: "HIGH impact on enterprise software developer roles",
    dependencies: ["Java OOP", "Maven/Gradle", "REST Fundamentals"],
    nextTopic: "Spring Dependency Injection & REST Controllers",
    recommendation: "Build a production-ready REST API using Spring Boot and Spring Data JPA.",
    topics: [
      { name: "Spring Core & Inversion of Control", mastery: 35, status: "Weak" },
      { name: "REST Controller & Services", mastery: 30, status: "Weak" },
      { name: "Spring Data JPA", mastery: 20, status: "Missing" },
      { name: "Spring Security & JWT", mastery: 10, status: "Missing" }
    ]
  },
  {
    id: "skill-systemdesign",
    name: "System Design & Architecture",
    shortName: "System Design",
    category: "Core Technical",
    current: 25,
    target: 65,
    gap: 40,
    status: "Missing",
    priority: "HIGH",
    trend: "Needs Focus",
    color: "#EF4444",
    assessmentScore: 25,
    problemSolving: 20,
    practiceConsistency: 15,
    impact: "HIGH impact on SDE-1 interview readiness",
    dependencies: ["Networks", "Databases", "Distributed Basics"],
    nextTopic: "Caching, Load Balancing & Database Sharding",
    recommendation: "Study high-level architecture case studies (URL Shortener, Notification System).",
    topics: [
      { name: "Scalability & Load Balancing", mastery: 30, status: "Weak" },
      { name: "Caching (Redis/Memcached)", mastery: 25, status: "Weak" },
      { name: "Database Sharding & Replication", mastery: 20, status: "Missing" },
      { name: "Microservices vs Monolith", mastery: 35, status: "Weak" }
    ]
  }
];

export const initialRecommendations = [
  {
    id: "rec-1",
    priority: "HIGH",
    title: "DSA Competency Gap",
    description: "DSA competency (42%) is significantly below the 80% benchmark required for Software Developer placements.",
    actionText: "View Skill Gap",
    targetRoute: "skill-gap",
    metric: "42% / 80%",
    category: "Technical Competency",
    statusKey: "dsa_low"
  },
  {
    id: "rec-2",
    priority: "MEDIUM",
    title: "SQL Query Performance",
    description: "SQL performance has declined in recent assessments (-3% drop). Re-test your indexing knowledge.",
    actionText: "Take Assessment",
    targetRoute: "assessments",
    metric: "74% / 75%",
    category: "Assessment Drill",
    statusKey: "sql_review"
  },
  {
    id: "rec-3",
    priority: "LOW",
    title: "Portfolio Resume Alignment",
    description: "Add a Spring Boot backend project to increase your resume match score from 72% to 85%+.",
    actionText: "View Recommendation",
    targetRoute: "resume-analysis",
    metric: "72% Match",
    category: "Career Readiness",
    statusKey: "resume_spring"
  }
];

export const initialWeeklyTasks = [
  { id: "task-1", day: "Monday", title: "Arrays & Searching Techniques", category: "DSA", duration: "30 minutes", priority: "HIGH", status: "In Progress", completed: false },
  { id: "task-2", day: "Monday", title: "Java OOP & Polymorphism Refresher", category: "Java", duration: "30 minutes", priority: "MEDIUM", status: "Pending", completed: false },
  { id: "task-3", day: "Tuesday", title: "SQL Complex Joins & Subqueries", category: "SQL", duration: "20 minutes", priority: "MEDIUM", status: "Pending", completed: false },
  { id: "task-4", day: "Wednesday", title: "Linked List Reversal & Fast/Slow Pointers", category: "DSA", duration: "45 minutes", priority: "HIGH", status: "Pending", completed: false },
  { id: "task-5", day: "Thursday", title: "Spring Boot REST API Controller Setup", category: "Backend", duration: "45 minutes", priority: "HIGH", status: "Pending", completed: false },
  { id: "task-6", day: "Friday", title: "React Context API & Custom Hooks", category: "Frontend", duration: "30 minutes", priority: "LOW", status: "Pending", completed: false },
  { id: "task-7", day: "Saturday", title: "DSA Fundamentals Assessment Drill", category: "Assessment", duration: "20 minutes", priority: "HIGH", status: "Pending", completed: false },
  { id: "task-8", day: "Sunday", title: "Weekly Revision & Mock Interview Prep", category: "Career", duration: "40 minutes", priority: "LOW", status: "Pending", completed: false }
];

export const initialCompetencyTree = {
  role: "SOFTWARE DEVELOPER",
  readiness: 74,
  required: 85,
  branches: [
    {
      id: "branch-dsa",
      name: "Data Structures & Algorithms",
      status: "Weak",
      color: "#EF4444",
      score: 42,
      nodes: [
        { id: "node-dsa-1", name: "Arrays & Searching", status: "strong", score: 65, desc: "Two Pointers, Binary Search, Prefix Sums" },
        { id: "node-dsa-2", name: "Strings Manipulation", status: "strong", score: 60, desc: "Sliding Window, Anagrams, Pattern Match" },
        { id: "node-dsa-3", name: "Linked Lists", status: "moderate", score: 55, desc: "Singly/Doubly, Reversal, Cycle Detection" },
        { id: "node-dsa-4", name: "Trees & BST", status: "weak", score: 28, desc: "Traversals, Lowest Common Ancestor, Height" },
        { id: "node-dsa-5", name: "Graphs & Algorithms", status: "missing", score: 20, desc: "BFS, DFS, Dijkstra, Topological Sort" }
      ]
    },
    {
      id: "branch-java",
      name: "Java & OOP Ecosystem",
      status: "Moderate",
      color: "#F59E0B",
      score: 68,
      nodes: [
        { id: "node-java-1", name: "OOP Principles", status: "strong", score: 85, desc: "Encapsulation, Inheritance, Polymorphism" },
        { id: "node-java-2", name: "Collections Framework", status: "moderate", score: 72, desc: "HashMap, ArrayList, Set, Comparators" },
        { id: "node-java-3", name: "Exception Handling", status: "strong", score: 80, desc: "Checked/Unchecked, Custom Exceptions" },
        { id: "node-java-4", name: "Spring Boot Basics", status: "missing", score: 30, desc: "DI, Annotations, Embedded Tomcat" }
      ]
    },
    {
      id: "branch-db",
      name: "Database Architecture",
      status: "Good",
      color: "#10B981",
      score: 74,
      nodes: [
        { id: "node-db-1", name: "SQL DDL / DML", status: "strong", score: 82, desc: "Queries, Aggregations, Group By" },
        { id: "node-db-2", name: "Complex Joins", status: "strong", score: 78, desc: "Inner, Outer, Cross, Self Joins" },
        { id: "node-db-3", name: "Query Optimization", status: "moderate", score: 55, desc: "EXPLAIN plans, Indexes, Normalization" }
      ]
    },
    {
      id: "branch-eng",
      name: "Software Engineering & Tools",
      status: "Moderate",
      color: "#6366F1",
      score: 62,
      nodes: [
        { id: "node-eng-1", name: "Git Version Control", status: "strong", score: 82, desc: "Branching, Pull Requests, Merge Workflows" },
        { id: "node-eng-2", name: "REST APIs", status: "moderate", score: 45, desc: "HTTP Verbs, Status Codes, JSON payloads" },
        { id: "node-eng-3", name: "System Design", status: "missing", score: 25, desc: "Caching, Load Balancers, Horizontal Scaling" }
      ]
    }
  ]
};

export const initialAssessmentsCatalog = [
  {
    id: "assess-dsa-1",
    title: "DSA Fundamentals Assessment",
    category: "Data Structures & Algorithms",
    questionsCount: 10,
    durationMinutes: 20,
    difficulty: "Medium",
    topics: ["Arrays", "Searching", "Linked Lists", "Complexity Analysis"],
    status: "Recommended",
    badgeColor: "danger",
    description: "Evaluates your core understanding of array manipulations, time complexity, and linked list traversals for Software Developer placement readiness."
  },
  {
    id: "assess-sql-1",
    title: "SQL & Query Optimization Drill",
    category: "Database Systems",
    questionsCount: 8,
    durationMinutes: 15,
    difficulty: "Medium",
    topics: ["Joins", "Grouping", "Indexes", "Subqueries"],
    status: "Recommended",
    badgeColor: "warning",
    description: "Sharpen your analytical SQL queries, indexing strategies, and database execution planning."
  },
  {
    id: "assess-java-1",
    title: "Java OOP & Concurrency Challenge",
    category: "Programming Languages",
    questionsCount: 12,
    durationMinutes: 25,
    difficulty: "Hard",
    topics: ["Polymorphism", "Generics", "Threads", "Memory Model"],
    status: "Recommended",
    badgeColor: "primary",
    description: "Deep test on object-oriented architecture, memory management, and multi-threaded synchronization in Java."
  }
];

export const initialCompletedAssessments = [
  { id: "comp-1", title: "DSA Basics Diagnostic", category: "DSA", date: "2024-05-14", score: 42, totalMarks: 100, status: "Passed", feedback: "Strong in linear search; struggling with Linked List pointer manipulation and space complexity." },
  { id: "comp-2", title: "SQL Basics & Schema Design", category: "DBMS", date: "2024-05-22", score: 74, totalMarks: 100, status: "Passed", feedback: "Proficient in multi-table joins. Minor errors in nested correlated queries." },
  { id: "comp-3", title: "Java OOP Concepts", category: "Java", date: "2024-06-02", score: 68, totalMarks: 100, status: "Passed", feedback: "Good grasp of class structures and inheritance. Review abstract interfaces." }
];

export const dsaQuizQuestions = [
  {
    id: 1,
    question: "What is the worst-case time complexity of searching an element in an unsorted array of size N?",
    codeSnippet: `int search(int arr[], int n, int x) {\n    for (int i = 0; i < n; i++)\n        if (arr[i] == x) return i;\n    return -1;\n}`,
    options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
    correctIndex: 2,
    explanation: "In the worst case, the target element is at the end of the unsorted array or not present at all, requiring N comparisons: O(N)."
  },
  {
    id: 2,
    question: "Which data structure operates on a Last In First Out (LIFO) principle?",
    options: ["Queue", "Stack", "Binary Tree", "Priority Queue"],
    correctIndex: 1,
    explanation: "A Stack pushes elements to the top and pops them from the top, strictly following LIFO."
  },
  {
    id: 3,
    question: "What is the time complexity of inserting a node at the head of a Singly Linked List with a known head pointer?",
    options: ["O(1)", "O(N)", "O(log N)", "O(N^2)"],
    correctIndex: 0,
    explanation: "Prepending to a linked list only requires updating the new node's next pointer and head pointer, taking constant O(1) time."
  },
  {
    id: 4,
    question: "In two-pointer technique for a sorted array, if arr[left] + arr[right] < target, what should you do to find the pair?",
    options: ["Decrement right pointer", "Increment left pointer", "Reset both pointers", "Multiply target by 2"],
    correctIndex: 1,
    explanation: "Because the array is sorted, incrementing the left pointer yields a larger sum closer to the target."
  },
  {
    id: 5,
    question: "Which of the following algorithms has an average time complexity of O(N log N) and is not in-place in its standard form?",
    options: ["Quick Sort", "Bubble Sort", "Merge Sort", "Insertion Sort"],
    correctIndex: 2,
    explanation: "Merge Sort guarantees O(N log N) time in all cases but requires O(N) auxiliary space to merge subarrays."
  },
  {
    id: 6,
    question: "What is the primary condition required to execute Binary Search on a collection?",
    options: ["Elements must be linked together", "Collection must be sorted", "Collection size must be even", "All elements must be positive"],
    correctIndex: 1,
    explanation: "Binary Search relies on monotonic ordering (sorted elements) to eliminate half the search space in each step."
  },
  {
    id: 7,
    question: "How do you detect a cycle in a Singly Linked List in O(N) time and O(1) space?",
    options: ["Breadth First Search", "Floyd's Tortoise and Hare (Slow/Fast Pointers)", "Dijkstra's Algorithm", "Store all addresses in an array"],
    correctIndex: 1,
    explanation: "Floyd's algorithm uses a slow pointer (1 step) and fast pointer (2 steps). If there is a cycle, they will collide in O(N) time without extra memory."
  },
  {
    id: 8,
    question: "What is the maximum number of nodes in a Binary Tree of height H (where height of root node = 1)?",
    options: ["2^H", "2^H - 1", "2^(H-1)", "H^2"],
    correctIndex: 1,
    explanation: "A complete binary tree of height H has sum_{i=0}^{H-1} 2^i = 2^H - 1 nodes."
  },
  {
    id: 9,
    question: "What data structure is optimal for implementing an LRU (Least Recently Used) Cache with O(1) get and put?",
    options: ["Array and Stack", "Hash Map + Doubly Linked List", "Binary Search Tree", "Queue + Min Heap"],
    correctIndex: 1,
    explanation: "A Hash Map provides O(1) lookup to nodes in a Doubly Linked List, which allows O(1) removal and insertion at the head."
  },
  {
    id: 10,
    question: "Given an array of size N, what is the auxiliary space complexity of an in-place array reversal?",
    options: ["O(N)", "O(log N)", "O(1)", "O(N^2)"],
    correctIndex: 2,
    explanation: "In-place reversal only swaps elements using a single temporary variable, achieving O(1) auxiliary space."
  }
];

export const initialRoadmapPhases = [
  {
    id: "phase-1",
    name: "Phase 1: Programming Foundations",
    duration: "4 Weeks",
    status: "Completed",
    progress: 100,
    badgeColor: "success",
    skills: ["Java Core", "Memory Model", "Git & GitHub", "Clean Code"],
    tasksCount: 14,
    completedTasks: 14,
    description: "Solidify core language mechanics, object-oriented design patterns, version control workflows, and debugging."
  },
  {
    id: "phase-2",
    name: "Phase 2: DSA Foundations (Arrays, Lists, Stacks)",
    duration: "5 Weeks",
    status: "In Progress",
    progress: 68,
    badgeColor: "primary",
    skills: ["Linear Data Structures", "Two Pointers", "Hashing", "Complexity"],
    tasksCount: 18,
    completedTasks: 12,
    description: "Master foundational linear data structures, pointer mechanics, and LeetCode easy/medium problem archetypes."
  },
  {
    id: "phase-3",
    name: "Phase 3: Intermediate DSA (Trees, Graphs, DP)",
    duration: "6 Weeks",
    status: "Pending",
    progress: 25,
    badgeColor: "warning",
    skills: ["Binary Trees", "BST", "Graph BFS/DFS", "Dynamic Programming Basics"],
    tasksCount: 22,
    completedTasks: 5,
    description: "Conquer hierarchical data structures, recursion, graph traversals, and memoization patterns."
  },
  {
    id: "phase-4",
    name: "Phase 4: Backend & Enterprise Development",
    duration: "6 Weeks",
    status: "Pending",
    progress: 35,
    badgeColor: "warning",
    skills: ["Spring Boot", "RESTful Architecture", "JPA/Hibernate", "PostgreSQL"],
    tasksCount: 20,
    completedTasks: 7,
    description: "Build robust full-stack production backend microservices with database persistence and JWT authentication."
  },
  {
    id: "phase-5",
    name: "Phase 5: Technical Interview & Placement Readiness",
    duration: "4 Weeks",
    status: "Upcoming",
    progress: 10,
    badgeColor: "secondary",
    skills: ["System Design", "Mock Coding Interviews", "Behavioral STAR", "ATS Resume"],
    tasksCount: 16,
    completedTasks: 2,
    description: "Simulate live whiteboarding, high-level system design rounds, and HR behavioral assessments."
  }
];

export const initialResumeAnalysis = {
  targetRole: "Software Developer",
  matchScore: 72,
  atsStatus: "Good Potential",
  summary: "Your profile shows solid programming fundamentals and database foundations. Adding Spring Boot microservices, REST API integration, and verifiable DSA problem-solving benchmarks will elevate your resume to 88%+ match score.",
  matchedSkills: [
    { name: "Java Programming", score: 85, category: "Language" },
    { name: "SQL & Relational DBs", score: 80, category: "Database" },
    { name: "Git Version Control", score: 90, category: "Tools" },
    { name: "React Frontend", score: 75, category: "Web" },
    { name: "Data Structures", score: 65, category: "Core" }
  ],
  missingSkills: [
    { name: "Spring Boot Microservices", impact: "High", advice: "Add a complete CRUD REST service with Spring Boot & Docker." },
    { name: "REST API Design & Swagger", impact: "High", advice: "Document endpoints using OpenAPI / Swagger specifications." },
    { name: "DSA LeetCode Evidence", impact: "High", advice: "Add verified badge showing 150+ solved problems on LeetCode/HackerRank." },
    { name: "System Design Basics", impact: "Medium", advice: "Include brief architecture notes (Caching, CDN, Load Balancer) in project descriptions." }
  ],
  strengths: [
    "Clean project structure and good GitHub commit consistency.",
    "Strong relational database query formulation (Joins, Aggregations).",
    "Balanced academic CGPA (7.8) with positive trajectory across semesters."
  ],
  actionableFixes: [
    "Quantify project achievements with metrics (e.g., 'Reduced query latency by 35%').",
    "Add live demo links and verified GitHub repositories for all portfolio projects.",
    "Replace generic summary with targeted AI/Full-Stack Software Developer value proposition."
  ]
};

export const initialInterviewReadiness = {
  overallReadiness: 74,
  benchmarkTarget: 85,
  domains: [
    { name: "DSA", score: 42, max: 100, status: "Needs Work", color: "#EF4444" },
    { name: "Java OOP", score: 75, max: 100, status: "Ready", color: "#10B981" },
    { name: "DBMS & SQL", score: 76, max: 100, status: "Ready", color: "#10B981" },
    { name: "OS & Concurrency", score: 71, max: 100, status: "Moderate", color: "#F59E0B" },
    { name: "Computer Networks", score: 83, max: 100, status: "Strong", color: "#10B981" },
    { name: "Projects & Architecture", score: 68, max: 100, status: "Moderate", color: "#F59E0B" },
    { name: "Resume Impact", score: 72, max: 100, status: "Moderate", color: "#F59E0B" },
    { name: "Communication & STAR", score: 80, max: 100, status: "Ready", color: "#10B981" }
  ],
  strongAreas: [
    "Computer Networks (OSI model, TCP/IP handshake, HTTP/HTTPS)",
    "Java OOP Architecture & Inheritance hierarchies",
    "Database Normalization and standard SQL Joins",
    "Behavioral interview STAR storytelling"
  ],
  weakAreas: [
    "Live algorithmic problem solving on Trees, Graphs & Dynamic Programming",
    "System Design scalability tradeoffs (Caching, Database Sharding)",
    "Spring Boot security and token-based auth implementation"
  ],
  recommendedDrills: [
    "Take 20-min timed DSA assessment on Trees & Searching.",
    "Practice mock system design explanation: Design a URL Shortener.",
    "Conduct live mock interview on Java Multithreading."
  ]
};

export const initialDocuments = [
  { id: "doc-1", name: "Alex_Morgan_Resume_2024.pdf", type: "Resume", size: "245 KB", uploadDate: "2024-05-10", status: "Processed", extractedData: { name: "Alex Morgan", gpa: "7.8", skillsCount: 14, projectsFound: 3 } },
  { id: "doc-2", name: "Semester_5_Grade_Card.pdf", type: "Marksheet", size: "512 KB", uploadDate: "2024-05-02", status: "Processed", extractedData: { semester: "5th", sgpa: "7.8", creditsEarned: 26, backlogCount: 0 } },
  { id: "doc-3", name: "Oracle_Java_SE8_Certificate.pdf", type: "Certificate", size: "1.2 MB", uploadDate: "2024-04-18", status: "Processed", extractedData: { issuer: "Oracle University", credentialId: "ORC-984210", score: "88%" } },
  { id: "doc-4", name: "Campus_Smart_Locker_SRS.pdf", type: "Project Document", size: "840 KB", uploadDate: "2024-03-25", status: "Processed", extractedData: { projectTitle: "Campus Smart Locker", stack: ["IoT", "React", "Node.js"], role: "Lead Developer" } }
];

export const initialProjects = [
  {
    id: "proj-1",
    title: "AI Campus Companion Platform",
    category: "Full Stack AI SaaS",
    techStack: ["React", "JavaScript", "CSS3", "Context API"],
    description: "Adaptive student intelligence dashboard with real-time skill gap diagnosis, dynamic study path adaptation, and competency mapping.",
    status: "Completed",
    impactScore: 92,
    githubUrl: "https://github.com/alexmorgan/ai-campus-companion"
  },
  {
    id: "proj-2",
    title: "Distributed Task Scheduler & Worker Pool",
    category: "Backend Systems",
    techStack: ["Java", "Multithreading", "SQLite", "REST"],
    description: "High-throughput asynchronous job execution engine with priority queue dispatching and failure retry mechanics.",
    status: "In Progress",
    impactScore: 78,
    githubUrl: "https://github.com/alexmorgan/task-scheduler"
  },
  {
    id: "proj-3",
    title: "Hospital Management DBMS with ACID Compliance",
    category: "Database Engineering",
    techStack: ["PostgreSQL", "SQL Views", "Stored Procedures"],
    description: "Normalized relational database schema with complex triggers, multi-table audit logs, and transaction isolation.",
    status: "Completed",
    impactScore: 84,
    githubUrl: "https://github.com/alexmorgan/hospital-dbms"
  }
];

export const initialCertifications = [
  { id: "cert-1", name: "Oracle Certified Associate: Java SE 8", issuer: "Oracle", issueDate: "Mar 2024", expiryDate: "No Expiry", credentialId: "OCA-99412", verified: true },
  { id: "cert-2", name: "Database Design & SQL Specialist", issuer: "Coursera / Stanford Online", issueDate: "Jan 2024", expiryDate: "No Expiry", credentialId: "DB-ST-7712", verified: true },
  { id: "cert-3", name: "Version Control with Git & GitHub", issuer: "Meta / Coursera", issueDate: "Nov 2023", expiryDate: "No Expiry", credentialId: "META-GIT-440", verified: true }
];

export const initialNotifications = [
  { id: "notif-1", title: "Skill Gap Identified", message: "DSA competency is at 42%. A 20-minute diagnostic drill is recommended.", time: "10 mins ago", type: "alert", read: false },
  { id: "notif-2", title: "Study Plan Sync", message: "Today's 'Arrays & Searching' task is scheduled for 30 minutes.", time: "1 hour ago", type: "info", read: false },
  { id: "notif-3", title: "Attendance Milestone", message: "Your attendance in Computer Networks reached 92% (Top 5%).", time: "Yesterday", type: "success", read: true },
  { id: "notif-4", title: "Semester Audit Ready", message: "Semester 5 CGPA (7.8) verified and added to Student Digital Twin.", time: "2 days ago", type: "info", read: true }
];

export const initialProgressHistory = {
  streak: 14,
  streakBest: 21,
  totalHoursStudied: 142,
  assessmentsCompleted: 12,
  monthlySkillTimeline: [
    { month: "June", dsa: 35, java: 60, sql: 70, overall: 65 },
    { month: "July", dsa: 48, java: 64, sql: 72, overall: 69 },
    { month: "August", dsa: 42, java: 68, sql: 74, overall: 71 }
  ],
  recentMilestones: [
    { title: "Completed Java OOP Module", date: "August 15", category: "Coursework" },
    { title: "Achieved 14-Day Study Streak", date: "August 18", category: "Consistency" },
    { title: "Uploaded Semester 5 Grade Card", date: "August 20", category: "Academic" }
  ]
};

export const sampleAiResponses = [
  {
    triggers: ["study today", "what to study", "daily plan", "today"],
    response: "Based on your current skill gap analysis, your highest priority is DSA (currently at {dsa}%). I recommend spending **45 minutes on Arrays & Searching** followed by **30 minutes on Java OOP Collections** today. This maximizes your ROI for Software Developer placement readiness."
  },
  {
    triggers: ["why is my readiness low", "readiness low", "readiness score", "overall readiness"],
    response: "Your overall Career Readiness is currently **{readiness}%** (target: 85%). The primary bottleneck holding it back is your **DSA competency ({dsa}%)** and missing **Spring Boot microservices experience**. Completing the DSA diagnostic assessment and adding a backend project will boost your readiness above 80%."
  },
  {
    triggers: ["which skill should i learn first", "learn first", "first priority", "highest priority"],
    response: "Your #1 priority is **Data Structures & Algorithms (DSA)**. It carries a 38% gap against placement criteria. Second priority is **Spring Boot & REST APIs** to elevate your resume match score from 72% to 85%+."
  },
  {
    triggers: ["how did my dsa improve", "dsa improve", "score improve", "assessment result"],
    response: "Your DSA score is currently **{dsa}%**. {dsaExplanation}"
  },
  {
    triggers: ["what am i missing", "missing for my target role", "target role", "software developer"],
    response: "For the **Software Developer** role (target 85%), you are currently missing:\n1. **Advanced DSA** (Trees, Graphs, DP)\n2. **Spring Boot & Microservices** (30% current)\n3. **System Design fundamentals** (Load Balancing, Caching, Sharding)\n4. **REST API Documentation** on your portfolio resume."
  },
  {
    triggers: ["create a 7-day study plan", "7-day study plan", "weekly plan", "schedule"],
    response: "Here is your adaptive 7-day high-yield study plan:\n- **Mon**: Arrays & Two-Pointer Patterns (45 mins)\n- **Tue**: Java Streams & Concurrency (30 mins)\n- **Wed**: Linked Lists & Cycle Detection (45 mins)\n- **Thu**: Spring Boot REST Controller & JPA (45 mins)\n- **Fri**: SQL Complex Joins & Query Execution (30 mins)\n- **Sat**: Timed Assessment Drill (30 mins)\n- **Sun**: Resume Project Revision & Mock Interview (45 mins)"
  }
];
