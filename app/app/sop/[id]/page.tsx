'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { getSopById } from '@/lib/data'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useToast } from '@/components/ui/Toast'
import {
    ArrowLeft, ArrowRight, Share2, BookOpen, CheckCircle,
    ChevronLeft, AlertTriangle, User, Calendar, Layers
} from 'lucide-react'

export default function SopViewer() {
    const params = useParams()
    const id = params?.id as string
    const sop = getSopById(id)
    const { addToast } = useToast()

    const [currentStep, setCurrentStep] = useState(0)
    const [completed, setCompleted] = useState(false)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)

    const step = sop?.steps[currentStep]
    const progress = sop ? ((currentStep + 1) / sop.steps.length) * 100 : 0

    useEffect(() => {
        if (sop) {
            document.title = `${sop.title} | SOPify`
        } else {
            document.title = "SOP Viewer | SOPify"
        }
    }, [sop])

    // Draw highlight on canvas
    useEffect(() => {
        const canvas = canvasRef.current
        const img = imgRef.current
        if (!canvas || !img || !step?.highlightCoords) return
        const ctx = canvas.getContext('2d')!
        const draw = () => {
            canvas.width = img.naturalWidth || 600
            canvas.height = img.naturalHeight || 340
            ctx.drawImage(img, 0, 0)
            const h = step.highlightCoords!
            ctx.fillStyle = 'rgba(245,158,11,0.25)'
            ctx.strokeStyle = '#F59E0B'
            ctx.lineWidth = 3
            ctx.fillRect(h.x, h.y, h.width, h.height)
            ctx.strokeRect(h.x, h.y, h.width, h.height)
            // Arrow
            ctx.fillStyle = '#F59E0B'
            ctx.beginPath()
            ctx.moveTo(h.x - 30, h.y + h.height / 2)
            ctx.lineTo(h.x - 5, h.y + h.height / 2 - 8)
            ctx.lineTo(h.x - 5, h.y + h.height / 2 + 8)
            ctx.closePath()
            ctx.fill()
        }
        if (img.complete) draw()
        else img.onload = draw
    }, [step])

    // Keyboard navigation
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                if (sop && currentStep < sop.steps.length - 1) setCurrentStep(c => c + 1)
                else if (sop && currentStep === sop.steps.length - 1) setCompleted(true)
            }
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                if (currentStep > 0) { setCurrentStep(c => c - 1); setCompleted(false) }
            }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [currentStep, sop])

    const handleNext = () => {
        if (!sop) return
        if (currentStep < sop.steps.length - 1) { setCurrentStep(c => c + 1) }
        else { setCompleted(true) }
    }

    const handlePrev = () => {
        if (currentStep > 0) { setCurrentStep(c => c - 1); setCompleted(false) }
    }

    const handleShare = () => {
        const url = `https://sopify.in/sop/${id}`
        navigator.clipboard?.writeText(url).catch(() => { })
        addToast('Link copied! Share it with your team on WhatsApp or email 🎉', 'success')
    }

    if (!sop) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-[#8A8A8A] text-lg mb-4">SOP not found</p>
                    <Link href="/app/library"><Button variant="secondary">← Back to Library</Button></Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#080808] flex flex-col">
            {/* Top bar */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[rgba(8,8,8,0.9)] border-b border-[#1F1F1F] backdrop-blur-xl">
                <div className="flex items-center gap-4 h-14 px-6">
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-7 h-7 bg-[#6366F1] rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xs">S</span>
                        </div>
                        <span className="font-bold text-[#F9F9F9] text-sm hidden sm:block">SOPify</span>
                    </div>

                    <div className="flex-1 text-center hidden md:block">
                        <p className="text-sm font-medium text-[#F9F9F9] truncate max-w-md mx-auto">{sop.title}</p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
                        <Button variant="ghost" size="sm" onClick={handleShare} icon={<Share2 className="w-3.5 h-3.5" />}>
                            <span className="hidden sm:inline">Share</span>
                        </Button>
                        <Link href="/app/library">
                            <Button variant="secondary" size="sm" icon={<ChevronLeft className="w-3.5 h-3.5" />}>
                                <span className="hidden sm:inline">Back to Library</span>
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Progress bar */}
                <ProgressBar value={completed ? 100 : progress} className="rounded-none h-0.5" />
            </header>

            {/* Main content */}
            <div className="flex-1 pt-[57px] flex">
                {/* Left sidebar - steps navigation */}
                <div className="w-64 flex-shrink-0 py-10 pl-6 hidden xl:block border-r border-[#1F1F1F]/50">
                    <div className="sticky top-24 pr-4">
                        <h3 className="text-xs font-medium text-[#8A8A8A] uppercase tracking-widest mb-6">Steps in this SOP</h3>
                        <div className="space-y-1 relative">
                            {/* Vertical line indicator */}
                            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#1F1F1F]" />

                            {sop.steps.map((s, i) => {
                                const isActive = currentStep === i && !completed
                                const isPast = completed || currentStep > i
                                return (
                                    <button
                                        key={i}
                                        onClick={() => { setCurrentStep(i); setCompleted(false) }}
                                        className={`w-full text-left flex gap-3 p-2 rounded-lg transition-colors group relative z-10 ${isActive ? 'bg-[#111111]' : 'hover:bg-[#111111]/50'}`}
                                    >
                                        <div className={`w-3.5 h-3.5 rounded-full mt-0.5 flex-shrink-0 flex items-center justify-center transition-colors ${isActive ? 'bg-[#6366F1] ring-4 ring-[#6366F1]/20' : isPast ? 'bg-[#6366F1]/50' : 'bg-[#1F1F1F] group-hover:bg-[#4A4A4A]'}`}>
                                            {isPast && <CheckCircle className="w-2.5 h-2.5 text-[#080808]" />}
                                        </div>
                                        <span className={`text-sm tracking-tight truncate transition-colors ${isActive ? 'text-[#F9F9F9] font-medium' : isPast ? 'text-[#8A8A8A]' : 'text-[#8A8A8A] group-hover:text-[#F9F9F9]'}`}>
                                            {s.title || `Step ${i + 1}`}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Step content */}
                <div className="flex-1 flex flex-col max-w-[900px] mx-auto w-full px-6 py-10">
                    <AnimatePresence mode="wait">
                        {completed ? (
                            <motion.div
                                key="completion"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 flex flex-col items-center justify-center text-center py-20"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', delay: 0.2 }}
                                    className="w-20 h-20 rounded-full bg-[#22C55E]/15 flex items-center justify-center mb-6"
                                >
                                    <CheckCircle className="w-10 h-10 text-[#22C55E]" />
                                </motion.div>
                                <h2 className="text-3xl font-bold text-[#F9F9F9] mb-3 tracking-tight">You've completed this SOP ✓</h2>
                                <p className="text-[#8A8A8A] mb-8 max-w-md">You've gone through all {sop.steps.length} steps of "{sop.title}". Well done!</p>
                                <div className="flex gap-3">
                                    <Button variant="secondary" onClick={() => { setCurrentStep(0); setCompleted(false) }}>
                                        Start Over
                                    </Button>
                                    <Link href="/app/library">
                                        <Button variant="primary">Back to Library</Button>
                                    </Link>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className="flex-1 space-y-8"
                            >
                                {/* Step header */}
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <span className="text-xs font-mono text-[#6366F1] mb-2 block">
                                            Step {currentStep + 1} of {sop.steps.length}
                                        </span>
                                        <h2 className="text-2xl font-bold text-[#F9F9F9] tracking-tight leading-tight">
                                            {step?.title || `Step ${currentStep + 1}`}
                                        </h2>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0 items-center">
                                        <Badge category={sop.category}>{sop.category}</Badge>
                                        <span className="text-xs font-mono text-[#8A8A8A] flex items-center bg-[#111111] px-2 py-1 rounded-md border border-[#1F1F1F]">
                                            Est. 4 min
                                        </span>
                                    </div>
                                </div>

                                {/* Image with highlight */}
                                {step?.imageUrl ? (
                                    <div className="relative rounded-xl overflow-hidden border border-[#1F1F1F] bg-[#0D0D0D]">
                                        <img ref={imgRef} src={step.imageUrl} alt="" className="hidden" loading="lazy" />
                                        {step.highlightCoords ? (
                                            <canvas ref={canvasRef} className="w-full" />
                                        ) : (
                                            <img src={step.imageUrl} alt="Step screenshot" className="w-full max-h-[400px] object-contain" loading="lazy" />
                                        )}
                                    </div>
                                ) : (
                                    <div className="h-48 rounded-xl border-2 border-dashed border-[#1F1F1F] flex items-center justify-center">
                                        <p className="text-[#4A4A4A] text-sm">No screenshot for this step</p>
                                    </div>
                                )}

                                {/* Description */}
                                <p className="text-[#F9F9F9] text-base leading-relaxed">{step?.description}</p>

                                {/* Note */}
                                {step?.note && (
                                    <div className="flex gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-amber-200/80">{step.note}</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation */}
                    {!completed && (
                        <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#1F1F1F]">
                            <Button
                                variant="secondary"
                                onClick={handlePrev}
                                disabled={currentStep === 0}
                                icon={<ArrowLeft className="w-4 h-4" />}
                            >
                                Previous
                            </Button>

                            {/* Step dots */}
                            <div className="flex items-center gap-1.5">
                                {sop.steps.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentStep(i)}
                                        className={`rounded-full transition-all duration-200 ${i === currentStep
                                            ? 'w-4 h-2 bg-[#6366F1]'
                                            : i < currentStep
                                                ? 'w-2 h-2 bg-[#6366F1]/50'
                                                : 'w-2 h-2 bg-[#1F1F1F]'
                                            }`}
                                    />
                                ))}
                            </div>

                            <Button
                                variant="primary"
                                onClick={handleNext}
                                icon={<ArrowRight className="w-4 h-4" />}
                            >
                                {currentStep === sop.steps.length - 1 ? 'Complete' : 'Next Step'}
                            </Button>
                        </div>
                    )}
                </div>

                {/* Right sidebar - metadata */}
                <div className="w-64 flex-shrink-0 py-10 pr-6 hidden lg:block">
                    <div className="bg-[#111111] border border-[#1F1F1F] rounded-xl p-5 space-y-4 sticky top-20">
                        <h3 className="text-xs font-medium text-[#8A8A8A] uppercase tracking-widest">About this SOP</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <User className="w-3.5 h-3.5 text-[#4A4A4A]" />
                                <div>
                                    <p className="text-xs text-[#4A4A4A]">Created by</p>
                                    <p className="text-xs font-medium text-[#F9F9F9]">{sop.creatorName}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-[#4A4A4A]" />
                                <div>
                                    <p className="text-xs text-[#4A4A4A]">Created</p>
                                    <p className="text-xs font-medium text-[#F9F9F9]">{sop.createdAt}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Layers className="w-3.5 h-3.5 text-[#4A4A4A]" />
                                <div>
                                    <p className="text-xs text-[#4A4A4A]">Total steps</p>
                                    <p className="text-xs font-medium text-[#F9F9F9]">{sop.steps.length}</p>
                                </div>
                            </div>
                        </div>
                        <hr className="border-[#1F1F1F]" />
                        <p className="text-xs text-[#4A4A4A]">Use ← → arrow keys to navigate steps</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
