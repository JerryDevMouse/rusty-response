import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { setNotifiers, setNotifiersLoading } from '../../app/store/slices/serversSlice';
import apiRequest from '../../helpers/apiRequest';
import type { IResponse } from '../../helpers/types';
import type { INotify } from '../../types/notifiers';
import { API } from '../../helpers/constants';
import { useMinimumDelay } from '../useMinimumDelay';
import ApiError from '../../helpers/ApiError';

const useFetchNotifiers = () => {
    const dispatch = useAppDispatch();
    const maxPage = useAppSelector(state => state.servers.page.max);
    const withMinimumDelay = useMinimumDelay(700);

    useEffect(() => {
        const fetchNotifiers = async () => {            
            dispatch(setNotifiersLoading(true))
            try {
                const notifiers = await withMinimumDelay(
                    apiRequest<IResponse<INotify>>(API.notify + `?limit=${maxPage}&offset=0`))
                ;
                dispatch(setNotifiers(notifiers.items))
            } catch (error) {
                if (error instanceof ApiError) error.log();
            } finally {
                dispatch(setNotifiersLoading(false))
            }
        }
        maxPage > 0 && fetchNotifiers();        
    }, [maxPage]);
}

export default useFetchNotifiers