import ButtonOptions from './ButtonOptions'
import Text from '../../../../../components/Text'
import ModalOptions from '../../../../../components/ModalOptions'
import type { INotify } from '../../../../../types/notifiers'
import useNotifierOptions from '../../../../../hooks/notifiers/useNotifierOptions'
import styles from './index.module.css'
interface Props {
    notifier: INotify
}

const CardNotifier = ({notifier}: Props) => {
    const activeText = notifier.active ? 'Active' : 'Inactive';
    const {editNotifier, deleteNotifier} = useNotifierOptions();
    
  return (
    <div className={styles.card}>
        <div className={styles.cardTop}>
            <Text type="tiny" weight={500}>id: {notifier.id}</Text>
            <ButtonOptions>
                <ModalOptions.OptionButton label='Edit' iconName='edit' 
                    handleClick={() => editNotifier(notifier)}
                />
                <ModalOptions.OptionButton label='Delete' iconName='delete' 
                    handleClick={() => deleteNotifier(notifier.id)}
                />
            </ButtonOptions>
        </div>
        <div className={`${styles.status} ${!notifier.active ? styles.inactive : ''}`}>
            <Text type="tiny">{activeText}</Text>
        </div>
    </div>
  )
}

export default CardNotifier