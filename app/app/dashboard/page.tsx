'use client'
import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { mockSops, type Sop } from '@/lib/data'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { TrendingUp, Eye, FileText, Plus, ArrowUpRight } from 'lucide-react'

function SopListItem({ sop }: { sop: Sop }) {
    return (
        <div className="flex items-center gap-4 py-4 border-b border-[#1F1F1F] last:border-0 group">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-[#6366F1]/20 border border-[#6366F1]/30 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-mono font-medium text-[#818CF8]">{sop.creatorInitials}</span>
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <Badge category={sop.category}>{sop.category}</Badge>
                    <span className="text-[10px] font-mono text-[#4A4A4A]">{sop.steps.length} steps</span>
                </div>
                <p className="text-sm font-medium text-[#F9F9F9] truncate">{sop.title}</p>
                <p className="text-xs text-[#4A4A4A]">{sop.creatorName} · {sop.createdAt}</p>
            </div>
            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
                <span className="flex items-center gap-1 text-xs text-[#4A4A4A]">
                    <Eye className="w-3 h-3" /> {sop.views}
                </span>
                <Link href={`/app/sop/${sop.id}`}>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        View
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default function Dashboard() {
    const recentSops = mockSops.slice(0, 5)
    const mostViewedSops = [...mockSops].sort((a, b) => b.views - a.views).slice(0, 5)

    const stats = [
        { label: 'Total SOPs', value: '24', trend: '+3 this month', icon: FileText, color: '#6366F1' },
        { label: 'This Month', value: '6', trend: '+2 from last', icon: TrendingUp, color: '#22C55E' },
        { label: 'Total Views', value: '847', trend: '+124 this week', icon: Eye, color: '#818CF8' },
    ]

    const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
    const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

    return (
        <div className="p-8 max-w-[1200px]">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-between mb-10"
            >
                <div>
                    <p className="text-[#8A8A8A] text-sm mb-1 font-mono">Welcome back</p>
                    <h1 className="text-3xl font-bold text-[#F9F9F9] tracking-tight">Good morning, Arjun.</h1>
                </div>
                <Link href="/app/create">
                    <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
                        Create SOP
                    </Button>
                </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-3 gap-4 mb-10"
            >
                {stats.map(stat => (
                    <motion.div key={stat.label} variants={item}>
                        <Card className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ background: `${stat.color}20` }}>
                                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-[#F9F9F9] tracking-tight">{stat.value}</p>
                                <p className="text-sm text-[#8A8A8A]">{stat.label}</p>
                                <p className="text-xs text-[#22C55E] flex items-center gap-1 mt-1">
                                    <ArrowUpRight className="w-3 h-3" />{stat.trend}
                                </p>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {/* Main content grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 gap-6"
            >
                {/* Recently Created */}
                <motion.div variants={item}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-[#F9F9F9]">Recently Created</h2>
                        <Link href="/app/library" className="text-xs text-[#6366F1] hover:text-[#818CF8] transition-colors flex items-center gap-1">
                            View all <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="bg-[#111111] border border-[#1F1F1F] rounded-xl px-6 py-2">
                        {recentSops.map(sop => <SopListItem key={sop.id} sop={sop} />)}
                    </div>
                </motion.div>

                {/* Most Viewed */}
                <motion.div variants={item}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-[#F9F9F9]">Most Viewed</h2>
                        <Link href="/app/library" className="text-xs text-[#6366F1] hover:text-[#818CF8] transition-colors flex items-center gap-1">
                            View all <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="bg-[#111111] border border-[#1F1F1F] rounded-xl px-6 py-2">
                        {mostViewedSops.map(sop => <SopListItem key={sop.id} sop={sop} />)}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}
