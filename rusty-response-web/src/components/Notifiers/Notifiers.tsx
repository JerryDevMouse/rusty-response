import NotifierCard from './NotifierCard'
import styles from './index.module.css'

const Notifiers = () => {
  return (
    <section className={styles.section}>
        <NotifierCard />
        <NotifierCard />
        <NotifierCard />
        <NotifierCard />
        <NotifierCard />
    </section>
  )
}

export default Notifiers