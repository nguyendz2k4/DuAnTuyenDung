import axios from 'axios';

// Đọc URL từ biến môi trường (.env), tránh hardcode
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7099/api';
export const API_HOST = process.env.REACT_APP_API_HOST || 'https://localhost:7099';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Tự động gắn token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Xử lý response trả về
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      // Token hết hạn hoặc không hợp lệ → tự động logout
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Chỉ redirect nếu chưa ở trang login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }

      console.error(`API Error [${status}]:`, error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;