import Text from '../../../../../components/Text'
import type { IChildren } from '../../../../../helpers/types'
import styles from '../index.module.css'
interface Props extends IChildren {
    title: string
}

const SectionInfo = ({title, children}: Props) => {
  return (
    <section className={styles.section}>
        <Text type='large' weight={600}>{title}</Text>
        {children}
    </section>
  )
}

export default SectionInfo