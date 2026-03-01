'use client'
import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { useToast } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { type SopCategory } from '@/lib/data'
import {
    Upload, GripVertical, Pencil, Trash2, Sparkles,
    X, Check, Eye, Plus, ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'

const categories: { value: SopCategory; label: string }[] = [
    { value: 'GST', label: 'GST' },
    { value: 'TDS', label: 'TDS' },
    { value: 'Income Tax', label: 'Income Tax' },
    { value: 'MCA', label: 'MCA' },
    { value: 'Audit', label: 'Audit' },
    { value: 'Internal', label: 'Internal' },
    { value: 'Client', label: 'Client' },
    { value: 'General', label: 'General' },
]

const aiDescriptions = [
    "Click on 'File Returns' in the left navigation menu under the GST Services section. Ensure you are on the correct GSTIN before proceeding.",
    "Select the relevant financial year and return period from the dropdown menus. The system will load the data from previous submissions automatically.",
    "Enter the GSTIN of the recipient in the designated field. Verify the auto-populated legal name matches the vendor's registration certificate.",
    "Click 'SUBMIT' and wait for the confirmation popup. Do not close the browser tab until the acknowledgment number is displayed.",
    "Download the challan receipt and save it in the client compliance folder at: Clients > [Client Name] > GST > [Financial Year].",
    "Verify all tax amounts match your working sheet before saving. Check CGST, SGST, and IGST breakdowns individually.",
]

interface SopStep {
    id: string
    stepNumber: number
    description: string
    imageUrl?: string
    highlight?: { x: number; y: number; w: number; h: number }
}

interface DrawHighlightProps {
    imageUrl: string
    highlight?: { x: number; y: number; w: number; h: number }
    onSave: (rect: { x: number; y: number; w: number; h: number }) => void
    onCancel: () => void
}

function DrawHighlight({ imageUrl, highlight, onSave, onCancel }: DrawHighlightProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)
    const [drawing, setDrawing] = useState(false)
    const [rect, setRect] = useState(highlight || { x: 0, y: 0, w: 0, h: 0 })
    const startRef = useRef({ x: 0, y: 0 })

    const draw = useCallback(() => {
        const canvas = canvasRef.current
        const img = imgRef.current
        if (!canvas || !img) return
        const ctx = canvas.getContext('2d')!
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        if (rect.w && rect.h) {
            ctx.save()
            ctx.fillStyle = 'rgba(245, 158, 11, 0.25)'
            ctx.strokeStyle = '#F59E0B'
            ctx.lineWidth = 2
            ctx.fillRect(rect.x, rect.y, rect.w, rect.h)
            ctx.strokeRect(rect.x, rect.y, rect.w, rect.h)
            ctx.restore()
        }
    }, [rect])

    React.useEffect(() => { draw() }, [draw])

    const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const r = canvasRef.current!.getBoundingClientRect()
        return { x: e.clientX - r.left, y: e.clientY - r.top }
    }

    return (
        <div className="space-y-3">
            <p className="text-xs text-[#8A8A8A]">Click and drag to draw a highlight box on the screenshot.</p>
            <div className="relative rounded-lg overflow-hidden border border-[#2A2A2A]">
                <img ref={imgRef} src={imageUrl} alt="step" className="hidden" onLoad={draw} />
                <canvas
                    ref={canvasRef}
                    width={600}
                    height={340}
                    className="w-full cursor-crosshair rounded-lg"
                    onMouseDown={e => {
                        setDrawing(true)
                        startRef.current = getPos(e)
                        setRect({ x: startRef.current.x, y: startRef.current.y, w: 0, h: 0 })
                    }}
                    onMouseMove={e => {
                        if (!drawing) return
                        const p = getPos(e)
                        setRect({ x: startRef.current.x, y: startRef.current.y, w: p.x - startRef.current.x, h: p.y - startRef.current.y })
                    }}
                    onMouseUp={() => setDrawing(false)}
                />
            </div>
            <div className="flex gap-2">
                <Button variant="primary" size="sm" onClick={() => onSave(rect)} icon={<Check className="w-3.5 h-3.5" />}>
                    Save Highlight
                </Button>
                <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
            </div>
        </div>
    )
}

interface StepEditorProps {
    step: SopStep
    onUpdate: (step: SopStep) => void
    onDelete: () => void
}

function StepEditor({ step, onUpdate, onDelete }: StepEditorProps) {
    const [showHighlight, setShowHighlight] = useState(false)
    const [aiLoading, setAiLoading] = useState(false)
    const [aiStreaming, setAiStreaming] = useState(false)
    const fileRef = useRef<HTMLInputElement>(null)

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = ev => onUpdate({ ...step, imageUrl: ev.target?.result as string })
        reader.readAsDataURL(file)
    }

    const generateAI = () => {
        setAiLoading(true)
        const words = aiDescriptions[Math.floor(Math.random() * aiDescriptions.length)].split(' ')
        let current = ''
        let i = 0
        setTimeout(() => {
            setAiLoading(false)
            setAiStreaming(true)
            const interval = setInterval(() => {
                current += (i > 0 ? ' ' : '') + words[i]
                onUpdate({ ...step, description: current })
                i++
                if (i >= words.length) { clearInterval(interval); setAiStreaming(false) }
            }, 80)
        }, 1500)
    }

    return (
        <div className="bg-[#111111] border border-[#1F1F1F] rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-[#6366F1]">Step {step.stepNumber}</span>
                <Button variant="ghost" size="sm" onClick={onDelete} className="text-[#EF4444] hover:text-[#EF4444]">
                    <Trash2 className="w-3.5 h-3.5" />
                </Button>
            </div>

            {/* Image */}
            {step.imageUrl ? (
                <div className="space-y-3">
                    {showHighlight ? (
                        <DrawHighlight
                            imageUrl={step.imageUrl}
                            highlight={step.highlight}
                            onSave={rect => { onUpdate({ ...step, highlight: rect }); setShowHighlight(false) }}
                            onCancel={() => setShowHighlight(false)}
                        />
                    ) : (
                        <div className="relative group rounded-lg overflow-hidden border border-[#2A2A2A]">
                            <img src={step.imageUrl} alt="screenshot" className="w-full rounded-lg max-h-64 object-contain bg-[#0D0D0D]" />
                            {step.highlight && (
                                <div
                                    className="absolute border-2 border-amber-400 bg-amber-400/20 rounded"
                                    style={{ left: step.highlight.x, top: step.highlight.y, width: step.highlight.w, height: step.highlight.h }}
                                />
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button size="sm" variant="secondary" onClick={() => setShowHighlight(true)}>
                                    <Pencil className="w-3.5 h-3.5" /> Draw Highlight
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => onUpdate({ ...step, imageUrl: undefined, highlight: undefined })}>
                                    <X className="w-3.5 h-3.5" /> Remove
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div
                    onClick={() => fileRef.current?.click()}
                    className="border-2 border-dashed border-[#1F1F1F] rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-[#6366F1] transition-colors"
                >
                    <Upload className="w-8 h-8 text-[#4A4A4A]" />
                    <p className="text-sm text-[#8A8A8A]">Upload screenshot or drag & drop</p>
                    <p className="text-xs text-[#4A4A4A]">PNG, JPG up to 10MB</p>
                </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />

            {/* Description */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-[#F9F9F9]">Step description</label>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={generateAI}
                        loading={aiLoading}
                        disabled={aiLoading || aiStreaming}
                        className="text-[#6366F1] hover:text-[#818CF8]"
                        icon={!aiLoading ? <Sparkles className="w-3.5 h-3.5" /> : undefined}
                    >
                        {aiLoading ? 'Generating...' : aiStreaming ? 'Writing...' : '✨ Generate with AI'}
                    </Button>
                </div>
                <textarea
                    value={step.description}
                    onChange={e => onUpdate({ ...step, description: e.target.value })}
                    rows={3}
                    placeholder="Describe what the user should do in this step..."
                    className="w-full px-4 py-3 rounded-lg bg-[#0D0D0D] border border-[#1F1F1F] text-[#F9F9F9] text-sm placeholder:text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#6366F1] resize-none"
                />
            </div>
        </div>
    )
}

export default function CreateSOP() {
    const { addToast } = useToast()
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState<SopCategory>('GST')
    const [description, setDescription] = useState('')
    const [tagInput, setTagInput] = useState('')
    const [tags, setTags] = useState<string[]>([])
    const [visibility, setVisibility] = useState<'firm' | 'link'>('firm')
    const [steps, setSteps] = useState<SopStep[]>([])
    const [saving, setSaving] = useState(false)
    const [publishing, setPublishing] = useState(false)

    const addTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            const t = tagInput.trim().replace(/,$/, '')
            if (t && !tags.includes(t)) setTags(prev => [...prev, t])
            setTagInput('')
        }
    }

    const addStep = () => {
        setSteps(prev => [...prev, { id: Math.random().toString(36).slice(2), stepNumber: prev.length + 1, description: '' }])
    }

    const updateStep = (id: string, updated: SopStep) => {
        setSteps(prev => prev.map(s => s.id === id ? updated : s))
    }

    const deleteStep = (id: string) => {
        setSteps(prev => {
            const filtered = prev.filter(s => s.id !== id)
            return filtered.map((s, i) => ({ ...s, stepNumber: i + 1 }))
        })
    }

    const handleReorder = (newOrder: SopStep[]) => {
        setSteps(newOrder.map((s, i) => ({ ...s, stepNumber: i + 1 })))
    }

    const handleSave = async () => {
        setSaving(true)
        await new Promise(r => setTimeout(r, 1000))
        setSaving(false)
        addToast('Draft saved successfully!', 'success')
    }

    const handlePublish = async () => {
        if (!title) { addToast('Please enter a title before publishing.', 'error'); return }
        if (steps.length === 0) { addToast('Add at least one step before publishing.', 'error'); return }
        setPublishing(true)
        await new Promise(r => setTimeout(r, 1500))
        setPublishing(false)
        addToast('SOP published! Your team can now access it. 🎉', 'success')
    }

    return (
        <div className="p-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#F9F9F9] tracking-tight">Create New SOP</h1>
                <p className="text-[#8A8A8A] text-sm mt-1">Document a process so your team can follow it independently</p>
            </div>

            {/* Section 1: SOP Details */}
            <div className="bg-[#111111] border border-[#1F1F1F] rounded-xl p-8 mb-6 space-y-6">
                <h2 className="text-base font-semibold text-[#F9F9F9]">SOP Details</h2>

                <Input
                    label="Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g., How to file GSTR-1 on GST Portal"
                />

                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Category"
                        value={category}
                        onChange={e => setCategory(e.target.value as SopCategory)}
                        options={categories}
                    />
                    <div>
                        <label className="text-sm font-medium text-[#F9F9F9] block mb-1.5">Visibility</label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setVisibility('firm')}
                                className={cn(
                                    'flex-1 h-11 rounded-lg border text-sm font-medium transition-all',
                                    visibility === 'firm'
                                        ? 'bg-[#6366F1]/15 border-[#6366F1] text-[#818CF8]'
                                        : 'bg-transparent border-[#1F1F1F] text-[#8A8A8A] hover:border-[#6366F1]'
                                )}
                            >
                                Firm Only
                            </button>
                            <button
                                onClick={() => setVisibility('link')}
                                className={cn(
                                    'flex-1 h-11 rounded-lg border text-sm font-medium transition-all',
                                    visibility === 'link'
                                        ? 'bg-[#6366F1]/15 border-[#6366F1] text-[#818CF8]'
                                        : 'bg-transparent border-[#1F1F1F] text-[#8A8A8A] hover:border-[#6366F1]'
                                )}
                            >
                                Anyone with Link
                            </button>
                        </div>
                        <p className="text-xs text-[#4A4A4A] mt-1.5">
                            {visibility === 'firm' ? 'Only team members can access this SOP.' : 'Anyone with the link can view this SOP — great for sharing with clients.'}
                        </p>
                    </div>
                </div>

                {/* Tags */}
                <div>
                    <label className="text-sm font-medium text-[#F9F9F9] block mb-1.5">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map(tag => (
                            <span key={tag} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1F1F1F] text-xs text-[#8A8A8A] border border-[#2A2A2A]">
                                {tag}
                                <button onClick={() => setTags(prev => prev.filter(t => t !== tag))} className="text-[#4A4A4A] hover:text-[#EF4444]">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                    <input
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        onKeyDown={addTag}
                        placeholder="Type and press Enter to add tags..."
                        className="w-full h-11 px-4 rounded-lg bg-[#0D0D0D] border border-[#1F1F1F] text-[#F9F9F9] text-sm placeholder:text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                    />
                    <p className="text-xs text-[#4A4A4A] mt-1.5">Press Enter or comma to add a tag. E.g., GSTR-1, Monthly Filing</p>
                </div>

                <Textarea
                    label="Description (optional)"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Brief overview of what this SOP covers..."
                />
            </div>

            {/* Section 2: Add Steps */}
            <div className="bg-[#111111] border border-[#1F1F1F] rounded-xl p-8 mb-8 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-[#F9F9F9]">Add Steps</h2>
                        <p className="text-xs text-[#8A8A8A] mt-0.5">{steps.length} steps added</p>
                    </div>
                    <Button variant="secondary" size="sm" onClick={addStep} icon={<Plus className="w-3.5 h-3.5" />}>
                        Add Step
                    </Button>
                </div>

                {steps.length === 0 ? (
                    <div
                        onClick={addStep}
                        className="border-2 border-dashed border-[#1F1F1F] rounded-xl p-12 flex flex-col items-center gap-3 cursor-pointer hover:border-[#6366F1] transition-colors"
                    >
                        <div className="w-12 h-12 rounded-full bg-[#1F1F1F] flex items-center justify-center">
                            <Plus className="w-5 h-5 text-[#4A4A4A]" />
                        </div>
                        <p className="text-sm text-[#8A8A8A]">Add your first step</p>
                        <p className="text-xs text-[#4A4A4A]">Upload a screenshot or start with a description</p>
                    </div>
                ) : (
                    <Reorder.Group axis="y" values={steps} onReorder={handleReorder} className="space-y-4">
                        {steps.map(step => (
                            <Reorder.Item
                                key={step.id}
                                value={step}
                                className="relative"
                            >
                                <div className="flex gap-3">
                                    <div className="flex items-center justify-center w-6 pt-6 cursor-grab flex-shrink-0">
                                        <GripVertical className="w-4 h-4 text-[#4A4A4A]" />
                                    </div>
                                    <div className="flex-1">
                                        <StepEditor
                                            step={step}
                                            onUpdate={updated => updateStep(step.id, updated)}
                                            onDelete={() => deleteStep(step.id)}
                                        />
                                    </div>
                                </div>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>
                )}

                {steps.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={addStep} icon={<Plus className="w-3.5 h-3.5" />} className="w-full border border-dashed border-[#1F1F1F] hover:border-[#6366F1]">
                        Add another step
                    </Button>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 justify-end">
                <Button variant="secondary" onClick={handleSave} loading={saving}>
                    Save as Draft
                </Button>
                <Button variant="primary" onClick={handlePublish} loading={publishing}>
                    Publish SOP →
                </Button>
            </div>
        </div>
    )
}
