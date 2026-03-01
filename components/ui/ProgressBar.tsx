'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
    value: number // 0-100
    className?: string
    animated?: boolean
}

export function ProgressBar({ value, className, animated = true }: ProgressBarProps) {
    return (
        <div className={cn('h-1 bg-[#1F1F1F] rounded-full overflow-hidden', className)}>
            {animated ? (
                <motion.div
                    className="h-full bg-[#6366F1] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                />
            ) : (
                <div className="h-full bg-[#6366F1] rounded-full" style={{ width: `${value}%` }} />
            )}
        </div>
    )
}
