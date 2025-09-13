import { useAppDispatch } from '../../app/store/hooks';
import { setSeparateNotifier } from '../../app/store/slices/serversSlice';
import { useNavigate } from 'react-router';
import type { TProvider } from '../../types/notifiers';

const useNotifierOptions = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

  const addNotifier = (server_id: number, provider?: TProvider) => {
    dispatch(setSeparateNotifier({ 
        server_id, 
        ...(provider && {provider}) 
    }));
    navigate('/dashboards/notifiers/create');
  }

  return {addNotifier}
}

export default useNotifierOptions