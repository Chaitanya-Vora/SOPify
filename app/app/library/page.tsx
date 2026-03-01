'use client'
import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { mockSops, type Sop, type SopCategory } from '@/lib/data'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'
import { Plus, Eye, BookOpen, Share2, Search, ChevronDown, Clock, TrendingUp } from 'lucide-react'

const categories: SopCategory[] = ['GST', 'TDS', 'Income Tax', 'MCA', 'Audit', 'Internal', 'Client', 'General']

function SopCard({ sop }: { sop: Sop }) {
    const { addToast } = useToast()

    const handleShare = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        const url = `https://sopify.in/sop/${sop.id}`
        navigator.clipboard?.writeText(url).catch(() => { })
        addToast('Link copied! Share on WhatsApp or email 🎉', 'success')
    }

    return (
        <motion.div
            whileHover={{ y: -2 }}
            className="bg-[#111111] border border-[#1F1F1F] rounded-xl p-6 flex flex-col gap-4 transition-[border-color,box-shadow] duration-200 hover:border-[#6366F1] hover:shadow-[0_8px_32px_rgba(99,102,241,0.15)] group"
        >
            <div className="flex items-start justify-between gap-2">
                <Badge category={sop.category}>{sop.category}</Badge>
                <span className="text-[10px] font-mono text-[#4A4A4A] bg-[#1F1F1F] px-2 py-0.5 rounded-full">
                    {sop.steps.length} steps
                </span>
            </div>

            <div className="flex-1">
                <h3 className="text-sm font-semibold text-[#F9F9F9] mb-2 line-clamp-2 leading-tight">{sop.title}</h3>
                <p className="text-xs text-[#8A8A8A] line-clamp-2 leading-relaxed">{sop.description}</p>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-[#1F1F1F]">
                <div className="w-6 h-6 rounded-full bg-[#6366F1]/20 flex items-center justify-center">
                    <span className="text-[9px] font-mono font-medium text-[#818CF8]">{sop.creatorInitials}</span>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-[#8A8A8A]">{sop.creatorName}</p>
                    <p className="text-[10px] text-[#4A4A4A]">{sop.createdAt}</p>
                </div>
                <span className="flex items-center gap-1 text-xs text-[#4A4A4A]">
                    <Eye className="w-3 h-3" /> {sop.views}
                </span>
            </div>

            <div className="flex gap-2">
                <Link href={`/app/sop/${sop.id}`} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">
                        <BookOpen className="w-3.5 h-3.5" /> View
                    </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleShare}>
                    <Share2 className="w-3.5 h-3.5" />
                </Button>
            </div>
        </motion.div>
    )
}

export default function Library() {
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState<string>('all')
    const [sort, setSort] = useState<'newest' | 'views' | 'updated'>('newest')
    const [page, setPage] = useState(12)

    useEffect(() => {
        document.title = "SOP Library | SOPify"
    }, [])

    const filtered = useMemo(() => {
        let result = [...mockSops]
        if (search) {
            const q = search.toLowerCase()
            result = result.filter(s =>
                s.title.toLowerCase().includes(q) ||
                s.description.toLowerCase().includes(q) ||
                s.tags.some(t => t.toLowerCase().includes(q))
            )
        }
        if (category !== 'all') {
            result = result.filter(s => s.category === category)
        }
        if (sort === 'views') result.sort((a, b) => b.views - a.views)
        else if (sort === 'updated') result.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        else result.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        return result
    }, [search, category, sort])

    const visible = filtered.slice(0, page)
    const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } }
    const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#F9F9F9] tracking-tight">SOP Library</h1>
                    <p className="text-[#8A8A8A] text-sm mt-1">{mockSops.length} guides · Browse and share</p>
                </div>
                <Link href="/app/create">
                    <Button variant="primary" icon={<Plus className="w-4 h-4" />}>Create SOP</Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-8 flex-wrap">
                <div className="relative flex-1 min-w-[240px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A4A4A]" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search SOPs, categories, steps..."
                        className="w-full h-11 pl-10 pr-4 rounded-lg bg-[#111111] border border-[#1F1F1F] text-[#F9F9F9] text-sm placeholder:text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                    />
                </div>
                <div className="relative">
                    <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="h-11 pl-4 pr-9 rounded-lg bg-[#111111] border border-[#1F1F1F] text-[#F9F9F9] text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                    >
                        <option value="all">All Categories</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A4A4A] pointer-events-none" />
                </div>
                <div className="relative">
                    <select
                        value={sort}
                        onChange={e => setSort(e.target.value as any)}
                        className="h-11 pl-4 pr-9 rounded-lg bg-[#111111] border border-[#1F1F1F] text-[#F9F9F9] text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                    >
                        <option value="newest">Newest</option>
                        <option value="views">Most Viewed</option>
                        <option value="updated">Recently Updated</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A4A4A] pointer-events-none" />
                </div>
            </div>

            {/* Grid */}
            {visible.length > 0 ? (
                <>
                    <motion.div
                        key={`${search}-${category}-${sort}`}
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
                    >
                        {visible.map(sop => (
                            <motion.div key={sop.id} variants={item}>
                                <SopCard sop={sop} />
                            </motion.div>
                        ))}
                    </motion.div>
                    {page < filtered.length && (
                        <div className="flex justify-center">
                            <Button variant="secondary" onClick={() => setPage(p => p + 6)}>
                                Load more ({filtered.length - page} remaining)
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-20">
                    <p className="text-[#4A4A4A] text-lg mb-2">No SOPs found</p>
                    <p className="text-[#4A4A4A] text-sm">Try adjusting your search or filters</p>
                </div>
            )}
        </div>
    )
}
