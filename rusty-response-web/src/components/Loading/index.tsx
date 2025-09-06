import styles from './index.module.css'

const Loading = ({type = 'block'}: {type?: 'full' | 'block'}) => {
  return (
    <div className={styles[type]}>
        <AnimLoading />
    </div>
  )
}

export default Loading

export const AnimLoading = () => {
  return (
    <div className={styles.row}>
        <span className={styles.circle}></span>
        <span className={styles.circle}></span>
        <span className={styles.circle}></span>
    </div>
  )
}