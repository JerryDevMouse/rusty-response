import ContentCondition from '../../../components/ContentCodition';
import Loading from '../../../components/Loading';
import NoServers from '../../../components/NoServers'
import Notifiers from '../../../components/Notifiers/Notifiers'
import Pagination from '../../../components/Pagination';
import Text from "../../../components/Text"
import useNotifiers from '../../../hooks/notifiers/useNotifiers';

const Main = () => {
  const {hasContent, isLoading} = useNotifiers()

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