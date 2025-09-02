import Text from '../Text'
import Icon from '../Icon/Icon'
import { Link } from 'react-router'
import styles from './index.module.css'

const NotifierCard = () => {
  return (
    <div className={styles.notifier}>
      <div className={styles.top}>
        <Text type='tiny' weight={600} mbottom={6}>BoostClock</Text>
        <button className={styles.link}>
          <Icon name='link' width={12} color={5} />
          <Text type='tiny' color={5}>https://boost-clock.vercel.app/</Text>
        </button>
      </div>
      <div className={styles.line}></div>
      <div className={styles.bottom}>
        <Text type='tiny' mbottom={8} color={5}>Notifiers</Text>
        <div className={styles.buttons}>
          <div className={styles.operators}>
            <Link to=''><Icon name='telegram' width={25} /></Link>
            <Link to=''><Icon name='discord' width={25} /></Link>
            <Link to='/dashboards/notifiers/create' className={styles.add}>
              <Icon name='plus' width={10}></Icon>
            </Link>
          </div>
          <button className={styles.options}>
            <Icon name='dots' width={20}/>
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotifierCard