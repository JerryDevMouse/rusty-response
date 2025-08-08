import { useEffect, useRef } from 'react'

const useSearch = () => {
    const inputRef = useRef<HTMLInputElement>(null);

    const focusInput = () => inputRef.current?.focus();

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