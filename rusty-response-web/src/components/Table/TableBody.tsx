import { useAppSelector } from '../../app/store/hooks'
import Icon from '../Icon/Icon';
import Text from '../Text';
import Status from './Status';
import styles from './index.module.css'

const TableBody = () => {
  const servers = useAppSelector(state => state.servers.servers);
  return (
    <tbody>
        {servers.map(server => (
            <tr key={server.id}>
                <td>
                    <Text type='tiny'>{server.id}</Text>
                </td>
                <td>
                    <Text type='tiny'>{server.name}</Text>
                </td>
                <td>
                    <Text type='tiny'>{server.url}</Text>
                </td>
                <td>
                    <Text type='tiny'>{server.last_seen_reason ?? 'No errors'}</Text>
                </td>
                <td>
                    <div className={styles.row}>
                    <Icon name='date' width={13} height={13} />
                    <Text type='tiny'>{server.updated_at}</Text>
                    </div>
                </td>
                <td>
                    <Status 
                    isTurned={server.is_turned_on} 
                    statusCode={server.last_seen_status_code}
                    />
                </td>
                <button className={styles.options}>
                    <Icon name='dots' width={16} height={16} />
                </button>
            </tr>
        ))}
    </tbody>
  )
}

export default TableBody