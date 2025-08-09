import Icon from '../Icon/Icon'
import styles from './index.module.css'
import Text from '../Text'
import { NavLink } from 'react-router'

const Sidebar = ({isOpen} : {isOpen: boolean}) => {
  return (
    <aside className={`${styles.sidebar} ${isOpen ? '' : styles.sidebarclose}`}>
        <div className={`${styles.row} ${styles.user}`}>
            <Icon name='avatar' width={24} height={24} color={8}/>
            <Text type='small'>dnflnx</Text>
        </div>
        <section className={styles.block}>
            <div className={styles.title}>
                <Text type='tiny' color={4}>Dashboards</Text>
            </div>
            <nav className={styles.nav}>
                <NavLink to='/dashboards/overview' className={({isActive}) => 
                    `${styles.link} ${styles.row} ${isActive ? styles.active : ''}`
                }>
                    <Icon name='sidebar_overview' width={16} height={16}></Icon>
                    <Text type='tiny'>Overview</Text>
                </NavLink>
                <NavLink to='/dashboards/servers' className={({isActive}) => 
                    `${styles.link} ${styles.row} ${isActive ? styles.active : ''}`
                }>
                    <Icon name='sidebar_servers' width={16} height={16}></Icon>
                    <Text type='tiny'>Servers</Text>
                </NavLink>
                <NavLink to='/dashboards/notifiers' className={({isActive}) => 
                    `${styles.link} ${styles.row} ${isActive ? styles.active : ''}`
                }>
                    <Icon name='sidebar_notifiers' width={16} height={16}></Icon>
                    <Text type='tiny'>Notifiers</Text>
                </NavLink>
            </nav>
        </section>
        <section className={styles.block}>
            <div className={styles.title}>
                <Text type='tiny' color={4}>Pages</Text>
            </div>
            <nav className={styles.nav}>
                <NavLink to='/pages/docs' className={({isActive}) => 
                    `${styles.link} ${styles.row} ${isActive ? styles.active : ''}`
                }>
                    <Icon name='sidebar_docs' width={16} height={16}></Icon>
                    <Text type='tiny'>Docs</Text>
                </NavLink>
            </nav>
        </section>
    </aside>
  )
}

export default Sidebar