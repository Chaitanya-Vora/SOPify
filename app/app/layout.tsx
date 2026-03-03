'use client'
import React, { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { SidebarContext } from '@/lib/sidebar-context'
import { cn } from '@/lib/utils'

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <SidebarContext.Provider value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen }}>
            <div className="min-h-screen bg-[#080808] flex">
                {/* Mobile overlay */}
                {mobileOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 z-30 md:hidden"
                        onClick={() => setMobileOpen(false)}
                    />
                )}
                <Sidebar />
                <main className={cn(
                    "flex-1 overflow-x-hidden transition-all duration-300 min-h-screen",
                    collapsed ? "md:ml-[72px] ml-0" : "md:ml-[240px] ml-0"
                )}>
                    {/* Mobile top bar */}
                    <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-[#1F1F1F] sticky top-0 bg-[#080808] z-20">
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="p-2 text-[#8A8A8A] hover:text-[#F9F9F9]"
                        >
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </button>
                        <div className="w-6 h-6 bg-[#6366F1] rounded-md flex items-center justify-center">
                            <span className="text-white font-bold text-xs">S</span>
                        </div>
                        <span className="font-bold text-[#F9F9F9] text-sm">SOPify</span>
                    </div>
                    {children}
                </main>
            </div>
        </SidebarContext.Provider>
    )
}
