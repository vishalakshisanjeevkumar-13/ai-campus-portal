/**
 * Centralized API configuration for AI Campus Companion Frontend.
 * Reads the deployed backend URL from Vite environment variable VITE_API_BASE_URL,
 * defaulting to local development backend (http://127.0.0.1:8000).
 */

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

// Ensure trailing slash is stripped for uniform endpoint concatenation
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "");
