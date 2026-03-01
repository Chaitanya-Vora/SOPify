'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'
import { Tooltip } from '@/components/ui/Tooltip'
import { Copy, UserPlus, Link as LinkIcon, Trash2, Shield } from 'lucide-react'

const teamMembers = [
    { id: '1', name: 'Rajesh Sharma', email: 'rajesh@demo-co.in', role: 'Partner', joined: 'Jan 2023', initials: 'RS' },
    { id: '2', name: 'Priya Mehta', email: 'priya@demo-co.in', role: 'Senior CA', joined: 'Mar 2023', initials: 'PM' },
    { id: '3', name: 'Amit Kulkarni', email: 'amit@demo-co.in', role: 'Audit Manager', joined: 'Jul 2023', initials: 'AK' },
    { id: '4', name: 'Arjun Singh', email: 'arjun@demo-co.in', role: 'Article', joined: 'Nov 2024', initials: 'AS' },
    { id: '5', name: 'Sneha Patel', email: 'sneha@demo-co.in', role: 'Article', joined: 'Jan 2025', initials: 'SP' },
]

const roleColors: Record<string, string> = {
    'Partner': '#818CF8',
    'Senior CA': '#22C55E',
    'Audit Manager': '#F97316',
    'Article': '#8A8A8A',
}

export default function Settings() {
    const { addToast } = useToast()
    const [firmName, setFirmName] = useState('M/s Demo & Co.')
    const [inviteLink, setInviteLink] = useState('')
    const [saving, setSaving] = useState(false)

    const generateInvite = () => {
        const link = `https://sopify.in/invite/${Math.random().toString(36).slice(2, 10)}`
        setInviteLink(link)
        addToast('Invite link generated! Share it with your new team member.', 'success')
    }

    const copyInvite = () => {
        navigator.clipboard?.writeText(inviteLink).catch(() => { })
        addToast('Invite link copied!', 'success')
    }

    const handleSave = async () => {
        setSaving(true)
        await new Promise(r => setTimeout(r, 800))
        setSaving(false)
        addToast('Settings saved!', 'success')
    }

    const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
    const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } }

    return (
        <div className="p-8 max-w-3xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#F9F9F9] tracking-tight">Settings</h1>
                <p className="text-[#8A8A8A] text-sm mt-1">Manage your firm profile and team</p>
            </div>

            <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
                {/* Firm Profile */}
                <motion.div variants={item} className="bg-[#111111] border border-[#1F1F1F] rounded-xl p-8 space-y-6">
                    <h2 className="text-base font-semibold text-[#F9F9F9]">Firm Profile</h2>
                    <Input
                        label="Firm Name"
                        value={firmName}
                        onChange={e => setFirmName(e.target.value)}
                        placeholder="M/s Your Firm & Co."
                    />
                    <Input
                        label="Admin Email"
                        defaultValue="admin@demo-co.in"
                        placeholder="email@yourfirm.com"
                    />
                    <Input
                        label="City"
                        defaultValue="Mumbai, Maharashtra"
                        placeholder="City, State"
                    />
                    <Button variant="primary" onClick={handleSave} loading={saving}>
                        Save Changes
                    </Button>
                </motion.div>

                {/* Team Members */}
                <motion.div variants={item} className="bg-[#111111] border border-[#1F1F1F] rounded-xl p-8 space-y-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold text-[#F9F9F9]">Team Members</h2>
                        <span className="text-xs font-mono text-[#4A4A4A]">{teamMembers.length}/20 seats</span>
                    </div>

                    <div className="space-y-2">
                        {teamMembers.map(member => (
                            <div key={member.id} className="flex items-center gap-4 p-4 rounded-xl bg-[#0D0D0D] border border-[#1F1F1F]">
                                <div className="w-9 h-9 rounded-full bg-[#6366F1]/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-mono font-medium text-[#818CF8]">{member.initials}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[#F9F9F9]">{member.name}</p>
                                    <p className="text-xs text-[#4A4A4A]">{member.email}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-mono px-2 py-0.5 rounded-full border"
                                        style={{
                                            color: roleColors[member.role] || '#8A8A8A',
                                            borderColor: `${roleColors[member.role]}33` || '#1F1F1F',
                                            background: `${roleColors[member.role]}15` || 'transparent'
                                        }}>
                                        {member.role}
                                    </span>
                                    <span className="text-xs text-[#4A4A4A]">Joined {member.joined}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Invite link */}
                    <div className="space-y-3 pt-2">
                        <h3 className="text-sm font-medium text-[#F9F9F9]">Invite New Member</h3>
                        {inviteLink ? (
                            <div className="flex gap-2">
                                <input
                                    readOnly
                                    value={inviteLink}
                                    className="flex-1 h-11 px-4 rounded-lg bg-[#0D0D0D] border border-[#1F1F1F] text-sm text-[#8A8A8A] font-mono"
                                />
                                <Button variant="secondary" onClick={copyInvite} icon={<Copy className="w-4 h-4" />}>
                                    Copy
                                </Button>
                            </div>
                        ) : (
                            <Button variant="secondary" onClick={generateInvite} icon={<LinkIcon className="w-4 h-4" />}>
                                Generate Invite Link
                            </Button>
                        )}
                        <p className="text-xs text-[#4A4A4A]">Invite links expire after 7 days. Members can sign up with any email address.</p>
                    </div>
                </motion.div>

                {/* Danger Zone */}
                <motion.div variants={item} className="bg-[#111111] border border-[#EF4444]/30 rounded-xl p-8 space-y-4">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[#EF4444]" />
                        <h2 className="text-base font-semibold text-[#EF4444]">Danger Zone</h2>
                    </div>
                    <p className="text-sm text-[#8A8A8A]">These actions are irreversible. Please be absolutely certain before proceeding.</p>
                    <Tooltip content="Contact support@sopify.in to delete all data">
                        <Button variant="ghost" disabled className="border border-[#EF4444]/30 text-[#EF4444]/50 cursor-not-allowed" icon={<Trash2 className="w-4 h-4" />}>
                            Delete All Data
                        </Button>
                    </Tooltip>
                </motion.div>
            </motion.div>
        </div>
    )
}
