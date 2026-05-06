import axios from "axios";

// =============================================
// API Configuration — Centralized
// =============================================

/**
 * Base URL cho .NET Backend API
 * Tất cả service files sẽ import từ đây thay vì hardcode URL
 */
export const API_BASE_URL = "https://localhost:7099";

/**
 * Axios instance với cấu hình mặc định:
 * - BaseURL trỏ đến .NET Backend
 * - Tự động gắn JWT token vào header
 * - Tự động redirect về /signin khi token hết hạn (401)
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request Interceptor: Gắn token vào mọi request ──
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: Xử lý 401 Unauthorized ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ → clear session, redirect
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
      localStorage.removeItem("fullName");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export default api;
