import api from "./apiConfig";

const applicationService = {
  /**
   * Lấy danh sách đơn ứng tuyển theo employer
   */
  getApplications: (employerId: number) => {
    return api.get(`/api/admin/applications`, { params: { employer_id: employerId } });
  },

  /**
   * Cập nhật trạng thái ứng viên
   */
  updateStatus: (applicationId: number, status: string) => {
    return api.post("/api/admin/applications/status", {
      application_id: applicationId,
      status,
    });
  },
};

export default applicationService;
