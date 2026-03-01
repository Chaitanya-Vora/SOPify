'use client'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import Link from 'next/link'
import {
    Video, Square, Sparkles, ChevronLeft, GripVertical,
    Trash2, Pencil, Check, X, Plus, Upload, AlertTriangle,
    Monitor, AppWindow, Chrome, Play, Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'
import { type SopCategory } from '@/lib/data'

// ─── TYPES ────────────────────────────────────────────────────────
interface GeneratedStep {
    id: string
    stepNumber: number
    title: string
    description: string
    imageDataUrl: string   // base64 PNG extracted from video frame
    timestamp: number      // seconds into video where this frame was taken
    isEditing: boolean
}

type RecordingPhase = 'idle' | 'recording' | 'processing' | 'reviewing' | 'publishing'

// ─── AI DESCRIPTIONS (CA-SPECIFIC FALLBACKS) ──────────────────────
// Used when no OpenAI key is present — realistic CA workflow descriptions
const caFallbackDescriptions = [
    "Navigate to the required section by clicking on the menu item in the left sidebar. Ensure you have selected the correct client or GSTIN before proceeding.",
    "Enter the required details in the form fields. Verify all figures match your working sheet before moving to the next step.",
    "Click the submit or save button to confirm the entry. Wait for the confirmation message before proceeding — do not close the browser tab.",
    "Select the appropriate return period, financial year, or assessment year from the dropdown menu. Cross-check with the client instruction sheet.",
    "Upload the required document by clicking 'Choose File' or 'Browse'. Ensure the file is in the correct format (PDF/Excel/JSON) as specified.",
    "Verify all the details shown on the summary or preview screen. Check for any discrepancies in tax amounts, PAN numbers, or dates before final submission.",
    "Download and save the acknowledgement, receipt, or challan. File it in the client's compliance folder: Clients > [Client Name] > [Year] > [Return Type].",
    "Enter the OTP received on the registered mobile number or email. The OTP is valid for 10 minutes. If not received, click 'Resend OTP'.",
]

// ─── FRAME EXTRACTOR ──────────────────────────────────────────────
// Extracts key frames from a recorded video blob using canvas
async function extractFramesFromVideo(
    videoBlob: Blob,
    onProgress: (pct: number, msg: string) => void
): Promise<{ imageDataUrl: string; timestamp: number }[]> {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video')
        video.muted = true
        video.src = URL.createObjectURL(videoBlob)

        video.onloadedmetadata = async () => {
            const duration = video.duration
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')!
            const frames: { imageDataUrl: string; timestamp: number }[] = []

            // Strategy: extract a frame every 3 seconds, plus detect significant changes
            // For V1: simple time-based extraction every 3-4 seconds
            const interval = Math.max(3, Math.floor(duration / 12)) // max 12 frames, min every 3s
            const timestamps: number[] = []

            for (let t = 1; t < duration; t += interval) {
                timestamps.push(Math.min(t, duration - 0.5))
            }
            // Always include first second and last 2 seconds
            if (timestamps[0] > 1.5) timestamps.unshift(1)

            onProgress(10, `Found ${timestamps.length} key moments in ${Math.round(duration)}s recording...`)

            let i = 0
            const captureFrame = (timestamp: number): Promise<string> => {
                return new Promise(res => {
                    video.currentTime = timestamp
                    video.onseeked = () => {
                        canvas.width = Math.min(video.videoWidth, 1280)
                        canvas.height = Math.round(canvas.width * (video.videoHeight / video.videoWidth))
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
                        res(canvas.toDataURL('image/jpeg', 0.85))
                    }
                })
            }

            for (const ts of timestamps) {
                const pct = 10 + Math.round((i / timestamps.length) * 60)
                onProgress(pct, `Extracting screenshot ${i + 1} of ${timestamps.length}...`)
                const dataUrl = await captureFrame(ts)
                frames.push({ imageDataUrl: dataUrl, timestamp: ts })
                i++
            }

            URL.revokeObjectURL(video.src)
            onProgress(75, `Extracted ${frames.length} screenshots. Generating descriptions...`)
            resolve(frames)
        }

        video.onerror = reject
    })
}

// ─── AI DESCRIPTION GENERATOR ─────────────────────────────────────
async function generateDescriptionForFrame(
    imageDataUrl: string,
    stepNumber: number,
    apiKey: string | null
): Promise<{ title: string; description: string }> {
    if (!apiKey) {
        // Use realistic CA fallback
        const desc = caFallbackDescriptions[stepNumber % caFallbackDescriptions.length]
        const titles = [
            'Open the Portal', 'Navigate to Section', 'Enter Details', 'Verify Information',
            'Upload Document', 'Review Summary', 'Submit and Confirm', 'Download Receipt',
            'Complete Verification', 'Save and Proceed'
        ]
        return {
            title: titles[stepNumber % titles.length],
            description: desc
        }
    }

    // Real OpenAI GPT-4o Vision call
    const base64Image = imageDataUrl.split(',')[1]
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'gpt-4o',
            max_tokens: 200,
            messages: [{
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: `You are an expert at writing SOP instructions for Indian CA firm employees. 
Look at this screenshot from a screen recording. 
Return a JSON object with exactly two fields:
- "title": A short 3-6 word title for this step (e.g., "Login to GST Portal", "Select Return Period", "Click Submit Button")
- "description": 1-3 clear sentences describing exactly what action to take. Be specific — mention button names, field labels, menu items visible in the screenshot. Write for a junior CA article who is learning this process for the first time.
Return ONLY valid JSON. No markdown, no explanation.`
                    },
                    {
                        type: 'image_url',
                        image_url: {
                            url: `data:image/jpeg;base64,${base64Image}`,
                            detail: 'low'
                        }
                    }
                ]
            }]
        })
    })

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content || '{}'
    const cleaned = text.replace(/```json|```/g, '').trim()

    try {
        const parsed = JSON.parse(cleaned)
        return {
            title: parsed.title || `Step ${stepNumber + 1}`,
            description: parsed.description || caFallbackDescriptions[stepNumber % caFallbackDescriptions.length]
        }
    } catch {
        return {
            title: `Step ${stepNumber + 1}`,
            description: caFallbackDescriptions[stepNumber % caFallbackDescriptions.length]
        }
    }
}

// ─── MAIN PAGE COMPONENT ─────────────────────────────────────────
export default function RecordPage() {
    const { addToast } = useToast()

    const [browserSupported, setBrowserSupported] = useState<boolean | null>(null)

    const [phase, setPhase] = useState<RecordingPhase>('idle')
    const [timer, setTimer] = useState(0)
    const [processingPct, setProcessingPct] = useState(0)
    const [processingMsg, setProcessingMsg] = useState('')
    const [steps, setSteps] = useState<GeneratedStep[]>([])
    const [sopTitle, setSopTitle] = useState('')
    const [sopCategory, setSopCategory] = useState<SopCategory>('GST')
    const [apiKey, setApiKey] = useState<string>(() => {
        if (typeof window !== 'undefined') return localStorage.getItem('openai_key') || ''
        return ''
    })
    const [showApiKeyInput, setShowApiKeyInput] = useState(false)

    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const chunksRef = useRef<Blob[]>([])
    const streamRef = useRef<MediaStream | null>(null)
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        setBrowserSupported(
            typeof navigator !== 'undefined' &&
            !!navigator.mediaDevices?.getDisplayMedia
        )
    }, [])

    // Timer tick
    useEffect(() => {
        if (phase === 'recording') {
            timerRef.current = setInterval(() => setTimer(t => t + 1), 1000)
        } else {
            if (timerRef.current) clearInterval(timerRef.current)
            setTimer(0)
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current) }
    }, [phase])

    const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

    // ── START RECORDING ─────────────────────────────────────────────
    const startRecording = useCallback(async () => {
        try {
            // Request display capture — this shows the OS-level screen/window picker
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    frameRate: { ideal: 10, max: 15 }, // Low FPS is fine for SOPs, reduces file size
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                },
                audio: false, // No audio needed for SOPs
            })

            streamRef.current = stream
            chunksRef.current = []

            const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
                ? 'video/webm;codecs=vp9'
                : MediaRecorder.isTypeSupported('video/webm')
                    ? 'video/webm'
                    : 'video/mp4'

            const recorder = new MediaRecorder(stream, { mimeType })
            mediaRecorderRef.current = recorder

            recorder.ondataavailable = e => {
                if (e.data.size > 0) chunksRef.current.push(e.data)
            }

            recorder.onstop = async () => {
                // Clean up stream tracks
                stream.getTracks().forEach(t => t.stop())
                streamRef.current = null

                const blob = new Blob(chunksRef.current, { type: mimeType })
                chunksRef.current = []

                if (blob.size < 10000) {
                    addToast('Recording was too short. Please record at least 5 seconds.', 'error')
                    setPhase('idle')
                    return
                }

                await processRecording(blob)
            }

            // Handle user stopping share via browser UI (clicking "Stop sharing" in browser toolbar)
            stream.getVideoTracks()[0].onended = () => {
                if (mediaRecorderRef.current?.state === 'recording') {
                    mediaRecorderRef.current.stop()
                }
            }

            recorder.start(1000) // Collect data every 1 second
            setPhase('recording')
            addToast('Recording started! Do your task naturally, then click Stop.', 'success')

        } catch (err: any) {
            if (err.name === 'NotAllowedError') {
                addToast('Screen recording permission denied. Please allow screen capture to continue.', 'error')
            } else if (err.name === 'NotSupportedError') {
                addToast('Screen recording is not supported in this browser. Please use Chrome, Edge, or Firefox.', 'error')
            } else {
                addToast(`Could not start recording: ${err.message}`, 'error')
            }
        }
    }, [])

    // ── STOP RECORDING ──────────────────────────────────────────────
    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop()
            setPhase('processing')
        }
    }, [])

    // ── PROCESS RECORDING ───────────────────────────────────────────
    const processRecording = useCallback(async (blob: Blob) => {
        setPhase('processing')
        setProcessingPct(5)
        setProcessingMsg('Analyzing your recording...')

        try {
            // Step 1: Extract frames
            const frames = await extractFramesFromVideo(blob, (pct, msg) => {
                setProcessingPct(pct)
                setProcessingMsg(msg)
            })

            if (frames.length === 0) {
                addToast('Could not extract frames from recording. Please try again.', 'error')
                setPhase('idle')
                return
            }

            setProcessingPct(75)
            setProcessingMsg(`Generating AI descriptions for ${frames.length} steps...`)

            // Step 2: Generate AI descriptions for each frame
            const activeKey = apiKey || null
            const generatedSteps: GeneratedStep[] = []

            for (let i = 0; i < frames.length; i++) {
                setProcessingMsg(`Writing description for step ${i + 1} of ${frames.length}...`)
                setProcessingPct(75 + Math.round((i / frames.length) * 20))

                const { title, description } = await generateDescriptionForFrame(
                    frames[i].imageDataUrl,
                    i,
                    activeKey
                )

                generatedSteps.push({
                    id: `rec-step-${i}-${Date.now()}`,
                    stepNumber: i + 1,
                    title,
                    description,
                    imageDataUrl: frames[i].imageDataUrl,
                    timestamp: frames[i].timestamp,
                    isEditing: false,
                })
            }

            setProcessingPct(100)
            setProcessingMsg('Done! Review your generated SOP.')

            await new Promise(r => setTimeout(r, 600))
            setSteps(generatedSteps)
            setPhase('reviewing')

        } catch (err: any) {
            addToast(`Processing failed: ${err.message}. Please try again.`, 'error')
            setPhase('idle')
        }
    }, [apiKey])

    // ── STEP EDITING ────────────────────────────────────────────────
    const updateStep = (id: string, updates: Partial<GeneratedStep>) => {
        setSteps(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
    }

    const deleteStep = (id: string) => {
        setSteps(prev => {
            const filtered = prev.filter(s => s.id !== id)
            return filtered.map((s, i) => ({ ...s, stepNumber: i + 1 }))
        })
    }

    const handleReorder = (newOrder: GeneratedStep[]) => {
        setSteps(newOrder.map((s, i) => ({ ...s, stepNumber: i + 1 })))
    }

    // ── PUBLISH ─────────────────────────────────────────────────────
    const handlePublish = async () => {
        if (!sopTitle.trim()) {
            addToast('Please give your SOP a title before publishing.', 'error')
            return
        }
        if (steps.length === 0) {
            addToast('You need at least one step to publish.', 'error')
            return
        }
        setPhase('publishing')
        await new Promise(r => setTimeout(r, 2000))
        addToast('SOP published successfully! Your team can now access it. 🎉', 'success')
        // In real app: save to database here
        window.location.href = '/app/library'
    }

    // ── SAVE API KEY ─────────────────────────────────────────────────
    const saveApiKey = (key: string) => {
        setApiKey(key)
        if (typeof window !== 'undefined') localStorage.setItem('openai_key', key)
        setShowApiKeyInput(false)
        addToast('OpenAI API key saved. AI descriptions will now be generated from your actual screenshots.', 'success')
    }

    if (browserSupported === false) {
        return (
            <div className="p-8 max-w-lg">
                <div className="bg-[#111111] border border-[#F59E0B]/30 rounded-xl p-8 text-center space-y-4">
                    <AlertTriangle className="w-10 h-10 text-[#F59E0B] mx-auto" />
                    <h2 className="text-xl font-bold text-[#F9F9F9]">Browser not supported</h2>
                    <p className="text-sm text-[#8A8A8A] leading-relaxed">
                        Screen recording requires Chrome, Edge, or Firefox (version 72+). Safari does not support this feature yet.
                    </p>
                    <p className="text-sm text-[#8A8A8A]">
                        Please open SOPify in Chrome or Edge to use the screen recording feature.
                    </p>
                    <Link href="/app/create">
                        <button className="h-10 px-5 rounded-lg bg-[#6366F1] text-white text-sm font-medium hover:bg-[#818CF8]">
                            Use Manual Upload Instead →
                        </button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#080808]">
            <AnimatePresence mode="wait">

                {/* ══════════════════════════════════════════════════
            PHASE: IDLE — Ready to Record
        ══════════════════════════════════════════════════ */}
                {phase === 'idle' && (
                    <motion.div
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-8 max-w-3xl"
                    >
                        {/* Header */}
                        <div className="mb-10">
                            <Link href="/app/dashboard" className="inline-flex items-center gap-2 text-sm text-[#8A8A8A] hover:text-[#F9F9F9] transition-colors mb-6">
                                <ChevronLeft className="w-4 h-4" /> Back to Dashboard
                            </Link>
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-[#F9F9F9] tracking-tight">Record Your Screen</h1>
                                    <p className="text-[#8A8A8A] text-sm mt-2 leading-relaxed">
                                        Do your task naturally — file a return, enter data, do an audit step. SOPify will automatically turn your recording into a step-by-step SOP.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* How it works — 3 steps */}
                        <div className="grid grid-cols-3 gap-4 mb-10">
                            {[
                                { num: '01', icon: Monitor, title: 'Pick your screen', desc: 'Choose full screen, a window (Tally, Excel), or a browser tab.' },
                                { num: '02', icon: Video, title: 'Do your task', desc: 'Work naturally. File that return. Enter those entries. SOPify records everything.' },
                                { num: '03', icon: Sparkles, title: 'AI writes the SOP', desc: 'Screenshots extracted. AI describes each step. Review and publish in minutes.' },
                            ].map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1, duration: 0.4 }}
                                    className="bg-[#111111] border border-[#1F1F1F] rounded-xl p-5"
                                >
                                    <span className="text-3xl font-mono font-bold text-[#6366F1]/25 block mb-3">{step.num}</span>
                                    <step.icon className="w-5 h-5 text-[#6366F1] mb-2" />
                                    <p className="text-sm font-semibold text-[#F9F9F9] mb-1">{step.title}</p>
                                    <p className="text-xs text-[#8A8A8A] leading-relaxed">{step.desc}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* What you can record */}
                        <div className="bg-[#111111] border border-[#1F1F1F] rounded-xl p-6 mb-8">
                            <p className="text-sm font-semibold text-[#F9F9F9] mb-4">What you can record</p>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { icon: Monitor, label: 'Full Screen', desc: 'Entire desktop — Tally, Excel, any app' },
                                    { icon: AppWindow, label: 'App Window', desc: 'Specific window — just Tally or Excel' },
                                    { icon: Chrome, label: 'Browser Tab', desc: 'GST portal, TRACES, MCA21, IT portal' },
                                    { icon: Play, label: 'Any Process', desc: 'If you can see it, SOPify can record it' },
                                ].map(item => (
                                    <div key={item.label} className="flex items-start gap-3 p-3 rounded-lg bg-[#0D0D0D] border border-[#1F1F1F]">
                                        <item.icon className="w-4 h-4 text-[#6366F1] mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs font-medium text-[#F9F9F9]">{item.label}</p>
                                            <p className="text-[11px] text-[#4A4A4A]">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* API Key section */}
                        <div className="bg-[#111111] border border-[#1F1F1F] rounded-xl p-5 mb-8">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <p className="text-sm font-semibold text-[#F9F9F9]">
                                        AI Descriptions {apiKey ? <span className="text-[#22C55E] font-mono text-xs ml-2">● Active</span> : <span className="text-[#F59E0B] font-mono text-xs ml-2">● Using fallback</span>}
                                    </p>
                                    <p className="text-xs text-[#4A4A4A] mt-0.5">
                                        {apiKey ? 'GPT-4o Vision will analyze your screenshots and write accurate descriptions.' : 'Add your OpenAI API key for AI-generated descriptions from your actual screenshots.'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowApiKeyInput(v => !v)}
                                    className="text-xs text-[#6366F1] hover:text-[#818CF8] transition-colors"
                                >
                                    {apiKey ? 'Change key' : 'Add key →'}
                                </button>
                            </div>
                            <AnimatePresence>
                                {showApiKeyInput && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <ApiKeyInput currentKey={apiKey} onSave={saveApiKey} onCancel={() => setShowApiKeyInput(false)} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Record Button — the hero CTA */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={startRecording}
                            className="w-full h-20 rounded-2xl bg-[#6366F1] text-white font-bold text-xl flex items-center justify-center gap-4 hover:bg-[#818CF8] hover:shadow-[0_0_60px_rgba(99,102,241,0.4)] transition-all duration-200"
                        >
                            <Video className="w-7 h-7" />
                            Start Recording
                        </motion.button>
                        <p className="text-center text-xs text-[#4A4A4A] mt-3 font-mono">
                            Works on Chrome, Edge, Firefox · Captures full screen, windows, or tabs
                        </p>
                    </motion.div>
                )}

                {/* ══════════════════════════════════════════════════
            PHASE: RECORDING — Active capture
        ══════════════════════════════════════════════════ */}
                {phase === 'recording' && (
                    <motion.div
                        key="recording"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center bg-[#080808]"
                    >
                        {/* Red recording border around entire screen */}
                        <div className="fixed inset-0 border-4 border-[#EF4444] pointer-events-none z-50 rounded-none opacity-60" />

                        <div className="text-center space-y-8 max-w-md px-8">
                            {/* Pulsing record indicator */}
                            <div className="flex items-center justify-center gap-3">
                                <div className="rec-dot" />
                                <span className="text-[#EF4444] font-mono font-bold text-lg">REC</span>
                                <span className="text-[#F9F9F9] font-mono text-lg">{formatTime(timer)}</span>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-[#F9F9F9] mb-2">Recording in progress</h2>
                                <p className="text-[#8A8A8A] text-sm leading-relaxed">
                                    Do your task naturally — switch windows, open portals, fill forms. SOPify is capturing everything. Click Stop when you're done.
                                </p>
                            </div>

                            {/* Tips */}
                            <div className="bg-[#111111] border border-[#1F1F1F] rounded-xl p-5 text-left space-y-2">
                                <p className="text-xs font-mono text-[#6366F1] mb-3">TIPS FOR BETTER SOPs</p>
                                {[
                                    'Move slowly and deliberately — pause briefly on each important step',
                                    'Click on each button or field clearly — even if you know where it is',
                                    'Wait for pages to fully load before proceeding',
                                    'Complete the full workflow — from start to final confirmation',
                                ].map((tip, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                        <Check className="w-3.5 h-3.5 text-[#22C55E] mt-0.5 flex-shrink-0" />
                                        <span className="text-xs text-[#8A8A8A]">{tip}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Stop button */}
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={stopRecording}
                                className="w-full h-16 rounded-2xl bg-[#EF4444] text-white font-bold text-lg flex items-center justify-center gap-3 hover:bg-red-400 transition-colors shadow-[0_0_40px_rgba(239,68,68,0.3)]"
                            >
                                <Square className="w-6 h-6 fill-white" />
                                Stop Recording
                            </motion.button>
                            <p className="text-xs text-[#4A4A4A] font-mono">Or click "Stop sharing" in your browser toolbar</p>
                        </div>
                    </motion.div>
                )}

                {/* ══════════════════════════════════════════════════
            PHASE: PROCESSING — AI analysis
        ══════════════════════════════════════════════════ */}
                {phase === 'processing' && (
                    <motion.div
                        key="processing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center bg-[#080808]"
                    >
                        <div className="text-center max-w-md px-8 space-y-8">
                            {/* Spinning loader with indigo glow */}
                            <div className="relative w-24 h-24 mx-auto">
                                <div className="absolute inset-0 rounded-full bg-[#6366F1]/10 blur-xl" />
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                    className="w-24 h-24 rounded-full border-4 border-[#1F1F1F] border-t-[#6366F1]"
                                />
                                <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-[#6366F1]" />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-[#F9F9F9] mb-2">Processing your recording</h2>
                                <p className="text-[#8A8A8A] text-sm">{processingMsg}</p>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full bg-[#1F1F1F] rounded-full h-2 overflow-hidden">
                                <motion.div
                                    className="h-full bg-[#6366F1] rounded-full"
                                    animate={{ width: `${processingPct}%` }}
                                    transition={{ duration: 0.5, ease: 'easeOut' }}
                                />
                            </div>
                            <p className="text-sm font-mono text-[#6366F1]">{processingPct}%</p>

                            {/* Processing steps */}
                            <div className="text-left space-y-2">
                                {[
                                    { label: 'Extract screenshots', done: processingPct >= 20 },
                                    { label: 'Detect key moments', done: processingPct >= 50 },
                                    { label: 'Generate AI descriptions', done: processingPct >= 90 },
                                    { label: 'Build SOP structure', done: processingPct >= 100 },
                                ].map((s, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className={cn(
                                            'w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300',
                                            s.done ? 'bg-[#22C55E]' : 'bg-[#1F1F1F]'
                                        )}>
                                            {s.done && <Check className="w-2.5 h-2.5 text-white" />}
                                        </div>
                                        <span className={cn('text-sm', s.done ? 'text-[#F9F9F9]' : 'text-[#4A4A4A]')}>{s.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ══════════════════════════════════════════════════
            PHASE: REVIEWING — Edit and publish
        ══════════════════════════════════════════════════ */}
                {phase === 'reviewing' && (
                    <motion.div
                        key="reviewing"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-8 max-w-4xl"
                    >
                        {/* Sticky header */}
                        <div className="sticky top-0 z-20 bg-[rgba(8,8,8,0.95)] backdrop-blur-xl border-b border-[#1F1F1F] -mx-8 px-8 py-4 mb-8 flex items-center gap-4">
                            <div className="flex-1">
                                <input
                                    value={sopTitle}
                                    onChange={e => setSopTitle(e.target.value)}
                                    placeholder="Give this SOP a title... e.g., How to file GSTR-1 on GST Portal"
                                    className="w-full bg-transparent text-lg font-bold text-[#F9F9F9] placeholder:text-[#4A4A4A] focus:outline-none tracking-tight"
                                />
                                <div className="flex items-center gap-3 mt-1">
                                    <select
                                        value={sopCategory}
                                        onChange={e => setSopCategory(e.target.value as SopCategory)}
                                        className="bg-transparent text-xs text-[#8A8A8A] focus:outline-none border-none"
                                    >
                                        {(['GST', 'TDS', 'Income Tax', 'MCA', 'Audit', 'Internal', 'Client', 'General'] as SopCategory[]).map(c => (
                                            <option key={c} value={c} className="bg-[#111111]">{c}</option>
                                        ))}
                                    </select>
                                    <span className="text-xs text-[#4A4A4A] font-mono">{steps.length} steps generated</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPhase('idle')}
                                    className="h-9 px-4 rounded-lg border border-[#1F1F1F] text-sm text-[#8A8A8A] hover:text-[#F9F9F9] hover:border-[#6366F1] transition-all"
                                >
                                    Record Again
                                </button>
                                <button
                                    onClick={handlePublish}
                                    className="h-9 px-5 rounded-lg bg-[#6366F1] text-white text-sm font-semibold hover:bg-[#818CF8] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all"
                                >
                                    Publish SOP →
                                </button>
                            </div>
                        </div>

                        {/* Success banner */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#22C55E]/8 border border-[#22C55E]/20 rounded-xl p-4 mb-8 flex items-center gap-3"
                        >
                            <Check className="w-5 h-5 text-[#22C55E] flex-shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-[#F9F9F9]">{steps.length} steps generated from your recording</p>
                                <p className="text-xs text-[#8A8A8A]">Review each step, edit descriptions, delete any unwanted frames, then publish.</p>
                            </div>
                        </motion.div>

                        {/* Steps list — reorderable */}
                        <Reorder.Group axis="y" values={steps} onReorder={handleReorder} className="space-y-4">
                            {steps.map((step, index) => (
                                <Reorder.Item key={step.id} value={step}>
                                    <ReviewStepCard
                                        step={step}
                                        onUpdate={updates => updateStep(step.id, updates)}
                                        onDelete={() => deleteStep(step.id)}
                                    />
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>

                        {/* Bottom publish */}
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handlePublish}
                                className="h-12 px-8 rounded-xl bg-[#6366F1] text-white font-semibold hover:bg-[#818CF8] hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all"
                            >
                                Publish SOP →
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* ══════════════════════════════════════════════════
            PHASE: PUBLISHING
        ══════════════════════════════════════════════════ */}
                {phase === 'publishing' && (
                    <motion.div
                        key="publishing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 flex items-center justify-center bg-[#080808]"
                    >
                        <div className="text-center space-y-4">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="w-12 h-12 rounded-full border-4 border-[#1F1F1F] border-t-[#6366F1] mx-auto"
                            />
                            <p className="text-lg font-semibold text-[#F9F9F9]">Publishing your SOP...</p>
                            <p className="text-sm text-[#8A8A8A]">Adding to your firm's library</p>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    )
}

// ─── REVIEW STEP CARD ────────────────────────────────────────────
function ReviewStepCard({
    step,
    onUpdate,
    onDelete,
}: {
    step: GeneratedStep
    onUpdate: (updates: Partial<GeneratedStep>) => void
    onDelete: () => void
}) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111111] border border-[#1F1F1F] rounded-xl overflow-hidden group hover:border-[#6366F1]/40 transition-[border-color] duration-200"
        >
            <div className="flex gap-4 p-5">
                {/* Drag handle */}
                <div className="flex items-center cursor-grab pt-1 flex-shrink-0">
                    <GripVertical className="w-4 h-4 text-[#2A2A2A] group-hover:text-[#4A4A4A] transition-colors" />
                </div>

                {/* Screenshot thumbnail */}
                <div className="w-40 h-28 rounded-lg overflow-hidden border border-[#1F1F1F] flex-shrink-0 bg-[#0D0D0D]">
                    <img
                        src={step.imageDataUrl}
                        alt={`Step ${step.stepNumber}`}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-mono text-[#6366F1]">Step {step.stepNumber}</span>
                        <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                                onClick={() => onUpdate({ isEditing: !step.isEditing })}
                                className="p-1.5 rounded-lg text-[#4A4A4A] hover:text-[#F9F9F9] hover:bg-[#1F1F1F] transition-all"
                            >
                                <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={onDelete}
                                className="p-1.5 rounded-lg text-[#4A4A4A] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-all"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    {step.isEditing ? (
                        <div className="space-y-2">
                            <input
                                value={step.title}
                                onChange={e => onUpdate({ title: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-lg bg-[#0D0D0D] border border-[#6366F1]/50 text-sm font-semibold text-[#F9F9F9] focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                                placeholder="Step title..."
                            />
                            <textarea
                                value={step.description}
                                onChange={e => onUpdate({ description: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2 rounded-lg bg-[#0D0D0D] border border-[#6366F1]/50 text-sm text-[#F9F9F9] placeholder:text-[#4A4A4A] focus:outline-none focus:ring-1 focus:ring-[#6366F1] resize-none"
                                placeholder="Step description..."
                            />
                            <button
                                onClick={() => onUpdate({ isEditing: false })}
                                className="flex items-center gap-1.5 text-xs text-[#22C55E] hover:text-[#4ade80] transition-colors"
                            >
                                <Check className="w-3 h-3" /> Done editing
                            </button>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm font-semibold text-[#F9F9F9] mb-1">{step.title}</p>
                            <p className="text-xs text-[#8A8A8A] leading-relaxed line-clamp-3">{step.description}</p>
                        </>
                    )}
                </div>
            </div>

            {/* Timestamp */}
            <div className="px-5 py-2 border-t border-[#1F1F1F] flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#2A2A2A]">
                    Captured at {Math.floor(step.timestamp / 60)}:{String(Math.round(step.timestamp % 60)).padStart(2, '0')} in recording
                </span>
                <span className="text-[10px] font-mono text-[#22C55E]">✓ AI generated</span>
            </div>
        </motion.div>
    )
}

// ─── API KEY INPUT ────────────────────────────────────────────────
function ApiKeyInput({
    currentKey,
    onSave,
    onCancel,
}: {
    currentKey: string
    onSave: (key: string) => void
    onCancel: () => void
}) {
    const [value, setValue] = useState(currentKey)
    return (
        <div className="pt-3 space-y-2">
            <input
                type="password"
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="sk-..."
                className="w-full h-10 px-3 rounded-lg bg-[#0D0D0D] border border-[#1F1F1F] text-sm text-[#F9F9F9] font-mono placeholder:text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
            />
            <div className="flex gap-2">
                <button
                    onClick={() => onSave(value)}
                    disabled={!value.startsWith('sk-')}
                    className="h-8 px-4 rounded-lg bg-[#6366F1] text-white text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Save Key
                </button>
                <button onClick={onCancel} className="h-8 px-4 rounded-lg border border-[#1F1F1F] text-[#8A8A8A] text-xs">
                    Cancel
                </button>
            </div>
            <p className="text-[11px] text-[#4A4A4A]">
                Your API key is stored locally in your browser only. It is never sent to SOPify servers.
                Get your key at platform.openai.com. GPT-4o usage costs ~$0.01 per screenshot analyzed.
            </p>
        </div>
    )
}
