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
import { PodiumCard } from '@/components/feature/shared/ranking-cards'
import Link from 'next/link'
import { fbqEvent } from '@/lib/meta-pixel'

import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'

export default function SearchPersonalPage() {
    const [filters, setFilters] = useState({
        query: '',
        region: '',
        specialty: '',
        sortBy: 'rating' as any
    })

    const { data: trainers = [], isLoading: loading } = useQuery({
        queryKey: QUERY_KEYS.search.trainers(filters),
        queryFn: async () => {
            const results = await searchTrainers(filters)

            // Track Lead event when search is performed with intent
            if (filters.query || filters.region || filters.specialty) {
                fbqEvent("Lead", {
                    content_category: "Trainer Search",
                    search_string: filters.query,
                    region: filters.region,
                    specialty: filters.specialty
                });
            }
            return results
        },
        // Keep the 300ms debounce feel for typing by using a small delay if needed, 
        // but useQuery handles most concurrency well. For now, matching the previous logic:
        staleTime: 1000 * 60, // 1 minute Cache for search
    })

    async function handleSearch() {
        // useQuery handles this now, but we keep the function for manual triggers if needed
    }

    const specialties = ['Hipertrofia', 'Emagrecimento', 'Atletas', 'Mobilidade', 'Saúde']

    return (
        <div className="min-h-screen bg-zinc-950 text-white pb-32 animate-in fade-in duration-700">
            {/* Header / Search Hero */}
            <div className="relative overflow-hidden bg-zinc-900/50 border-b border-zinc-800/50 pt-12 pb-[146px] backdrop-blur-3xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(249,115,22,0.1),transparent_50%)]" />
                <div className="absolute top-0 right-0 p-20 opacity-[0.02] rotate-12">
                    <Trophy className="w-96 h-96" />
                </div>

                <div className="max-w-[1600px] mx-auto px-8 space-y-12 relative z-10">
                    <div className="space-y-6">
                        <Link href="/dashboard/student" className="group w-fit text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] hover:text-white transition-all flex items-center gap-2">
                            <ArrowRight className="w-3 h-3 rotate-180 group-hover:-translate-x-1 transition-transform" />
                            Voltar
                        </Link>
                        <Logo size="lg" className="max-md:scale-90" />
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-stretch">
                        <div className="relative flex-1 group">
                            <div className="absolute inset-0 bg-orange-500/5 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-orange-500 transition-colors z-20" />
                            <Input
                                placeholder="Nome do personal, cidade ou especialidade..."
                                className="h-18 pl-14 pr-6 rounded-2xl bg-zinc-900 border-zinc-800 hover:border-zinc-700 focus:border-orange-500/50 transition-all font-bold text-white italic placeholder:text-zinc-700 text-lg shadow-2xl relative z-10"
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
            <div className="max-w-[1600px] mx-auto -mt-[100px] px-8 relative z-20">


                {/* Results Grid */}
                <main className="space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3 pb-4">
                            <div className="w-2 h-4 bg-orange-500 rounded-full" />
                            <span className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em]">
                                {trainers.length} Profissionais Disponíveis
                            </span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 4, 6, 8, 9].map(i => (
                                <div key={i} className="h-[500px] bg-zinc-900/50 rounded-3xl animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {trainers.map((trainer, index) => (
                                <PodiumCard
                                    key={trainer.id}
                                    trainer={{
                                        ...trainer,
                                        rating: trainer.average_rating || 0,
                                        studentCount: trainer.studentCount || 0,
                                        score: trainer.score || 0
                                    }}
                                    rank={index + 1}
                                />
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
