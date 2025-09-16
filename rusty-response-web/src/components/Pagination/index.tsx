import useServersPagination from "../../hooks/servers/useServersPagination";
import Icon from "../Icon/Icon";
import Text from "../Text";
import styles from './index.module.css'

const Pagination = () => {
    const {pages, page, setPage, incrementPage, decrementPage} = useServersPagination();

  return (
    <section className={styles.pagination}>
      {pages.map(num => (
        <button 
          key={num} 
          className={`${styles.button} ${page === num ? styles.active : ''}`}
          onClick={() => setPage(num)}>
          <Text type='tiny'>{num}</Text>
        </button>
      ))}
      <button className={styles.button} onClick={decrementPage}>
        <Icon name='arrow_left' width={10} height={10}></Icon>
      </button>
      <button className={styles.button} onClick={incrementPage}>
        <Icon name='arrow_right' width={10} height={10}></Icon>
      </button>
    </section>
  )
}

export default Pagination