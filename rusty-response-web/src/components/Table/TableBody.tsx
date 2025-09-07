import { Link } from 'react-router';
import { useAppSelector } from '../../app/store/hooks'
import Icon from '../Icon/Icon';
import Text from '../Text';
import Status from './Status';
import styles from './index.module.css'
import useModalById from '../../hooks/useModalById';
import useDeleteServer from '../../hooks/servers/useDeleteServer';

const TableBody = () => {
    const servers = useAppSelector(state => state.servers.servers.list);
    const {modalId, resetModalId, toggleModalId} = useModalById();
    const deleteServer = useDeleteServer();
    
  return (
    <>
        {servers.map(server => (
            <tr key={server.id} onMouseLeave={() => resetModalId(server.id)}>
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
                <td className={styles.options} title='Options' onClick={() => toggleModalId(server.id)}>
                    <button>
                        <Icon name='dots' width={16} height={16} />
                    </button>
                </td>
                <td className={`${styles.modal} ${modalId === server.id ? styles.show : ''}`}>
                    <Link to={''}>
                        <Icon name='visit' width={10} height={10} />
                        <Text type='tiny'>Visit</Text>
                    </Link>
                    <Link to={''}>
                        <Icon name='edit' width={10} height={10} />
                        <Text type='tiny'>Edit</Text>
                    </Link>
                    <button onClick={() => deleteServer(server.id)}>
                        <Icon name='delete' width={10} height={10} />
                        <Text type='tiny'>Delete</Text>
                    </button>
                </td>
            </tr>
        ))}
    </>
  )
}

export default TableBody