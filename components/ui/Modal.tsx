'use client'
import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
    open: boolean
    onClose: () => void
    children: React.ReactNode
    title?: string
    className?: string
}

export function Modal({ open, onClose, children, title, className }: ModalProps) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        if (open) document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [open, onClose])

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={e => e.stopPropagation()}
                        className={cn(
                            'relative z-10 w-full max-w-lg bg-[#111111] border border-[#1F1F1F] rounded-xl p-8',
                            'shadow-[0_25px_50px_rgba(0,0,0,0.8)]',
                            className
                        )}
                    >
                        <div className="flex items-center justify-between mb-6">
                            {title && <h2 className="text-lg font-semibold text-[#F9F9F9]">{title}</h2>}
                            <button
                                onClick={onClose}
                                className="ml-auto p-1.5 rounded-lg text-[#8A8A8A] hover:text-[#F9F9F9] hover:bg-[#1F1F1F] transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
