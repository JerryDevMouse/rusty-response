import type { FC } from 'react'
import type { IChildren } from '../../types'
import Text from '../Text'
import styles from './index.module.css'
interface Props extends IChildren {
    subtitle: string
}

const Section: FC<Props> = ({subtitle, children}) => {
  return (
    <section className={styles.section}>
      <Text type="small" weight={600}>{subtitle}</Text>
      <div className={styles.block}>
        {children}
      </div>
    </section>
  )
}

export default Section