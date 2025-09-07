import Animation from "./Animation"
import styles from './index.module.css'
interface Props {
  type?: 'full' | 'block'
}

const Basic = ({type = 'block'}: Props) => {
  return (
    <div className={styles[type]}>
      <Animation />
    </div>
  )
}

export default Basic