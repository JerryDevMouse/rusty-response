// import NoServers from '../../../components/NoServers'
import Notifiers from '../../../components/Notifiers/Notifiers'

import Text from "../../../components/Text"

const Main = () => {
  return (
    // <NoServers text='To set up notifications, create at least one server'/>
    <>
      <h2><Text type="xl" mbottom={6} weight={600}>Notifiers</Text></h2>
      <Text type="small" color={5} mbottom={23}>Manage notification channels for each server</Text>
      <Notifiers />
    </>
  )
}

export default Main