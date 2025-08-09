import { useState } from 'react'

const useSwitchSidebar = () => {
    const [sidebarIsOpen, setSidebarIsOpen] = useState(true);
    const switchSidebar = () => {
        setSidebarIsOpen(c => !c)
    }
    return {sidebarIsOpen, switchSidebar}
}

export default useSwitchSidebar