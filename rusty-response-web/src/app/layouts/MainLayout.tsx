import { Outlet } from 'react-router'
import styles from './index.module.css'
import Sidebar from '../../components/Sidebar/Sidebar'

const MainLayout = () => {

  return (
    <div className={styles.container}>
      <Sidebar/>
      <div className={styles.containercol}>
        <header className={styles.header}>
          
        </header>
        <main className={styles.main}>
          <Outlet/>
        </main>
      </div>
    </div>
  )
}

export default MainLayout