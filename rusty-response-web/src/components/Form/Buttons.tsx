import { type FC } from 'react'
import styles from './index.module.css'
import Button from '../Button'
interface Props {
    handleSubmit: VoidFunction,
    handleCancel: VoidFunction,
    submitText: string
}

const Buttons: FC<Props> = ({handleSubmit, submitText, handleCancel}) => {
  return (
    <div className={styles.btns}>
        <Button type='gray' onClick={handleCancel}>Cancel</Button>
        <Button type='main' onClick={handleSubmit}>{submitText}</Button>
    </div>
  )
}

export default Buttons