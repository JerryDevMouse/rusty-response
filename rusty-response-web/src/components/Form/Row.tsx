import type { IChildren } from '../../types'
import styles from './index.module.css'

const Row = ({children}: IChildren) => {
  return (
    <div className={styles.row}>
        {children}
    </div>
  )
}

export default Row