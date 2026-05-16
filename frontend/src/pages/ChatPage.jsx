import { useEffect } from 'react';
import ChatWindow from '../components/ChatWindow.jsx';
import UserList from '../components/UserList.jsx';
import { connectSocket, disconnectSocket } from '../services/socket.js';
import { useAuthStore } from '../stores/authStore.js';
import { useChatStore } from '../stores/chatStore.js';

export default function ChatPage() {
  const token = useAuthStore((state) => state.token);
  const { fetchUsers, pushMessage, setOnlineUsers, setTyping, markSeen } = useChatStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const socket = connectSocket(token);
    if (!socket) return undefined;

    socket.on('users:online', setOnlineUsers);
    socket.on('message:new', pushMessage);
    socket.on('typing:start', ({ userId }) => setTyping(userId, true));
    socket.on('typing:stop', ({ userId }) => setTyping(userId, false));
    socket.on('message:seen', markSeen);

    return () => {
      socket.off('users:online', setOnlineUsers);
      socket.off('message:new', pushMessage);
      socket.off('typing:start');
      socket.off('typing:stop');
      socket.off('message:seen', markSeen);
      disconnectSocket();
    };
  }, [token, setOnlineUsers, pushMessage, setTyping, markSeen]);

  return (
    <main className="h-screen overflow-hidden bg-white">
      <div className="grid h-full grid-rows-[280px_1fr] md:grid-cols-[320px_1fr] md:grid-rows-1">
        <UserList />
        <ChatWindow />
      </div>
    </main>
  );
}
