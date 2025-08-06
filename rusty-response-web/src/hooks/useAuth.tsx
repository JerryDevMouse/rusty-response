import { useNavigate } from 'react-router';
import ApiError from '../helpers/ApiError';
import apiRequest from '../helpers/apiRequest';
import { API } from '../helpers/constants';

const useAuth = () => {
  const navigate = useNavigate();
  
  const getValues = (formData: FormData) => {
    return [formData.get('login'), formData.get('password')]
  }

  const fetchSign = async (formData: FormData, type: 'signup' | 'signin') => {
    const [username, password_raw] = getValues(formData);
    try {
      const user = await apiRequest(API[type], {
        method: 'POST',
        body: { username, password_raw }
      })
      // todo: add to global state/localstorage
    } catch (err) {
      if (err instanceof ApiError) {
        // todo: single standard output for the user
        console.log('Server error: ', err.message);
        console.log('Error status: ', err.status);
        if (err.details) console.log('Error details: ', err.details);
      }
    }
  }

  const handleSignUp = async (formData: FormData) => {
    await fetchSign(formData, 'signup');
    navigate('/');
  }
  const handleSignIn = async (formData: FormData) => {
    await fetchSign(formData, 'signin');
    navigate('/');
  }

  return {handleSignUp, handleSignIn}
}

export default useAuth