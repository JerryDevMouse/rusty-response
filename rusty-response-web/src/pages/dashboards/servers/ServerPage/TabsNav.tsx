import { useNavigate } from 'react-router';
import ModalOptions from '../../../../components/ModalOptions';
import Text from '../../../../components/Text';
import { serverPageTabs } from '../../../../constants/text';
import styles from './index.module.css'
import ButtonOptions from './TabNotifiers/ButtonOptions';
import useDeleteServer from '../../../../hooks/servers/useDeleteServer';
interface Props {
    tab: string,
    setTab: (value: string) => void,
    serverId: number
}

const TabsNav = ({tab, setTab, serverId}: Props) => {
    const navigate = useNavigate();
    const deleteServer = useDeleteServer();
    const handleDeleteServer = () => {
        deleteServer(serverId);
        navigate('/dashboards/servers');
    }

  return (
    <div className={styles.top}>
        <div className={styles.tabs}>
            {serverPageTabs.map(name => (
                <button 
                    key={name}
                    className={`${styles.tabButton} ${tab === name ? styles.active : ''}`}
                    onClick={() => setTab(name)}
                >
                    <Text type='small'>{name}</Text>
                </button>
            ))}
        </div>
        <ButtonOptions size={28}>
            <ModalOptions.OptionLink 
                iconName='edit'    
                to={`/dashboards/servers/edit/${serverId}`}
                label='Edit'
            />
            <ModalOptions.OptionButton 
                iconName='delete'
                handleClick={handleDeleteServer}
                label='Delete'
            />
        </ButtonOptions>
    </div>
  )
}

export default TabsNav