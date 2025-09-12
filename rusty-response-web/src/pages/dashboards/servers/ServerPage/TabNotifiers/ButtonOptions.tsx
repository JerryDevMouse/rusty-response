import { useState } from 'react'
import Icon from '../../../../../components/Icon/Icon'
import ModalOptions from '../../../../../components/ModalOptions'
import styles from './index.module.css'
interface Props {
    size?: number
}
const ButtonOptions = ({size = 24}: Props) => {
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
      <ModalOptions isShow={isShow} isTable >
        <ModalOptions.OptionLink 
            iconName='edit'    
            to={``}
            label='Edit'
        />
        <ModalOptions.OptionButton 
            iconName='delete'
            handleClick={() => {}}
            label='Delete'
        />
    </ModalOptions>
    </div>
  )
}

export default ButtonOptions