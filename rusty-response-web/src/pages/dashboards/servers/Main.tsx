import NoServers from '../../../components/NoServers'
import Table from '../../../components/Table'
import useFetchServers from '../../../hooks/servers/useFetchServers';

const Main = () => {
  const servers = useFetchServers();

  return (
    <>
    {servers.length > 0 ?
      <Table />
    :
      <NoServers text='To get started, add your first server'/>
    }
    </>
  )
}

export default Main