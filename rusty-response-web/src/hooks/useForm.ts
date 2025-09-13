import { type FormEvent } from 'react'
import { useNavigate } from 'react-router';

const useForm = (onSubmit: (formData: FormData) => void) => {
    const navigate = useNavigate();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        onSubmit(formData);

        e.currentTarget.reset();
    }
    
    const handleCancel = () => {        
            const currentHistoryIndex = window.history.state?.idx || 0;
            if (currentHistoryIndex > 0) {
                navigate(-1);
            } else {
                navigate('/');
            }
        }

    return {handleSubmit, handleCancel}
}

export default useForm