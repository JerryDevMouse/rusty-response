import { useNavigate } from 'react-router';
import { useAppDispatch } from '../../app/store/hooks';
import { deleteServerById } from '../../app/store/slices/serversSlice';
import { API } from '../../constants/api';
import apiRequest from '../../helpers/apiRequest';
import useCatchError from '../useCatchError';
import useModalUI from '../useModalUI';

const useServerOptions = () => {
    const dispatch = useAppDispatch();
    const catchError = useCatchError();
    const {showModal} = useModalUI();
    const navigate = useNavigate();
    
    const deleteServer = async (id: number, isNavigateBack?: boolean) => {
        try {
            await apiRequest(API.server + `${id}`, 
                {method: 'DELETE'}
            )
            dispatch(deleteServerById(id));
            showModal('Successfully deleted', 'success');
            isNavigateBack && navigate(-1);
        } catch (error) {
            catchError(error)
        }
    }

    return {deleteServer}
}

export default useServerOptions