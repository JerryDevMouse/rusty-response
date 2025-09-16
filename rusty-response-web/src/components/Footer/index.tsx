import { Link } from 'react-router'
import Text from '../Text'
import styles from './index.module.css'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Text type='tiny' color={4}>&copy; 2025 Rusty Response</Text>
      <nav className={styles.nav}>
        <Link to='#'>
          <Text type='tiny' color={4}>About</Text>
        </Link>
        <Link to='#'>
          <Text type='tiny' color={4}>Contact Us</Text>
        </Link>
      </nav>
    </footer>
  )
}

export default Footer