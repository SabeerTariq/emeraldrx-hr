import axios from "axios";

/**
 * API client configuration
 * Centralized axios instance for API calls
 */
const getApiBaseURL = () => {
  // Always check environment variable first (set at build time)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // In browser
  if (typeof window !== "undefined") {
    // In development, use localhost
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return "http://localhost:5000/api";
    }
    
    // In production/staging without env var, use relative URL
    // This assumes API is proxied via Next.js rewrites (see next.config.js)
    // If backend is on different server, you MUST set NEXT_PUBLIC_API_URL
    return "/api";
  }
  
  // Server-side: default to localhost
  return "http://localhost:5000/api";
};

const api = axios.create({
  baseURL: getApiBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

