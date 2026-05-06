import api from "./apiConfig";
import type { DashboardStats } from "../types/api";

const dashboardService = {
  /**
   * Lấy thống kê tổng quan cho dashboard
   * Endpoint này cần tạo ở BE: GET /api/admin/dashboard/stats
   */
  getStats: () => {
    return api.get<DashboardStats>("/api/admin/dashboard/stats");
  },

  /**
   * Lấy dữ liệu biểu đồ doanh thu hàng tháng
   */
  getMonthlySales: (year?: number) => {
    return api.get("/api/admin/dashboard/monthly-sales", { params: { year } });
  },

  /**
   * Lấy dữ liệu đơn ứng tuyển gần đây
   */
  getRecentApplications: (limit = 10) => {
    return api.get("/api/admin/dashboard/recent-applications", { params: { limit } });
  },
};

export default dashboardService;
