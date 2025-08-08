import { Link } from 'react-router'
import Text from '../Text'
import styles from './index.module.css'
import capitalizeFirstLetter from '../../helpers/capitalizeFirstLetter'
import useCrumbs from '../../hooks/useCrumbs'

const Crumbs = () => {
    const [section, page] = useCrumbs();
  return (
    <div className={styles.crumbs}>
        <Link to={`/${section}`}>
            <Text type='tiny' color={4}>{capitalizeFirstLetter(section)}
            </Text>
        </Link>
        <Text type='tiny' color={4}>/</Text>
        <Link to={`/${section}/${page}`}>
            <Text type='tiny'>{capitalizeFirstLetter(page)}</Text>
        </Link>
    </div>
  )
}

export default Crumbs