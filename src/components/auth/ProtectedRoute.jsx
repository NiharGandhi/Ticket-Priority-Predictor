import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { authAPI, setAuthToken } from '../../services/api';
import LoadingSkeleton from '../common/LoadingSkeleton';

export default function ProtectedRoute({ children, roles = [] }) {
  const location = useLocation();
  const token = localStorage.getItem('token');

  // Set token on the api instance immediately if available
  if (token) {
    setAuthToken(token);
  }

  const { data: userResponse, isLoading, isError } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await authAPI.getMe();
      return res.data.data;
    },
    enabled: !!token,
    retry: false,
  });

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (isLoading) {
    return <div className="p-6 h-screen w-full flex items-center justify-center"><LoadingSkeleton /></div>;
  }

  if (isError || !userResponse) {
    setAuthToken(null);
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles.length > 0 && !roles.includes(userResponse.role)) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
}
