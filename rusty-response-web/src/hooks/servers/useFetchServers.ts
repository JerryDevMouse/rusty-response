import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { changeServersMaxPage, setServers, setServersLoading } from '../../app/store/slices/serversSlice';
import type { IResponse } from '../../helpers/types';
import type { IServer } from '../../types/servers';
import apiRequest from '../../helpers/apiRequest';
import { API } from '../../helpers/constants';

const useFetchServers = () => {
    const dispatch = useAppDispatch();
    const currentPage = useAppSelector(state => state.servers.page.current);
    const offset = useAppSelector(state => state.servers.offset);
    const deleteCount = useAppSelector(state => state.servers.deleteCount);

    useEffect(() => {
        const fetchServers = async () => {
            dispatch(setServersLoading(true))
            const res: IResponse<IServer> = await apiRequest(API.server + `?limit=5&offset=${offset}`);
            dispatch(setServers(res.items));
            dispatch(changeServersMaxPage(res.total));
            dispatch(setServersLoading(false))
        }
        fetchServers();
    }, [currentPage, deleteCount]);
}

export default useFetchServers