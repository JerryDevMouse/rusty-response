import { type FC } from 'react'
import type { IChildren } from '../../helpers/types'
import styles from './AuthPages.module.css'

const Container: FC<IChildren> = ({children}) => {
  return (
    <div className={styles.container}>
        {children}
    </div>
)
}

export default Container