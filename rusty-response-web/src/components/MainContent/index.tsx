import { Outlet } from 'react-router'
import styles from '../../app/layouts/index.module.css'

const MainContent = () => {

  return (
    <main className={styles.main}>
      <Outlet/>
    </main>
  )
}

export default MainContent