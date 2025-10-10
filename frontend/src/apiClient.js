import axios from "axios";

const API_BASE = "https://telugu-info-website-bckend1.onrender.com";

function isJwtExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);
    return typeof payload.exp === "number" && payload.exp <= now;
  } catch {
    return true;
  }
}

function getToken() {
  try {
    return localStorage.getItem("token") || "";
  } catch {
    return "";
  }
}

function clearTokenAndRedirect() {
  try { localStorage.removeItem("token"); } catch {}
  // Optional: window.location.href = "/login";
}

function isPublicRequest(method, url) {
  const path = url.replace(API_BASE, "");
  const publicAllMethods = [
    "/api/auth/login",
    "/api/auth/forgot-password",
    "/api/auth/reset-password",
    "/api/courses" // allow public course creation
  ];
  const publicGetOnly = [
    "/api/courses",
    "/api/courses-featured",
    "/api/courses/", // covers /api/courses/:id and /api/courses/:id/share
    "/api/quiz",
    "/api/feedback",
  ];
  if (publicAllMethods.some(prefix => path.startsWith(prefix))) return true;
  return (method || "get").toLowerCase() === "get" && publicGetOnly.some(prefix => path.startsWith(prefix));
}

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const fullUrl = (config.baseURL || "") + (config.url || "");
    const method = (config.method || "get").toLowerCase();
    if (!isPublicRequest(method, fullUrl)) {
      const token = getToken();
      if (!token || isJwtExpired(token)) {
        clearTokenAndRedirect();
        return Promise.reject(new Error("NO_AUTH_TOKEN"));
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      clearTokenAndRedirect();
    } else if (status === 403) {
      // Handle forbidden globally if desired
    }
    return Promise.reject(error);
  }
);

export default api;


