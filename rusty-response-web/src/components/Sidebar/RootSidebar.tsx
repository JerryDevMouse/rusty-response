import Icon from '../Icon/Icon'
import styles from './index.module.css'
import Text from '../Text'
import { Sidebar } from '.'

export const RootSidebar = ({isOpen} : {isOpen: boolean}) => {
  return (
    <aside className={`${styles.sidebar} ${isOpen ? '' : styles.sidebarclose}`}>
        <div className={`${styles.row} ${styles.user}`}>
            <Icon name='avatar' width={24} height={24} color={8}/>
            <Text type='small'>dnflnx</Text>
        </div>
        <Sidebar.NavSection section='dashboards'/>
        <Sidebar.NavSection section='pages'/>
    </aside>
  )
}
