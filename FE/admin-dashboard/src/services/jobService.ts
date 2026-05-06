import api from "./apiConfig";

const jobService = {
  /**
   * Lấy danh sách danh mục nghề nghiệp
   */
  getCategories: () => {
    return api.get("/api/jobs/categories");
  },

  /**
   * Tạo bài đăng tuyển dụng mới (FormData cho upload ảnh)
   */
  createJobPost: (formData: FormData) => {
    return api.post("/admin/JobPosts/jobpost", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default jobService;
