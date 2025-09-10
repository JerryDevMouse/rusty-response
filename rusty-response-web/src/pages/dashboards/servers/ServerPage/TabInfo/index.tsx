import useGetServerById from '../../../../../hooks/servers/useGetServerById'
import type { IServer } from '../../../../../types/servers'
import RowInfo from './RowInfo'
import SectionInfo from './SectionInfo'
interface Props {
  id: IServer['id']
}

const TabInfo = ({id}: Props) => {
  const {server} = useGetServerById(id);
  if (!server) return 'Error'

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