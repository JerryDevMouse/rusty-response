import useSearch from '../../hooks/useSearch'
import Icon from '../Icon/Icon'
import Text from '../Text'
import styles from './index.module.css'

const Search = () => {
    const {inputRef, focusInput} = useSearch();

  return (
    <div className={styles.search}>
        <button className={styles.searchbtn} onClick={focusInput}>
            <Icon name='search' width={13} height={13} />
        </button>
        <input type="text" placeholder='Search' className={styles.input} ref={inputRef}/>
        <button className={styles.searchhint}>
            <div className={styles.hint}>
                <Text type='tiny' color={2}>/</Text>
            </div>
        </button>
    </div>
  )
}

export default Search