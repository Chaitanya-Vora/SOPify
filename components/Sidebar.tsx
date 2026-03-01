'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    LayoutDashboard,
    BookOpen,
    PlusCircle,
    Settings,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    User,
    Video
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/lib/sidebar-context'

const navItems = [
    { href: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/app/record', icon: Video, label: 'Record SOP' },
    { href: '/app/library', icon: BookOpen, label: 'SOP Library' },
    { href: '/app/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
    const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar()
    const pathname = usePathname()

    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? 72 : 240 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className={cn(
                "fixed left-0 top-0 h-screen bg-[#0D0D0D] border-r border-[#1F1F1F] flex flex-col z-[70] md:z-40 overflow-hidden transition-transform duration-300 md:translate-x-0",
                mobileOpen ? "translate-x-0" : "-translate-x-full"
            )}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-5">
                <div className="w-8 h-8 bg-[#6366F1] rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">S</span>
                </div>
                <AnimatePresence>
                    {!collapsed && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.15 }}
                            className="text-[#F9F9F9] font-bold text-base tracking-tight whitespace-nowrap"
                        >
                            SOPify
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            {/* Firm Selector */}
            <AnimatePresence>
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 mb-4"
                    >
                        <div className="flex items-center justify-between w-full px-3 py-2 bg-[#1A1A1A] rounded-md border border-[#2A2A2A] cursor-pointer hover:bg-[#222222] transition-colors">
                            <div className="flex gap-2 items-center">
                                <div className="w-6 h-6 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">M</div>
                                <span className="text-sm font-medium text-white truncate">M/s Demo & Co.</span>
                            </div>
                            <ChevronDown className="w-3 h-3 text-gray-500" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Nav */}
            <nav className="flex-1 px-3 py-2 flex flex-col gap-1">
                <Link href="/app/create" className="mb-2" onClick={() => setMobileOpen?.(false)}>
                    <div className={cn(
                        "flex items-center gap-3 rounded-lg bg-[#6366F1] text-white hover:bg-[#818CF8] transition-all duration-150 shadow-[0_0_15px_rgba(99,102,241,0.2)]",
                        collapsed ? "w-10 h-10 justify-center p-0 mx-auto" : "px-3 py-2.5"
                    )}>
                        <PlusCircle className="w-4 h-4 flex-shrink-0" />
                        {!collapsed && <span className="text-sm font-medium whitespace-nowrap">Create SOP</span>}
                    </div>
                </Link>

                {navItems.map(({ href, icon: Icon, label }) => {
                    const active = pathname === href || pathname.startsWith(href + '/')
                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setMobileOpen?.(false)}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group',
                                active
                                    ? 'bg-[#1F1F1F] text-[#F9F9F9]'
                                    : 'text-[#8A8A8A] hover:text-[#F9F9F9] hover:bg-[#1F1F1F]/50',
                                collapsed && "justify-center px-0 w-10 h-10 mx-auto"
                            )}
                        >
                            <Icon className={cn('w-4 h-4 flex-shrink-0', active && 'text-[#F9F9F9]')} />
                            <AnimatePresence>
                                {!collapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.15 }}
                                        className="text-sm font-medium whitespace-nowrap flex-1 flex items-center"
                                    >
                                        {label}
                                        {label === 'Record SOP' && (
                                            <span className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-[#6366F1]/20 text-[#818CF8] border border-[#6366F1]/20">
                                                NEW
                                            </span>
                                        )}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom - User profile */}
            <div className="p-4 border-t border-[#1F1F1F]">
                <div className={cn(
                    'flex items-center gap-3',
                    collapsed ? 'justify-center' : 'px-2'
                )}>
                    <div className="w-8 h-8 rounded-full bg-[#2A2A2A] flex items-center justify-center flex-shrink-0 border border-[#3A3A3A]">
                        <User className="w-4 h-4 text-[#8A8A8A]" />
                    </div>
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.15 }}
                                className="min-w-0"
                            >
                                <p className="text-sm font-medium text-[#F9F9F9] truncate">Arjun Singh</p>
                                <p className="text-xs text-[#8A8A8A] truncate">arjun@demo-co.in</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Collapse toggle (desktop only) */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden md:flex absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-[#1F1F1F] border border-[#2A2A2A] items-center justify-center text-[#8A8A8A] hover:text-[#F9F9F9] transition-colors z-[80] hover:scale-110 shadow-md"
            >
                {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
            </button>
        </motion.aside>
    )
}
