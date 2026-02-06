import axios from 'axios';

const API_BASE_URL = 'http://localhost:7099/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Xử lý response trả về
api.interceptors.response.use(
  (response) => {
    return response.data; 
  },
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
      console.error('Status:', error.response.status);
    } else if (error.request) {
      console.error('Network Error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;