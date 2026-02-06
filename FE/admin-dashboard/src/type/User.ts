export interface User {
    user_id: number;
    username: string;
    email: string;
    role: "job_seeker" | "employer" | "admin";
    status: number;
    created_at: string;
}

export interface UserDetail {
    user_id: number;
    username: string;
    email: string;
    role: "job_seeker" | "employer" | "admin";
    status: number;
    created_at: string;

    // Thông tin chi tiết từ bảng user_profiles
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
