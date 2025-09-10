import Text from '../../../../../components/Text'
import styles from '../index.module.css'
interface Props {
    name: string,
    value: string | number
}

const RowInfo = ({name, value}: Props) => {
  return (
    <div className={styles.row}>
        <Text type='tiny' weight={500}>{name}</Text>
        <Text type='tiny' weight={500} color={5}>{value}</Text>
    </div>
  )
}

export default RowInfo