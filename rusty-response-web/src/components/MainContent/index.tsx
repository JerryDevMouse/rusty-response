import { Outlet } from 'react-router'
import styles from '../../app/layouts/index.module.css'
import { useAppSelector } from '../../app/store/hooks'
import Loading from '../Loading';

const MainContent = () => {
    const serversLoading = useAppSelector(state => state.servers.servers.loading);
    const notifiersLoading = useAppSelector(state => state.servers.notifiersLoading);

    if (serversLoading || notifiersLoading) return <Loading type='block'/>

  return (
    <main className={styles.main}>
        <Outlet/>
    </main>
  )
}

export default MainContent