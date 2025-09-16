import { useAppSelector } from '../../../app/store/hooks'
import ContentCondition from '../../../components/ContentCodition';
import NoServers from '../../../components/NoServers'
import Table from '../../../components/Table'

const Main = () => {
  const servers = useAppSelector(state => state.servers.servers.list);
  const loading = useAppSelector(state => state.servers.servers.loading)

  return (
    <ContentCondition
      condition={loading || !loading && servers.length > 0}
      fallback={<NoServers text='To get started, add your first server'/>}
    >
      <Table />
    </ContentCondition>
  )
}

export default Main