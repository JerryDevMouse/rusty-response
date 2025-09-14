import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../app/store/hooks';
import { clearTimers, hideModal, setModalWithTimers } from '../app/store/slices/modalSlice';
import type { TModalIconName } from '../types/ui';

const useModalUI = () => {
  const dispatch = useAppDispatch();
  const modal = useAppSelector((state) => state.modal);

  const showModal = useCallback((text: string, iconName: TModalIconName) => {
    dispatch(setModalWithTimers(text, iconName));
  }, [dispatch]);

  const closeModal = useCallback(() => {
    dispatch(clearTimers());
    dispatch(hideModal());
  }, [dispatch]);

  return {modal, showModal, closeModal};
};

export default useModalUI