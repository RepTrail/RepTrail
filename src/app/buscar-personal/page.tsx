'use client'

import { useState, useEffect } from 'react'
import { searchTrainers } from '@/actions/student-actions'
import {
    Search,
    MapPin,
    Filter,
    Star,
    ChevronDown,
    User,
    ArrowRight,
    LucideIcon,
    X,
    TrendingUp,
    ShieldCheck,
    CheckCircle2,
    SlidersHorizontal,
    Trophy
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Logo } from '@/components/ui/logo'
import Link from 'next/link'

export default function SearchPersonalPage() {
    const [trainers, setTrainers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        query: '',
        region: '',
        specialty: '',
        sortBy: 'rating' as any
    })

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            handleSearch()
        }, 300)
        return () => clearTimeout(delaySearch)
    }, [filters.query, filters.region, filters.specialty, filters.sortBy])

    async function handleSearch() {
        setLoading(true)
        const results = await searchTrainers(filters)
        setTrainers(results)
        setLoading(false)
    }

    const specialties = ['Hipertrofia', 'Emagrecimento', 'Atletas', 'Mobilidade', 'Saúde']

    return (
        <div className="min-h-screen bg-zinc-950 text-white pb-32 animate-in fade-in duration-700">
            {/* Header / Search Hero */}
            <div className="relative overflow-hidden bg-zinc-900/50 border-b border-zinc-800/50 pt-20 pb-32 px-4 backdrop-blur-3xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(249,115,22,0.1),transparent_50%)]" />
                <div className="absolute top-0 right-0 p-20 opacity-[0.02] rotate-12">
                    <Trophy className="w-96 h-96" />
                </div>

                <div className="max-w-6xl mx-auto space-y-12 relative z-10">
                    <div className="space-y-6">
                        <Link href="/dashboard/student" className="group w-fit text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] hover:text-white transition-all flex items-center gap-2">
                            <ArrowRight className="w-3 h-3 rotate-180 group-hover:-translate-x-1 transition-transform" />
                            Voltar ao Dashboard
                        </Link>
                        <Logo size="xl" />
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-stretch">
                        <div className="relative flex-1 group">
                            <div className="absolute inset-0 bg-orange-500/5 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-orange-500 transition-colors z-20" />
                            <Input
                                placeholder="Nome do personal, cidade ou especialidade..."
                                className="h-18 pl-14 pr-6 rounded-2xl bg-zinc-900 border-zinc-800 focus:border-orange-500/50 transition-all font-bold text-white italic placeholder:text-zinc-700 text-lg shadow-2xl relative z-10"
                                value={filters.query}
                                onChange={e => setFilters(f => ({ ...f, query: e.target.value }))}
                                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <Button
                            onClick={handleSearch}
                            className="h-18 px-12 rounded-2xl bg-orange-500 hover:bg-orange-400 text-zinc-950 font-black uppercase italic tracking-wide shadow-xl shadow-orange-500/20 active:scale-95 transition-all text-lg relative z-10"
                        >
                            Encontrar Treinador
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-6xl mx-auto px-4 -mt-16 grid gap-10 lg:grid-cols-12 relative z-20">

                {/* Filters Sidebar */}
                <aside className="lg:col-span-3 space-y-6">
                    <div className="p-8 bg-zinc-900 border border-zinc-800 shadow-2xl rounded-[3rem] space-y-8 backdrop-blur-xl">
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
                            <h2 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2">
                                <SlidersHorizontal className="w-4 h-4 text-orange-500" />
                                Refinar Busca
                            </h2>
                            <button
                                onClick={() => setFilters({ query: '', region: '', specialty: '', sortBy: 'rating' })}
                                className="text-[9px] text-zinc-600 hover:text-white font-black uppercase tracking-widest transition-colors"
                            >
                                Limpar
                            </button>
                        </div>

                        <div className="space-y-8">
                            <FilterSection label="Região / Cidade">
                                <div className="relative group">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-700 group-focus-within:text-orange-500 transition-colors" />
                                    <Input
                                        placeholder="Ex: São Paulo, SP"
                                        className="h-12 pl-10 rounded-xl bg-zinc-950 border-zinc-800 font-bold text-xs focus:border-orange-500/30 transition-all placeholder:text-zinc-800"
                                        value={filters.region}
                                        onChange={e => setFilters(f => ({ ...f, region: e.target.value }))}
                                    />
                                </div>
                            </FilterSection>

                            <FilterSection label="Especialidade">
                                <div className="grid gap-2">
                                    {specialties.map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setFilters(f => ({ ...f, specialty: f.specialty === s ? '' : s }))}
                                            className={`
                                                w-full px-4 py-3 rounded-xl text-left text-[10px] font-black uppercase tracking-[0.2em] border transition-all relative overflow-hidden group/btn
                                                ${filters.specialty === s
                                                    ? 'bg-orange-500 border-orange-400 text-zinc-950 shadow-lg shadow-orange-500/10'
                                                    : 'bg-zinc-950 border-zinc-900 text-zinc-600 hover:border-zinc-700 hover:text-zinc-300'}
                                            `}
                                        >
                                            <span className="relative z-10">{s}</span>
                                            {filters.specialty === s && (
                                                <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-950/20" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </FilterSection>

                            <FilterSection label="Ordenar Por">
                                <select
                                    value={filters.sortBy}
                                    onChange={e => setFilters(f => ({ ...f, sortBy: e.target.value }))}
                                    className="w-full h-12 px-4 rounded-xl bg-zinc-950 border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-400 outline-none focus:border-orange-500/50 appearance-none cursor-pointer hover:border-zinc-700 transition-colors"
                                >
                                    <option value="rating">Melhor Avaliação</option>
                                    <option value="popular">Maior número de alunos</option>
                                    <option value="price_asc">Menor Preço Mensal</option>
                                    <option value="price_desc">Maior Preço Mensal</option>
                                </select>
                            </FilterSection>
                        </div>
                    </div>

                    <div className="p-8 bg-orange-500/5 border border-orange-500/10 rounded-[2.5rem] space-y-4">
                        <div className="flex items-center gap-2 text-orange-500">
                            <Star className="w-4 h-4 fill-orange-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">Conselho Pro</span>
                        </div>
                        <p className="text-zinc-500 text-[11px] font-medium leading-relaxed">
                            Profissionais com selo <span className="text-orange-500 font-bold uppercase">Elite</span> possuem 98% de taxa de retenção de alunos.
                        </p>
                    </div>
                </aside>

                {/* Results Grid */}
                <main className="lg:col-span-9 space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-4 bg-orange-500 rounded-full" />
                            <span className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em]">
                                {trainers.length} Profissionais Disponíveis
                            </span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid gap-8 md:grid-cols-2">
                            {[1, 2, 4, 6].map(i => (
                                <div key={i} className="h-96 bg-zinc-900/50 rounded-[3rem] animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2">
                            {trainers.map(trainer => (
                                <TrainerCard key={trainer.id} trainer={trainer} />
                            ))}
                        </div>
                    )}

                    {!loading && trainers.length === 0 && (
                        <div className="py-32 text-center space-y-6 bg-zinc-900/20 border border-zinc-800/50 border-dashed rounded-[4rem] animate-in zoom-in-95 duration-500">
                            <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 mx-auto shadow-2xl">
                                <Search className="w-10 h-10 text-zinc-800" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-white font-black uppercase italic text-2xl">Nenhum rastro encontrado</p>
                                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest max-w-xs mx-auto leading-relaxed">Não encontramos treinadores com esses critérios. Tente ampliar sua busca ou mudar o filtro.</p>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

function FilterSection({ label, children }: any) {
    return (
        <div className="space-y-4">
            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
                <div className="w-1 h-3 bg-zinc-800 rounded-full" />
                {label}
            </label>
            {children}
        </div>
    )
}

function TrainerCard({ trainer }: any) {
    return (
        <Card className="group relative bg-zinc-900/30 border-zinc-800/50 hover:border-orange-500/40 transition-all duration-700 rounded-[3.5rem] overflow-hidden backdrop-blur-sm shadow-xl hover:shadow-[0_30px_60px_-15px_rgba(249,115,22,0.1)]">
            {trainer.is_elite && (
                <div className="absolute top-8 right-8 z-30 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center gap-2 shadow-2xl shadow-orange-500/20 rotate-3 group-hover:rotate-0 transition-transform">
                    <ShieldCheck className="w-3.5 h-3.5 text-zinc-950" />
                    <span className="text-[10px] font-black text-zinc-950 uppercase tracking-widest">Elite</span>
                </div>
            )}

            <CardContent className="p-10 space-y-6">
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="relative group/avatar shrink-0">
                        <div className="absolute -inset-1 bg-orange-500 rounded-[2.5rem] blur opacity-0 group-hover/avatar:opacity-20 transition duration-500" />
                        <Avatar className="h-24 w-24 rounded-[2rem] border-2 border-zinc-800 relative z-10 transition-transform duration-500 group-hover:scale-105">
                            <AvatarImage src={trainer.avatar_url} className="object-cover" />
                            <AvatarFallback className="bg-zinc-800 text-zinc-500 font-black text-3xl italic uppercase">
                                {trainer.full_name?.substring(0, 2) || 'TR'}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="space-y-2 w-full min-w-0">
                        <h3 className="text-2xl font-black text-white italic uppercase group-hover:text-orange-500 transition-colors duration-500 leading-tight truncate">
                            {trainer.full_name}
                        </h3>
                        <div className="flex items-center justify-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] bg-zinc-950/50 w-fit px-3 py-1 rounded-lg border border-zinc-800/50 mx-auto">
                            <MapPin className="w-3 h-3 text-orange-500" />
                            {trainer.region || 'Brasil'}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {trainer.specialty && (
                        <Badge variant="outline" className="px-4 py-1.5 bg-zinc-950 border-zinc-800 text-[9px] font-black text-zinc-400 uppercase tracking-widest italic rounded-xl">
                            {trainer.specialty}
                        </Badge>
                    )}
                    <div className="flex items-center gap-1.5 px-4 py-1.5 bg-orange-500/5 border border-orange-500/20 rounded-xl">
                        <Star className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                        <span className="text-xs font-black text-orange-500 leading-none">{Number(trainer.average_rating || 0).toFixed(1)}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="text-zinc-500 text-[11px] font-medium leading-relaxed line-clamp-2 italic">
                        "{trainer.bio || 'Treinador focado em resultados de alta performance e acompanhamento 24/7.'}"
                    </p>
                </div>

                <div className="pt-6 border-t border-zinc-800/50 flex flex-col gap-6">
                    <div className="space-y-1">
                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] block mb-1">Início a partir de</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-sm font-black text-zinc-500 italic uppercase">R$</span>
                            <span className="text-4xl font-black text-white italic tracking-tighter leading-none">
                                {trainer.monthly_price?.toFixed(0) || '---'}
                                <span className="text-sm opacity-30">,00</span>
                            </span>
                        </div>
                    </div>
                    {trainer.trainer_code ? (
                        <Link href={`/personal/${trainer.trainer_code.toUpperCase().trim()}`} className="block w-full">
                            <Button className="w-full h-16 rounded-2xl bg-white hover:bg-orange-500 hover:text-zinc-950 text-zinc-950 font-black uppercase italic tracking-wide transition-all group/btn shadow-xl active:scale-95 border-none">
                                Contratar
                                <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    ) : (
                        <Button disabled className="w-full h-16 rounded-2xl bg-zinc-800 text-zinc-600 font-black uppercase italic tracking-wide cursor-not-allowed">
                            Sem código
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
