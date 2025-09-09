import { useAppSelector } from '../../../app/store/hooks'
import ContentCondition from '../../../components/ContentCodition';
import Loading from '../../../components/Loading';
import NoServers from '../../../components/NoServers'
import Notifiers from '../../../components/Notifiers/Notifiers'
import Pagination from '../../../components/Pagination';
import Text from "../../../components/Text"

const Main = () => {
  const servers = useAppSelector(state => state.servers.servers);
  const loadingNotifiers = useAppSelector(state => state.servers.notifiersLoading);
  
  const isLoading = servers.loading || loadingNotifiers;
  const hasContent = servers.list.length > 0 || isLoading;

  return (
    <ContentCondition 
      condition={hasContent}
      fallback={<NoServers 
        text='To set up notifications, create at least one server'/>
      }
    >
      <h2><Text type="xl" mbottom={6} weight={600}>Notifiers</Text></h2>
      <Text type="small" color={5} mbottom={23}>
        Manage notification channels for each server
      </Text>
      <Loading.ConditionalLoader
        isLoading={isLoading}
        loader={<Loading.Basic type='block'/>}
      >
        <Notifiers />
      </Loading.ConditionalLoader>
      <Pagination />
    </ContentCondition>
  );
};

export default Main