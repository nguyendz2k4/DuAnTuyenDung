// =============================================
// FILTER OPTIONS - Dùng cho trang HomePage
// =============================================

export const FILTER_TYPES = ["Địa điểm", "Mức lương", "Kinh nghiệm", "Ngành nghề"];

export const LOCATIONS = [
  "Ngẫu nhiên",
  "Hà Nội",
  "Thành phố Hồ Chí Minh",
  "Miền Bắc",
  "Miền Nam",
];

export const SALARY_OPTIONS = [
  "Tất cả",
  "10-15 triệu",
  "15-20 triệu",
  "20-25 triệu",
  "25-40 triệu",
  "Trên 40 triệu",
  "Thỏa thuận",
];

export const EXP_OPTIONS = [
  "Tất cả",
  "Chưa có kinh nghiệm",
  "1 năm trở xuống",
  "1 năm trở lên",
  "Đại học",
  "Cao đẳng",
];

// Các field thuộc loại "education" chứ không phải "experience"
export const EDUCATION_VALUES = ["Đại học", "Cao đẳng"];

// =============================================
// APPLICATION STATUS - Dùng cho trang AppliedJobs
// =============================================

export const APPLICATION_FILTERS = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Đang xử lý" },
  { key: "viewed", label: "NTD đã xem" },
  { key: "accepted", label: "Phù hợp" },
  { key: "rejected", label: "Từ chối" },
];

// =============================================
// PAGINATION
// =============================================

export const DEFAULT_PAGE_SIZE = 12;
export const APPLIED_JOBS_PAGE_SIZE = 10;
