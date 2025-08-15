import ApiError from '../helpers/ApiError';
import apiRequest from '../helpers/apiRequest';
import { API } from '../helpers/constants';
import type { IUser } from '../helpers/types';
import { useAppDispatch, useAppSelector } from '../app/store/hooks';
import { setUser, setUserLoading } from '../app/store/slices/userSlice';
import { useNavigate } from 'react-router';

const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(state => state.user.currentUser);
  
  const getValues = (formData: FormData) => {
    return [formData.get('login'), formData.get('password')]
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
    } catch (err) {
      if (err instanceof ApiError) {
        // todo: single standard output for the user
        console.log('Server error: ', err.message);
        console.log('Error status: ', err.status);
        if (err.details) console.log('Error details: ', err.details);
      }
    } finally {
      dispatch(setUserLoading(false))
    }
  }

  const handleSignUp = async (formData: FormData) => {
    await fetchSign(formData, 'signup');
  }
  const handleSignIn = async (formData: FormData) => {
    await fetchSign(formData, 'signin');
  }

  return {handleSignUp, handleSignIn, user}
}

export default useAuth