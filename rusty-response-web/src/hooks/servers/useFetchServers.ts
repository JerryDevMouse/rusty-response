import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { changeServersMaxPage, setServers, setServersLoading } from '../../app/store/slices/serversSlice';
import type { IResponse } from '../../helpers/types';
import type { IServer } from '../../types/servers';
import apiRequest from '../../helpers/apiRequest';
import { API } from '../../helpers/constants';
import { useMinimumDelay } from '../useMinimumDelay';
import ApiError from '../../helpers/ApiError';

const useFetchServers = () => {
    const dispatch = useAppDispatch();
    const currentPage = useAppSelector(state => state.servers.page.current);
    const offset = useAppSelector(state => state.servers.offset);
    const deleteCount = useAppSelector(state => state.servers.deleteCount);
    const withMinimumDelay = useMinimumDelay(700);

    useEffect(() => {
        const fetchServers = async () => {
            dispatch(setServersLoading(true))
            try {
                const res = await withMinimumDelay(
                    apiRequest<IResponse<IServer>>(API.server + `?limit=5&offset=${offset}`)
                );
                dispatch(setServers(res.items));
                dispatch(changeServersMaxPage(res.total));
                
            } catch (error) {
                if (error instanceof ApiError) error.log();
            } finally {
                dispatch(setServersLoading(false))
            }
        }
        fetchServers();
    }, [currentPage, deleteCount]);
}

export default useFetchServers