import api from "./apiConfig";
import type { NotificationResponse } from "../types/api";

const notificationService = {
  /**
   * Lấy danh sách thông báo
   */
  getNotifications: (userId: number, limit = 20, unreadOnly = false) => {
    return api.get<NotificationResponse>("/api/admin/notifications", {
      params: { user_id: userId, limit, unread_only: unreadOnly ? 1 : undefined },
    });
  },

  /**
   * Đánh dấu 1 thông báo đã đọc
   */
  markAsRead: (userId: number, notificationId: number) => {
    return api.post("/api/admin/notifications/read", {
      user_id: userId,
      notification_id: notificationId,
    });
  },

  /**
   * Đánh dấu tất cả thông báo đã đọc
   */
  markAllAsRead: (userId: number) => {
    return api.post("/api/admin/notifications/read-all", {
      user_id: userId,
      mark_all: true,
    });
  },
};

export default notificationService;
