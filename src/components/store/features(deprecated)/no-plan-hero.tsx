'use client'

import { Sparkles, ArrowRight, Zap, TrendingUp } from 'lucide-react'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { Stack } from '@/components/store/base/stack'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { PodiumCard, RankingRow } from '@/components/store/advanced/ranking-cards'

export function NoPlanHero({ ranking }: { ranking: any[] }) {
    const topTrainers = ranking.slice(0, 3)
    const otherTrainers = ranking.slice(3, 6)

    return (
        <RegistryMain
            title="BEM-VINDO"
            subtitle="Você ainda não possui um plano ativo no RepTrail."
            icon={Sparkles}
            contextLabel="Área do Aluno"
            showTabs={false}
        >
            <Stack gap={{ base: 12.5, md: 'section' }} className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                {/* Hero Section - Premium Marketplace Entry */}
                <header className="relative">
                    <div className="absolute -inset-20 bg-gradient-to-br from-orange-500/20 via-orange-500/5 to-transparent blur-3xl opacity-50" />
                    <div className="relative group overflow-hidden p-8 sm:p-16 bg-zinc-900/40 border border-zinc-800/50 rounded-[3rem] backdrop-blur-md shadow-2xl">
                        <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center text-center lg:text-left">
                            <div className="flex-1 space-y-8">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Plataforma Elite
                                </div>
                                <h2 className="text-4xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-[0.9]">
                                    Desbloqueie seu <br /><span className="text-orange-500">Potencial Máximo</span>
                                </h2>
                                <p className="text-zinc-500 text-sm md:text-xl font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                    Você ainda não possui um personal trainer. Conecte-se com a elite do treinamento físico e receba protocolos 100% personalizados.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                                    <Link href="/buscar-personal">
                                        <Button className="h-16 px-12 rounded-2xl bg-white hover:bg-orange-500 text-zinc-950 font-black uppercase italic tracking-wide text-lg transition-all shadow-2xl shadow-white/5 active:scale-95">
                                            Encontrar Personal
                                            <ArrowRight className="w-6 h-6 ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="hidden lg:block relative shrink-0">
                                <div className="absolute -inset-10 bg-orange-500/20 rounded-full blur-[80px] opacity-20" />
                                <div className="w-80 h-80 rounded-[3rem] bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 relative overflow-hidden flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-700">
                                    <Zap className="w-32 h-32 text-orange-500/20" />
                                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                        <p className="text-xs font-black text-white uppercase italic tracking-widest">+500 Treinadores</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Auto-Training Promotion */}
                <Stack gap={{ base: 12.5, md: 'section' }}>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                                Treine de forma <span className="text-orange-500">Inteligente</span>
                            </h3>
                            <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Sem tempo para um personal? Use o Auto-Training</p>
                        </div>
                        <Link href="/dashboard/student/plans">
                            <Button variant="link" className="text-orange-500 font-black uppercase text-xs tracking-widest gap-2 group p-0 h-auto">
                                Ver Planos de IA
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>

                    <Link href="/dashboard/student/plans">
                        <div className="relative group overflow-hidden p-8 sm:p-12 bg-gradient-to-r from-orange-500/5 to-orange-500/10 border border-orange-500/20 rounded-[3rem] shadow-2xl transition-all hover:border-orange-500/40">
                            <div className="absolute top-0 right-0 p-12 opacity-5 translate-x-10 -translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-1000">
                                <Sparkles className="w-48 h-48 text-orange-500" />
                            </div>
                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                                <div className="space-y-4 text-center md:text-left">
                                    <h4 className="text-2xl md:text-4xl font-black text-white italic uppercase tracking-tighter">Auto-Training com <span className="text-orange-500">RepTrail AI</span></h4>
                                    <p className="text-zinc-500 text-sm md:text-lg max-w-xl font-medium">Protocolos gerados instantaneamente com base na sua rotina, objetivos e equipamentos disponíveis.</p>
                                </div>
                                <Button className="h-14 px-10 rounded-2xl bg-orange-500 hover:bg-orange-600 text-zinc-950 font-black uppercase italic tracking-wide text-sm whitespace-nowrap active:scale-95 transition-all">
                                    Ativar por R$ 10,90/mês
                                </Button>
                            </div>
                        </div>
                    </Link>
                </Stack>

                {/* Top Trainers - Reusing Ranking Components */}
                <Stack gap={{ base: 12.5, md: 'section' }} className="pb-20">
                    <div className="flex items-center gap-4 px-4 overflow-hidden">
                        <div className="h-px bg-zinc-800 flex-1" />
                        <h3 className="text-3xl font-black text-white italic uppercase tracking-tight shrink-0">
                            Treinadores <span className="text-orange-500">Destaque</span>
                        </h3>
                        <div className="h-px bg-zinc-800 flex-1" />
                    </div>

                    <div className="grid gap-12 lg:grid-cols-3 px-2">
                        {topTrainers.map((t: any, idx: number) => (
                            <PodiumCard key={t.id} trainer={t} rank={idx + 1} />
                        ))}
                    </div>

                    {otherTrainers.length > 0 && (
                        <div className="space-y-6 pt-10">
                            <div className="flex items-center gap-3 px-4">
                                <TrendingUp className="w-4 h-4 text-orange-500" />
                                <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Outros Recomendados</h2>
                            </div>

                            <Card className="bg-zinc-900/30 border-zinc-800/50 shadow-2xl rounded-[2.5rem] overflow-hidden backdrop-blur-sm">
                                <CardContent className="p-0">
                                    <div className="divide-y divide-zinc-800/30">
                                        {otherTrainers.map((t: any, idx: number) => (
                                            <RankingRow key={t.id} trainer={t} rank={idx + 4} />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    <div className="text-center pt-8">
                        <Link href="/buscar-personal">
                            <Button variant="outline" className="h-14 px-10 rounded-2xl border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white font-black uppercase italic tracking-widest text-xs">
                                Ver Todos os Treinadores
                            </Button>
                        </Link>
                    </div>
                </Stack>
            </Stack>
        </RegistryMain>
    )
}

