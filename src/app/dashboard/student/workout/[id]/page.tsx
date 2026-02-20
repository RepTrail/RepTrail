
import { createClient } from '@/lib/supabase/server'
import { WorkoutPlayer } from '@/components/feature/player/workout-player'
import { notFound, redirect } from 'next/navigation'
import { Dumbbell, Trophy } from 'lucide-react'
import { getTodayRangeBrazil } from '@/lib/date-utils'
import { MissionCompletedView } from '@/components/feature/student/mission-completed'

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

    // 3. Check for Completed Workout Today
    const { start: todayStart, end: todayEnd } = getTodayRangeBrazil()

    // Check if ALREADY COMPLETED today
    const { data: completedLog } = await supabase
        .from('workout_logs')
        .select('id')
        .eq('workout_id', workout.id)
        .eq('student_id', user.id)
        .eq('status', 'completed')
        .gte('completed_at', todayStart) // Use completed_at for completion check
        .lte('completed_at', todayEnd)
        .maybeSingle()

    if (completedLog) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
                <MissionCompletedView />
            </div>
        )
    }

    // 4. Check for In-Progress Workout (Resume)
    const { data: inProgressLog } = await supabase
        .from('workout_logs')
        .select('id')
        .eq('workout_id', workout.id) // Specific workout
        .eq('student_id', user.id)
        .eq('status', 'in_progress')
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle()

    let initialExerciseIndex = 0
    let initialLogId: string | undefined = undefined

    if (inProgressLog) {
        initialLogId = inProgressLog.id
        // Find last exercise with activity
        const { data: lastLoad } = await supabase
            .from('load_history')
            .select('exercise_id')
            .eq('workout_log_id', inProgressLog.id)
            .order('recorded_at', { ascending: false })
            .limit(1)
            .maybeSingle()

        if (lastLoad) {
            // Find index of this exercise in current workout list
            // exercises is array of workout_exercise joined with exercise
            // Each item has exercise_id (UUID of actual exercise) or id (workout_exercise id)?
            // The table is workout_exercises. columns: workout_id, exercise_id
            const idx = exercises.findIndex((e: any) => e.exercise_id === lastLoad.exercise_id)
            if (idx !== -1) {
                initialExerciseIndex = idx
            }
        }
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
                    <WorkoutPlayer
                        workout={workout}
                        exercises={exercises}
                        initialExerciseIndex={initialExerciseIndex}
                        initialLogId={initialLogId}
                    />
                </div>
            </div>
        </div>
    )
}
