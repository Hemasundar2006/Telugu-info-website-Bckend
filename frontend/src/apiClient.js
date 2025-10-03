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
  const publicPrefixes = [
    "/api/courses",
    "/api/courses-featured",
    "/api/quiz",
    "/api/feedback",
    "/api/auth/forgot-password",
    "/api/auth/reset-password",
  ];
  const isPublicPath = publicPrefixes.some(prefix => path.startsWith(prefix));
  // Only treat these as public for safe, read-only GET requests
  return (method || "get").toLowerCase() === "get" && isPublicPath;
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


