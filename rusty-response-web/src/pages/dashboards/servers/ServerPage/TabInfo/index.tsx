import { useAppSelector } from '../../../../../app/store/hooks'
import RowInfo from './RowInfo'
import SectionInfo from './SectionInfo'

const TabInfo = () => {
  const server = useAppSelector(state => state.servers.separateServer.server)
  if (!server) return 'Error' //todo: catchError and loading

  return (
      <>
        <SectionInfo title='Server Information'>
          <RowInfo name='Server Name' value={server.name} />
          <RowInfo name='URL' value={server.url} />
          <RowInfo name='Created at' value={server.created_at} />
        </SectionInfo>
        <SectionInfo title='Server Settings'>
          <RowInfo name='Interval' value={server.interval} />
          <RowInfo name='Timeout' value={server.timeout} />
          <RowInfo name='Status' value={server.is_turned_on ? 'Active' : 'Inactive'} />
        </SectionInfo>
      </>
  )
}

export default TabInfo