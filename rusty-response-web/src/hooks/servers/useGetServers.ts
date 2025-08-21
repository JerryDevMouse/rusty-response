import { useEffect, useMemo, useState } from 'react'
import { useAppDispatch } from '../../app/store/hooks';
import type { IResponse } from '../../helpers/types';
import type { IServer } from '../../types/servers';
import apiRequest from '../../helpers/apiRequest';
import { API } from '../../helpers/constants';
import { setServers } from '../../app/store/slices/serversSlice';
const COUNT_SERVERS = 5; //on page

const useGetServers = () => {
    const [offset, setOffset] = useState(0);
    const [page, setPage] = useState({
        current: 1,
        max: 0
    });

    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchServers = async () => {
            const res: IResponse<IServer> = await apiRequest(API.server + `?limit=5&offset=${offset}`);
            dispatch(setServers(res.items));
            setPage(c => ({...c, max: Math.ceil(res.total / COUNT_SERVERS)}));
        }
        fetchServers();
    }, [page.current]);
    
    const changePage = (num: number) => {        
        setPage(c => ({...c, current: num}));
        setOffset((num - 1) * COUNT_SERVERS);
    }
    const incrementPage = () => {
        if (page.current === page.max) return;
        changePage(page.current + 1)
    }
    const decrementPage = () => {
        if (page.current === 1) return;
        changePage(page.current - 1)
    }

    const pages = useMemo(() => Array.from({length: page.max}, (_, i) => i + 1), [page.max]);

    return {
        pages, 
        page: page.current,
        setPage: changePage,
        incrementPage,
        decrementPage
    }
}

export default useGetServers