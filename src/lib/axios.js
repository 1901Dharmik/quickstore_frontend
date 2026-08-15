import axios from 'axios';

// Create a customized axios instance
const api = axios.create({
  // Use environment variable for the backend API URL, fallback to localhost for development
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  // Ensure cookies are sent with requests if using httpOnly cookies for auth
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add request interceptor (e.g., to attach Bearer tokens if you aren't using httpOnly cookies)
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      let guestId = localStorage.getItem('guest_id');
      if (!guestId) {
        guestId = crypto.randomUUID();
        localStorage.setItem('guest_id', guestId);
      }
      config.headers['x-guest-id'] = guestId;

      const token = localStorage.getItem('auth_token');
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

// Optional: Add response interceptor (e.g., handle 401 Unauthorized globally)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g., redirect to login or clear token)
      console.warn('Unauthorized. Please login again.');
    }
    return Promise.reject(error);
  }
);

export default api;
