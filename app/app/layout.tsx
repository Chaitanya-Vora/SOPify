'use client'
import { Sidebar } from '@/components/Sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#080808] flex">
            <Sidebar />
            <main className="flex-1 ml-[240px] overflow-x-hidden transition-all duration-200">
                {children}
            </main>
        </div>
    )
}
