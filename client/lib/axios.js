import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  try {
    const authStore = localStorage.getItem('auth-storage');
    if (authStore) {
      const { state } = JSON.parse(authStore);
      if (state?.user?.token) {
        config.headers.Authorization = `Bearer ${state.user.token}`;
      }
    }
  } catch (error) {}
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/refresh`, {}, { withCredentials: true });
        return api(originalRequest);
      } catch (err) {
        // If refresh fails, it means we're fully logged out
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
