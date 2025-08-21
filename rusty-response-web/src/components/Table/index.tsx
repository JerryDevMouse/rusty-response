import Text from '../Text'
import Filters from './Filters'
import styles from './index.module.css'
import Pagination from './Pagination';
import TableBody from './TableBody';
import TableHead from './TableHead';

const Table = () => {

  return (
  <>
    <Text type='xl' weight={600} mbottom={18}>Servers List</Text>
    <Filters />
    <table className={styles.table}>
      <TableHead />
      <TableBody />
    </table>
    <Pagination />
  </>
  )
}

export default Table