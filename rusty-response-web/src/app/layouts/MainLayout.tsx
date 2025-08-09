import { Outlet } from 'react-router'
import styles from './index.module.css'
import Sidebar from '../../components/Sidebar/Sidebar'
import Header from '../../components/Header/Header'
import useSwitchSidebar from '../../hooks/useSwitchSidebar'

const MainLayout = () => {
  const {sidebarIsOpen, switchSidebar} = useSwitchSidebar();
  
  return (
    <div className={styles.container}>
      <Sidebar isOpen={sidebarIsOpen}/>
      <div className={styles.containercol}>
        <Header switchSidebar={switchSidebar}/>
        <main className={styles.main}>
          <Outlet/>
        </main>
      </div>
    </div>
  )
}

export default MainLayout