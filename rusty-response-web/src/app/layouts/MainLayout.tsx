import { Outlet } from 'react-router'
import styles from './index.module.css'
import Header from '../../components/Header/Header'
import useSwitchSidebar from '../../hooks/useSwitchSidebar'
import { Sidebar } from '../../components/Sidebar'
import Footer from '../../components/Footer'

const MainLayout = () => {
  const {sidebarIsOpen, switchSidebar} = useSwitchSidebar();
  
  return (
    <div className={styles.container}>
      <Sidebar isOpen={sidebarIsOpen}/>
      <div className={styles.gridcontainer}>
        <Header isOpen={sidebarIsOpen} switchSidebar={switchSidebar}/>
        <main className={styles.main}>
          <Outlet/>
        </main>
        <Footer/>
      </div>
    </div>
  )
}

export default MainLayout