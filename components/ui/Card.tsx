'use client'
import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps {
    children: React.ReactNode
    className?: string
    hover?: boolean
    padding?: boolean
    onClick?: () => void
}

export function Card({ children, className, hover = true, padding = true, onClick }: CardProps) {
    const cardRef = useRef<HTMLDivElement>(null)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        cardRef.current.style.setProperty('--mouse-x', `${x}%`)
        cardRef.current.style.setProperty('--mouse-y', `${y}%`)
    }

    return (
        <motion.div
            ref={cardRef}
            whileHover={hover ? { y: -2 } : undefined}
            onMouseMove={handleMouseMove}
            onClick={onClick}
            className={cn(
                'bento-card bg-[#111111] border border-[#1F1F1F] rounded-xl',
                'shadow-[0_1px_3px_rgba(0,0,0,0.5)]',
                'transition-[border-color,box-shadow] duration-200',
                hover && 'hover:border-[#6366F1] hover:shadow-[0_8px_32px_rgba(99,102,241,0.15)] cursor-pointer',
                padding && 'p-8',
                className
            )}
        >
            {children}
        </motion.div>
    )
}
