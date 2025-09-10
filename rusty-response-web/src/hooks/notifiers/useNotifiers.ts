import { useAppSelector } from '../../app/store/hooks';
import useFetchNotifiers from './useFetchNotifiers';

const useNotifiers = () => {
  const servers = useAppSelector(state => state.servers.servers);
  const loadingNotifiers = useAppSelector(state => state.servers.notifiersLoading);
  
  useFetchNotifiers();

  const isLoading = servers.loading || loadingNotifiers;
  const hasContent = servers.list.length > 0 || isLoading;

  return {hasContent, isLoading}
}

export default useNotifiers