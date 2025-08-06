import { NavLink, Outlet } from 'react-router'
import styles from './index.module.css'
import Icon from '../../components/Icon/Icon'

const MainLayout = () => {

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <Icon name='avatar' width={24} height={24} color={8}/>
      </aside>
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