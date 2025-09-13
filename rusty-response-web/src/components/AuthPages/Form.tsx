import type { FC } from 'react'
import { NavLink } from 'react-router';
import Text from '../Text';
import { AuthPages } from '.';
import useForm from '../../hooks/useForm';
import { authPageRedirectOffer } from '../../constants/text';
import styles from './AuthPages.module.css'
interface Props {
    onSubmit: (formData: FormData) => void; 
    sign: 'Up' | 'In'
}

const Form: FC<Props> = ({onSubmit, sign}) => {
    const {handleSubmit} = useForm(onSubmit)

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.content}>
            <h2 className={styles.title}><Text type='xxl' weight={600}>Sign {sign}</Text></h2>
            <div className={styles.inputs}>
                <AuthPages.FormInput name='login' placeholder='Login'/>
                <AuthPages.FormInput name='password' placeholder='Password'/>
            </div>
            <button className={styles.button} type='submit'>
                <Text type='small' weight={400}>Sign {sign}</Text>
            </button>
            <div className={styles.row}>
                <Text type='tiny' weight={400} color={4}>{authPageRedirectOffer[sign]}</Text>
                <NavLink to={`/auth/sign${sign ==='In' ? 'up' : 'in'}`} className={styles.link}>
                    <Text type='tiny' weight={400}>Sign {sign ==='In' ? 'Up' : 'In'}</Text>
                </NavLink>
            </div>
        </div>
    </form>
  )
}

export default Form