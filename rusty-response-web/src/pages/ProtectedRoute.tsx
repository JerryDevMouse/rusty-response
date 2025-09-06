import { Navigate, Outlet } from 'react-router';
import useVerifyAuth from '../hooks/useVerifyAuth';

export const ProtectedRoute = ({type}: {type?: 'auth'}) => {
  const isAuth = useVerifyAuth();  
  // // if (isAuth === null) return <Loading>; todo
  if (type === 'auth') return isAuth ? <Navigate to='/dashboards/overview' replace /> : <Outlet/>;
  return isAuth ? <Outlet/> : <Navigate to='/auth/signin' replace />
}