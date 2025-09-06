import { Sidebar } from '.'
import styles from './index.module.css'

export const RootSidebar = ({isOpen} : {isOpen: boolean}) => {
  return (
    <aside className={`${styles.sidebar} ${isOpen ? '' : styles.sidebarclose}`}>
      <Sidebar.User />
      <Sidebar.NavSection section='dashboards'/>
      <Sidebar.NavSection section='pages'/>
    </aside>
  )
}
