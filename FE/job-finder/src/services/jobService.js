import api from './api';

const jobService = {
  /**
   * Lấy danh sách việc làm với bộ lọc
   * @param {object} params - { page, limit, location, salary, experience, education, category_id, search }
   * @returns {Promise}
   */
  getJobs: (params) => {
    return api.get('/jobs', { params });
  },

  /**
   * Lấy chi tiết 1 việc làm
   * @param {string|number} id - Job ID
   * @returns {Promise}
   */
  getJobDetail: (id) => {
    return api.get(`/DetailJobs/${id}`);
  },

  /**
   * Lấy danh sách công ty
   * @returns {Promise}
   */
  getCompanies: () => {
    return api.get('/Company');
  },

  /**
   * Lấy danh sách ngành nghề
   * @returns {Promise}
   */
  getCategories: () => {
    return api.get('/categories');
  },

  /**
   * Lấy danh sách gói TopCV Pro
   * @returns {Promise}
   */
  getPackages: () => {
    return api.get('/packages');
  },

  /**
   * Đăng ký gói TopCV Pro
   * @param {object} data - { userId, packageId, paymentMethod, amount }
   * @returns {Promise}
   */
  registerPackage: (data) => {
    return api.post('/packages/register', data);
  },
};

export default jobService;