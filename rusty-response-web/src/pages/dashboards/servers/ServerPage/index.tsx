import { useState } from "react"
import Text from "../../../../components/Text"
import styles from './index.module.css'
import TabInfo from "./TabInfo"
import { useParams } from "react-router"
const tabs = ['Info', 'Notifiers', 'Logs']

const ServerPage = () => {
    const [tab, setTab] = useState(tabs[0]);
    const {id} = useParams();
  return (
    <>
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
        <TabInfo id={Number(id)} />
    </>
  )
}

export default ServerPage