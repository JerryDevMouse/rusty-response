import Text from '../../components/Text'
import { NavLink } from 'react-router'
import { AuthPages } from '../../components/AuthPages'
import styles from '../../components/AuthPages/AuthPages.module.css'

const SignUpPage = () => {
  const handleSignUp = (formData: FormData) => {
    const login = formData.get('login');
    const password = formData.get('password');
    console.log(login, password);
  }

  return (
    <AuthPages.Container>
      <AuthPages.Form onSubmit={handleSignUp}>
        <div className={styles.content}>
          <h2 className={styles.title}><Text type='xxl' weight={600}>Sign In</Text></h2>
          <div className={styles.inputs}>
            <input type="text" placeholder='Login' className={styles.input} name='login'/>
            <input type="password" placeholder='Password' className={styles.input} name='password'/>
          </div>
          <button className={styles.button} type='submit'>
            <Text type='small' weight={400}>Sign In</Text>
          </button>
          <div className={styles.row}>
            <Text type='tiny' weight={400} color={4}>Not a member yet?</Text>
            <NavLink to='/signin' className={styles.link}>
              <Text type='tiny' weight={400}>Sign Up</Text>
            </NavLink>
          </div>
        </div>
      </AuthPages.Form>
      <div className={styles.copy}>
        <Text type='tiny' weight={400} color={4}>&copy; 2025 Rusty Response</Text>
      </div>
    </AuthPages.Container>
  )
}

export default SignUpPage