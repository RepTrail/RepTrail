import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Activity, ArrowLeft, ChevronRight, Sparkles, Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

// Streaming Components
import { MetricsAndEvolution } from './_components/metrics-evolution'
import { WorkoutHistorySection } from './_components/history-section'
import { PhotosAndTransformation } from './_components/photos-transformation'

export const metadata = {
    title: 'Perfil do Aluno | RepTrail'
}

export default async function StudentPublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id: studentId } = await params
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    const isOwner = authUser?.id === studentId

    // 1. Fetch Core Profile Data (Fast)
    const { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, created_at')
        .eq('id', studentId)
        .single()

    if (!profile) notFound()

    // 2. Fetch Basic Details (Fast)
    const { data: details } = await supabase
        .from('student_details')
        .select('steroid_use')
        .eq('id', studentId)
        .single()

    // 3. Fetch Trainer Info (Fast)
    const { data: trainerLink } = await supabase
        .from('trainer_students')
        .select(`
            active,
            trainer:profiles!trainer_id(
                id, full_name, avatar_url, trainer_code
            )
        `)
        .eq('student_id', studentId)
        .eq('active', true)
        .maybeSingle()

    const trainerData = trainerLink?.trainer as { id: string; full_name: string; avatar_url: string; trainer_code?: string } | undefined

    return (
        <div className="min-h-screen bg-black text-white pb-20 overflow-x-hidden">
            {/* Navigation Header */}
            <div className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 py-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
                    <Link href="/dashboard/student/feed" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group shrink-0">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest italic">Voltar ao Feed</span>
                    </Link>
                    <div className="flex items-center gap-2 bg-emerald-500/10 px-3 sm:px-4 py-1.5 rounded-full border border-emerald-500/20 shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-emerald-500 whitespace-nowrap">Perfil Verificado</span>
                    </div>
                </div>
            </div>

            {/* Hero Section (Immediate Render) */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12">
                <div className="relative rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden bg-zinc-900/40 border border-white/5 p-6 sm:p-8 md:p-12 mb-12">
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
                        <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-emerald-500/30 overflow-hidden relative shadow-2xl">
                            {profile.avatar_url ? (
                                <Image src={profile.avatar_url} alt={profile.full_name} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-emerald-500 font-black text-4xl uppercase">
                                    {profile.full_name?.charAt(0)}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-6">
                            <div className="space-y-1">
                                <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">
                                    {profile.full_name}
                                </h1>
                                <div className="flex items-center justify-center md:justify-start gap-2 pt-1">
                                    <div className="flex items-center gap-2 bg-white/5 border border-white/5 px-3 py-1.5 rounded-full backdrop-blur-md">
                                        <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                                        <span className="text-zinc-500 font-black uppercase tracking-[0.2em] text-[10px] leading-none">
                                            Membro desde <span className="text-zinc-300">{profile.created_at ? new Date(profile.created_at).getFullYear() : 2024}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                {trainerData ? (
                                    <Link
                                        href={`/personal/${trainerData.trainer_code || trainerData.id}`}
                                        className="group bg-emerald-500 text-zinc-950 px-8 py-4 rounded-2xl font-black italic uppercase text-xs tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/20 flex items-center gap-3"
                                    >
                                        <div className="w-10 h-10 rounded-full overflow-hidden relative border-2 border-zinc-950/20">
                                            {trainerData.avatar_url ? (
                                                <Image src={trainerData.avatar_url} alt={trainerData.full_name} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-zinc-900 text-[10px] flex items-center justify-center">?</div>
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[8px] opacity-70 leading-none mb-1">Coach Responsável</p>
                                            <p className="leading-tight">{trainerData.full_name}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </Link>
                                ) : (
                                    <div className="bg-emerald-500/10 px-6 py-4 rounded-2xl border border-emerald-500/20 flex items-center gap-3">
                                        <Sparkles className="w-6 h-6 text-emerald-500" />
                                        <div className="text-left">
                                            <p className="text-[10px] font-black uppercase text-emerald-500/60 leading-none mb-1">Módulo</p>
                                            <p className="text-sm font-black uppercase italic text-emerald-500">Auto Treino RepTrail</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-radial from-emerald-500/10 to-transparent opacity-50" />
                </div>

                {/* Heavy Sections (Streamed) */}
                <Suspense fallback={<SectionSkeleton />}>
                    <MetricsAndEvolution studentId={studentId} steroidUse={!!details?.steroid_use} />
                </Suspense>

                <Suspense fallback={<SectionSkeleton />}>
                    <WorkoutHistorySection studentId={studentId} />
                </Suspense>

                <Suspense fallback={<SectionSkeleton />}>
                    <PhotosAndTransformation studentId={studentId} isOwner={isOwner} studentName={profile.full_name} />
                </Suspense>

                {/* Footer */}
                <footer className="mt-20 pt-8 border-t border-zinc-800/50">
                    <div className="text-center space-y-4">
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                                <Zap className="w-4 h-4 text-zinc-950" />
                            </div>
                            <span className="text-sm font-black text-zinc-400 uppercase tracking-widest">RepTrail</span>
                        </div>
                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                            Plataforma de Treino Personalizado
                        </p>
                        <p className="text-[8px] text-zinc-700">
                            © 2026 Todos os direitos reservados
                        </p>
                    </div>
                </footer>
            </div>
        </div >
    )
}

function SectionSkeleton() {
    return (
        <div className="w-full space-y-6 mb-16">
            <Skeleton className="h-8 w-48 bg-zinc-800" />
            <Skeleton className="h-[300px] w-full bg-zinc-900/40 rounded-[2.5rem]" />
        </div>
    )
}
