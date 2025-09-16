import { type FC } from 'react'
import styles from './index.module.css'
import Button from '../Button'
interface Props {
    handleCancel: VoidFunction,
    submitText: string
}

const Buttons: FC<Props> = ({submitText, handleCancel}) => {
  return (
    <div className={styles.btns}>
        <Button type='button' onClick={handleCancel}>Cancel</Button>
        <Button type='submit'>{submitText}</Button>
    </div>
  )
}

export default Buttons