import Text from '../Text'
import Filters from './Filters'
import styles from './index.module.css'

const tableHeads = ['Server ID', 'Name', 'URL', 'Last Error', 'Last Date', 'Status']
const tableBody = [1, 'BoostCLock', 'https://boost-clock.vercel.apdasdasdasdasdasdasdasdasdasdp/', 'TypeError', '1 hour ago', 'Pause']
const Table = () => {
  return (
  <>
    <Text type='xl' weight={600} mbottom={18}>Servers List</Text>
    <Filters />
    <table className={styles.table}>
      <thead>
        <tr>
          {tableHeads.map(name => (
            <td key={name}>
              <Text type='tiny' color={4}>{name}</Text>
            </td>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {tableBody.map(name => (
            <td key={name}>
              <Text type='tiny'>{name}</Text>
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  </>
  )
}

export default Table