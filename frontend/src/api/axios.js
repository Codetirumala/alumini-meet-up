import axios from 'axios';

const isLocalFrontend =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const resolvedApiBaseUrl = isLocalFrontend
  ? 'http://localhost:5000/api'
  : import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: resolvedApiBaseUrl,
  timeout: 15000
});

// Automatically attach token
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

// Response interceptor with retry logic
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error(`Request timeout - server is not responding: ${resolvedApiBaseUrl}`);
    }
    if (error.message === 'Network Error') {
      console.error(`Network Error - Cannot reach backend at ${resolvedApiBaseUrl}`);
    }
    return Promise.reject(error);
  }
);

export default api;
