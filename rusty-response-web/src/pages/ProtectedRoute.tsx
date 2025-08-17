import { useEffect, useRef, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router';
import useAuth from '../hooks/useAuth'
import Storage from '../helpers/storage';

const useVerifyAuth = () => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const intervalRef = useRef<number>(null);

  const {verifyAuth} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVerify = async () => {          
      const lastAuth = Storage.get<number>('lastAuth');
      if (!lastAuth) return navigate('/auth/signin');
      
      const timePassed = Date.now() - lastAuth;
      if (timePassed < 3_600_000) {
        setIsAuth(true);
        return;
      }
      
      const tokenIsValid = await verifyAuth();
      if (tokenIsValid) {
        const remainingTime = Math.max(300_000, 3_600_000 - timePassed);
        Storage.set('lastAuth', Date.now() - 3_600_000 + remainingTime)
        setIsAuth(true);
      } else {
        Storage.remove('lastAuth');
        navigate('/auth/signin');
      }
    }
    fetchVerify();

    intervalRef.current = setInterval(fetchVerify, 300_000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [verifyAuth, navigate])

  return isAuth;
}

export const ProtectedRoute = ({type}: {type?: 'auth'}) => {
  const isAuth = useVerifyAuth();  
  // // if (isAuth === null) return <Loading>; todo
  if (type === 'auth') return isAuth ? <Navigate to='/dashboards/overview' replace /> : <Outlet/>;
  return isAuth ? <Outlet/> : <Navigate to='/auth/signin' replace />
}