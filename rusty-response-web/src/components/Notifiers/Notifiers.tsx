import { useAppSelector } from '../../app/store/hooks'
import NotifierCard from './NotifierCard'
import styles from './index.module.css'

const Notifiers = () => {
  const servers = useAppSelector(state => state.servers.servers.list);

  return (
    <section className={styles.section}>
      {servers.map(s => 
        <NotifierCard  
          key={s.id}
          serverId={s.id}
          serverName={s.name}
          serverURL={s.url}
          notifiers={s.notifiers}
        />

      )}
    </section>
  )
}

export default Notifiers