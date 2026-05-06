import api from "./apiConfig";

const userService = {
  /**
   * Lấy danh sách tất cả users
   */
  getUsers: () => {
    return api.get("/api/admin/users");
  },

  /**
   * Lấy chi tiết 1 user
   */
  getUserDetail: (userId: number) => {
    return api.get(`/api/admin/users/${userId}`);
  },

  /**
   * Xóa user
   */
  deleteUser: (userId: number) => {
    return api.delete(`/api/admin/users/${userId}`);
  },

  /**
   * Thêm tài khoản mới (FormData cho upload logo)
   */
  addUser: (formData: FormData) => {
    return api.post("/api/admin/users", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default userService;
