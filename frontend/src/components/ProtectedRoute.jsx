import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore.js';

export default function ProtectedRoute() {
  const token = useAuthStore((state) => state.token);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
