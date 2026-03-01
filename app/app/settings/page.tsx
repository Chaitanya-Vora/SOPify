'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'
import { Tooltip } from '@/components/ui/Tooltip'
import { Copy, Trash2, Shield, Edit2, Download } from 'lucide-react'

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

// Custom Toggle Component
function Toggle({ checked, onChange, label }: { checked: boolean, onChange: () => void, label: string }) {
    return (
        <label className="flex items-center justify-between cursor-pointer py-3 border-b border-[#1F1F1F] last:border-0">
            <span className="text-sm text-[#F9F9F9]">{label}</span>
            <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${checked ? 'bg-[#6366F1]' : 'bg-[#1F1F1F]'}`} onClick={onChange}>
                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
        </label>
    )
}

export default function Settings() {
    useEffect(() => {
        document.title = "Settings | SOPify"
    }, [])
    const { addToast } = useToast()
    const [isEditingProfile, setIsEditingProfile] = useState(false)
    const [firmName, setFirmName] = useState('M/s Demo & Associates')
    const [city, setCity] = useState('Mumbai')
    const [saving, setSaving] = useState(false)

    // Toggles
    const [emailNotif, setEmailNotif] = useState(true)
    const [weeklyDigest, setWeeklyDigest] = useState(true)
    const [draftSops, setDraftSops] = useState(false)

    const copyInvite = () => {
        navigator.clipboard?.writeText('https://sopify.in/join/abc123xyz').catch(() => { })
        addToast('Invite link copied!', 'success')
    }

    const handleSaveProfile = async () => {
        setSaving(true)
        await new Promise(r => setTimeout(r, 800))
        setSaving(false)
        setIsEditingProfile(false)
        addToast('Profile saved!', 'success')
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
                <motion.div variants={item} className="bg-[#111111] border border-[#1F1F1F] rounded-xl p-8 space-y-6 relative">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-base font-semibold text-[#F9F9F9]">Firm Profile</h2>
                        {!isEditingProfile && (
                            <Button variant="ghost" size="sm" onClick={() => setIsEditingProfile(true)} icon={<Edit2 className="w-4 h-4" />}>
                                Edit
                            </Button>
                        )}
                    </div>

                    <div className="space-y-4 max-w-md">
                        <div>
                            <label className="block text-xs text-[#8A8A8A] mb-1.5 uppercase font-mono tracking-widest">Firm Name</label>
                            {isEditingProfile ? (
                                <Input value={firmName} onChange={e => setFirmName(e.target.value)} />
                            ) : (
                                <p className="text-sm font-medium text-[#F9F9F9] bg-[#0D0D0D] border border-[#1F1F1F] rounded-lg px-3 py-2">{firmName}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs text-[#8A8A8A] mb-1.5 uppercase font-mono tracking-widest">City</label>
                            {isEditingProfile ? (
                                <Input value={city} onChange={e => setCity(e.target.value)} />
                            ) : (
                                <p className="text-sm font-medium text-[#F9F9F9] bg-[#0D0D0D] border border-[#1F1F1F] rounded-lg px-3 py-2">{city}</p>
                            )}
                        </div>
                    </div>

                    {isEditingProfile && (
                        <div className="pt-2 flex gap-3">
                            <Button variant="primary" onClick={handleSaveProfile} loading={saving}>Save Changes</Button>
                            <Button variant="ghost" onClick={() => setIsEditingProfile(false)}>Cancel</Button>
                        </div>
                    )}
                </motion.div>

                {/* Team Members */}
                <motion.div variants={item} className="bg-[#111111] border border-[#1F1F1F] rounded-xl p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold text-[#F9F9F9]">Team Members</h2>
                        <span className="text-xs font-mono text-[#4A4A4A]">{teamMembers.length}/20 seats</span>
                    </div>

                    <div className="border border-[#1F1F1F] rounded-xl overflow-hidden bg-[#0D0D0D]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#1F1F1F] bg-[#111111]">
                                    <th className="py-3 px-4 text-xs font-mono text-[#4A4A4A] font-medium w-1/2">User</th>
                                    <th className="py-3 px-4 text-xs font-mono text-[#4A4A4A] font-medium">Role</th>
                                    <th className="py-3 px-4 text-xs font-mono text-[#4A4A4A] font-medium">Joined</th>
                                    <th className="py-3 px-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1F1F1F]">
                                {teamMembers.map(member => (
                                    <tr key={member.id} className="hover:bg-[#111111]/50 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#6366F1]/20 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-[10px] font-mono font-medium text-[#818CF8]">{member.initials}</span>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-[#F9F9F9] truncate">{member.name}</p>
                                                    <p className="text-xs text-[#8A8A8A] truncate">{member.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-xs font-mono px-2 py-0.5 rounded-full border whitespace-nowrap"
                                                style={{
                                                    color: roleColors[member.role] || '#8A8A8A',
                                                    borderColor: `${roleColors[member.role]}33` || '#1F1F1F',
                                                    background: `${roleColors[member.role]}15` || 'transparent'
                                                }}>
                                                {member.role}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-xs text-[#4A4A4A]">{member.joined}</span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <button className="text-[#EF4444]/60 hover:text-[#EF4444] transition-colors p-1" title="Remove member">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Invite link */}
                    <div className="pt-4 border-t border-[#1F1F1F]">
                        <h3 className="text-sm font-medium text-[#F9F9F9] mb-1">Invite a team member</h3>
                        <p className="text-xs text-[#8A8A8A] mb-3">Share this link with your team:</p>
                        <div className="flex items-center gap-2 max-w-sm">
                            <input
                                readOnly
                                value="https://sopify.in/join/abc123xyz"
                                className="flex-1 h-9 px-3 rounded-lg bg-[#0D0D0D] border border-[#1F1F1F] text-xs text-[#8A8A8A] font-mono outline-none"
                            />
                            <Button variant="secondary" size="sm" onClick={copyInvite} icon={<Copy className="w-3 h-3" />}>
                                Copy
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Preferences */}
                <motion.div variants={item} className="bg-[#111111] border border-[#1F1F1F] rounded-xl p-8">
                    <h2 className="text-base font-semibold text-[#F9F9F9] mb-6">Preferences</h2>
                    <div className="flex flex-col">
                        <Toggle label="Email notifications for new SOPs" checked={emailNotif} onChange={() => setEmailNotif(!emailNotif)} />
                        <Toggle label="Weekly summary digest" checked={weeklyDigest} onChange={() => setWeeklyDigest(!weeklyDigest)} />
                        <Toggle label="Allow team to see draft SOPs" checked={draftSops} onChange={() => setDraftSops(!draftSops)} />
                    </div>
                </motion.div>

                {/* Danger Zone */}
                <motion.div variants={item} className="bg-[#111111] border border-[#EF4444]/30 rounded-xl p-8 space-y-4">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[#EF4444]" />
                        <h2 className="text-base font-semibold text-[#EF4444]">Danger Zone</h2>
                    </div>
                    <div className="flex items-center gap-4 pt-2">
                        <Tooltip content="Contact support to delete all data"><div>
                            <Button variant="ghost" disabled className="border border-[#EF4444]/30 text-[#EF4444]/50 cursor-not-allowed">
                                Delete all SOPs
                            </Button>
                        </div></Tooltip>
                        <Button variant="ghost" icon={<Download className="w-4 h-4" />}>
                            Export all SOPs as PDF
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}
