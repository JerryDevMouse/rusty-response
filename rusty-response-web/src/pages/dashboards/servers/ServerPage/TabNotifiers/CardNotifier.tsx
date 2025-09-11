import ButtonOptions from './ButtonOptions'
import Text from '../../../../../components/Text'
import styles from './index.module.css'
interface Props {
    id: number,
    active: boolean
}

const CardNotifier = ({id, active}: Props) => {
    const activeText = active ? 'Active' : 'Inactive';
    
  return (
    <div className={styles.card}>
        <div className={styles.cardTop}>
            <Text type="tiny" weight={500}>id: {id}</Text>
            <ButtonOptions />
        </div>
        <div className={`${styles.status} ${!active ? styles.inactive : ''}`}>
            <Text type="tiny">{activeText}</Text>
        </div>
    </div>
  )
}

export default CardNotifier