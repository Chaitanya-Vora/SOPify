'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
    ArrowRight, Menu, X, Play, Check, ChevronUp,
    Share2, Search, Smartphone, ExternalLink,
    FileText, Zap, Users, Shield, Star, Video, Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'

// =====================
// NEW COMPONENTS
// =====================
function CountUp({ target, suffix = '' }: { target: number, suffix?: string }) {
    const [count, setCount] = useState(0)
    const ref = useRef(null)
    const inView = useInView(ref, { once: true })
    useEffect(() => {
        if (!inView) return
        let start = 0
        const step = target / 40
        const timer = setInterval(() => {
            start += step
            if (start >= target) { setCount(target); clearInterval(timer) }
            else setCount(Math.floor(start))
        }, 30)
        return () => clearInterval(timer)
    }, [inView, target])
    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

function TerminalAnimation() {
    const ref = useRef(null)
    const inView = useInView(ref)
    const [replayKey, setReplayKey] = useState(0)

    useEffect(() => {
        if (inView) {
            setReplayKey(prev => prev + 1)
        }
    }, [inView])

    const lines = [
        { text: '$ Recording screen... 00:45', color: '#4A4A4A', delay: 0 },
        { text: '✓ Recording complete. Analyzing 45 screenshots...', color: '#22C55E', delay: 0.8 },
        { text: '⚡ AI generating step descriptions...', color: '#818CF8', delay: 1.6 },
        { text: '✓ Step 1: Navigate to GST Portal and login', color: '#F9F9F9', delay: 2.4 },
        { text: '✓ Step 2: Click "File Returns" in navigation', color: '#F9F9F9', delay: 2.8 },
        { text: '✓ Step 3: Select GSTR-1 and return period', color: '#F9F9F9', delay: 3.2 },
        { text: '✦ Published to SOP Library ✓', color: '#6366F1', delay: 3.8 },
    ]
    return (
        <div ref={ref} className="bg-[#0D0D0D] rounded-xl border border-[#1F1F1F] p-4 font-mono text-xs space-y-1.5 min-h-[160px]">
            {inView && (
                <div key={replayKey}>
                    {lines.map((line, i) => (
                        <motion.p
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: line.delay, duration: 0.3 }}
                            style={{ color: line.color }}
                            className="font-mono text-xs"
                        >
                            {line.text}
                        </motion.p>
                    ))}
                </div>
            )}
        </div>
    )
}

// =====================
// ANIMATION HELPERS
// =====================
function FadeInSection({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-80px' })
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: 'easeOut', delay }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

// =====================
// NAVBAR
// =====================
function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <>
            <header className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                scrolled ? 'bg-[rgba(8,8,8,0.85)] backdrop-blur-xl border-b border-[#1F1F1F]' : 'bg-transparent'
            )}>
                <div className="container-max flex items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
                        <div className="w-8 h-8 bg-[#6366F1] rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">S</span>
                        </div>
                        <span className="font-bold text-[#F9F9F9] text-base tracking-tight">SOPify</span>
                    </Link>

                    {/* Center nav */}
                    <nav className="hidden md:flex items-center gap-8 ml-10 flex-1">
                        {['Features', 'How it Works', 'Pricing', 'For CA Firms'].map(item => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                                className="text-sm text-[#8A8A8A] hover:text-[#F9F9F9] transition-colors relative group"
                            >
                                {item}
                                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#6366F1] group-hover:w-full transition-all duration-200" />
                            </a>
                        ))}
                    </nav>

                    {/* CTA */}
                    <div className="hidden md:flex items-center gap-3 ml-auto">
                        <Link href="/app/dashboard" className="text-sm text-[#8A8A8A] hover:text-[#F9F9F9] transition-colors px-3 py-2">
                            Log in
                        </Link>
                        <Link href="/app/dashboard">
                            <button className="h-10 px-5 rounded-lg bg-[#6366F1] text-white text-sm font-medium hover:bg-[#818CF8] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all duration-150">
                                Start Free
                            </button>
                        </Link>
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden ml-auto p-2 text-[#8A8A8A] hover:text-[#F9F9F9]"
                        onClick={() => setMobileOpen(o => !o)}
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Mobile menu */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="md:hidden bg-[#0D0D0D] border-b border-[#1F1F1F] px-6 py-4 space-y-3"
                        >
                            {['Features', 'How it Works', 'Pricing', 'For CA Firms'].map(item => (
                                <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="block text-sm text-[#8A8A8A] hover:text-[#F9F9F9] py-2"
                                    onClick={() => setMobileOpen(false)}>
                                    {item}
                                </a>
                            ))}
                            <div className="pt-2 border-t border-[#1F1F1F] flex flex-col gap-2">
                                <Link href="/app/dashboard" className="text-sm text-[#8A8A8A] py-2">Log in</Link>
                                <Link href="/app/dashboard">
                                    <button className="w-full h-10 rounded-lg bg-[#6366F1] text-white text-sm font-medium">Start Free</button>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
        </>
    )
}

// =====================
// PRODUCT MOCKUP
// =====================
function FloatingMockup() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="relative max-w-4xl mx-auto"
        >
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
            >
                {/* glow behind mockup */}
                <div className="absolute -inset-6 rounded-3xl bg-[#6366F1] opacity-[0.08] blur-[80px] pointer-events-none" />
                <div className="relative">
                    <ProductMockup />
                </div>
            </motion.div>
        </motion.div>
    )
}

function ProductMockup() {
    const sopItems = [
        { cat: 'GST', title: 'File GSTR-1 on GST Portal', steps: 6, creator: 'RS', views: 142 },
        { cat: 'TDS', title: 'TDS Return Filing in TRACES', steps: 6, creator: 'PM', views: 98 },
        { cat: 'MCA', title: 'Adding New Company on MCA21', steps: 5, creator: 'AK', views: 76 },
        { cat: 'Audit', title: 'Auditing Cash Book Entries', steps: 5, creator: 'RS', views: 134 },
        { cat: 'Income Tax', title: 'ITR-1 Filing for Individuals', steps: 5, creator: 'PM', views: 210 },
        { cat: 'GST', title: 'GST Annual Return (GSTR-9)', steps: 3, creator: 'AK', views: 167 },
    ]

    const catColors: Record<string, { bg: string; text: string }> = {
        'GST': { bg: 'rgba(16,185,129,0.15)', text: '#10B981' },
        'TDS': { bg: 'rgba(249,115,22,0.15)', text: '#F97316' },
        'MCA': { bg: 'rgba(168,85,247,0.15)', text: '#A855F7' },
        'Audit': { bg: 'rgba(239,68,68,0.15)', text: '#EF4444' },
        'Income Tax': { bg: 'rgba(59,130,246,0.15)', text: '#3B82F6' },
    }

    return (
        <div className="rounded-2xl overflow-hidden border border-[#2A2A2A] shadow-[0_32px_80px_rgba(0,0,0,0.7)]">
            {/* Browser chrome */}
            <div className="bg-[#1A1A1A] border-b border-[#2A2A2A] px-4 py-3 flex items-center gap-3">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                    <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                    <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
                </div>
                <div className="flex-1 bg-[#111111] rounded-md px-3 py-1 text-xs text-[#4A4A4A] font-mono ml-2">
                    app.sopify.in/library
                </div>
            </div>

            {/* App UI */}
            <div className="bg-[#0D0D0D] flex" style={{ height: '420px' }}>
                {/* Sidebar */}
                <div className="w-44 bg-[#080808] border-r border-[#1F1F1F] flex flex-col p-3 gap-1">
                    <div className="flex items-center gap-2 px-3 py-2 mb-3">
                        <div className="w-6 h-6 bg-[#6366F1] rounded-md flex items-center justify-center">
                            <span className="text-white text-xs font-bold">S</span>
                        </div>
                        <span className="text-xs font-bold text-[#F9F9F9]">SOPify</span>
                    </div>
                    {[
                        { icon: '⊞', label: 'Dashboard' },
                        { icon: '⊟', label: 'SOP Library', active: true },
                        { icon: '+', label: 'Create SOP' },
                        { icon: '⚙', label: 'Settings' },
                    ].map(item => (
                        <div key={item.label} className={cn(
                            'flex items-center gap-2 px-3 py-2 rounded-lg text-xs',
                            item.active ? 'bg-[#6366F1]/15 text-[#818CF8]' : 'text-[#4A4A4A]'
                        )}>
                            <span className="w-4 text-center">{item.icon}</span>
                            {item.label}
                        </div>
                    ))}
                </div>

                {/* Main content */}
                <div className="flex-1 p-4 overflow-hidden">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold text-[#F9F9F9]">SOP Library</p>
                        <div className="bg-[#6366F1] text-white text-[10px] px-3 py-1 rounded-lg font-medium">+ Create</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {sopItems.map((sop, i) => (
                            <div key={i} className="bg-[#111111] border border-[#1F1F1F] rounded-lg p-3 space-y-2">
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-mono font-medium"
                                    style={{ background: catColors[sop.cat]?.bg, color: catColors[sop.cat]?.text }}>
                                    {sop.cat}
                                </span>
                                <p className="text-[10px] text-[#F9F9F9] leading-tight font-medium line-clamp-2">{sop.title}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] text-[#4A4A4A] font-mono">{sop.steps} steps</span>
                                    <span className="text-[9px] text-[#4A4A4A]">👁 {sop.views}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

// =====================
// HERO TYPEWRITER
// =====================
function Typewriter({ text }: { text: string }) {
    const [displayed, setDisplayed] = useState('')
    const [done, setDone] = useState(false)

    useEffect(() => {
        let i = 0
        const interval = setInterval(() => {
            setDisplayed(text.slice(0, i + 1))
            i++
            if (i >= text.length) { clearInterval(interval); setDone(true) }
        }, 30)
        return () => clearInterval(interval)
    }, [text])

    return (
        <span className="text-[#8A8A8A]">
            {displayed}
            {!done && <span className="animate-pulse">|</span>}
        </span>
    )
}

// =====================
// SECTION WRAPPERS
// =====================
function Section({ id, children, className }: { id?: string; children: React.ReactNode; className?: string }) {
    return (
        <section id={id} className={cn('section-padding', className)}>
            <div className="container-max">
                {children}
            </div>
        </section>
    )
}

// =====================
// PRICING TOGGLE
// =====================
function Pricing() {
    const [annual, setAnnual] = useState(false)

    const plans = [
        {
            name: 'Starter',
            monthly: 1499,
            features: ['Up to 5 team members', '50 SOPs', 'Shareable links', 'Basic AI descriptions', 'Email support'],
            cta: 'Get Started',
            popular: false,
        },
        {
            name: 'Growth',
            monthly: 3499,
            features: ['Up to 20 team members', 'Unlimited SOPs', 'AI-generated descriptions', 'PDF export', 'Priority email support', 'WhatsApp integration'],
            cta: 'Start Growth Plan',
            popular: true,
        },
        {
            name: 'Firm',
            monthly: 7999,
            features: ['Unlimited team members', 'Unlimited SOPs', 'Everything in Growth', 'Priority phone support', 'Custom branding', 'Onboarding call'],
            cta: 'Talk to Sales',
            popular: false,
        },
    ]

    return (
        <Section id="pricing">
            <FadeInSection className="text-center mb-16">
                <h2 className="text-5xl font-bold text-[#F9F9F9] tracking-tight mb-4">
                    Simple pricing.<br />No per-user nonsense.
                </h2>
                <p className="text-[#8A8A8A] text-lg max-w-xl mx-auto">
                    One flat price for your whole firm. Predictable costs, no surprises.
                </p>
                {/* Toggle */}
                <div className="flex items-center justify-center gap-3 mt-8">
                    <span className={cn('text-sm', !annual ? 'text-[#F9F9F9]' : 'text-[#8A8A8A]')}>Monthly</span>
                    <button
                        onClick={() => setAnnual(a => !a)}
                        className={cn(
                            'relative w-12 h-6 rounded-full transition-colors duration-200',
                            annual ? 'bg-[#6366F1]' : 'bg-[#1F1F1F]'
                        )}
                    >
                        <span className={cn(
                            'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200',
                            annual && 'translate-x-6'
                        )} />
                    </button>
                    <span className={cn('text-sm flex items-center gap-2', annual ? 'text-[#F9F9F9]' : 'text-[#8A8A8A]')}>
                        Annual
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30">Save 20%</span>
                    </span>
                </div>
            </FadeInSection>

            <div className="grid grid-cols-3 gap-6 max-w-5xl mx-auto">
                {plans.map((plan, i) => (
                    <FadeInSection key={plan.name} delay={i * 0.1}>
                        <div className={cn(
                            'relative bg-[#111111] border rounded-xl p-8 flex flex-col',
                            plan.popular
                                ? 'border-[#6366F1] shadow-[0_0_40px_rgba(99,102,241,0.2)]'
                                : 'border-[#1F1F1F]'
                        )}>
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-[#6366F1] text-white">
                                        Most Popular
                                    </span>
                                </div>
                            )}
                            <div className="mb-6">
                                <p className="text-sm text-[#8A8A8A] mb-2">{plan.name}</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-[#F9F9F9] tracking-tight">
                                        ₹{annual ? Math.round(plan.monthly * 0.8).toLocaleString() : plan.monthly.toLocaleString()}
                                    </span>
                                    <span className="text-sm text-[#4A4A4A]">/month</span>
                                </div>
                                {annual && <p className="text-xs text-[#22C55E] mt-1">Billed annually</p>}
                            </div>

                            <ul className="space-y-3 flex-1 mb-8">
                                {plan.features.map(f => (
                                    <li key={f} className="flex items-start gap-2.5 text-sm text-[#8A8A8A]">
                                        <Check className="w-3.5 h-3.5 text-[#22C55E] mt-0.5 flex-shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <Link href="/app/dashboard">
                                <button className={cn(
                                    'w-full h-12 rounded-lg text-sm font-medium transition-all duration-150',
                                    plan.popular
                                        ? 'bg-[#6366F1] text-white hover:bg-[#818CF8] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]'
                                        : 'bg-transparent border border-[#1F1F1F] text-[#F9F9F9] hover:border-[#6366F1]'
                                )}>
                                    {plan.cta}
                                </button>
                            </Link>
                        </div>
                    </FadeInSection>
                ))}
            </div>
        </Section>
    )
}

// =====================
// BENTO CARD
// =====================
function BentoCard({ children, className, large }: { children: React.ReactNode; className?: string; large?: boolean }) {
    const ref = useRef<HTMLDivElement>(null)

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        ref.current.style.setProperty('--mouse-x', `${x}%`)
        ref.current.style.setProperty('--mouse-y', `${y}%`)
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            whileHover={{ borderColor: '#6366F1', y: -2 }}
            transition={{ duration: 0.2 }}
            className={cn(
                'bento-card bg-[#111111] border border-[#1F1F1F] rounded-xl p-8',
                'transition-[border-color] duration-200',
                className
            )}
        >
            {children}
        </motion.div>
    )
}

// =====================
// SCROLL TO TOP
// =====================
function ScrollToTop() {
    const [show, setShow] = useState(false)
    useEffect(() => {
        const onScroll = () => setShow(window.scrollY > 500)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <AnimatePresence>
            {show && (
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed bottom-8 right-8 w-11 h-11 rounded-xl bg-[#6366F1] text-white flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:bg-[#818CF8] z-50 transition-colors"
                >
                    <ChevronUp className="w-5 h-5" />
                </motion.button>
            )}
        </AnimatePresence>
    )
}

// =====================
// MAIN PAGE
// =====================
export default function LandingPage() {
    return (
        <main className="bg-[#080808] text-[#F9F9F9] overflow-x-hidden">
            <Navbar />
            <ScrollToTop />

            {/* ── HERO ─────────────────────────────────────────── */}
            <section className="min-h-screen flex flex-col items-center justify-center text-center pt-16 pb-20 relative hero-dot-pattern">
                {/* Background glows */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-[#6366F1] opacity-[0.07] blur-[140px] pointer-events-none" />
                <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-[#8B5CF6] opacity-[0.04] blur-[100px] pointer-events-none" />
                <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] rounded-full bg-[#06B6D4] opacity-[0.03] blur-[100px] pointer-events-none" />

                <div className="container-max relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Announcement pill */}
                        <div className="gradient-border-pill inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                            <span className="text-[#818CF8] text-xs font-mono">Built for Indian CA Firms</span>
                        </div>

                        {/* Hero headline */}
                        <h1 className="text-7xl font-extrabold tracking-tight leading-none mb-6" style={{ letterSpacing: '-0.04em' }}>
                            <span className="text-[#F9F9F9]">Your firm's knowledge,</span>
                            <br />
                            <span className="text-[#F9F9F9]">finally </span>
                            <span className="gradient-text text-glow">captured.</span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-xl max-w-[520px] mx-auto mb-10 leading-relaxed" style={{ lineHeight: 1.65 }}>
                            <Typewriter text="Articles leave every 2 years. Your best practices don't have to. Record your screen, AI writes the SOP. Your juniors learn faster." />
                        </p>

                        {/* CTAs */}
                        <div className="flex items-center gap-4 justify-center flex-wrap mb-12">
                            <Link href="/app/record">
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    className="h-14 px-8 rounded-xl bg-[#6366F1] text-white font-semibold text-sm hover:bg-[#818CF8] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-150 flex items-center gap-2"
                                >
                                    Record your screen. AI writes the SOP. Done. <ArrowRight className="w-4 h-4" />
                                </motion.button>
                            </Link>
                            <Link href="/app/record">
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    className="h-14 px-8 rounded-xl bg-transparent border border-[#1F1F1F] text-[#F9F9F9] font-semibold text-sm hover:border-[#6366F1] hover:bg-[#111111] transition-all duration-150 flex items-center gap-2"
                                >
                                    Try the recorder <ArrowRight className="w-4 h-4 ml-1" />
                                </motion.button>
                            </Link>
                        </div>

                        <div className="flex items-center gap-8 justify-center mb-12 flex-wrap">
                            {[
                                { num: 500, label: 'CA Firms', suffix: '+' },
                                { num: 12000, label: 'SOPs Created', suffix: '+' },
                                { num: 2, label: 'Avg. SOP creation time', suffix: ' min' },
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <p className="text-2xl font-bold text-[#F9F9F9] tracking-tight">
                                        <CountUp target={stat.num} suffix={stat.suffix} />
                                    </p>
                                    <p className="text-xs text-[#4A4A4A] font-mono mt-0.5">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Product mockup */}
                    <div className="mt-8">
                        <FloatingMockup />
                    </div>
                </div>
            </section>

            {/* ── SOCIAL PROOF ─────────────────────────────────── */}
            <div className="border-y border-[#1F1F1F] py-8 overflow-hidden">
                <p className="text-center text-xs font-mono text-[#4A4A4A] mb-6 tracking-widest uppercase">
                    Trusted by CA professionals across India
                </p>
                <div className="overflow-hidden relative">
                    <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#080808] to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#080808] to-transparent z-10 pointer-events-none" />
                    <div className="marquee-track">
                        {[
                            'S.R. Batliboi & Co.', 'Lodha & Co.', 'Nanubhai & Co.', 'PKF India',
                            'MSKA & Associates', 'Deloitte India', 'Walker Chandiok', 'A.F. Ferguson & Co.',
                            'S.R. Batliboi & Co.', 'Lodha & Co.', 'Nanubhai & Co.', 'PKF India',
                            'MSKA & Associates', 'Deloitte India', 'Walker Chandiok', 'A.F. Ferguson & Co.',
                        ].map((firm, i) => (
                            <span key={i} className="text-[#2A2A2A] font-medium text-sm mx-10 whitespace-nowrap hover:text-[#4A4A4A] transition-colors cursor-default">
                                {firm}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── THE PROBLEM ───────────────────────────────────── */}
            <Section id="for-ca-firms">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <FadeInSection>
                        <p className="text-xs font-mono text-[#6366F1] mb-4 tracking-widest uppercase">The Problem</p>
                        <h2 className="text-5xl font-bold text-[#F9F9F9] tracking-tight leading-tight">
                            Every 2 years, your best article leaves.
                        </h2>
                        <p className="text-2xl text-[#8A8A8A] mt-4 leading-relaxed">
                            And takes everything they know with them.
                        </p>
                    </FadeInSection>

                    <div className="space-y-4">
                        {[
                            {
                                icon: Users,
                                title: 'Partners repeat the same training every batch',
                                desc: 'No structured guides means seniors spend hours teaching basics that should take minutes.',
                                color: '#6366F1',
                            },
                            {
                                icon: FileText,
                                title: 'New articles struggle for months',
                                desc: 'Without documentation, every junior reinvents the wheel and makes the same mistakes.',
                                color: '#F59E0B',
                            },
                            {
                                icon: Star,
                                title: 'Clients notice the quality drop',
                                desc: 'Each new batch means a dip in output quality that affects client trust.',
                                color: '#EF4444',
                            },
                        ].map((item, i) => (
                            <FadeInSection key={item.title} delay={i * 0.15}>
                                <div className="bg-[#111111] border border-[#1F1F1F] rounded-xl p-6 flex gap-4 hover:border-[#6366F1] transition-[border-color] duration-200">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{ background: `${item.color}20` }}>
                                        <item.icon className="w-5 h-5" style={{ color: item.color }} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[#F9F9F9] mb-1">{item.title}</p>
                                        <p className="text-sm text-[#8A8A8A] leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </Section>

            <div className="h-px bg-gradient-to-r from-transparent via-[#1F1F1F] to-transparent" />

            {/* ── HOW IT WORKS ─────────────────────────────────── */}
            <Section id="how-it-works" className="bg-[#0A0A0A]">
                <FadeInSection className="text-center mb-16">
                    <h2 className="text-5xl font-bold text-[#F9F9F9] tracking-tight mb-4">
                        From screen recording to perfect SOP<br />— in 60 seconds.
                    </h2>
                    <p className="text-[#8A8A8A] text-lg">No editing. No formatting. Just press record and walk through the process.</p>
                </FadeInSection>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connecting lines */}
                    <div className="hidden md:block absolute top-[52px] left-[16.66%] w-[66.66%] h-px border-t border-dashed border-[#2A2A2A] pointer-events-none" />

                    {[
                        {
                            num: '01',
                            title: 'Press Record',
                            desc: 'Hit the record button while you work. Do the task naturally — filing a return, entering entries, making MCA filings. SOPify captures every click.',
                            icon: Video,
                            href: '/app/record'
                        },
                        {
                            num: '02',
                            title: 'AI writes the steps',
                            desc: 'Our AI analyzes your screen recording and writes clear, numbered instructions with annotated screenshots automatically. You review, edit, publish.',
                            icon: Sparkles,
                        },
                        {
                            num: '03',
                            title: 'Share with your team',
                            desc: 'Publish to your firm\'s library instantly. Your juniors find answers themselves. Partners stop repeating themselves. Knowledge stays forever.',
                            icon: Share2,
                        },
                    ].map((step, i) => (
                        <FadeInSection key={step.num} delay={i * 0.15} className="relative z-10 text-center flex flex-col items-center space-y-4">
                            <div className="w-14 h-14 rounded-2xl bg-[#111111] border border-[#1F1F1F] flex items-center justify-center mb-2 z-10 relative">
                                <step.icon className="w-6 h-6 text-[#6366F1]" />
                            </div>
                            <span className="text-sm font-mono font-bold text-[#6366F1]/80">Step {step.num}</span>
                            <h3 className="text-xl font-bold text-[#F9F9F9]">{step.title}</h3>
                            <p className="text-[#8A8A8A] leading-relaxed text-sm">
                                {step.href ? (
                                    <Link href={step.href} className="text-[#6366F1] hover:underline hover:text-[#818CF8] transition-colors">
                                        {step.desc}
                                    </Link>
                                ) : (
                                    step.desc
                                )}
                            </p>
                        </FadeInSection>
                    ))}
                </div>
            </Section>

            <div className="h-px bg-gradient-to-r from-transparent via-[#1F1F1F] to-transparent" />

            {/* ── FEATURES BENTO ───────────────────────────────── */}
            <Section id="features">
                <FadeInSection className="text-center mb-16">
                    <h2 className="text-5xl font-bold text-[#F9F9F9] tracking-tight mb-4">
                        Everything your firm needs<br />to stop losing knowledge.
                    </h2>
                    <p className="text-[#8A8A8A] text-lg max-w-xl mx-auto">
                        Built specifically for CA firm workflows — not generic SOP tools that miss the context.
                    </p>
                </FadeInSection>

                {/* Bento grid */}
                <div className="grid grid-cols-6 gap-4">
                    {/* Large card — col-span-4 */}
                    <FadeInSection className="col-span-6 md:col-span-4 h-full">
                        <BentoCard className="h-full flex flex-col">
                            <div className="flex gap-2 mb-4">
                                <span className="text-2xl">🎥</span>
                                <div>
                                    <p className="font-bold text-[#F9F9F9] text-lg">Screen Record → Auto SOP</p>
                                    <p className="text-sm text-[#8A8A8A] mt-1">Click Record in SOPify. Pick your screen — full desktop, Tally window, Excel, or browser tab. Do the task. Stop recording. That's it.</p>
                                </div>
                            </div>
                            <TerminalAnimation />
                        </BentoCard>
                    </FadeInSection>

                    {/* Medium card — col-span-2 */}
                    <FadeInSection delay={0.1} className="col-span-6 md:col-span-2">
                        <BentoCard className="h-full">
                            <p className="font-bold text-[#F9F9F9] mb-1">CA-Specific Categories</p>
                            <p className="text-sm text-[#8A8A8A] mb-4">Every category your firm needs, pre-built.</p>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { cat: 'GST' as const }, { cat: 'TDS' as const }, { cat: 'Income Tax' as const },
                                    { cat: 'MCA' as const }, { cat: 'Audit' as const }, { cat: 'Internal' as const },
                                    { cat: 'Client' as const }, { cat: 'General' as const },
                                ].map(({ cat }) => (
                                    <Badge key={cat} category={cat}>{cat}</Badge>
                                ))}
                            </div>
                        </BentoCard>
                    </FadeInSection>

                    {/* Wide card — col-span-6 */}
                    <FadeInSection className="col-span-6" delay={0.15}>
                        <BentoCard>
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <p className="font-bold text-[#F9F9F9] text-lg mb-2">✨ AI Writes Every Step</p>
                                    <p className="text-sm text-[#8A8A8A] leading-relaxed">
                                        Stop staring at a blank description field. Our AI understands GST portals, TRACES, MCA21, Income Tax portal — it writes descriptions that actually make sense to a junior CA.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-[#0D0D0D] border border-[#1F1F1F] rounded-xl p-4">
                                        <p className="text-[10px] font-mono text-[#4A4A4A] mb-2 uppercase">Before AI</p>
                                        <p className="text-xs text-[#4A4A4A] italic">Click submit...</p>
                                    </div>
                                    <div className="bg-[#0D0D0D] border border-[#6366F1]/30 rounded-xl p-4 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#6366F1]/5 to-transparent shimmer" />
                                        <p className="relative text-[10px] font-mono text-[#6366F1] mb-2 uppercase">After AI ✨</p>
                                        <p className="relative text-xs text-[#F9F9F9] leading-relaxed">Click the blue "SUBMIT" button at the bottom of the return summary page. A confirmation dialog will appear — verify the total tax liability matches your working sheet before clicking "Confirm Filing".</p>
                                    </div>
                                </div>
                            </div>
                        </BentoCard>
                    </FadeInSection>

                    {/* 4 small cards — col-span-3 each (2 per row on md) */}
                    {[
                        { icon: Share2, title: 'Shareable Links', desc: 'Send via WhatsApp in one tap' },
                        { icon: Search, title: 'Searchable Library', desc: 'Full-text search across all SOPs' },
                        { icon: FileText, title: 'Step-by-Step Viewer', desc: 'Guided mode for junior staff' },
                        { icon: Smartphone, title: 'Mobile Friendly', desc: 'Works on any device or screen' },
                    ].map((item, i) => (
                        <FadeInSection key={item.title} delay={i * 0.1} className="col-span-6 md:col-span-3">
                            <BentoCard className="h-full">
                                <item.icon className="w-5 h-5 text-[#6366F1] mb-3" />
                                <p className="font-semibold text-[#F9F9F9] text-sm mb-1">{item.title}</p>
                                <p className="text-xs text-[#8A8A8A]">{item.desc}</p>
                            </BentoCard>
                        </FadeInSection>
                    ))}
                </div>
            </Section>

            {/* ── SOP VIEWER PREVIEW ───────────────────────────── */}
            <Section className="bg-[#0A0A0A]">
                <FadeInSection className="text-center mb-16">
                    <h2 className="text-5xl font-bold text-[#F9F9F9] tracking-tight mb-4">
                        Your juniors learn by doing,<br />not by asking.
                    </h2>
                </FadeInSection>

                <FadeInSection>
                    <div className="max-w-3xl mx-auto bg-[#111111] border border-[#1F1F1F] rounded-2xl overflow-hidden">
                        {/* Viewer top bar */}
                        <div className="bg-[#0D0D0D] border-b border-[#1F1F1F] px-6 py-3 flex items-center gap-4">
                            <span className="text-xs font-mono text-[#4A4A4A]">SOPify</span>
                            <span className="flex-1 text-xs text-[#8A8A8A] text-center">How to file GSTR-1 on GST Portal</span>
                            <span className="text-xs font-mono text-[#6366F1]">Step 3 of 6</span>
                        </div>
                        {/* Progress bar */}
                        <div className="h-1 bg-[#1F1F1F]">
                            <div className="h-full bg-[#6366F1] rounded-r" style={{ width: '50%' }} />
                        </div>
                        {/* Content */}
                        <div className="p-8 space-y-6">
                            <div>
                                <span className="text-xs font-mono text-[#6366F1] block mb-2">Step 3 of 6</span>
                                <h3 className="text-xl font-bold text-[#F9F9F9]">Open GSTR-1 Form</h3>
                            </div>
                            {/* Screenshot placeholder */}
                            <div className="relative bg-[#0D0D0D] rounded-xl border border-[#1F1F1F] h-48 flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-full h-8 bg-[#1A1A1A] absolute top-10" />
                                    <div className="flex gap-3 absolute top-4 left-4">
                                        {['Dashboard', 'Returns', 'Payments', 'User Services'].map(item => (
                                            <span key={item} className="text-[10px] text-[#4A4A4A]">{item}</span>
                                        ))}
                                    </div>
                                    {/* Highlight box */}
                                    <div className="absolute border-2 border-amber-400 bg-amber-400/20 rounded-lg w-40 h-14 top-12 left-1/2 -translate-x-1/2 flex items-center justify-center">
                                        <span className="text-[10px] text-amber-300 font-mono">PREPARE ONLINE →</span>
                                    </div>
                                    {/* Arrow */}
                                    <div className="absolute top-[70px] left-[calc(50%-100px)] text-amber-400 text-xl">→</div>
                                </div>
                            </div>
                            <p className="text-[#8A8A8A] text-sm leading-relaxed">
                                On the Returns Dashboard, find the GSTR-1 tile. Click <strong className="text-[#F9F9F9]">"PREPARE ONLINE"</strong> if you want to enter invoices manually, or "PREPARE OFFLINE" if you have data in JSON/Excel format.
                            </p>
                            {/* Navigation */}
                            <div className="flex items-center justify-between pt-2 border-t border-[#1F1F1F]">
                                <button className="h-10 px-5 rounded-lg border border-[#1F1F1F] text-sm text-[#8A8A8A]">← Previous</button>
                                <div className="flex gap-1.5">
                                    {[0, 1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className={`rounded-full ${i === 2 ? 'w-4 h-2 bg-[#6366F1]' : i < 2 ? 'w-2 h-2 bg-[#6366F1]/50' : 'w-2 h-2 bg-[#1F1F1F]'}`} />
                                    ))}
                                </div>
                                <button className="h-10 px-5 rounded-lg bg-[#6366F1] text-sm text-white font-medium">Next Step →</button>
                            </div>
                        </div>
                    </div>
                </FadeInSection>
            </Section>

            {/* ── PRICING ────────────────────────────────────── */}
            <Pricing />

            {/* ── TESTIMONIALS ─────────────────────────────────── */}
            <Section className="bg-[#0A0A0A]">
                <FadeInSection className="text-center mb-16">
                    <h2 className="text-5xl font-bold text-[#F9F9F9] tracking-tight mb-4">
                        From CA professionals who've been there.
                    </h2>
                </FadeInSection>

                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        {
                            quote: "Before SOPify, every new batch of articles took 3 months to become productive. Now they're filing returns independently in 3 weeks. I don't know how we managed without this.",
                            name: 'Priya Mehta',
                            role: 'Partner, M/s Mehta & Associates',
                            city: 'Mumbai',
                        },
                        {
                            quote: "I recorded myself doing a GSTR-9 filing once. That single recording has trained 8 articles since. I haven't explained the annual return process even once since then.",
                            name: 'Rajesh Sharma',
                            role: 'Senior Manager, PKF India',
                            city: 'New Delhi',
                        },
                        {
                            quote: "The institutional knowledge problem is real and silent. You don't feel it until it's gone. SOPify made us realize how much we were hemorrhaging knowledge between every batch.",
                            name: 'Aditya Nair',
                            role: 'Managing Partner, Nair & Sons',
                            city: 'Pune',
                        },
                    ].map((t, i) => (
                        <FadeInSection key={t.name} delay={i * 0.1}>
                            <div className="bg-[#111111] border border-[#1F1F1F] rounded-xl p-8 flex flex-col h-full hover:border-[#6366F1] transition-[border-color] duration-200">
                                <div className="flex gap-1 mb-6">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />)}
                                </div>
                                <div className="relative mb-6 flex-1">
                                    <span className="absolute -top-6 -left-2 text-8xl text-[#6366F1]/10 font-serif leading-none select-none">"</span>
                                    <p className="relative text-[#F9F9F9] italic leading-relaxed text-base">"{t.quote}"</p>
                                </div>
                                <hr className="border-[#1F1F1F] mb-6" />
                                <div>
                                    <p className="font-semibold text-[#F9F9F9]">{t.name}</p>
                                    <p className="text-sm text-[#8A8A8A]">{t.role}</p>
                                    <p className="text-xs text-[#4A4A4A] mt-0.5">{t.city}</p>
                                </div>
                            </div>
                        </FadeInSection>
                    ))}
                </div>
            </Section>

            {/* ── CTA BANNER ────────────────────────────────────── */}
            <section className="py-24 bg-gradient-to-br from-[#6366F1] via-[#4F46E5] to-[#3730A3] relative overflow-hidden">
                <div className="absolute inset-0 hero-dot-pattern opacity-20" />
                <div className="container-max text-center relative z-10">
                    <FadeInSection>
                        <h2 className="text-5xl font-extrabold text-white mb-4 tracking-tight">
                            Stop losing what your firm knows.
                        </h2>
                        <p className="text-indigo-200 text-xl mb-10">
                            Start documenting in the next 10 minutes.
                        </p>
                        <Link href="/app/create">
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                className="h-16 px-10 rounded-xl bg-white text-[#4F46E5] font-bold text-base hover:bg-indigo-50 transition-colors shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
                            >
                                Create Free Account →
                            </motion.button>
                        </Link>
                        <p className="text-indigo-300/70 text-sm mt-6">
                            No credit card required · Free 14-day trial · Cancel anytime
                        </p>
                    </FadeInSection>
                </div>
            </section>

            {/* ── FOOTER ────────────────────────────────────────── */}
            <footer className="bg-[#080808] border-t border-[#1F1F1F]">
                <div className="container-max py-16">
                    <div className="grid grid-cols-4 gap-12 mb-12">
                        {/* Logo col */}
                        <div>
                            <Link href="/" className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-[#6366F1] rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">S</span>
                                </div>
                                <span className="font-bold text-[#F9F9F9]">SOPify</span>
                            </Link>
                            <p className="text-sm text-[#4A4A4A] leading-relaxed">
                                Stop losing institutional knowledge. Built for Indian CA firms.
                            </p>
                        </div>

                        {/* Link columns */}
                        {[
                            {
                                title: 'Product',
                                links: ['Features', 'How it Works', 'Pricing', 'Changelog'],
                            },
                            {
                                title: 'Company',
                                links: ['About', 'Blog', 'Contact', 'Careers'],
                            },
                            {
                                title: 'Legal',
                                links: ['Privacy Policy', 'Terms of Service'],
                            },
                        ].map(col => (
                            <div key={col.title}>
                                <p className="text-xs font-mono text-[#4A4A4A] uppercase tracking-widest mb-4">{col.title}</p>
                                <ul className="space-y-3">
                                    {col.links.map(link => (
                                        <li key={link}>
                                            <a href="#" className="text-sm text-[#8A8A8A] hover:text-[#F9F9F9] transition-colors">{link}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between pt-8 border-t border-[#1F1F1F]">
                        <p className="text-xs text-[#4A4A4A]">© 2025 SOPify. Built for Indian CA firms.</p>
                        <p className="text-xs text-[#4A4A4A]">Made with ♥ in India</p>
                    </div>
                </div>
            </footer>
        </main>
    )
}
