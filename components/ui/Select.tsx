import React from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string
    error?: string
    options: { value: string; label: string }[]
}

export function Select({ label, error, options, className, id, ...props }: SelectProps) {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label htmlFor={inputId} className="text-sm font-medium text-[#F9F9F9]">
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    id={inputId}
                    className={cn(
                        'w-full h-11 pl-4 pr-10 rounded-lg bg-[#111111] border border-[#1F1F1F] text-[#F9F9F9]',
                        'text-sm appearance-none',
                        'focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent',
                        'transition-colors duration-150',
                        error && 'border-[#EF4444]',
                        className
                    )}
                    {...props}
                >
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value} className="bg-[#111111]">
                            {opt.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A] pointer-events-none" />
            </div>
            {error && <p className="text-xs text-[#EF4444]">{error}</p>}
        </div>
    )
}
