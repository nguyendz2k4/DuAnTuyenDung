import api from './api';

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
};

export default applicationService;
