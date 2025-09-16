import Icon from '../Icon/Icon'
import styles from './index.module.css'

const ButtonSearch= ({onClick}: {onClick: VoidFunction}) => {
  return (
   <button className={styles.searchbtn} onClick={onClick}>
        <Icon name='search' width={13} height={13} />
    </button>
  )
}

export default ButtonSearch