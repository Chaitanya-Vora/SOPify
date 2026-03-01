import React from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
    helper?: string
}

export function Textarea({ label, error, helper, className, id, ...props }: TextareaProps) {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label htmlFor={inputId} className="text-sm font-medium text-[#F9F9F9]">
                    {label}
                </label>
            )}
            <textarea
                id={inputId}
                className={cn(
                    'px-4 py-3 rounded-lg bg-[#111111] border border-[#1F1F1F] text-[#F9F9F9]',
                    'placeholder:text-[#4A4A4A] text-sm resize-none',
                    'focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent',
                    'transition-colors duration-150',
                    error && 'border-[#EF4444] focus:ring-[#EF4444]',
                    className
                )}
                {...props}
            />
            {error && <p className="text-xs text-[#EF4444]">{error}</p>}
            {helper && !error && <p className="text-xs text-[#8A8A8A]">{helper}</p>}
        </div>
    )
}
