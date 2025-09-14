import useModalUI from '../../hooks/useModalUI'
import Icon from '../Icon/Icon';
import Text from '../Text';
import styles from './index.module.css'

const ModalUI = () => {
    const {modal, closeModal} = useModalUI();

    if (!modal.show) return null;

  return (
    <div 
        className={`${styles.modal} ${modal.isHiding ? styles.hide : ''}`} 
        onClick={closeModal}
    >
      <Text type='tiny'>{modal.text}</Text>
      <Icon name={modal.iconName} width={15}/>
    </div>
  )
}

export default ModalUI