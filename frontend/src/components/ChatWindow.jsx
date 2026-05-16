import { SendHorizonal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { getSocket } from '../services/socket.js';
import { useAuthStore } from '../stores/authStore.js';
import { useChatStore } from '../stores/chatStore.js';
import Avatar from './common/Avatar.jsx';

export default function ChatWindow() {
  const [text, setText] = useState('');
  const bottomRef = useRef(null);
  const { user } = useAuthStore();
  const { selectedUser, messages, loadingMessages, sending, typingUserIds, onlineUserIds, sendMessage } = useChatStore();

  const selectedUserId = selectedUser?._id || selectedUser?.id;
  const isOnline = selectedUserId ? onlineUserIds.includes(selectedUserId) : false;
  const isTyping = selectedUserId ? typingUserIds.includes(selectedUserId) : false;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedUserId]);

  if (!selectedUser) {
    return (
      <section className="flex h-full items-center justify-center bg-panel px-6 text-center">
        <div>
          <h2 className="text-xl font-semibold text-ink">Select a conversation</h2>
          <p className="mt-2 text-sm text-gray-500">Choose a user from the list to load chat history.</p>
        </div>
      </section>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const value = text.trim();
    if (!value) return;
    setText('');
    await sendMessage(value);
    getSocket()?.emit('typing:stop', { receiverId: selectedUserId });
  };

  const handleChange = (event) => {
    setText(event.target.value);
    const socket = getSocket();
    socket?.emit(event.target.value ? 'typing:start' : 'typing:stop', { receiverId: selectedUserId });
  };

  return (
    <section className="flex h-full min-w-0 flex-col bg-panel">
      <header className="flex items-center gap-3 border-b border-line bg-white p-4">
        <Avatar name={selectedUser.name} src={selectedUser.avatar} online={isOnline} />
        <div>
          <h2 className="text-sm font-semibold text-ink">{selectedUser.name}</h2>
          <p className="text-xs text-gray-500">{isTyping ? 'Typing...' : isOnline ? 'Online' : 'Offline'}</p>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {loadingMessages ? <p className="text-sm text-gray-500">Loading conversation...</p> : null}
        <div className="space-y-3">
          {messages.map((message) => {
            const isMine = (message.sender?._id || message.sender) === (user?.id || user?._id);
            return (
              <div key={message._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[78%] rounded-lg px-4 py-2 text-sm shadow-sm ${isMine ? 'bg-brand text-white' : 'bg-white text-ink'}`}>
                  <p className="whitespace-pre-wrap break-words">{message.text}</p>
                  <p className={`mt-1 text-[11px] ${isMine ? 'text-teal-100' : 'text-gray-400'}`}>
                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {isMine && message.seenAt ? ' · Seen' : ''}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3 border-t border-line bg-white p-4">
        <input value={text} onChange={handleChange} className="input" placeholder="Write a message" maxLength="3000" />
        <button disabled={sending || !text.trim()} className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-brand text-white disabled:opacity-60" aria-label="Send message">
          <SendHorizonal className="h-5 w-5" />
        </button>
      </form>
    </section>
  );
}
