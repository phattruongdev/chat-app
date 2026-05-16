import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm.jsx';
import { useAuthStore } from '../stores/authStore.js';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading, error } = useAuthStore();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await register({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password')
    });
    navigate('/');
  };

  return (
    <AuthForm
      title="Create your account"
      subtitle="Start a private realtime chat workspace."
      submitLabel="Create account"
      loading={loading}
      error={error}
      isRegister
      onSubmit={handleSubmit}
    />
  );
}
