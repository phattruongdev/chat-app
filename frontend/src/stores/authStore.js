import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../services/api.js';
import { disconnectSocket } from '../services/socket.js';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,
      error: '',
      login: async (payload) => {
        set({ loading: true, error: '' });
        try {
          const { data } = await api.post('/auth/login', payload);
          set({ user: data.user, token: data.token, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      register: async (payload) => {
        set({ loading: true, error: '' });
        try {
          const { data } = await api.post('/auth/register', payload);
          set({ user: data.user, token: data.token, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      updateProfile: async (payload) => {
        set({ loading: true, error: '' });
        try {
          const { data } = await api.put('/auth/profile', payload);
          set({ user: data.user, loading: false });
          return data.user;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      logout: () => {
        disconnectSocket();
        set({ user: null, token: null, error: '' });
      }
    }),
    { name: 'chat-auth' }
  )
);
