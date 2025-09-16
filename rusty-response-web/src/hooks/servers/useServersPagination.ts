import { useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { changeServersOffset, setServersCurrentPage } from '../../app/store/slices/serversSlice';

const useServersPagination = () => {
    const dispatch = useAppDispatch();
    const currentPage = useAppSelector(state => state.servers.page.current);
    const maxPage = useAppSelector(state => state.servers.page.max);
    
    const changePage = (num: number) => {        
        dispatch(setServersCurrentPage(num))
        dispatch(changeServersOffset(num))
    }
    const incrementPage = () => {
        if (currentPage === maxPage) return;
        changePage(currentPage + 1)
    }
    const decrementPage = () => {
        if (currentPage === 1) return;
        changePage(currentPage - 1);
    }

    const pages = useMemo(() => Array.from({length: maxPage}, (_, i) => i + 1), [maxPage]);

    return {
        pages, 
        page: currentPage,
        setPage: changePage,
        incrementPage,
        decrementPage
    }
}

export default useServersPagination