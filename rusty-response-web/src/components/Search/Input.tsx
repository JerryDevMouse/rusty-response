import type { FC } from 'react'
import styles from './index.module.css'
interface Props {
    name: string,
    inputRef?: React.RefObject<HTMLInputElement | null>,
    gray?: boolean
}
const Input: FC<Props> = ({name, inputRef, gray}) => {
  return (
    <input 
        className={`${styles.input} ${gray ? styles.gray : ''}`}
        type="text" 
        placeholder='Search' 
        ref={inputRef}
        name={name}
    />
  )
}

export default Input