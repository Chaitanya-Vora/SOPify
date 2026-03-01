import { createContext, useContext } from 'react'

export const SidebarContext = createContext({
    collapsed: false,
    setCollapsed: (_: boolean) => { },
    mobileOpen: false,
    setMobileOpen: (_: boolean) => { },
})

export const useSidebar = () => useContext(SidebarContext)
