import type { FC } from 'react'
import Icon from '../Icon/Icon'
import Search from '../Search'
import Crumbs from './Crumbs'
import styles from './index.module.css'
import useSearch from '../../hooks/useSearch'
interface Props {
  isOpen: boolean,
  switchSidebar: VoidFunction
}

const Header:FC<Props> = ({isOpen, switchSidebar}) => {
  const {inputRef, focusInput} = useSearch();

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
        <Search onSubmit={(e) => {e.preventDefault()}}>
          <Search.ButtonSearch onClick={focusInput}/>
          <Search.Input name='headerSearch' inputRef={inputRef}/>
          <Search.ButtonHint onClick={focusInput}/>
        </Search>
    </header>
  )
}

export default Header