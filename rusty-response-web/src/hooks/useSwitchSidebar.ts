import { useState } from 'react'
import Storage from '../helpers/Storage';

const useSwitchSidebar = () => {        
    const [sidebarIsOpen, setSidebarIsOpen] = useState<boolean>(
        Storage.get('sidebarIsOpen') ?? true
    );
    const switchSidebar = () => {
        setSidebarIsOpen(c => {            
            Storage.set('sidebarIsOpen', !c)
            return !c
        })
    }
    return {sidebarIsOpen, switchSidebar}
}

export default useSwitchSidebar