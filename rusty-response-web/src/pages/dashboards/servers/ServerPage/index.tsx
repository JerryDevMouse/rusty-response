import { useState } from "react"
import Text from "../../../../components/Text"
import styles from './index.module.css'
import TabInfo from "./TabInfo"
import { useNavigate, useParams } from "react-router"
import TabNotifiers from "./TabNotifiers"
import TabLogs from "./TabLogs"
import ButtonOptions from "./TabNotifiers/ButtonOptions"
import useGetServerById from "../../../../hooks/useGetDataById"
import Loading from "../../../../components/Loading"
import { useAppSelector } from "../../../../app/store/hooks"
import useDeleteServer from "../../../../hooks/servers/useDeleteServer"
import ModalOptions from "../../../../components/ModalOptions"
const tabs = ['Info', 'Notifiers', 'Logs']

const ServerPage = () => {
    const {id} = useParams();
    useGetServerById(Number(id));

    const navigate = useNavigate();
    const deleteServer = useDeleteServer();
    const handleDeleteServer = () => {
        deleteServer(Number(id));
        navigate('/dashboards/servers');
    }

    const [tab, setTab] = useState(tabs[0]);
    const loading = useAppSelector(state => state.servers.separateServer.loading)

    const renderTab = () => {
        if (tab === tabs[0]) return <TabInfo />
        if (tab === tabs[1]) return <TabNotifiers />
        if (tab === tabs[2]) return <TabLogs />
    }

  return (
    <>
        <div className={styles.top}>
            <div className={styles.tabs}>
                {tabs.map(name => (
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
                    to={`/dashboards/servers/edit/${id}`}
                    label='Edit'
                />
                <ModalOptions.OptionButton 
                    iconName='delete'
                    handleClick={handleDeleteServer}
                    label='Delete'
                />
            </ButtonOptions>
        </div>
        <Loading.ConditionalLoader
            isLoading={loading}
            loader={<Loading.Basic />}
        >
            {renderTab()}        
        </Loading.ConditionalLoader>
    </>
  )
}

export default ServerPage