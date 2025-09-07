import styles from './index.module.css'
interface Props {
  type?: 'full' | 'block'
}

export const Loading = ({type = 'block'}: Props) => {
  return (
    <div className={styles[type]}>
      <AnimLoading />
    </div>
  )
}

export const LoadingTable = ({type = 'block'}: Props) => {
  return (
    <tr className={styles[type]}>
      <td className={styles[type]}>
        <AnimLoading />
      </td>
    </tr>
  )
}

export const AnimLoading = () => {
  return (
    <div className={styles.row}>
        <span className={styles.circle}></span>
        <span className={styles.circle}></span>
        <span className={styles.circle}></span>
    </div>
  )
}