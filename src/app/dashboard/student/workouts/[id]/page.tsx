import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dumbbell, Clock, ArrowLeft, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function StudentWorkoutPage({
    params,
}: {
    params: { id: string }
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return notFound()

    // Verify auto-training is active
    const { data: profile } = await supabase
        .from('profiles')
        .select('auto_training_status')
        .eq('id', user.id)
        .single()

    const isAutoTrainingActive = profile?.auto_training_status === 'active' || profile?.auto_training_status === 'trial'
    if (!isAutoTrainingActive) return notFound()

    // Get workout details with exercises
    const { data: workout } = await supabase
        .from('workouts')
        .select(`
            *,
            exercises:workout_exercises(
                *,
                exercise:exercises(name)
            )
        `)
        .eq('id', params.id)
        .eq('trainer_id', user.id)
        .single()

    if (!workout) return notFound()

    // Sort exercises by order_index
    if (workout.exercises) {
        workout.exercises.sort((a: any, b: any) => a.order_index - b.order_index)
    }

    const dayNames = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"]
    const assignment = await supabase
        .from('assigned_workouts')
        .select('day_of_week')
        .eq('workout_id', params.id)
        .eq('student_id', user.id)
        .eq('active', true)
        .maybeSingle()

    const scheduledDay = assignment?.data?.day_of_week !== undefined ? dayNames[assignment.data.day_of_week] : "Não agendado"

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/student/workouts">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                        {workout.name}
                    </h1>
                </div>
                <div className="flex gap-2">
                    {isAutoTrainingActive && (
                        <>
                            <Button asChild variant="outline" size="sm">
                                <Link href={`/dashboard/student/workouts/${workout.id}/edit`} className="flex items-center gap-1">
                                    <Edit className="w-3 h-3" />
                                    Editar
                                </Link>
                            </Button>
                            <form action={`/api/student/workouts/${workout.id}/delete`} method="POST">
                                <Button type="submit" variant="outline" size="sm" className="border-red-900 text-red-400 hover:text-red-300 hover:bg-red-500/10">
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </form>
                        </>
                    )}
                </div>
            </div>

            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                {scheduledDay}
            </div>

            {workout.description && (
                <p className="text-zinc-400 text-sm">{workout.description}</p>
            )}

            <div className="space-y-4">
                {workout.exercises?.map((exercise: any, index: number) => (
                    <Card key={exercise.id} className="bg-zinc-900 border-zinc-800">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-2">
                                        {exercise.exercise?.name || 'Exercício'}
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <span className="text-zinc-500">Séries:</span>
                                            <span className="text-white ml-2">{exercise.working_sets}</span>
                                        </div>
                                        <div>
                                            <span className="text-zinc-500">Reps:</span>
                                            <span className="text-white ml-2">{exercise.reps}</span>
                                        </div>
                                        <div>
                                            <span className="text-zinc-500">Descanso:</span>
                                            <span className="text-white ml-2">{exercise.rest_seconds}s</span>
                                        </div>
                                        <div>
                                            <span className="text-zinc-500">Carga:</span>
                                            <span className="text-white ml-2">-</span>
                                        </div>
                                    </div>
                                    {(exercise.warmup_sets > 0 || exercise.feeder_sets > 0) && (
                                        <div className="mt-3 pt-3 border-t border-zinc-800">
                                            <div className="text-xs text-zinc-500 space-y-1">
                                                {exercise.warmup_sets > 0 && (
                                                    <div>Aquecimento: {exercise.warmup_sets} x {exercise.warmup_reps}</div>
                                                )}
                                                {exercise.feeder_sets > 0 && (
                                                    <div>Feeder: {exercise.feeder_sets} x {exercise.feeder_reps}</div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {exercise.notes && (
                                        <div className="mt-3 pt-3 border-t border-zinc-800">
                                            <p className="text-xs text-zinc-400 italic">{exercise.notes}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                                        #{index + 1}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
