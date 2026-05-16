import { Camera, KeyRound, Mail, Phone, User, X } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../stores/authStore.js';
import Avatar from './common/Avatar.jsx';

export default function ProfileModal({ open, onClose }) {
  const { user, loading, updateProfile } = useAuthStore();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!open) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      avatar: formData.get('avatar')
    };

    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');

    if (newPassword) {
      payload.currentPassword = currentPassword;
      payload.newPassword = newPassword;
    }

    try {
      await updateProfile(payload);
      event.currentTarget.currentPassword.value = '';
      event.currentTarget.newPassword.value = '';
      setSuccess('Profile updated successfully.');
    } catch (profileError) {
      setError(profileError.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-ink">Personal information</h2>
            <p className="mt-1 text-xs text-gray-500">Update your profile and account security.</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-md hover:bg-panel" aria-label="Close profile">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="max-h-[75vh] overflow-y-auto px-5 py-5">
          <div className="flex items-center gap-4">
            <Avatar name={user?.name} src={user?.avatar} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{user?.name}</p>
              <p className="truncate text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>

          {error ? <div className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
          {success ? <div className="mt-4 rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div> : null}

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <User className="h-4 w-4" />
                User name
              </span>
              <input name="name" className="input" defaultValue={user?.name || ''} minLength="2" required />
            </label>

            <label className="block sm:col-span-2">
              <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Mail className="h-4 w-4" />
                Email
              </span>
              <input name="email" type="email" className="input" defaultValue={user?.email || ''} required />
            </label>

            <label className="block sm:col-span-2">
              <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Phone className="h-4 w-4" />
                Phone
              </span>
              <input name="phone" className="input" defaultValue={user?.phone || ''} placeholder="+84 901 234 567" />
            </label>

            <label className="block sm:col-span-2">
              <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Camera className="h-4 w-4" />
                Avatar URL
              </span>
              <input name="avatar" type="url" className="input" defaultValue={user?.avatar || ''} placeholder="https://..." />
            </label>

            <div className="sm:col-span-2 border-t border-line pt-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <KeyRound className="h-4 w-4" />
                Change password
              </p>
              <p className="mt-1 text-xs text-gray-500">Leave these fields empty if you do not want to change password.</p>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Current password</span>
              <input name="currentPassword" type="password" className="input" minLength="6" />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">New password</span>
              <input name="newPassword" type="password" className="input" minLength="6" />
            </label>
          </div>
        </div>

        <footer className="flex justify-end gap-3 border-t border-line px-5 py-4">
          <button type="button" onClick={onClose} className="rounded-md border border-line px-4 py-2 text-sm font-semibold text-gray-700">
            Cancel
          </button>
          <button disabled={loading} className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-70">
            {loading ? 'Saving...' : 'Save changes'}
          </button>
        </footer>
      </form>
    </div>
  );
}
