import React from 'react'
import { cn } from '@/lib/utils'
import { type SopCategory } from '@/lib/data'

const categoryConfig: Record<SopCategory, { bg: string; text: string; border: string }> = {
    'GST': {
        bg: 'rgba(16,185,129,0.1)',
        text: '#10B981',
        border: 'rgba(16,185,129,0.25)'
    },
    'TDS': {
        bg: 'rgba(249,115,22,0.1)',
        text: '#F97316',
        border: 'rgba(249,115,22,0.25)'
    },
    'Income Tax': {
        bg: 'rgba(59,130,246,0.1)',
        text: '#3B82F6',
        border: 'rgba(59,130,246,0.25)'
    },
    'MCA': {
        bg: 'rgba(168,85,247,0.1)',
        text: '#A855F7',
        border: 'rgba(168,85,247,0.25)'
    },
    'Audit': {
        bg: 'rgba(239,68,68,0.1)',
        text: '#EF4444',
        border: 'rgba(239,68,68,0.25)'
    },
    'Internal': {
        bg: 'rgba(113,113,122,0.1)',
        text: '#71717A',
        border: 'rgba(113,113,122,0.25)'
    },
    'Client': {
        bg: 'rgba(20,184,166,0.1)',
        text: '#14B8A6',
        border: 'rgba(20,184,166,0.25)'
    },
    'General': {
        bg: 'rgba(100,116,139,0.1)',
        text: '#64748B',
        border: 'rgba(100,116,139,0.25)'
    }
}

interface BadgeProps {
    children: React.ReactNode
    category?: SopCategory
    className?: string
    variant?: 'default' | 'indigo'
}

export function Badge({ children, category, className, variant = 'default' }: BadgeProps) {
    if (category && categoryConfig[category]) {
        const cfg = categoryConfig[category]
        return (
            <span
                className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium',
                    className
                )}
                style={{
                    background: cfg.bg,
                    color: cfg.text,
                    border: `1px solid ${cfg.border}`,
                }}
            >
                {children}
            </span>
        )
    }

    if (variant === 'indigo') {
        return (
            <span
                className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium',
                    'bg-[rgba(99,102,241,0.15)] text-[#818CF8] border border-[rgba(99,102,241,0.3)]',
                    className
                )}
            >
                {children}
            </span>
        )
    }

    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium',
                'bg-[#1F1F1F] text-[#8A8A8A] border border-[#2A2A2A]',
                className
            )}
        >
            {children}
        </span>
    )
}
