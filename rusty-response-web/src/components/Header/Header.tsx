import styles from './index.module.css'
import Icon from '../Icon/Icon'
import Search from '../Search/Search'
import Crumbs from './Crumbs'

const Header = () => {
  return (
    <header className={styles.header}>
        <div className={styles.left}>
            <button className={styles.button}>
                <Icon name='header_windows' width={13} height={11} color={8} />
            </button>
            <Crumbs />
        </div>
        <Search />
    </header>
  )
}

export default Header