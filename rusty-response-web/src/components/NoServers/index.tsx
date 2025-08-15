import { Link } from 'react-router'
import Icon from '../Icon/Icon'
import Text from '../Text'
import styles from './index.module.css'
import noServersIcon from '/icons/no_servers.png'

const NoServers = ({text}: {text: string}) => {
  return (
    <div className={styles.container}>
        <div className={styles.content}>
            <img src={noServersIcon} alt="no servers" />
            <div className={styles.title}>
                <Text type='xxl' weight={600}>No servers</Text>
            </div>
            <div className={styles.text}>
                <Text type='small' weight={500} color={5}>{text}</Text>
            </div>
            <Link className={styles.link} to='/dashboards/servers/create'>
                <Icon name='plus' width={17} height={17} />
                <Text type='small' weight={600}>Add a server</Text>
            </Link>
        </div>
    </div>
  )
}

export default NoServers