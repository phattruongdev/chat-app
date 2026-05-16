import { create } from 'zustand';
import { api } from '../services/api.js';

export const useChatStore = create((set, get) => ({
  users: [],
  onlineUserIds: [],
  selectedUser: null,
  messages: [],
  loadingUsers: false,
  loadingMessages: false,
  sending: false,
  typingUserIds: [],
  error: '',
  fetchUsers: async () => {
    set({ loadingUsers: true, error: '' });
    try {
      const { data } = await api.get('/users');
      set({ users: data.users, loadingUsers: false });
    } catch (error) {
      set({ error: error.message, loadingUsers: false });
    }
  },
  selectUser: async (user) => {
    set({ selectedUser: user, loadingMessages: true, messages: [], error: '' });
    try {
      const { data } = await api.get(`/messages/${user._id || user.id}`);
      set({ messages: data.messages, loadingMessages: false });
    } catch (error) {
      set({ error: error.message, loadingMessages: false });
    }
  },
  sendMessage: async (text) => {
    const { selectedUser } = get();
    if (!selectedUser || !text.trim()) return;

    set({ sending: true, error: '' });
    try {
      await api.post('/messages', { receiverId: selectedUser._id || selectedUser.id, text });
      set({ sending: false });
    } catch (error) {
      set({ error: error.message, sending: false });
    }
  },
  pushMessage: (message) => {
    const { messages, selectedUser } = get();
    const selectedUserId = selectedUser?._id || selectedUser?.id;
    const senderId = message.sender?._id || message.sender;
    const receiverId = message.receiver?._id || message.receiver;

    if (selectedUserId && ![senderId, receiverId].includes(selectedUserId)) return;
    if (messages.some((item) => item._id === message._id)) return;
    set({ messages: [...messages, message] });
  },
  setOnlineUsers: (onlineUserIds) => set({ onlineUserIds }),
  setTyping: (userId, isTyping) => {
    const current = get().typingUserIds;
    set({
      typingUserIds: isTyping
        ? Array.from(new Set([...current, userId]))
        : current.filter((id) => id !== userId)
    });
  },
  markSeen: ({ messageId, seenAt }) => {
    set({
      messages: get().messages.map((message) =>
        message._id === messageId ? { ...message, seenAt } : message
      )
    });
  }
}));
