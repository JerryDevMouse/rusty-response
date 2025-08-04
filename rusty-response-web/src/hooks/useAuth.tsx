import React from 'react'

const useAuth = () => {
    const getValues = (formData: FormData) => {
        const login = formData.get('login');
        const password = formData.get('password');

        return {login, password}
    }

    const handleSignUp = (formData: FormData) => {
    }
    const handleSignIn = (formData: FormData) => {

    }

  return {handleSignUp, handleSignIn}
}

export default useAuth