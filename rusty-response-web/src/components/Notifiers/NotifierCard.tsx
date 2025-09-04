import Text from '../Text'
import Icon from '../Icon/Icon'
import { Link } from 'react-router'
import styles from './index.module.css'
import type { IStateServer } from '../../app/store/slices/serversSlice'
import type { INotify } from '../../types/notifiers'
interface Props {
  serverId: IStateServer['id'],
  serverName: IStateServer['name'],
  serverURL: IStateServer['url'],
  notifiers: IStateServer['notifiers']
}

const NotifierCard = ({serverId, serverName, serverURL, notifiers}: Props) => {
  const notifiersProviders = notifiers.reduce((acc, n) => {
    const isAlreadyHas = acc.includes(n.provider);
    if (isAlreadyHas) return acc
    return [...acc, n.provider]
  }, [] as INotify['provider'][]);

  return (
    <div className={styles.notifier}>
      <div className={styles.top}>
        <Text type='tiny' weight={600} mbottom={6}>{serverName}</Text>
        <button className={styles.link}>
          <Icon name='link' width={12} color={5} />
          <Text type='tiny' color={5}>{serverURL}</Text>
        </button>
      </div>
      <div className={styles.line}></div>
      <div className={styles.bottom}>
        <Text type='tiny' mbottom={8} color={5}>Notifiers</Text>
        <div className={styles.buttons}>
          <div className={styles.operators}>
            {notifiersProviders.map(provider => 
              <Link key={provider} to=''><Icon name={provider} width={25} /></Link>
            )}
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