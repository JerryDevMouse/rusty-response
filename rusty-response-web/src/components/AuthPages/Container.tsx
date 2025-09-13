import { type FC } from 'react'
import styles from './AuthPages.module.css'
import type { IChildren } from '../../types'

const Container: FC<IChildren> = ({children}) => {
  return (
    <div className={styles.container}>
      {children}
    </div>
)
}

export default Container