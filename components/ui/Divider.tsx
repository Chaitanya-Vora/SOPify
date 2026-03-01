import React from 'react'
import { cn } from '@/lib/utils'

export function Divider({ className }: { className?: string }) {
    return <hr className={cn('border-[#1F1F1F]', className)} />
}
