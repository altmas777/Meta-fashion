import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const res = await api.post('/api/auth/login', credentials);
          set({ user: res.data.data, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          const res = await api.post('/api/auth/register', userData);
          set({ user: res.data.data, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
      },

      logout: async () => {
        try {
          await api.post('/api/auth/logout');
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          console.error('Logout failed:', error);
        }
      },

      checkAuth: async () => {
        try {
          const res = await api.get('/api/auth/me');
          set((state) => ({ 
            user: { ...res.data.data, token: state.user?.token }, 
            isAuthenticated: true 
          }));
        } catch (error) {
          set({ user: null, isAuthenticated: false });
        }
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
