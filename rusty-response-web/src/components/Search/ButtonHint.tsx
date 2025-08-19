import Text from '../Text'
import styles from './index.module.css'

const ButtonHint = ({onClick}: {onClick: VoidFunction}) => {
  return (
    <button className={styles.searchhint} onClick={onClick}>
        <div className={styles.hint}>
            <Text type='tiny' color={2}>/</Text>
        </div>
    </button>
  )
}

export default ButtonHint