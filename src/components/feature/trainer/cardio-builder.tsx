'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Activity,
    ArrowLeft,
    Pencil,
    Check,
    X,
    Loader2,
    AlignLeft,
    Save,
    Clock,
    Zap
} from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { updateCardioMeta } from '@/actions/cardio-actions'

interface CardioBuilderProps {
    cardio: {
        id: string
        name: string
        description?: string | null
        duration_minutes?: number | null
        suggested_intensity?: string | null
        created_at: string
    }
    backHref?: string
}

export function CardioBuilder({ cardio, backHref = '/dashboard/trainer/cardio' }: CardioBuilderProps) {
    // Inline name editing
    const [isEditingName, setIsEditingName] = useState(false)
    const [editName, setEditName] = useState(cardio.name)
    const [isSavingName, setIsSavingName] = useState(false)
    const nameInputRef = useRef<HTMLInputElement>(null)

    // Description editing
    const [isEditingDesc, setIsEditingDesc] = useState(false)
    const [editDesc, setEditDesc] = useState(cardio.description || '')
    const [isSavingDesc, setIsSavingDesc] = useState(false)
    const descRef = useRef<HTMLTextAreaElement>(null)

    // Duration and Intensity
    const [editDuration, setEditDuration] = useState(cardio.duration_minutes?.toString() || '30')
    const [editIntensity, setEditIntensity] = useState(cardio.suggested_intensity || 'Moderada')
    const [isSavingMeta, setIsSavingMeta] = useState(false)

    useEffect(() => { if (isEditingName) nameInputRef.current?.focus() }, [isEditingName])
    useEffect(() => { if (isEditingDesc) descRef.current?.focus() }, [isEditingDesc])

    async function handleSaveName() {
        if (!editName.trim()) return
        setIsSavingName(true)
        const res = await updateCardioMeta(cardio.id, editName, editDesc, parseInt(editDuration), editIntensity)
        setIsSavingName(false)
        if (res.success) setIsEditingName(false)
    }

    function handleCancelName() {
        setEditName(cardio.name)
        setIsEditingName(false)
    }

    async function handleSaveDesc() {
        setIsSavingDesc(true)
        const res = await updateCardioMeta(cardio.id, editName, editDesc, parseInt(editDuration), editIntensity)
        setIsSavingDesc(false)
        if (res.success) setIsEditingDesc(false)
    }

    async function handleSaveQuickMeta(duration: string, intensity: string) {
        setIsSavingMeta(true)
        await updateCardioMeta(cardio.id, editName, editDesc, parseInt(duration), intensity)
        setIsSavingMeta(false)
    }

    function handleCancelDesc() {
        setEditDesc(cardio.description || '')
        setIsEditingDesc(false)
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col gap-4">
                {/* Name */}
                {isEditingName ? (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-200 bg-zinc-900/60 border border-zinc-700/60 rounded-2xl p-5 space-y-3 shadow-xl">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Nome do Cardio</label>
                        <Input
                            ref={nameInputRef}
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') handleCancelName() }}
                            className="bg-zinc-950 border-zinc-700 text-white text-lg font-black h-12 rounded-xl focus-visible:ring-orange-500/30 focus-visible:border-orange-500/50"
                            placeholder="Nome do cardio..."
                        />
                        <div className="flex items-center gap-2 pt-1">
                            <Button
                                onClick={handleSaveName}
                                disabled={isSavingName || !editName.trim()}
                                className="h-9  bg-orange-500 hover:bg-orange-400 text-white font-black uppercase tracking-widest text-[10px] rounded-xl transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                            >
                                {isSavingName ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Check className="w-3 h-3 mr-1.5" />Salvar</>}
                            </Button>
                            <Button
                                onClick={handleCancelName}
                                disabled={isSavingName}
                                variant="ghost"
                                className="h-9  bg-zinc-800/60 hover:bg-zinc-700/60 text-zinc-400 hover:text-white font-black uppercase tracking-widest text-[10px] rounded-xl transition-all border border-zinc-700/50 hover:border-zinc-600"
                            >
                                <X className="w-3 h-3 mr-1.5" />Cancelar
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div
                        className="group flex items-center gap-3 pb-4 cursor-pointer w-fit"
                        onClick={() => setIsEditingName(true)}
                    >
                        <div className="flex items-center gap-3 pb-4">
                            <div className="p-2.5 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                                <Activity className="w-5 h-5 text-orange-500" />
                            </div>
                            <h1 className="text-3xl font-bold text-white group-hover:text-orange-400 transition-colors duration-200 border-b border-transparent group-hover:border-orange-400/40 pb-0.5">
                                {editName}
                            </h1>
                        </div>
                        <button
                            className="p-2 rounded-xl text-zinc-600 hover:text-orange-400 hover:bg-orange-400/10 transition-all border border-transparent hover:border-orange-400/20 active:scale-90"
                            title="Editar nome"
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                    </div>
                )}

                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                    Template de Cardio • Criado em {new Date(cardio.created_at).toLocaleDateString('pt-BR')}
                </p>
            </div>

            {/* Description / Instructions */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <AlignLeft className="w-4 h-4 text-zinc-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Descrição / Instruções</span>
                </div>

                {isEditingDesc ? (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-200 space-y-3">
                        <Textarea
                            ref={descRef}
                            value={editDesc}
                            onChange={e => setEditDesc(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Escape') handleCancelDesc() }}
                            rows={8}
                            className="bg-zinc-950 border-zinc-700 text-zinc-200 rounded-2xl resize-none focus-visible:ring-orange-500/30 focus-visible:border-orange-500/50 text-sm leading-relaxed"
                            placeholder={"Descreva o protocolo do cardio...\n\nEx:\n• Aquecimento: 5 min caminhada 5km/h\n• Trabalho: 30 min corrida 10km/h\n• Recuperação: 5 min caminhada 5km/h\n\nManter frequência cardíaca entre 130-150 bpm."}
                        />
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={handleSaveDesc}
                                disabled={isSavingDesc}
                                className="h-9  bg-orange-500 hover:bg-orange-400 text-white font-black uppercase tracking-widest text-[10px] rounded-xl transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                            >
                                {isSavingDesc ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Save className="w-3 h-3 mr-1.5" />Salvar</>}
                            </Button>
                            <Button
                                onClick={handleCancelDesc}
                                disabled={isSavingDesc}
                                variant="ghost"
                                className="h-9  bg-zinc-800/60 hover:bg-zinc-700/60 text-zinc-400 hover:text-white font-black uppercase tracking-widest text-[10px] rounded-xl transition-all border border-zinc-700/50 hover:border-zinc-600"
                            >
                                <X className="w-3 h-3 mr-1.5" />Cancelar
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div
                        className="group relative bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 cursor-pointer hover:border-orange-500/30 hover:bg-zinc-900/60 transition-all min-h-[140px]"
                        onClick={() => setIsEditingDesc(true)}
                    >
                        {editDesc ? (
                            <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                                {editDesc}
                            </p>
                        ) : (
                            <p className="text-zinc-600 text-sm italic">
                                Clique para adicionar uma descrição ou protocolo de execução...
                            </p>
                        )}
                        <button className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-700 group-hover:text-orange-400 group-hover:bg-orange-400/10 transition-all border border-transparent group-hover:border-orange-400/20">
                            <Pencil className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}
            </div>

            {/* Duration / Intensity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Duração Padrão (min)</span>
                    </div>
                    <div className="flex items-center gap-3 pb-4">
                        <Input
                            type="number"
                            value={editDuration}
                            onChange={(e) => {
                                setEditDuration(e.target.value)
                                handleSaveQuickMeta(e.target.value, editIntensity)
                            }}
                            className="bg-zinc-950 border-zinc-800 h-12 rounded-xl focus-visible:ring-orange-500/30 font-bold"
                        />
                        {isSavingMeta && <Loader2 className="w-4 h-4 animate-spin text-orange-500" />}
                    </div>
                </div>

                <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-orange-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Intensidade Sugerida</span>
                    </div>
                    <Select
                        value={editIntensity}
                        onValueChange={(val) => {
                            setEditIntensity(val)
                            handleSaveQuickMeta(editDuration, val)
                        }}
                    >
                        <SelectTrigger className="bg-zinc-950 border-zinc-800 h-12 rounded-xl focus:ring-orange-500/30 font-bold">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent position="popper" className="bg-zinc-900 border-zinc-800 text-white rounded-2xl p-2 shadow-2xl border-white/5">
                            {[
                                { label: 'Leve', value: 'Leve', color: '#10b981' },
                                { label: 'Moderada', value: 'Moderada', color: '#f59e0b' },
                                { label: 'Alta', value: 'Alta', color: '#ef4444' },
                                { label: 'Máxima', value: 'Máxima', color: '#a855f7' }
                            ].map((opt) => (
                                <SelectItem
                                    key={opt.value}
                                    value={opt.value}
                                    className="rounded-xl px-3 py-2.5 font-bold focus:bg-orange-500/10 focus:text-orange-500 transition-all cursor-pointer mb-1 last:mb-0"
                                >
                                    <div className="flex items-center gap-3 pb-4">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: opt.color, boxShadow: `0 0 8px ${opt.color}66` }} />
                                        {opt.label}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Template Info */}
            <div className="bg-zinc-900/20 border border-zinc-800/30 rounded-2xl p-4 flex items-center gap-3 pb-4">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                    <Activity className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Template Reutilizável</p>
                    <p className="text-[9px] text-zinc-600 font-medium">As configurações acima serão sugeridas automaticamente ao agendar este cardio.</p>
                </div>
            </div>

            {/* Back */}
            <div className="pt-10 flex justify-center border-t border-zinc-800/30">
                <Button
                    asChild
                    variant="ghost"
                    className="text-zinc-500 hover:text-white hover:bg-zinc-900 gap-2 px-6 h-12 rounded-xl transition-all border border-transparent hover:border-zinc-800"
                >
                    <Link href={backHref}>
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para Biblioteca de Cardio
                    </Link>
                </Button>
            </div>
        </div>
    )
}
