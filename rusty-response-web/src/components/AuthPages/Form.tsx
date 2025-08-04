import type { FC, FormEvent } from 'react'
import type { IChildren } from '../../helpers/types'
import styles from './AuthPages.module.css'

interface Props extends IChildren {
    onSubmit: (formData: FormData) => void; 
}

const Form: FC<Props> = ({onSubmit, children}) => {
    
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        onSubmit(formData);
    }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
        {children}
    </form>
  )
}

export default Form