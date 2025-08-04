import styles from './AuthPages.module.css'
import Text from '../Text'

const Copyright = () => {
  return (
    <div className={styles.copy}>
        <Text type='tiny' weight={400} color={4}>&copy; 2025 Rusty Response</Text>
    </div>
  )
}

export default Copyright