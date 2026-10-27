"""
Server-Side Assessment Catalog and Secure Answer Keys.
CRITICAL: Correct answers are NEVER exposed to the client prior to submission.
All evaluation occurs strictly on the backend.
"""

from typing import Dict, Any, List, Optional

ASSESSMENT_CATALOG: Dict[str, Dict[str, Any]] = {
    "assess-dsa-1": {
        "id": "assess-dsa-1",
        "title": "DSA Fundamentals Assessment",
        "skill_id": "skill-dsa",
        "skill_name": "Data Structures & Algorithms",
        "total_questions": 10,
        "duration_minutes": 20,
        "difficulty": "Medium",
        "questions": [
            {
                "id": 1,
                "question": "What is the worst-case time complexity of searching an element in an unsorted array of size N?",
                "codeSnippet": "int search(int arr[], int n, int x) {\n    for (int i = 0; i < n; i++)\n        if (arr[i] == x) return i;\n    return -1;\n}",
                "options": ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
                "correct_index": 2,
                "explanation": "In the worst case, the target element is at the end of the unsorted array or not present at all, requiring N comparisons: O(N)."
            },
            {
                "id": 2,
                "question": "Which data structure operates on a Last In First Out (LIFO) principle?",
                "options": ["Queue", "Stack", "Binary Tree", "Priority Queue"],
                "correct_index": 1,
                "explanation": "A Stack pushes elements to the top and pops them from the top, strictly following LIFO."
            },
            {
                "id": 3,
                "question": "What is the time complexity of inserting a node at the head of a Singly Linked List with a known head pointer?",
                "options": ["O(1)", "O(N)", "O(log N)", "O(N^2)"],
                "correct_index": 0,
                "explanation": "Prepending to a linked list only requires updating the new node's next pointer and head pointer, taking constant O(1) time."
            },
            {
                "id": 4,
                "question": "In two-pointer technique for a sorted array, if arr[left] + arr[right] < target, what should you do to find the pair?",
                "options": ["Decrement right pointer", "Increment left pointer", "Reset both pointers", "Multiply target by 2"],
                "correct_index": 1,
                "explanation": "Because the array is sorted, incrementing the left pointer yields a larger sum closer to the target."
            },
            {
                "id": 5,
                "question": "Which of the following algorithms has an average time complexity of O(N log N) and is not in-place in its standard form?",
                "options": ["Quick Sort", "Bubble Sort", "Merge Sort", "Insertion Sort"],
                "correct_index": 2,
                "explanation": "Merge Sort guarantees O(N log N) time in all cases but requires O(N) auxiliary space to merge subarrays."
            },
            {
                "id": 6,
                "question": "What is the primary condition required to execute Binary Search on a collection?",
                "options": ["Elements must be linked together", "Collection must be sorted", "Collection size must be even", "All elements must be positive"],
                "correct_index": 1,
                "explanation": "Binary Search relies on monotonic ordering (sorted elements) to eliminate half the search space in each step."
            },
            {
                "id": 7,
                "question": "How do you detect a cycle in a Singly Linked List in O(N) time and O(1) space?",
                "options": ["Breadth First Search", "Floyd's Tortoise and Hare (Slow/Fast Pointers)", "Dijkstra's Algorithm", "Store all addresses in an array"],
                "correct_index": 1,
                "explanation": "Floyd's algorithm uses a slow pointer (1 step) and fast pointer (2 steps). If there is a cycle, they will collide in O(N) time without extra memory."
            },
            {
                "id": 8,
                "question": "What is the maximum number of nodes in a Binary Tree of height H (where height of root node = 1)?",
                "options": ["2^H", "2^H - 1", "2^(H-1)", "H^2"],
                "correct_index": 1,
                "explanation": "A complete binary tree of height H has sum_{i=0}^{H-1} 2^i = 2^H - 1 nodes."
            },
            {
                "id": 9,
                "question": "What data structure is optimal for implementing an LRU (Least Recently Used) Cache with O(1) get and put?",
                "options": ["Array and Stack", "Hash Map + Doubly Linked List", "Binary Search Tree", "Queue + Min Heap"],
                "correct_index": 1,
                "explanation": "A Hash Map provides O(1) lookup to nodes in a Doubly Linked List, which allows O(1) removal and insertion at the head."
            },
            {
                "id": 10,
                "question": "Given an array of size N, what is the auxiliary space complexity of an in-place array reversal?",
                "options": ["O(N)", "O(log N)", "O(1)", "O(N^2)"],
                "correct_index": 2,
                "explanation": "In-place reversal only swaps elements using a single temporary variable, achieving O(1) auxiliary space."
            }
        ]
    }
}


def get_assessment(assessment_id: str) -> Optional[Dict[str, Any]]:
    """Fetches full assessment details including questions and answer key."""
    return ASSESSMENT_CATALOG.get(assessment_id)


def get_client_assessment(assessment_id: str) -> Optional[Dict[str, Any]]:
    """Returns assessment questions stripped of correct answers and explanations for client-side rendering."""
    assessment = ASSESSMENT_CATALOG.get(assessment_id)
    if not assessment:
        return None

    sanitized_questions = []
    for q in assessment["questions"]:
        item = {
            "id": q["id"],
            "question": q["question"],
            "options": q["options"]
        }
        if "codeSnippet" in q:
            item["codeSnippet"] = q["codeSnippet"]
        sanitized_questions.append(item)

    return {
        "id": assessment["id"],
        "title": assessment["title"],
        "skill_id": assessment["skill_id"],
        "skill_name": assessment["skill_name"],
        "total_questions": assessment["total_questions"],
        "duration_minutes": assessment["duration_minutes"],
        "difficulty": assessment["difficulty"],
        "questions": sanitized_questions
    }
