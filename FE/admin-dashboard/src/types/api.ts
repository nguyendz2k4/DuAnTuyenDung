// =============================================
// API Response Types — Shared across services
// =============================================

// ── Auth ──
export interface LoginResponse {
  token: string;
  user: {
    id: number;
    userId?: number;
    fullName: string;
    email: string;
    userName: string;
    avatar?: string;
    role: string;
  };
}

// ── User Management ──
export interface UserListItem {
  user_id: number;
  username: string;
  email: string;
  role: "job_seeker" | "employer" | "admin";
  status: number;
  created_at: string;
}

export interface UserDetailInfo {
  user_id: number;
  username: string;
  email: string;
  role: string;
  status: number;
  created_at: string;
  full_name?: string;
  date_of_birth?: string;
  gender?: string;
  phone?: string;
  address?: string;
  bio?: string;
  education_level?: string;
  experience_years?: number;
  skills?: string;
  company_name?: string;
  company_website?: string;
  company_address?: string;
  company_phone?: string;
  company_description?: string;
}

// ── Job Post ──
export interface JobCategory {
  category_id: number;
  name: string;
  description: string;
}

export interface JobPostPayload {
  employerId: number;
  title: string;
  requirements: string;
  location: string;
  salaryRange: string;
  quantity: number;
  categoryId: number;
  education: string;
  level: string;
  workForm: string;
  description: string;
  isFeatured: boolean;
  imageFile?: File;
}

// ── Applications ──
export interface ApplicationItem {
  application_id: number;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  job_title: string;
  status: "pending" | "approved" | "rejected" | "responded";
  applied_at: string;
  cover_letter?: string;
  cv_path?: string;
  seeker_id?: number;
}

// ── Notifications ──
export interface NotificationItem {
  notification_id: number;
  title: string;
  content: string;
  type: "new_application" | "new_message" | "application_status";
  is_read: number;
  created_at: string;
}

export interface NotificationResponse {
  success: boolean;
  data: NotificationItem[];
  unread_count: number;
}

// ── Messages ──
export interface MessageItem {
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: string;
}

// ── Packages ──
export interface PackageItem {
  package_id: number;
  name: string;
  description: string;
  price: string;
  duration_days: number;
  features: string; // JSON string
}

// ── Dashboard Stats ──
export interface DashboardStats {
  totalUsers: number;
  totalJobPosts: number;
  totalApplications: number;
  totalEmployers: number;
  userGrowthPercent?: number;
  jobGrowthPercent?: number;
}

// ── User Profile ──
export interface UserProfile {
  fullName: string | null;
  avatar: string | null;
  accountType: string | null;
  status: number | null;
  phone: string | null;
  address: string | null;
  companyName: string | null;
  companyWebsite: string | null;
  companySize: string | null;
  nameIndustry: string | null;
  companyAddress: string | null;
  companyPhone: string | null;
  logo: string | null;
  description: string | null;
}

// ── Generic API Response ──
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}
