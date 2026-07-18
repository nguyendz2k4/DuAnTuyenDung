import api, { API_HOST } from './api';

const applicationService = {
  /**
   * Nộp hồ sơ ứng tuyển
   * @param {FormData} formData - Dữ liệu form bao gồm CV file
   * @returns {Promise}
   */
  applyJob: (formData) => {
    return api.post('/applications/apply', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * Lấy danh sách việc làm đã ứng tuyển
   * @param {object} params - { seekerId, page, limit, status, q }
   * @returns {Promise}
   */
  getAppliedJobs: (params) => {
    return api.get('/applications', { params });
  },

  getEmployerApplications: (employerId) => {
    return api.get(`${API_HOST}/api/admin/applications`, { params: { employer_id: employerId } });
  },

  updateEmployerApplicationStatus: (applicationId, status) => {
    return api.post(`${API_HOST}/api/admin/applications/status`, { application_id: applicationId, status });
  },
};

export default applicationService;
