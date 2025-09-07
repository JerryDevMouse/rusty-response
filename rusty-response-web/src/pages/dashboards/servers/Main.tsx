import { useAppSelector } from '../../../app/store/hooks'
import NoServers from '../../../components/NoServers'
import Table from '../../../components/Table'

const Main = () => {
  const servers = useAppSelector(state => state.servers.servers.list);
  const loading = useAppSelector(state => state.servers.servers.loading)

  return (
    <>
    {(loading || !loading && servers.length > 0) ?
      <Table />
    :
      <NoServers text='To get started, add your first server'/>
    }
    </>
  )
}

export default Main