import type { IChildren } from '../../helpers/types'
import styles from './index.module.css'
import OptionButton from './OptionButton'
import OptionLink from './OptionLink'
interface Props extends IChildren {
    isShow: boolean,
    isTable?: boolean,
}

const Modal = ({children, isShow, isTable = false}: Props) => {
    if (isTable) return (
        <td className={`${styles.modal} ${isShow ? styles.show : ''}`}>
            {children}
        </td>
    )

  return (
    <div className={`${styles.modal} ${isShow ? styles.show : ''}`}>
        {children}
    </div>
  )
}

const ModalOptions = Object.assign(Modal, {
    OptionLink,
    OptionButton
})

export default ModalOptions