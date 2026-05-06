import api from './api';

const authService = {
  /**
   * Đăng nhập
   * @param {string} userName
   * @param {string} password
   * @returns {Promise<{token: string, user: object}>}
   */
  login: (userName, password) => {
    return api.post('/auth/login', {
      userName,
      password,
      rememberMe: false,
    });
  },

  /**
   * Đăng ký tài khoản
   * @param {object} data - { fullName, email, userName, password, accountType }
   * @returns {Promise}
   */
  register: (data) => {
    return api.post('/auth/register', {
      fullName: data.fullName,
      email: data.email,
      userName: data.userName,
      password: data.password,
      accountType: data.accountType || 'JobSeeker',
    });
  },

  /**
   * Lấy URL đăng nhập Google OAuth
   * @returns {string} URL redirect
   */
  getGoogleLoginUrl: () => {
    return `${api.defaults.baseURL}/auth/google-login`;
  },

  /**
   * Lấy URL đăng nhập Facebook OAuth
   * @returns {string} URL redirect
   */
  getFacebookLoginUrl: () => {
    return `${api.defaults.baseURL}/auth/facebook-login`;
  },
};

export default authService;
