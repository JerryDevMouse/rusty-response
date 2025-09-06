import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { setNotifiers, setNotifiersLoading } from '../../app/store/slices/serversSlice';
import apiRequest from '../../helpers/apiRequest';
import type { IResponse } from '../../helpers/types';
import type { INotify } from '../../types/notifiers';
import { API } from '../../helpers/constants';

const useFetchNotifiers = () => {
    const dispatch = useAppDispatch();
    const maxPage = useAppSelector(state => state.servers.page.max);

    useEffect(() => {
        const fetchNotifiers = async () => {            
            dispatch(setNotifiersLoading(true))
            const notifiers = await apiRequest<IResponse<INotify>>(API.notify + `?limit=${maxPage}&offset=0`, {method: 'GET'});
            dispatch(setNotifiers(notifiers.items))
            dispatch(setNotifiersLoading(false))
        }
        maxPage > 0 && fetchNotifiers();        
    }, [maxPage]);
}

export default useFetchNotifiers