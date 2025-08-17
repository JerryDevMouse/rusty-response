import ApiError from '../helpers/ApiError';
import apiRequest from '../helpers/apiRequest';
import { API } from '../helpers/constants';
import type { IUser } from '../helpers/types';
import { useAppDispatch } from '../app/store/hooks';
import { setUser, setUserLoading } from '../app/store/slices/userSlice';
import { useNavigate } from 'react-router';

const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const getValues = (formData: FormData) => {
    return [formData.get('login'), formData.get('password')]
  }
  const verifyAuth = async () => {
    try {
      await apiRequest(API.verify);
      return true;
    } catch (error) {
      if (error instanceof ApiError) error.log();
      return false;
    }
  }

  const fetchSign = async (formData: FormData, type: 'signup' | 'signin') => {
    const [username, password_raw] = getValues(formData);
    try {
      dispatch(setUserLoading(true))
      const resUser = await apiRequest<IUser>(API[type], {
        method: 'POST',
        body: { username, password_raw }
      })
      dispatch(setUser(resUser));
      navigate('/');
    } catch (error) {
      // todo: single standard output for the user  
      if (error instanceof ApiError) error.log();
    } finally {
      dispatch(setUserLoading(false));
      localStorage.setItem('lastAuth', JSON.stringify(Date.now()))
    }
  }

  const handleSignUp = async (formData: FormData) => {
    await fetchSign(formData, 'signup');
  }
  const handleSignIn = async (formData: FormData) => {
    await fetchSign(formData, 'signin');
  }

  return {handleSignUp, handleSignIn, verifyAuth}
}

export default useAuth