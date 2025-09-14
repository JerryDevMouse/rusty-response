import { type FC } from 'react'
import styles from './AuthPages.module.css'
import type { IChildren } from '../../types'
import ModalUI from '../ModalUI'

const Container: FC<IChildren> = ({children}) => {
  return (
    <div className={styles.container}>
      {children}
      <ModalUI />
    </div>
)
}

export default Container