/**
 * Format thời gian tương đối (VD: "5 phút trước", "2 ngày trước")
 * Dùng chung cho NotificationDropdown và AllNotificationsPage
 */
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return "Vừa xong";
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;

  return date.toLocaleDateString("vi-VN");
};

/**
 * Format thời gian chi tiết hơn — dùng cho AllNotificationsPage
 */
export const formatTimeDetailed = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return "Vừa xong";
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format số tiền VND
 */
export const formatCurrency = (amount: string | number): string => {
  const num = typeof amount === "string" ? parseInt(amount) : amount;
  return num.toLocaleString("vi-VN") + "đ";
};

/**
 * Lấy icon theo loại thông báo
 */
export const getNotificationIcon = (type: string): string => {
  const icons: Record<string, string> = {
    new_application: "📄",
    new_message: "💬",
    application_status: "✅",
  };
  return icons[type] || "📢";
};

/**
 * Lấy badge style cho status ứng viên
 */
export const getStatusBadgeConfig = (status: string) => {
  const badges: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Chờ xử lý" },
    approved: { bg: "bg-green-100", text: "text-green-800", label: "Đã chấp nhận" },
    rejected: { bg: "bg-red-100", text: "text-red-800", label: "Đã từ chối" },
    responded: { bg: "bg-blue-100", text: "text-blue-800", label: "Đã phản hồi" },
  };
  return badges[status] || badges.pending;
};
