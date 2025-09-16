import { useState } from 'react'
import Icon from '../../../../../components/Icon/Icon'
import ModalOptions from '../../../../../components/ModalOptions'
import styles from './index.module.css'
import type { IChildren } from '../../../../../types'
interface Props extends IChildren {
    size?: number,
    right?: boolean
}
// todo change directory
const ButtonOptions = ({size = 24, children, right}: Props) => {
    const [isShow, setIsShow] = useState(false);

  return (
    <div className={`${styles.optcontainer} ${right ? styles.right : ''}`}>
        <button 
            onClick={() => setIsShow(c => !c)}
            className={styles.options} 
            style={{
                width: size,
                height: size
            }}
            type='button'
        >
            <Icon name="dots" width={16} />
        </button>
        <ModalOptions isShow={isShow} onMouseLeave={() => setIsShow(false)}>
            {children}
        </ModalOptions>
    </div>
  )
}

export default ButtonOptions