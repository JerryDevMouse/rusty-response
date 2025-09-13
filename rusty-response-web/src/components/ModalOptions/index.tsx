import type { IChildren } from '../../types'
import styles from './index.module.css'
import OptionButton from './OptionButton'
import OptionLink from './OptionLink'
interface Props extends IChildren {
    isShow: boolean,
    isTable?: boolean,
    onMouseLeave: VoidFunction
}

const Modal = ({children, isShow, isTable = false, onMouseLeave}: Props) => {
    if (isTable) return (
        <td className={`${styles.modal} ${isShow ? styles.show : ''}`} onMouseLeave={onMouseLeave}>
            {children}
        </td>
    )

  return (
    <div className={`${styles.modal} ${isShow ? styles.show : ''}`} onMouseLeave={onMouseLeave}>
        {children}
    </div>
  )
}

const ModalOptions = Object.assign(Modal, {
    OptionLink,
    OptionButton
})

export default ModalOptions