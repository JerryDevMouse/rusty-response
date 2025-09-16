import type { FC } from 'react'
import Text from '../Text'
import styles from './index.module.css'
import type { IChildren } from '../../types'
export interface IButtonProps extends IChildren {
  onClick?: VoidFunction,
  type: 'submit' | 'button'
}

const Button: FC<IButtonProps>= ({children, onClick, type}) => {
  return (
    <button className={styles[type]} onClick={onClick} type={type}>
        <Text type='small'>{children}</Text>
    </button>
  )
}

export default Button