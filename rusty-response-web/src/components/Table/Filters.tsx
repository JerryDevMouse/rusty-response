import { Link } from 'react-router'
import useInput from '../../hooks/useInput'
import Icon from '../Icon/Icon'
import Search from '../Search'
import styles from './index.module.css'

const Filters = () => {
    const {inputRef, focusInput} = useInput();
  return (
    <section className={styles.filters}>
        <div className={styles.filtersBtns}>
            <Link to={'/dashboards/servers/create'}>
                <Icon name='plus' height={10} width={10} />
            </Link>
            <button>
                <Icon name='list_sort' height={10} width={10} />
            </button>
        </div>
        <Search onSubmit={e => e.preventDefault()}>
            <Search.ButtonSearch onClick={focusInput}/>
            <Search.Input 
                name='filtersSearch' 
                inputRef={inputRef} gray
            />
        </Search>
    </section>
  )
}

export default Filters