import { AuthPages } from '../components/AuthPages'
import useAuth from '../hooks/useAuth'

const SignUpPage = () => {
  const {handleSignUp} = useAuth();

  return (
    <AuthPages.Container>
      <AuthPages.Form onSubmit={handleSignUp} sign='Up'/>
      <AuthPages.Copyright />
    </AuthPages.Container>
  )
}

export default SignUpPage