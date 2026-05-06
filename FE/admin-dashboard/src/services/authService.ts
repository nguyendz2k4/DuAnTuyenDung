import api from "./apiConfig";
import type { LoginResponse } from "../types/api";

const authService = {
  /**
   * Đăng nhập Admin/Employer
   */
  adminLogin: (userName: string, password: string) => {
    return api.post<LoginResponse>("/api/Auth/admin-login", { userName, password });
  },

  /**
   * Lấy thông tin profile theo userId
   */
  getProfile: (userId: string) => {
    return api.get(`/admin/ProfileUser/${userId}`);
  },
};

export default authService;
