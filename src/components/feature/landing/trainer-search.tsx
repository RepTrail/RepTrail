'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, Loader2, Star, ChevronRight, Trophy } from 'lucide-react'
import Link from 'next/link'
import { searchTrainers, TrainerSearchResult } from '@/actions/public-actions'


export function TrainerSearch() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<TrainerSearchResult[]>([])
    const [loading, setLoading] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length >= 2) {
                setLoading(true)
                try {
                    const data = await searchTrainers(query)
                    setResults(data)
                } catch (error) {
                    console.error('Failed to search', error)
                } finally {
                    setLoading(false)
                    setHasSearched(true)
                }
            } else {
                setResults([])
                setHasSearched(false)
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [query])

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8">
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-3xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-500" />
                <div className="relative flex items-center bg-zinc-900/90 border border-zinc-800 rounded-3xl p-2 shadow-2xl backdrop-blur-xl">
                    <div className="pl-4 text-zinc-400">
                        <Search className={`w-6 h-6 ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity absolute`} />
                        <Loader2 className={`w-6 h-6 animate-spin text-emerald-500 ${loading ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
                    </div>
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Busque por nome do treinador..."
                        className="h-16 border-none bg-transparent text-lg md:text-xl placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <Button
                        size="lg"
                        className="hidden md:flex h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-black uppercase tracking-wide px-8 transition-all hover:scale-105"
                    >
                        Buscar
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                {results.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {results.map((trainer) => (
                            <Link
                                href={`/personal/${trainer.trainer_code}`}
                                key={trainer.id}
                                className="group block bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/50 rounded-3xl p-4 transition-all hover:bg-zinc-900 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <Avatar className="w-16 h-16 border-2 border-zinc-800 group-hover:border-emerald-500 transition-colors">
                                            <AvatarImage src={trainer.avatar_url || ''} className="object-cover" />
                                            <AvatarFallback className="bg-zinc-800 text-zinc-500 font-bold">
                                                {trainer.full_name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        {trainer.plan_tier === 'elite' && (
                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center border-2 border-zinc-900 shadow-sm" title="Elite Trainer">
                                                <Trophy className="w-3 h-3 text-white fill-white" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                                                {trainer.full_name}
                                            </h3>
                                            {trainer.average_rating > 0 && (
                                                <div className="flex items-center text-xs font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-md">
                                                    <Star className="w-3 h-3 fill-current mr-1" />
                                                    {trainer.average_rating.toFixed(1)}
                                                </div>
                                            )}
                                        </div>
                                        {trainer.specialties && trainer.specialties.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-2">
                                                {trainer.specialties.slice(0, 2).map((s, i) => (
                                                    <span key={i} className="text-[10px] uppercase font-bold text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded-full border border-zinc-800">
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <div className="flex items-center text-xs text-zinc-500">
                                            Ver perfil completo <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : hasSearched && query.length >= 2 ? (
                    <div className="text-center py-12 bg-zinc-900/30 rounded-3xl border border-zinc-800/50">
                        <p className="text-zinc-500 text-lg">Nenhum treinador encontrado para "{query}"</p>
                    </div>
                ) : (
                    query.length < 2 && (
                        <div className="flex flex-wrap justify-center gap-2 opacity-50">
                            {['Musculação', 'Crossfit', 'Emagrecimento', 'Hipertrofia'].map((tag) => (
                                <span key={tag} className="text-xs font-medium text-zinc-600 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    )
}
