import type { FC } from 'react'
import type { IButtonProps } from '../../helpers/types'
import Text from '../Text'
import styles from './index.module.css'

const Button: FC<IButtonProps>= ({children, onClick, type}) => {
  return (
    <button className={styles[type]} onClick={onClick}>
        <Text type='small'>{children}</Text>
    </button>
  )
}

export default Button