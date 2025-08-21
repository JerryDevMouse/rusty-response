import Text from '../Text'
import Icon from '../Icon/Icon'
import useGetServers from '../../hooks/servers/useGetServers';
import styles from './index.module.css'

const Pagination = () => {
    const {pages, page, setPage, incrementPage, decrementPage} = useGetServers();

  return (
    <section className={styles.pagination}>
      {pages.map(num => (
        <button 
          key={num} 
          className={`${styles.btnpag} ${page === num ? styles.active : ''}`}
          onClick={() => setPage(num)}>
          <Text type='tiny'>{num}</Text>
        </button>
      ))}
      <button className={styles.btnpag} onClick={decrementPage}>
        <Icon name='arrow_left' width={10} height={10}></Icon>
      </button>
      <button className={styles.btnpag} onClick={incrementPage}>
        <Icon name='arrow_right' width={10} height={10}></Icon>
      </button>
    </section>
  )
}

export default Pagination