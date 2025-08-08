import { type FormEvent } from 'react'

const useForm = (onSubmit: (formData: FormData) => void) => {

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        onSubmit(formData);

        e.currentTarget.reset();
    }

    return {handleSubmit}
}

export default useForm