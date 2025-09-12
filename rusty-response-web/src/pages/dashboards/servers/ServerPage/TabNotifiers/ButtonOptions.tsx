import { useState } from 'react'
import Icon from '../../../../../components/Icon/Icon'
import ModalOptions from '../../../../../components/ModalOptions'
import styles from './index.module.css'
import { useNavigate } from 'react-router'
import useDeleteServer from '../../../../../hooks/servers/useDeleteServer'
interface Props {
    size?: number
    id: string
}
const ButtonOptions = ({size = 24, id}: Props) => {
    const [isShow, setIsShow] = useState(false);
    const navigate = useNavigate();
    const deleteServer = useDeleteServer();
    const handleDeleteServer = () => {
        deleteServer(Number(id));
        navigate('/dashboards/servers');
    }
    
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
      <ModalOptions isShow={isShow} >
        <ModalOptions.OptionLink 
            iconName='edit'    
            to={`/dashboards/servers/edit/${id}`}
            label='Edit'
        />
        <ModalOptions.OptionButton 
            iconName='delete'
            handleClick={handleDeleteServer}
            label='Delete'
        />
    </ModalOptions>
    </div>
  )
}

export default ButtonOptions