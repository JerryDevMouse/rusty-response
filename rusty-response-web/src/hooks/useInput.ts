import { useRef } from 'react'

const useInput = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const focusInput = () => inputRef.current?.focus();

    return {inputRef, focusInput}
}

export default useInput