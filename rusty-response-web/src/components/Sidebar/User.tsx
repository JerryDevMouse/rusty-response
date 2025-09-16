import { useAppSelector } from '../../app/store/hooks'
import Icon from '../Icon/Icon'
import Text from '../Text'
import styles from './index.module.css'

const User = () => {
    const userName = useAppSelector(state => state.user.currentUser?.username)
  return (
    <div className={`${styles.row} ${styles.user}`}>
      <Icon name='avatar' width={24} height={24} color={8}/>
      <Text type='small'>{userName ?? 'user'}</Text>
    </div>
  )
}

export default User