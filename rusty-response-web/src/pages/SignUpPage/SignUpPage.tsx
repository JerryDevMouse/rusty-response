import Text from '../../components/Text'
import { NavLink } from 'react-router'
import styles from './index.module.css'

const SignUpPage = () => {
  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <div className={styles.content}>
          <h2 className={styles.title}><Text type='xxl' weight={600}>Sign In</Text></h2>
          <div className={styles.inputs}>
            <input type="text" placeholder='Login' className={styles.input}/>
            <input type="password" placeholder='Password' className={styles.input}/>
          </div>
          <button className={styles.button}>
            <Text type='small' weight={400}>Sign In</Text>
          </button>
          <div className={styles.row}>
            <Text type='tiny' weight={400} color={4}>Not a member yet?</Text>
            <NavLink to='/signin' className={styles.link}>
              <Text type='tiny' weight={400}>Sign Up</Text>
            </NavLink>
          </div>
        </div>
      </form>
      <div className={styles.copy}>
        <Text type='tiny' weight={400} color={4}>&copy; 2025 Rusty Response</Text>
      </div>
    </div>
  )
}

export default SignUpPage