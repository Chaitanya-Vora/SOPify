'use client'
import React, { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
    id: string
    message: string
    type: ToastType
}

interface ToastContextValue {
    addToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue>({ addToast: () => { } })

export function useToast() {
    return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const addToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).slice(2)
        setToasts(prev => [...prev, { id, message, type }])
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, 4000)
    }, [])

    const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id))

    const icons = {
        success: <CheckCircle className="w-4 h-4 text-[#22C55E] flex-shrink-0" />,
        error: <XCircle className="w-4 h-4 text-[#EF4444] flex-shrink-0" />,
        info: <Info className="w-4 h-4 text-[#6366F1] flex-shrink-0" />,
    }

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 50, y: -10 }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            className={cn(
                                'flex items-start gap-3 p-4 rounded-xl border',
                                'bg-[#111111] border-[#1F1F1F] shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
                            )}
                        >
                            {icons[toast.type]}
                            <p className="text-sm text-[#F9F9F9] flex-1">{toast.message}</p>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="p-0.5 text-[#8A8A8A] hover:text-[#F9F9F9] transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    )
}
