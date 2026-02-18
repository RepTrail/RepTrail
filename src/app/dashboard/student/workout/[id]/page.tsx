
import { createClient } from '@/lib/supabase/server'
import { WorkoutPlayer } from '@/components/feature/player/workout-player'
import { notFound, redirect } from 'next/navigation'
import { Dumbbell } from 'lucide-react'

export default async function WorkoutPlayerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    // 1. Fetch Workout
    const { data: workout } = await supabase
        .from('workouts')
        .select('*')
        .eq('id', id)
        .single()

    if (!workout) {
        return notFound()
    }

    // 2. Fetch Exercises (Joined)
    const { data: exercises } = await supabase
        .from('workout_exercises')
        .select(`
            *,
            exercise:exercises (
                name,
                video_url
            )
        `)
        .eq('workout_id', workout.id)
        .order('order_index', { ascending: true })

    if (!exercises || exercises.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center space-y-4">
                <div className="p-6 bg-zinc-900 rounded-full border border-zinc-800">
                    <Dumbbell className="h-10 w-10 text-zinc-700" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white uppercase italic">Sem exercícios</h3>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest max-w-[300px]">
                        Este treino ainda não possui exercícios cadastrados.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col">
            {/* Header Header */}
            <div className="bg-black/40 backdrop-blur-xl border-b border-zinc-800/50 p-6 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="w-1.5 h-6 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <h1 className="text-xl font-black text-white uppercase italic tracking-tight">{workout.name}</h1>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Em progresso</span>
                </div>
            </div>

            <div className="flex-1 p-4 md:p-8 flex flex-col">
                <div className="max-w-xl mx-auto w-full flex-1">
                    <WorkoutPlayer workout={workout} exercises={exercises} />
                </div>
            </div>
        </div>
    )
}
