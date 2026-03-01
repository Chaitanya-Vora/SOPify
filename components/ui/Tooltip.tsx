'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TooltipProps {
    children: React.ReactNode
    content: string
    className?: string
}

export function Tooltip({ children, content, className }: TooltipProps) {
    const [show, setShow] = useState(false)
    return (
        <div className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
            {children}
            <AnimatePresence>
                {show && (
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                            'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50',
                            'px-2.5 py-1.5 rounded-lg text-xs text-[#F9F9F9] whitespace-nowrap',
                            'bg-[#1F1F1F] border border-[#2A2A2A] shadow-lg pointer-events-none',
                            className
                        )}
                    >
                        {content}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
