import { AuthPages } from '../components/AuthPages'
import useAuth from '../hooks/useAuth'

const SignInPage = () => {
  const {handleSignIn} = useAuth();
 
  return (
    <AuthPages.Container>
      <AuthPages.Form onSubmit={handleSignIn} sign='In'/>
      <AuthPages.Copyright />
    </AuthPages.Container>
  )
}

export default SignInPage