import styles from './index.module.css'
import Header from '../../components/Header/Header'
import useSwitchSidebar from '../../hooks/useSwitchSidebar'
import { Sidebar } from '../../components/Sidebar'
import Footer from '../../components/Footer'
import useFetchData from '../../hooks/useFetchData'
import MainContent from '../../components/MainContent'

const MainLayout = () => {
  const {sidebarIsOpen, switchSidebar} = useSwitchSidebar();
  useFetchData();
  
  return (
    <div className={styles.container}>
      <Sidebar isOpen={sidebarIsOpen}/>
      <div className={styles.gridcontainer}>
        <Header isOpen={sidebarIsOpen} switchSidebar={switchSidebar}/>
        <MainContent />
        <Footer/>
      </div>
    </div>
  )
}

export default MainLayout