import type { FC } from 'react'
import { NavLink } from 'react-router'
import Icon from '../Icon/Icon'
import Text from '../Text'
import type { TSidebarNavName, TSidebarNavSection } from '../../types/ui'
import capitalizeFirstLetter from '../../helpers/capitalizeFirstLetter'
import styles from './index.module.css'

interface Props {
    section: TSidebarNavSection,
    name: TSidebarNavName
}

const Link: FC<Props> = ({section, name}) => {
  const capitalizedName = capitalizeFirstLetter(name);
  return (
    <NavLink 
      to={`/${section}/${name}`} 
      className={({isActive}) => 
        `${styles.link} ${styles.row} ${isActive ? styles.active : ''}`}
      title={capitalizedName}>
        <Icon name={`sidebar_${name}`} width={16} height={16}></Icon>
        <Text type='tiny'>{capitalizedName}</Text>
    </NavLink>
  )
}

export default Link