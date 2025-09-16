import type { FC } from 'react'
import { sidebarNav } from '../../constants/text'
import Text from '../Text'
import styles from './index.module.css'
import type { TSidebarNavSection } from '../../types/ui'
import { Sidebar } from '../Sidebar'
import capitalizeFirstLetter from '../../helpers/capitalizeFirstLetter'
interface Props {
    section: TSidebarNavSection
}

const NavSection: FC<Props> = ({section}) => {
  return (
    <section className={styles.block}>
        <Text type='tiny' color={4} mbottom={8}>
            {capitalizeFirstLetter(section)}
        </Text>
        <nav className={styles.nav}>
            {sidebarNav[section].map(name => (
                <Sidebar.Link section={section} name={name} key={name}/>
            ))}
        </nav>
    </section>
  )
}

export default NavSection