import useAuth from '../hooks/useAuth'
import { Navigate, Outlet } from 'react-router';

export const ProtectedRoute = () => {
  const {user} = useAuth();
  return user ? <Outlet/> : <Navigate to='/auth/signin' replace />
}

export const AuthRedirect = () => {
  const {user} = useAuth();  
  return user ? <Navigate to='/dashboards/overview' replace /> : <Outlet/>
}
