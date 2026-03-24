import api from './api';

const jobService = {
  getJobs: async (params) => {
    try {
      const response = await api.get('/jobs', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },
  getJobDetail: async (id) => {
    try {
      const response = await api.get(`/DetailJobs/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
  // Thêm các hàm API khác liên quan đến Jobs ở đây
};

export default jobService;