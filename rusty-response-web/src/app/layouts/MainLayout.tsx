import { Outlet } from 'react-router'
import styles from './index.module.css'
import Sidebar from '../../components/Sidebar/Sidebar'
import Header from '../../components/Header/Header'

const MainLayout = () => {

  return (
    <div className={styles.container}>
      <Sidebar/>
      <div className={styles.containercol}>
        <Header/>
        <main className={styles.main}>
          <Outlet/>
        </main>
      </div>
    </div>
  )
}

export default MainLayout