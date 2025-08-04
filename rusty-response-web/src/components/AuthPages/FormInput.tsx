import type { FC } from 'react'
import styles from './AuthPages.module.css'
interface Props {
    name: 'login' | 'password',
    placeholder: 'Login' | 'Password'
}

const FormInput: FC<Props> = ({name, placeholder}) => {
  return (
    <input 
        className={styles.input} 
        name={name}
        type={name === 'password' ? 'password' : 'text'} 
        placeholder={placeholder}
        required
    />
  )
}

export default FormInput