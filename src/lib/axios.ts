import axios, { AxiosInstance } from 'axios';
import { getClientIP, getAPIHeaders } from '@/utils/request';
import { apiUrl } from '@/config/site';

const API_BASE_URL = apiUrl;

// Client-side axios instance (with localStorage)
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - thêm token vào header nếu có (client-side only)
axiosInstance.interceptors.request.use(
  (config) => {
    // Only access localStorage on client
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý lỗi chung (client-side only)
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Only access window/localStorage on client
    if (typeof window !== 'undefined') {
      // Xử lý lỗi 401 - Unauthorized
      if (error.response?.status === 401) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Create SSR axios instance (for server-side rendering)
 * Similar to ddv-web's approach but using axios instead of fetch
 */
export const createSSRAxiosInstance = (req?: any): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 8000,
    headers: {
      'Content-Type': 'application/json',
      ...(req ? getAPIHeaders(req) : {}),
    },
  });

  return instance;
};

/**
 * Get axios instance (auto-detect server/client)
 * For SSR, pass req object to include client IP headers
 */
export const getAxiosInstance = (req?: any): AxiosInstance => {
  // If req is provided, we're in SSR
  if (req && typeof window === 'undefined') {
    return createSSRAxiosInstance(req);
  }
  // Otherwise use client instance
  return axiosInstance;
};

export default axiosInstance;

