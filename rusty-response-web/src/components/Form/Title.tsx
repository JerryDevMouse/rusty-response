import Text from '../Text'
import styles from './index.module.css'
import type { IChildren } from '../../types'

const Title = ({children}: IChildren) => {
  return (
    <div className={styles.title}>
      <Text type="xl" weight={600}>{children}</Text>
    </div>
  )
}

export default Title