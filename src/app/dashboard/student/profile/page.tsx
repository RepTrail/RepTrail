'use client'

import { useState, useEffect } from 'react'
import { getStudentProfile, updateStudentFullProfile, uploadAvatar } from '@/actions/student-actions'
import {
    User,
    Settings,
    Mail,
    Calendar,
    Ruler,
    Target,
    Activity,
    FileText,
    Save,
    ShieldCheck,
    LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { Checkbox } from '@/components/ui/checkbox'
import { AvatarUploadWithCrop } from '@/components/feature/avatar-upload-with-crop'

export default function StudentProfilePage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [profile, setProfile] = useState<any>(null)
    const [formData, setFormData] = useState({
        full_name: '',
        birth_date: '',
        height: '',
        goal: '',
        activity_level: '',
        observations: '',
        steroid_use: false,
        whatsapp: ''
    })

    useEffect(() => {
        loadProfile()
    }, [])

    async function loadProfile() {
        setLoading(true)
        const { data: { user } } = await (await import('@/lib/supabase/client')).createClient().auth.getUser()
        if (user) {
            const data = await getStudentProfile(user.id)
            if (data) {
                setProfile(data)
                setFormData({
                    full_name: data.full_name || '',
                    birth_date: data.details?.birth_date || '',
                    height: data.details?.height?.toString() || '',
                    goal: data.details?.goal || '',
                    activity_level: data.details?.activity_level || '',
                    observations: data.details?.observations || '',
                    steroid_use: data.details?.steroid_use || false,
                    whatsapp: data.whatsapp || ''
                })
            }
        }
        setLoading(false)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)
        const result = await updateStudentFullProfile({
            ...formData,
            height: parseFloat(formData.height) || 0
        })

        if (result.success) {
            toast({
                title: 'Perfil Atualizado',
                description: 'Suas informações foram salvas com sucesso.',
            })
        } else {
            toast({
                title: 'Erro ao salvar',
                description: result.error,
                variant: 'destructive'
            })
        }
        setSaving(false)
    }

    if (loading) return (
        <div className="p-10 space-y-10 animate-pulse">
            <div className="h-12 bg-zinc-900 rounded-2xl w-1/4" />
            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-1 h-64 bg-zinc-900 rounded-[2.5rem]" />
                <div className="md:col-span-2 h-[500px] bg-zinc-900 rounded-[2.5rem]" />
            </div>
        </div>
    )

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
                        Meu Perfil
                    </h1>
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        Configurações da conta e dados físicos
                    </p>
                </div>
            </header>

            <div className="grid gap-10 lg:grid-cols-12">

                {/* Profile Card / Avatar Area */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="bg-zinc-900/40 border-zinc-800/50 rounded-[3rem] overflow-hidden backdrop-blur-sm shadow-2xl">
                        <CardContent className="p-10 text-center space-y-6">
                            <AvatarUploadWithCrop
                                currentImageUrl={profile?.avatar_url}
                                userName={profile?.full_name}
                                onUploadSuccess={(url) => setProfile((prev: any) => ({ ...prev, avatar_url: url }))}
                                uploadAction={uploadAvatar}
                                accentColor="orange"
                            />

                            <div className="space-y-1">
                                <h2 className="text-2xl font-black text-white italic uppercase">{profile?.full_name}</h2>
                                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                                    <Mail className="w-3 h-3" />
                                    {profile?.email}
                                </p>
                            </div>

                            <div className="pt-6 border-t border-zinc-800/50 grid grid-cols-2 gap-4">
                                <div className="p-4 bg-zinc-950/50 rounded-3xl border border-zinc-800">
                                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block mb-1">Início</span>
                                    <span className="text-xs font-black text-white uppercase italic">Março 2024</span>
                                </div>
                                <div className="p-4 bg-zinc-950/50 rounded-3xl border border-zinc-800">
                                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block mb-1">Status</span>
                                    <span className="text-xs font-black text-emerald-500 uppercase italic">Ativo</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>


                </div>

                {/* Edit Form */}
                <div className="lg:col-span-8">
                    <Card className="bg-zinc-900/40 border-zinc-800/50 rounded-[3rem] backdrop-blur-sm shadow-2xl overflow-hidden">
                        <CardHeader className="p-10 border-b border-zinc-800/50">
                            <CardTitle className="text-xl font-black text-white italic uppercase tracking-tight flex items-center gap-3">
                                <Settings className="w-5 h-5 text-orange-500" />
                                Informações Pessoais
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-10">
                            <form onSubmit={handleSubmit} className="space-y-10">
                                <div className="grid gap-x-8 gap-y-8 md:grid-cols-2">

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                            <User className="w-3.5 h-3.5" />
                                            Nome Completo
                                        </label>
                                        <Input
                                            value={formData.full_name}
                                            onChange={e => setFormData(f => ({ ...f, full_name: e.target.value }))}
                                            placeholder="Ex: João Silva"
                                            className="h-14 bg-zinc-950 border-zinc-800 rounded-2xl focus:border-orange-500/50 font-bold italic text-white"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5" />
                                            Data de Nascimento
                                        </label>
                                        <Input
                                            type="date"
                                            value={formData.birth_date}
                                            onChange={e => setFormData(f => ({ ...f, birth_date: e.target.value }))}
                                            className="h-14 bg-zinc-950 border-zinc-800 rounded-2xl focus:border-orange-500/50 font-bold text-white uppercase brightness-90"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                            <Ruler className="w-3.5 h-3.5" />
                                            Altura (cm)
                                        </label>
                                        <Input
                                            type="number"
                                            value={formData.height}
                                            onChange={e => setFormData(f => ({ ...f, height: e.target.value }))}
                                            placeholder="Ex: 180"
                                            className="h-14 bg-zinc-950 border-zinc-800 rounded-2xl focus:border-orange-500/50 font-bold italic text-white"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                            <Target className="w-3.5 h-3.5" />
                                            Objetivo principal
                                        </label>
                                        <Input
                                            value={formData.goal}
                                            onChange={e => setFormData(f => ({ ...f, goal: e.target.value }))}
                                            placeholder="Ex: Hipertrofia Máxima"
                                            className="h-14 bg-zinc-950 border-zinc-800 rounded-2xl focus:border-orange-500/50 font-bold italic text-white"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                            WhatsApp (com DDD)
                                        </label>
                                        <Input
                                            value={formData.whatsapp}
                                            onChange={e => setFormData(f => ({ ...f, whatsapp: e.target.value }))}
                                            placeholder="Ex: 55 11 99999-9999"
                                            className="h-14 bg-zinc-950 border-zinc-800 rounded-2xl focus:border-orange-500/50 font-bold italic text-white"
                                        />
                                    </div>

                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                            <Activity className="w-3.5 h-3.5" />
                                            Nível de Atividade
                                        </label>
                                        <select
                                            value={formData.activity_level}
                                            onChange={e => setFormData(f => ({ ...f, activity_level: e.target.value }))}
                                            className="w-full h-14 px-6 bg-zinc-950 border border-zinc-800 rounded-2xl focus:border-orange-500/50 font-bold text-white uppercase outline-none"
                                        >
                                            <option value="sedentary">Sedentário</option>
                                            <option value="light">Levemente Ativo</option>
                                            <option value="moderate">Moderado</option>
                                            <option value="active">Muito Ativo</option>
                                            <option value="athlete">Atleta / Extremo</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2 space-y-3">
                                        <div className="flex items-center space-x-3 p-6 bg-zinc-950 border border-zinc-800 rounded-2xl group-hover:border-orange-500/30 transition-all">
                                            <Checkbox
                                                id="steroid_use"
                                                checked={formData.steroid_use}
                                                onCheckedChange={(checked) => setFormData(f => ({ ...f, steroid_use: checked === true }))}
                                                className="border-zinc-700 data-[state=checked]:bg-orange-500 data-[state=checked]:text-zinc-950"
                                            />
                                            <div className="grid gap-1.5 leading-none">
                                                <label
                                                    htmlFor="steroid_use"
                                                    className="text-xs font-black uppercase tracking-widest text-white cursor-pointer"
                                                >
                                                    Uso de Ergogênicos / Hormônios
                                                </label>
                                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">
                                                    Esta informação é importante para que seu treinador ajuste seu protocolo corretamente.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                            <FileText className="w-3.5 h-3.5" />
                                            Observações Médicas / Importantes
                                        </label>
                                        <Textarea
                                            value={formData.observations}
                                            onChange={e => setFormData(f => ({ ...f, observations: e.target.value }))}
                                            placeholder="Ex: Lesão no ombro direito, asma..."
                                            className="min-h-[120px] bg-zinc-950 border-zinc-800 rounded-2xl focus:border-orange-500/50 font-bold italic text-white p-6"
                                        />
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row gap-6 md:items-center justify-between">
                                    <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest max-w-sm">
                                        Após salvar, algumas informações podem levar alguns segundos para atualizar em todo o sistema.
                                    </p>
                                    <Button
                                        type="submit"
                                        disabled={saving}
                                        className="h-16 px-10 rounded-2xl bg-orange-500 hover:bg-orange-400 text-zinc-950 font-black uppercase italic tracking-wide shadow-xl shadow-orange-500/10 active:scale-95 transition-all group"
                                    >
                                        {saving ? (
                                            <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent animate-spin rounded-full" />
                                        ) : (
                                            <>
                                                Salvar Alterações
                                                <Save className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Logout — visible on mobile since sidebar logout is hidden */}
            <div className="md:hidden pt-4 pb-8">
                <form action={async () => {
                    const { signOutAction } = await import('@/actions/auth-actions')
                    await signOutAction()
                }}>
                    <Button
                        type="submit"
                        variant="outline"
                        className="w-full flex items-center justify-center gap-3 h-14 rounded-2xl border border-zinc-800 bg-zinc-900/50 text-zinc-500 hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/5 font-black uppercase tracking-widest text-[10px] transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        Sair da Conta
                    </Button>
                </form>
            </div>
        </div>
    )
}
