import styles from './index.module.css'
import Icon from '../Icon/Icon'
import { Link } from 'react-router'
import Text from '../Text'
import Search from '../Search/Search'

const Header = () => {
  return (
    <header className={styles.header}>
        <div className={styles.left}>
            <button className={styles.button}>
                <Icon name='header_windows' width={13} height={11} color={8} />
            </button>
            <div className={styles.crumbs}>
                <Link to='#'><Text type='tiny' color={4}>Dashboards</Text></Link>
                <Text type='tiny' color={4}>/</Text>
                <Link to='#'><Text type='tiny'>Notifiers</Text></Link>
            </div>
        </div>
        <Search />
    </header>
  )
}

export default Header