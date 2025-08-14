import { Link } from 'react-router'
import Text from '../Text'
import styles from './index.module.css'
import useCrumbs from '../../hooks/useCrumbs'

const Crumbs = () => {
    const {sectionLink, sectionText, pageLink, pageText} = useCrumbs();
  return (
    <div className={styles.crumbs}>
        <Link to={sectionLink}>
            <Text type='tiny' color={4}>{sectionText}
            </Text>
        </Link>
        <Text type='tiny' color={4}>/</Text>
        <Link to={pageLink}>
            <Text type='tiny'>{pageText}</Text>
        </Link>
    </div>
  )
}

export default Crumbs