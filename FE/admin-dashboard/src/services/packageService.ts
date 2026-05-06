import api from "./apiConfig";

const packageService = {
  /**
   * Lấy danh sách gói dịch vụ TopCV Pro
   */
  getPackages: () => {
    return api.get("/api/admin/packages");
  },

  /**
   * Đăng ký gói dịch vụ
   */
  registerPackage: (data: {
    user_id: number;
    package_id: number;
    payment_method: string;
    amount: string;
  }) => {
    return api.post("/api/admin/packages/register", data);
  },
};

export default packageService;
