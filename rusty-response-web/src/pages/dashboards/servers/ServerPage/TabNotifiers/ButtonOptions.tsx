import Icon from '../../../../../components/Icon/Icon'
import styles from './index.module.css'
interface Props {
    size?: number
}
const ButtonOptions = ({size = 24}: Props) => {
  return (
    <button 
        className={styles.options} 
        style={{
            width: size,
            height: size
        }}
    >
        <Icon name="dots" width={16} />
    </button>
  )
}

export default ButtonOptions