import { useAppDispatch } from '../../app/store/hooks';
import { deleteServerById } from '../../app/store/slices/serversSlice';
import { API } from '../../constants/api';
import apiRequest from '../../helpers/apiRequest';
import useCatchError from '../useCatchError';

const useServerOptions = () => {
    const dispatch = useAppDispatch();
    const catchError = useCatchError();

    const deleteServer = async (id: number) => {
        try {
            await apiRequest(API.server + `${id}`, 
                {method: 'DELETE'}
            )
            dispatch(deleteServerById(id))
        } catch (error) {
            catchError(error)
        }
    }

    return {deleteServer}
}

export default useServerOptions