import { useEffect } from 'react'
import useInput from './useInput'

const useSearch = () => {
    const {inputRef, focusInput} = useInput();

    useEffect(()=> {
        const inputHandler = (e: KeyboardEvent) => {
            if (e.key === '/' && e.target !== inputRef.current) {
                e.preventDefault();
                focusInput();
            };
        }
        document.addEventListener('keydown', inputHandler);
        return () => document.removeEventListener('keydown', inputHandler);
    }, [])

    return {inputRef, focusInput}
}

export default useSearch