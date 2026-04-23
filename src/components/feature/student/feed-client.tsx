'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getPublicFeed } from '@/actions/student-actions'
import { ShieldCheck, Lock, ChevronRight, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function FeedClient() {
    const queryClient = useQueryClient()
    const supabase = createClient()

    const { data: result, isLoading } = useQuery({
        queryKey: QUERY_KEYS.public.feed,
        queryFn: async () => getPublicFeed(),
        staleTime: 1000 * 60 * 5 // 5 minutes
    })

    // Realtime invalidation for the public feed
    useEffect(() => {
        const channel = supabase
            .channel('public-feed-sync')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'progress_photos' },
                () => {
                    // Invalidate feed to fetch latest joined data
                    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.public.feed })
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [queryClient, supabase])

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-zinc-500 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
                <p className="text-[10px] font-black uppercase tracking-widest italic">Carregando feed...</p>
            </div>
        )
    }

    const publicPhotos = (result?.success ? result.data : []) ?? []

    if (publicPhotos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-zinc-900/50 border border-zinc-800 rounded-3xl animate-in fade-in duration-700">
                <Lock className="w-12 h-12 text-zinc-600 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Feed Vazio</h3>
                <p className="text-zinc-500 max-w-sm">
                    Nenhum aluno compartilhou sua evolução publicamente ainda. Que tal ser o primeiro atualizando suas configurações de privacidade?
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {publicPhotos.map((photo: any, index: number) => {
                const mainUrl = photo.front_url || photo.side_right_url || photo.back_url;
                if (!mainUrl) return null;

                return (
                    <Link
                        key={photo.id}
                        href={`/aluno/${photo.student_id}`}
                        className="group block relative rounded-3xl overflow-hidden border border-zinc-900 bg-zinc-950 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] transition-all duration-500"
                    >
                        {/* Image Container */}
                        <div className="aspect-[3/4] relative overflow-hidden bg-zinc-900">
                            <Image
                                src={mainUrl}
                                alt={`Foto de ${photo.student?.full_name}`}
                                fill
                                priority={index === 0}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-100"
                            />
                            {/* Glass Overlay Top */}
                            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                                <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/90">Evolução Ativa</span>
                                </div>
                            </div>
                            {/* Gradient Overlay Bottom */}
                            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                        </div>

                        {/* Student Info Card (Floating) */}
                        <div className="absolute inset-x-4 bottom-4 p-4 rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-white/5 flex items-center justify-between group-hover:translate-y-[-4px] transition-transform duration-500">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full border-2 border-emerald-500/30 overflow-hidden relative shadow-2xl">
                                    {photo.student?.avatar_url ? (
                                        <Image src={photo.student.avatar_url} alt="Avatar" fill sizes="48px" className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-emerald-500 font-black text-sm uppercase" style={{ backgroundColor: '#18181b' }}>
                                            {photo.student?.full_name?.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-sm font-black text-white italic uppercase tracking-tight">
                                        {photo.student?.full_name}
                                    </span>
                                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1">
                                        Ver Perfil Completo
                                    </span>
                                </div>
                            </div>

                            <div className="w-10 h-10 flex items-center justify-center bg-emerald-500 text-zinc-950 rounded-xl group-hover:rotate-[360deg] transition-all duration-700 shadow-lg shadow-emerald-500/20">
                                <ChevronRight className="w-5 h-5 transition-colors" />
                            </div>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}
