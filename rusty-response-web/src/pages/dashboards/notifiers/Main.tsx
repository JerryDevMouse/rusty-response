import { useAppSelector } from '../../../app/store/hooks'
import { Loading } from '../../../components/Loading'
import NoServers from '../../../components/NoServers'
import Notifiers from '../../../components/Notifiers/Notifiers'

import Text from "../../../components/Text"

const Main = () => {
  const servers = useAppSelector(state => state.servers.servers);
  const loading = useAppSelector(state => state.servers.notifiersLoading);

  if (servers.loading || loading) return <Loading type='block'/>
  
  return (
    <>
      {servers.list.length > 0 ?
      <>
        <h2><Text type="xl" mbottom={6} weight={600}>Notifiers</Text></h2>
        <Text type="small" color={5} mbottom={23}>Manage notification channels for each server</Text>
        <Notifiers />
      </>
      :
        <NoServers text='To set up notifications, create at least one server'/>
      }
    </>
  )
}

export default Main