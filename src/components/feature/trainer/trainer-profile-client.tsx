'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, User, CreditCard, Sparkles, Zap, Crown, Activity } from "lucide-react"
import { ClientProfileForm } from "@/components/feature/trainer/client-profile-form"
import { CancelSubscriptionButton } from "@/components/feature/subscription/cancel-subscription-button"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'

interface TrainerProfileClientProps {
    profile: any
    activeStudents: number
}

export function TrainerProfileClient({ profile, activeStudents }: TrainerProfileClientProps) {
    const currentTier = (profile?.plan_tier as 'on_demand' | 'start' | 'pro' | 'elite') || 'on_demand'

    const tierColors = {
        on_demand: 'text-zinc-500',
        start: 'text-blue-500',
        pro: 'text-emerald-500',
        elite: 'text-amber-500'
    }
    const tierBgColors = {
        on_demand: 'bg-zinc-500/5 border-b border-zinc-500/10',
        start: 'bg-blue-500/5 border-b border-blue-500/10',
        pro: 'bg-emerald-500/5 border-b border-emerald-500/10',
        elite: 'bg-amber-500/5 border-b border-amber-500/10'
    }
    const tierIcons = {
        on_demand: Activity,
        start: Zap,
        pro: Sparkles,
        elite: Crown
    }

    const TierIcon = tierIcons[currentTier] || Activity
    const tierColor = tierColors[currentTier] || 'text-zinc-500'
    const tierBg = tierBgColors[currentTier] || 'bg-zinc-500/5 border-b border-zinc-500/10'

    return (
        <RegistryMain
            title="MEU PERFIL PROFISSIONAL"
            subtitle="Gerencie sua identidade e veja seu progresso como treinador."
            icon={User}
            contextLabel="Área do Personal"
            showTabs={false}
        >
            <Grid gap={5} lgCols={12}>
                {/* Main Settings */}
                <div className="lg:col-span-8">
                    <Card className="bg-zinc-950 border-zinc-800 shadow-2xl overflow-hidden rounded-2xl border-t-zinc-700/50">
                        <CardHeader className="bg-zinc-900/10 border-b border-zinc-900/50 py-4">
                            <CardTitle className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                                <User className="w-5 h-5 text-emerald-500" />
                                Dados Profissionais
                            </CardTitle>
                            <CardDescription className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest leading-none mt-1">
                                Essas informações ficam visíveis para seus alunos e no convite.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            <ClientProfileForm profile={profile} />
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar area */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="bg-zinc-950 border-zinc-800 shadow-2xl rounded-2xl overflow-hidden group">
                        <CardHeader className={`${tierBg} py-4`}>
                            <CardTitle className={`text-sm font-bold ${tierColor} flex items-center gap-2 uppercase tracking-widest`}>
                                <Award className="w-4 h-4" />
                                Gamificação
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="flex flex-col items-center justify-center py-4 bg-zinc-900/30 rounded-2xl border border-zinc-800/50 border-dashed">
                                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Nível</div>
                                <div className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-2">
                                    {(profile?.plan_tier || 'START').toUpperCase()}
                                    <TierIcon className={`w-5 h-5 ${tierColor} animate-pulse`} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/50 text-center">
                                    <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Avaliação</div>
                                    <div className={`text-xl font-bold ${tierColor}`}>
                                        {profile?.rating && profile.rating > 0 ? `${profile.rating} ★` : '0.0'}
                                    </div>
                                    {(!profile?.rating || profile.rating === 0) && (
                                        <p className="text-[8px] text-zinc-600 mt-1 uppercase font-bold tracking-tight">Sem avaliações ainda</p>
                                    )}
                                </div>
                                <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/50 text-center">
                                    <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Alunos</div>
                                    <div className="text-xl font-bold text-white">{activeStudents || 0}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* ASSINATURA & FATURAMENTO */}
                    <Card className="bg-zinc-950 border-zinc-800/50 shadow-2xl rounded-[2rem] overflow-hidden group relative text-left">
                        <CardHeader className="bg-zinc-900/40 border-b border-zinc-900/50 py-5 relative z-10">
                            <CardTitle className="text-xs font-black text-purple-500 flex items-center gap-2 uppercase tracking-[0.2em]">
                                <CreditCard className="w-4 h-4" />
                                Assinatura & Faturamento
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6 flex flex-col items-center relative z-10">
                            <div className="w-full space-y-4">
                                <div className="flex justify-between items-end pb-4 border-b border-zinc-900/50">
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none text-left">Status Atual</div>
                                        <div className={`text-lg font-black italic uppercase tracking-tighter ${profile?.asaas_subscription_id ? 'text-emerald-500' : 'text-zinc-600'}`}>
                                            {profile?.asaas_subscription_id ? 'Plano Ativo' : 'Plano Inativo'}
                                        </div>
                                    </div>
                                    {profile?.asaas_subscription_id && (
                                        <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">
                                            Válido
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2 text-left w-full pt-1">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${profile?.asaas_subscription_id ? 'bg-purple-500' : 'bg-zinc-800'}`} />
                                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                                            Ciclo On Demand Mensal
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider text-left">
                                            Pagamento Seguro via Asaas
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {profile?.asaas_subscription_id ? (
                                <div className="w-full">
                                    <CancelSubscriptionButton />
                                </div>
                            ) : (
                                <Link href="/dashboard/trainer/plans" className="w-full">
                                    <Button className="w-full h-12 rounded-xl bg-white text-zinc-950 hover:bg-purple-500 hover:text-white font-black uppercase italic tracking-widest text-xs transition-all shadow-xl">
                                        Explorar Planos
                                        <Zap className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            )}

                            <div className="flex items-center gap-2 pt-2 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                                <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Faturamento por</span>
                                <span className="text-[10px] font-black text-white italic uppercase tracking-tighter">Asaas</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Grid>
        </RegistryMain>
    )
}
