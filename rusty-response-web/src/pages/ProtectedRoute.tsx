import { Navigate, Outlet } from 'react-router';
import useVerifyAuth from '../hooks/useVerifyAuth';
import { Loading } from '../components/Loading';

export const ProtectedRoute = ({type}: {type?: 'auth'}) => {
  const isAuth = useVerifyAuth();  
  if (isAuth === null) return <Loading type='full'/>;
  if (type === 'auth') return isAuth ? <Navigate to='/dashboards/overview' replace /> : <Outlet/>;
  return isAuth ? <Outlet/> : <Navigate to='/auth/signin' replace />
}