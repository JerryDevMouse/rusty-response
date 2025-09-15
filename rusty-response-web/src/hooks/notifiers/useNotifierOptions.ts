import { useAppDispatch } from '../../app/store/hooks';
import { deleteNotifierById, setSeparateNotifier } from '../../app/store/slices/serversSlice';
import { useNavigate } from 'react-router';
import type { INotify, TProvider } from '../../types/notifiers';
import apiRequest from '../../helpers/apiRequest';
import { API } from '../../constants/api';
import useCatchError from '../useCatchError';
import useModalUI from '../useModalUI';

const useNotifierOptions = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const catchError = useCatchError();
    const {showModal} = useModalUI();

  const addNotifier = (server_id: number, provider?: TProvider) => {
    dispatch(setSeparateNotifier({ 
        server_id, 
        ...(provider && {provider}) 
    }));
    navigate('/dashboards/notifiers/create');
  }

  const editNotifier = (notifier: INotify) => {
    dispatch(setSeparateNotifier(notifier));
    navigate(`/dashboards/notifiers/edit/${notifier.id}`);
  }

  const deleteNotifier = async (id: number) => {
    try {
      await apiRequest(`${API.notify}${id}`, {
        method: 'DELETE',
      })
      dispatch(deleteNotifierById(id))
      showModal('Succesfully deleted', 'success')
    } catch (error) {
      catchError(error)
    }    
  }

  return {addNotifier, editNotifier, deleteNotifier}
}

export default useNotifierOptions