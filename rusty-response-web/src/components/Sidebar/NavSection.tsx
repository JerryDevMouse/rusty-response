import type { FC } from 'react'
import { sidebarNav } from '../../helpers/constants'
import Text from '../Text'
import styles from './index.module.css'
import type { TSidebarNavSection } from '../../helpers/types'
import { Sidebar } from '../Sidebar'
import capitalizeFirstLetter from '../../helpers/capitalizeFirstLetter'
interface Props {
    section: TSidebarNavSection
}

const NavSection: FC<Props> = ({section}) => {
  return (
    <section className={styles.block}>
        <div className={styles.title}>
            <Text type='tiny' color={4}>{capitalizeFirstLetter(section)}</Text>
        </div>
        <nav className={styles.nav}>
            {sidebarNav[section].map(name => (
                <Sidebar.Link section={section} name={name} key={name}/>
            ))}
        </nav>
    </section>
  )
}

export default NavSection