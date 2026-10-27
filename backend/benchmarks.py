"""
Role Benchmarks and Competency Standards.
Defines industry-aligned target proficiency benchmarks, weights, and prerequisite dependencies.
Benchmark definitions are decoupled from individual student records.
"""

from typing import Dict, Any, List

ROLE_BENCHMARKS: Dict[str, Dict[str, Any]] = {
    "software-developer": {
        "role_name": "Software Developer",
        "description": "Full-Stack & Backend Software Engineer across enterprise and product teams",
        "overall_target": 80.0,
        "skills": {
            "skill-dsa": {
                "name": "Data Structures & Algorithms",
                "short_name": "DSA",
                "target_score": 80.0,
                "importance_weight": 1.0,
                "prerequisites": [],
                "is_foundational": True,
                "topics": ["Arrays", "Strings", "Linked Lists", "Trees & BST", "Dynamic Programming", "Graphs"]
            },
            "skill-java": {
                "name": "Java Core & OOP",
                "short_name": "Java",
                "target_score": 80.0,
                "importance_weight": 0.85,
                "prerequisites": [],
                "is_foundational": True,
                "topics": ["OOP Principles", "Collections Framework", "Exception Handling", "Streams", "Multithreading"]
            },
            "skill-sql": {
                "name": "SQL & Relational Databases",
                "short_name": "SQL",
                "target_score": 75.0,
                "importance_weight": 0.75,
                "prerequisites": [],
                "is_foundational": False,
                "topics": ["Complex Joins", "Normalization", "Indexing & Execution Plans", "Transactions & ACID"]
            },
            "skill-react": {
                "name": "React & Frontend Architecture",
                "short_name": "React",
                "target_score": 75.0,
                "importance_weight": 0.70,
                "prerequisites": [],
                "is_foundational": False,
                "topics": ["Components & Props", "Hooks", "Context API", "Routing & Performance"]
            },
            "skill-git": {
                "name": "Git & Version Control",
                "short_name": "Git",
                "target_score": 70.0,
                "importance_weight": 0.60,
                "prerequisites": [],
                "is_foundational": False,
                "topics": ["Branching & Merging", "Rebase & Conflict Fixes", "Workflows & Remotes"]
            },
            "skill-python": {
                "name": "Python Programming",
                "short_name": "Python",
                "target_score": 75.0,
                "importance_weight": 0.70,
                "prerequisites": [],
                "is_foundational": False,
                "topics": ["Built-in Data Structures", "OOP & Modules", "File I/O & Scripting"]
            },
            "skill-springboot": {
                "name": "Spring Boot & Microservices",
                "short_name": "Spring Boot",
                "target_score": 75.0,
                "importance_weight": 0.85,
                "prerequisites": ["Java Core & OOP"],
                "is_foundational": False,
                "topics": ["Spring Core & DI", "REST Controllers", "Spring Data JPA", "Spring Security"]
            },
            "skill-systemdesign": {
                "name": "System Design & Architecture",
                "short_name": "System Design",
                "target_score": 65.0,
                "importance_weight": 0.90,
                "prerequisites": ["SQL & Relational Databases"],
                "is_foundational": False,
                "topics": ["Scalability & Load Balancing", "Caching (Redis)", "Database Sharding", "Microservices vs Monolith"]
            }
        }
    }
}


def get_role_benchmark(role_slug: str = "software-developer") -> Dict[str, Any]:
    """Retrieves target benchmark specification for a role, defaulting to software-developer."""
    normalized = role_slug.lower().strip().replace(" ", "-")
    return ROLE_BENCHMARKS.get(normalized, ROLE_BENCHMARKS["software-developer"])


def categorize_skill_status(current_score: float, target_score: float) -> str:
    """
    Categorizes student skill mastery based on configurable thresholds:
      - Mastered : current_score >= target_score or current_score >= 80.0
      - Moderate : gap <= 20.0 and current_score >= 50.0
      - Weak     : current_score >= 35.0 and current_score < 50.0
      - Missing  : current_score < 35.0 (or zero attempt)
    """
    gap = max(0.0, target_score - current_score)
    if current_score >= target_score or current_score >= 80.0:
        return "Mastered"
    elif gap <= 20.0 and current_score >= 50.0:
        return "Moderate"
    elif current_score >= 35.0:
        return "Weak"
    else:
        return "Missing"
