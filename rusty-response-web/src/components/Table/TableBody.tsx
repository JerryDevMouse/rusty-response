import { useAppSelector } from '../../app/store/hooks'
import useServerOptions from '../../hooks/servers/useServerOptions';
import Icon from '../Icon/Icon';
import Text from '../Text';
import Status from './Status';
import useModalById from '../../hooks/useModalById';
import ModalOptions from '../ModalOptions';
import styles from './index.module.css'

const TableBody = () => {
    const servers = useAppSelector(state => state.servers.servers.list);
    const {modalId, resetModalId, toggleModalId} = useModalById();
    const {deleteServer} = useServerOptions();
    
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
                    <Text type='tiny'>{server.last_seen_reason || 'No errors'}</Text>
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
                <ModalOptions isShow={modalId === server.id} isTable onMouseLeave={() => resetModalId(modalId)}>
                    <ModalOptions.OptionLink 
                        iconName='visit'    
                        to={`/dashboards/servers/${server.id}`}
                        label='Visit'
                    />
                    <ModalOptions.OptionLink 
                        iconName='edit'    
                        to={`/dashboards/servers/edit/${server.id}`}
                        label='Edit'
                    />
                    <ModalOptions.OptionButton 
                        iconName='delete'
                        handleClick={() => deleteServer(server.id)}
                        label='Delete'
                    />
                </ModalOptions>
            </tr>
        ))}
    </>
  )
}

export default TableBody