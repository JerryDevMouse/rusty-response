import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch } from '../app/store/hooks';
import ApiError from '../helpers/ApiError';
import apiRequest from '../helpers/apiRequest';
import { API } from '../constants/api';
import type { IUser } from '../types/api';
import { setUser, setUserLoading } from '../app/store/slices/userSlice';
import Storage from '../helpers/Storage';
import useModalUI from './useModalUI';

const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {showModal} = useModalUI();
  
  const getValues = (formData: FormData) => {
    return [formData.get('login'), formData.get('password')]
  }
  const verifyAuth = useCallback(async (): Promise<boolean> => {
    try {
      await apiRequest(API.verify);
      return true;
    } catch (error) {
      if (error instanceof ApiError) error.log();
      return false;
    }
  }, [])

  const fetchSign = async (formData: FormData, type: 'signup' | 'signin') => {
    const [username, password_raw] = getValues(formData);
    try {
      dispatch(setUserLoading(true));
      const resUser = await apiRequest<IUser>(API[type], {
        method: 'POST',
        body: { username, password_raw }
      })
      dispatch(setUser(resUser));
      Storage.set('lastAuth', Date.now())
      navigate('/');
      showModal('Successfully login', 'success')
    } catch (error) {
      showModal(error instanceof ApiError ? error.message : 'Unexpected error', 'error');
    } finally {
      dispatch(setUserLoading(false));
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