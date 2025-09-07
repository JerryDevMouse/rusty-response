import { useAppSelector } from '../../app/store/hooks';
import { LoadingTable } from '../Loading';
import Text from '../Text'
import Filters from './Filters'
import styles from './index.module.css'
import Pagination from './Pagination';
import TableBody from './TableBody';
import TableHead from './TableHead';

const Table = () => {
  const loading = useAppSelector(state => state.servers.servers.loading);

  return (
  <>
    <Text type='xl' weight={600} mbottom={18}>Servers List</Text>
    <Filters />
    <table className={styles.table}>
        <TableHead />
        {!loading ? 
          <TableBody />
        :
          <tbody className={styles.loading}>
            <LoadingTable type='block'/>
          </tbody>
        }
    </table>
    <Pagination />
  </>
  )
}

export default Table