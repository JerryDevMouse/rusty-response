import { useState } from 'react'

const useModalById = () => {
    const [modalId, setModalId] = useState(0);

    const resetModalId = (id: number) => {
        if (modalId !== id) return;
        setModalId(0);
    }
    const toggleModalId = (id: number) => {
        setModalId(id === modalId ? 0 : id)
    }
    return {modalId, resetModalId, toggleModalId}
}

export default useModalById