import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { changeServersMaxPage, setServers, setServersLoading } from '../../app/store/slices/serversSlice';
import type { IResponse } from '../../types/api';
import type { IServer } from '../../types/servers';
import apiRequest from '../../helpers/apiRequest';
import { API } from '../../constants/api';
import { useMinimumDelay } from '../useMinimumDelay';
import useCatchError from '../useCatchError';

const useFetchServers = () => {
    const dispatch = useAppDispatch();
    const currentPage = useAppSelector(state => state.servers.page.current);
    const offset = useAppSelector(state => state.servers.offset);
    const deleteCount = useAppSelector(state => state.servers.deleteCount);
    const withMinimumDelay = useMinimumDelay(700);
    const catchError = useCatchError();

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
                catchError(error);
            } finally {
                dispatch(setServersLoading(false))
            }
        }
        fetchServers();
    }, [currentPage, deleteCount]);
}

export default useFetchServers