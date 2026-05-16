import { Settings, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAuthStore } from '../stores/authStore.js';
import { useChatStore } from '../stores/chatStore.js';
import Avatar from './common/Avatar.jsx';
import ProfileModal from './ProfileModal.jsx';

export default function UserList() {
  const [query, setQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { logout, user } = useAuthStore();
  const { users, selectedUser, selectUser, onlineUserIds, loadingUsers } = useChatStore();

  const filteredUsers = useMemo(() => {
    return users.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
  }, [users, query]);

  return (
    <aside className="flex h-full flex-col border-r border-line bg-white">
      <header className="border-b border-line p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar name={user?.name} src={user?.avatar} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{user?.name}</p>
              <p className="text-xs text-gray-500">Online</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsProfileOpen(true)} className="grid h-10 w-10 place-items-center rounded-md border border-line text-gray-700" aria-label="Open profile">
              <Settings className="h-4 w-4" />
            </button>
            <button onClick={logout} className="rounded-md border border-line px-3 py-2 text-xs font-semibold text-gray-700">
              Logout
            </button>
          </div>
        </div>
        <label className="mt-4 flex items-center gap-2 rounded-md border border-line bg-panel px-3 py-2">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full bg-transparent text-sm outline-none"
            placeholder="Search users"
          />
        </label>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {loadingUsers ? <p className="p-4 text-sm text-gray-500">Loading users...</p> : null}
        {filteredUsers.map((item) => {
          const id = item._id || item.id;
          const isOnline = onlineUserIds.includes(id);
          const isSelected = (selectedUser?._id || selectedUser?.id) === id;

          return (
            <button
              key={id}
              onClick={() => selectUser(item)}
              className={`flex w-full items-center gap-3 rounded-md p-3 text-left transition hover:bg-panel ${isSelected ? 'bg-teal-50' : ''}`}
            >
              <Avatar name={item.name} src={item.avatar} online={isOnline} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{item.name}</p>
                <p className="text-xs text-gray-500">{isOnline ? 'Online' : 'Offline'}</p>
              </div>
            </button>
          );
        })}
      </div>
      <ProfileModal open={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </aside>
  );
}
