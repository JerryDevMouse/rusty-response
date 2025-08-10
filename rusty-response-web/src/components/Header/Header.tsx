import type { FC } from 'react'
import Icon from '../Icon/Icon'
import Search from '../Search/Search'
import Crumbs from './Crumbs'
import styles from './index.module.css'
interface Props {
  isOpen: boolean,
  switchSidebar: VoidFunction
}

const Header:FC<Props> = ({isOpen, switchSidebar}) => {
  return (
    <header className={styles.header}>
        <div className={styles.left}>
            <button 
              className={styles.button} 
              title={`${isOpen ? 'Close' : 'Open'} Sidebar`}
              onClick={switchSidebar}
            >
                <Icon name='header_windows' width={13} height={13} color={8} />
            </button>
            <Crumbs />
        </div>
        <Search />
    </header>
  )
}

export default Header