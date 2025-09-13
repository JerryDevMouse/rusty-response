import { useNavigate } from 'react-router';
import useServerOptions from '../../../../hooks/servers/useServerOptions';
import ModalOptions from '../../../../components/ModalOptions';
import { serverPageTabs } from '../../../../constants/text';
import ButtonOptions from './TabNotifiers/ButtonOptions';
import Text from '../../../../components/Text';
import styles from './index.module.css'
interface Props {
    tab: string,
    setTab: (value: string) => void,
    serverId: number
}

const TabsNav = ({tab, setTab, serverId}: Props) => {
    const navigate = useNavigate();
    const {deleteServer} = useServerOptions();
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