'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    icon?: React.ReactNode
    loading?: boolean
    children: React.ReactNode
}

export function Button({
    variant = 'primary',
    size = 'md',
    icon,
    loading = false,
    children,
    className,
    disabled,
    ...props
}: ButtonProps) {
    const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808] disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
        primary: 'bg-[#6366F1] text-white hover:bg-[#818CF8] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]',
        secondary: 'bg-transparent border border-[#1F1F1F] text-[#F9F9F9] hover:border-[#6366F1] hover:bg-[#111111]',
        ghost: 'bg-transparent text-[#8A8A8A] hover:text-[#F9F9F9] hover:bg-[#111111]',
    }

    const sizes = {
        sm: 'h-9 px-4 text-sm',
        md: 'h-12 px-6 text-sm',
        lg: 'h-14 px-8 text-base',
    }

    return (
        <motion.button
            whileTap={{ scale: 0.97 }}
            className={cn(base, variants[variant], sizes[size], className)}
            disabled={disabled || loading}
            {...(props as any)}
        >
            {loading ? (
                <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            ) : icon ? (
                <span className="flex-shrink-0">{icon}</span>
            ) : null}
            {children}
        </motion.button>
    )
}
