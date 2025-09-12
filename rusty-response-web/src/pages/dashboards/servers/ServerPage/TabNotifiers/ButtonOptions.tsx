import { useState } from 'react'
import Icon from '../../../../../components/Icon/Icon'
import ModalOptions from '../../../../../components/ModalOptions'
import styles from './index.module.css'
import type { IChildren } from '../../../../../helpers/types'
interface Props extends IChildren {
    size?: number
}
const ButtonOptions = ({size = 24, children}: Props) => {
    const [isShow, setIsShow] = useState(false);

  return (
    <div style={{position: 'relative'}}>
        <button 
            onClick={() => setIsShow(c => !c)}
            className={styles.options} 
            style={{
                width: size,
                height: size
            }}
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