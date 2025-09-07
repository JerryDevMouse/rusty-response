import Animation from "./Animation"
import styles from './index.module.css'

const Table = () => {
  return (
    <tr className={styles.block}>
      <td className={styles.block}>
        <Animation />
      </td>
    </tr>
  )
}
export default Table