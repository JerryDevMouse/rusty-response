import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { getNotifiers } from '../../app/store/thunks/getNotifiers';

const useNotifiers = () => {
  const dispatch = useAppDispatch();
  const servers = useAppSelector(state => state.servers.servers);
  const loadingNotifiers = useAppSelector(state => state.servers.notifiersLoading);
  
  useEffect(() => {
    if (!servers.loading && servers.list.length > 0) {
      dispatch(getNotifiers())
    }
  }, [servers.lastUpdate])

  const isLoading = servers.loading || loadingNotifiers;
  const hasContent = servers.list.length > 0 || isLoading;

  return {hasContent, isLoading}
}

export default useNotifiers