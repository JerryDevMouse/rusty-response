import ApiError from '../helpers/apiError';
import apiRequest from '../helpers/apiRequest';
import { API } from '../helpers/constants';

const useAuth = () => {
    const getValues = (formData: FormData) => {
      return [formData.get('login'), formData.get('password')]
    }

    const handleSignUp = async (formData: FormData) => {
      const [username, password_raw] = getValues(formData);
      try {
        const user = await apiRequest(API.signup, {
          method: 'POST',
          body: { username, password_raw }
        })
      } catch (err) {
        if (err instanceof ApiError) {
          // todo: single standard output for the user
          console.log('Server error: ', err.message);
          console.log('Error status: ', err.status);
          if (err.details) console.log('Error details: ', err.details);
        }
      }
    }
    const handleSignIn = (formData: FormData) => {

    }

  return {handleSignUp, handleSignIn}
}

export default useAuth