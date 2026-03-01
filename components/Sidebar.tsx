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
    Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
    { href: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/app/library', icon: BookOpen, label: 'SOP Library' },
    { href: '/app/create', icon: PlusCircle, label: 'Create SOP' },
    { href: '/app/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false)
    const pathname = usePathname()

    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? 72 : 240 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="fixed left-0 top-0 h-screen bg-[#0D0D0D] border-r border-[#1F1F1F] flex flex-col z-40 overflow-hidden"
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-5 border-b border-[#1F1F1F]">
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

            {/* Nav */}
            <nav className="flex-1 p-3 flex flex-col gap-1">
                {navItems.map(({ href, icon: Icon, label }) => {
                    const active = pathname === href
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group',
                                active
                                    ? 'bg-[#6366F1]/15 text-[#818CF8]'
                                    : 'text-[#8A8A8A] hover:text-[#F9F9F9] hover:bg-[#1F1F1F]'
                            )}
                        >
                            <Icon className={cn('w-4 h-4 flex-shrink-0', active && 'text-[#6366F1]')} />
                            <AnimatePresence>
                                {!collapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.15 }}
                                        className="text-sm font-medium whitespace-nowrap"
                                    >
                                        {label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom - Firm name */}
            <div className="p-3 border-t border-[#1F1F1F]">
                <div className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#1F1F1F]/50',
                    collapsed && 'justify-center'
                )}>
                    <div className="w-6 h-6 rounded bg-[#6366F1]/20 flex items-center justify-center flex-shrink-0">
                        <Zap className="w-3 h-3 text-[#6366F1]" />
                    </div>
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.15 }}
                            >
                                <p className="text-xs font-medium text-[#F9F9F9] whitespace-nowrap">M/s Demo & Co.</p>
                                <p className="text-[10px] text-[#4A4A4A] whitespace-nowrap">Chartered Accountants</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Collapse toggle */}
            <button
                onClick={() => setCollapsed(c => !c)}
                className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-[#1F1F1F] border border-[#2A2A2A] flex items-center justify-center text-[#8A8A8A] hover:text-[#F9F9F9] transition-colors z-50"
            >
                {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
            </button>
        </motion.aside>
    )
}
