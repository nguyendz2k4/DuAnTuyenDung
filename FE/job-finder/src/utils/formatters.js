/**
 * Format ngày tháng theo locale Việt Nam
 * @param {string|Date} dateInput - Ngày cần format
 * @returns {string} Ngày đã format (dd/mm/yyyy)
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return "N/A";
  return new Date(dateInput).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/**
 * Parse text dạng paragraph thành mảng các dòng
 * Dùng để render danh sách mô tả, yêu cầu công việc
 * 
 * @param {string} text - Đoạn text cần parse
 * @returns {string[]} Mảng các dòng đã tách
 */
export const parseText = (text) => {
  if (!text) return [];
  const safeText = String(text);
  // Tách theo dòng mới trước
  let items = safeText
    .split("\n")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
  // Nếu chỉ có 1 dòng, thử tách theo dấu chấm
  if (items.length <= 1) {
    items = safeText
      .split(".")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  }
  return items.length > 0 ? items : [safeText];
};

/**
 * Format số tiền theo locale Việt Nam
 * @param {number|string} amount - Số tiền
 * @returns {string} Số tiền đã format (1,000,000đ)
 */
export const formatCurrency = (amount) => {
  if (!amount) return "0đ";
  return parseInt(amount).toLocaleString("vi-VN") + "đ";
};

/**
 * Lấy label trạng thái ứng tuyển
 * @param {string} status - Mã trạng thái
 * @returns {string} Label hiển thị
 */
export const getStatusLabel = (status) => {
  if (!status) return "Đang xử lý";
  return status;
};
