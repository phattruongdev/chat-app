import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm.jsx';
import { useAuthStore } from '../stores/authStore.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuthStore();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await login({ email: formData.get('email'), password: formData.get('password') });
    navigate('/');
  };

  return (
    <AuthForm
      title="Welcome back"
      subtitle="Login to continue your conversations."
      submitLabel="Login"
      loading={loading}
      error={error}
      onSubmit={handleSubmit}
    />
  );
}
