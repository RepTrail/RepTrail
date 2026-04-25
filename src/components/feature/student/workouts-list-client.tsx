'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { Dumbbell, Calendar, PlayCircle, Clock, ChevronRight, Plus, Edit, Trash2, FileUp } from 'lucide-react'
import { UnifiedCreationDialog } from '@/components/feature/shared/unified-creation-dialog'
import { UnifiedAssignDialog } from '@/components/feature/shared/unified-assign-dialog'
import { DuplicateButton } from '@/components/feature/trainer/duplicate-button'
import { UnifiedDeleteButton } from '@/components/feature/shared/unified-delete-button'
import { WorkoutPreviewDialog } from '@/components/feature/student/workout-preview-dialog'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getAssignedWorkouts, getTrainerWorkouts } from '@/actions/workout-actions'
import { getStudentProfile, getStudentTrainer } from '@/actions/student-actions'
import { cn } from "@/lib/utils"

interface WorkoutsListClientProps {
    userId: string
}

import { useRealtimeSync } from '@/hooks/use-realtime-sync'

export function WorkoutsListClient({ userId }: WorkoutsListClientProps) {
    // 1. Data Fetching via TanStack Query (Hydrated from SSR)
    const { data: profile } = useQuery({
        queryKey: QUERY_KEYS.student.details(userId),
        queryFn: () => getStudentProfile(userId),
        staleTime: 1000 * 60 * 5
    })

    const { data: trainerLink } = useQuery({
        queryKey: QUERY_KEYS.profile.trainer(userId),
        queryFn: () => getStudentTrainer(userId),
        staleTime: 1000 * 60 * 5
    })

    const { data: workouts = [] } = useQuery({
        queryKey: QUERY_KEYS.workouts.all(userId),
        queryFn: () => getAssignedWorkouts(userId),
        staleTime: 1000 * 60 * 5
    })

    const isAutoTrainingActive = profile?.auto_training_status === 'active' || profile?.auto_training_status === 'trial'
    const hasTrainer = !!trainerLink
    const allowManualWorkouts = isAutoTrainingActive && !hasTrainer

    const { data: libraryWorkouts = [] } = useQuery({
        queryKey: QUERY_KEYS.workouts.library(userId),
        queryFn: () => getTrainerWorkouts(),
        enabled: allowManualWorkouts,
        staleTime: 1000 * 60 * 5
    })

    // 2. Realtime Synchronization
    useRealtimeSync({
        table: 'assigned_workouts',
        queryKey: QUERY_KEYS.workouts.all(userId),
        filter: `student_id=eq.${userId}`
    })

    useRealtimeSync({
        table: 'workouts',
        queryKey: QUERY_KEYS.workouts.library(userId),
        filter: `trainer_id=eq.${userId}`
    })

    const workoutDaysMap = workouts.reduce((acc: any, assignment: any) => {
        if (!acc[assignment.workout?.id]) {
            acc[assignment.workout?.id] = []
        }
        if (assignment.day_of_week !== undefined && assignment.day_of_week !== null) {
            acc[assignment.workout?.id].push(assignment.day_of_week)
        }
        return acc
    }, {})

    return (
        <div className="flex flex-col gap-section-gap">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-2">
                <div className="space-y-2 sm:space-y-5">
                    <div className="flex items-center gap-3 pb-4">
                        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                            Meus <span className="text-orange-500">Treinos</span>
                        </h1>
                    </div>
                    {allowManualWorkouts ? (
                        <p className="text-zinc-500 text-sm font-medium max-w-md">
                            Gerencie seus modelos de treino, importe fichas em PDF e organize sua rotina de musculação.
                        </p>
                    ) : (
                        <p className="text-zinc-500 text-sm font-medium max-w-md">
                            Acesse e execute os treinos preparados especialmente para você pelo seu treinador.
                        </p>
                    )}
                </div>

                {allowManualWorkouts && (
                    <div className="flex items-center gap-3 pb-4 w-full sm:w-auto">
                        <Button asChild variant="outline" className="flex-1 sm:flex-none h-12 px-6 bg-zinc-900 border-zinc-700 hover:bg-zinc-800 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-300 transition-all flex items-center justify-center gap-2">
                            <Link href="/dashboard/student/import-pdf">
                                <FileUp className="w-4 h-4 text-orange-500" />
                                Importar PDF
                            </Link>
                        </Button>
                        <UnifiedCreationDialog
                            title="Novo Modelo de Treino"
                            description="Crie um template de treino para agendar para seus auto-treinos."
                            trigger={
                                <Button className="flex-1 sm:flex-none h-12 px-6 bg-orange-500 hover:bg-orange-400 text-zinc-950 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Criar Modelo
                                </Button>
                            }
                            fields={[
                                { name: 'name', label: 'Nome do Treino', placeholder: 'Ex: Hipertrofia A - Peito/Tríceps', required: true },
                                { name: 'description', label: 'Descrição (Opcional)', placeholder: 'Instruções gerais, foco do treino, etc.', type: 'textarea' }
                            ]}
                            actionType="create-manual-workout"
                            successMessage="Modelo de treino criado!"
                            footerLabel="Salvar Template"
                            colorScheme="orange"
                            queryKey={QUERY_KEYS.workouts.library(userId)}
                        />
                    </div>
                )}
            </div>

            {!allowManualWorkouts && (
                workouts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-800">
                        <div className="p-6 bg-zinc-950 rounded-full border border-zinc-800 mb-2">
                            <Dumbbell className="h-10 w-10 text-zinc-700" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-white uppercase italic">Nenhum treino encontrado</h3>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest max-w-[300px]">
                                Seu treinador ainda não atribuiu treinos para sua conta.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {workouts.map((assignment: any) => {
                            const workout = assignment.workout
                            const dayNames = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"]
                            const scheduledDay = assignment.day_of_week !== undefined ? dayNames[assignment.day_of_week] : "Não agendado"

                            return (
                                <Card key={assignment.id} className="bg-zinc-900/40 border-zinc-800/50 hover:border-orange-500/30 transition-all duration-300 shadow-2xl rounded-3xl overflow-hidden group backdrop-blur-sm">
                                    <CardHeader className="p-8 pb-4 space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 group-hover:bg-orange-500/10 group-hover:border-orange-500/20 shadow-2xl transition-all duration-300">
                                                <Dumbbell className="w-8 h-8 text-zinc-700 group-hover:text-orange-500 transition-colors shadow-inner" />
                                            </div>
                                            <div className="bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-2xl flex items-center gap-1.5 shadow-2xl">
                                                <Clock className="w-3.5 h-3.5 text-orange-500" />
                                                <span className="text-[10px] font-black text-white italic uppercase tracking-widest text-orange-500">
                                                    {(() => {
                                                        let totalSeconds = 0;
                                                        const exs = (workout as any).workout_exercises || [];
                                                        exs.forEach((ex: any) => {
                                                            const sets = (ex.warmup_sets || 0) + (ex.feeder_sets || 0) + (ex.working_sets || 0);
                                                            totalSeconds += sets * 120; // 2 min per set
                                                            totalSeconds += (ex.warmup_sets || 0) * (ex.warmup_rest_seconds || 0);
                                                            totalSeconds += (ex.feeder_sets || 0) * (ex.feeder_rest_seconds || 0);
                                                            totalSeconds += (ex.working_sets || 0) * (ex.rest_seconds || 0);
                                                        });
                                                        const mins = Math.max(15, Math.ceil(totalSeconds / 60));
                                                        return `${mins} min`;
                                                    })()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <CardTitle className="text-2xl font-black text-white italic uppercase tracking-tight group-hover:text-orange-500 transition-colors truncate">
                                                {workout.name}
                                            </CardTitle>
                                            <CardDescription className="text-zinc-500 font-black uppercase tracking-[0.2em] text-[9px] line-clamp-2">
                                                {workout.description || 'Ficha oficial preparada pelo seu treinador.'}
                                            </CardDescription>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="px-8 pb-8 space-y-6">
                                        <div className="flex items-center justify-between pt-6 border-t border-zinc-800/50">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-0.5">Programado</span>
                                                <span className="text-xs font-black text-zinc-400 italic">{scheduledDay}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <WorkoutPreviewDialog
                                                    workoutName={workout.name}
                                                    exercises={workout.workout_exercises || []}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                )
            )}

            {/* Library Section */}
            {allowManualWorkouts && (
                <div className="space-y-8">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-6">
                        {libraryWorkouts.length > 0 ? (
                            libraryWorkouts.map((workout: any) => {
                                const assignedDays: number[] = workoutDaysMap[workout.id] || []
                                const dayNamesShort = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

                                return (
                                    <Card key={workout.id} className="bg-zinc-900/50 border-zinc-800 text-zinc-100 hover:border-orange-500/30 transition-all group rounded-3xl overflow-hidden flex flex-col">
                                        <CardHeader className="p-6 pb-4 flex-1">
                                            <div className="flex items-start justify-between">
                                                <div className="bg-zinc-800 p-2 rounded-lg text-zinc-400 group-hover:text-orange-500 transition-colors">
                                                    <Dumbbell className="w-5 h-5" />
                                                </div>
                                                <UnifiedDeleteButton
                                                    id={workout.id}
                                                    actionType="delete-student-workout"
                                                    itemName={workout.name}
                                                    studentId={userId}
                                                    queryKey={QUERY_KEYS.workouts.library(userId)}
                                                />
                                            </div>
                                            <CardTitle className="mt-4 text-lg font-black italic uppercase tracking-tight">{workout.name}</CardTitle>
                                            <CardDescription className="text-zinc-400 text-[12px] leading-relaxed line-clamp-3 mt-2">
                                                {workout.description || "Sem descrição adicionada."}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {assignedDays.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mb-6">
                                                    {(Array.from(new Set(assignedDays)) as number[]).sort((a: number, b: number) => a - b).map((day: number) => (
                                                        <span key={day} className="flex items-center shrink-0 gap-1 px-2 py-1 bg-orange-500/10 text-orange-400 text-[9px] font-black uppercase rounded-[0.5rem] border border-orange-500/20">
                                                            <Calendar className="w-2.5 h-2.5" />
                                                            {dayNamesShort[day]}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between text-sm text-zinc-400 mb-6">
                                                <span className="text-[10px] font-bold uppercase tracking-widest">{workout.workout_exercises?.[0]?.count || 0} Exercícios</span>
                                                <span className="text-[10px] font-bold uppercase tracking-widest">{new Date(workout.created_at).toLocaleDateString('pt-BR')}</span>
                                            </div>

                                            <div className="mt-auto pt-6 border-t border-zinc-800/50 flex items-center gap-2">
                                                <UnifiedAssignDialog
                                                    title="Agendar Treino"
                                                    description="Escolha os dias da semana para este treino."
                                                    itemId={workout.id}
                                                    fixedStudentId={userId}
                                                    type="workout"
                                                    initialDays={Array.from(new Set(assignedDays))}
                                                    trigger={
                                                        <Button
                                                            className="flex-1 min-w-0 h-9 bg-orange-500 hover:bg-orange-400 text-zinc-950 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-1.5 px-6"
                                                        >
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            <span className="truncate">Agendar</span>
                                                        </Button>
                                                    }
                                                    queryKey={QUERY_KEYS.workouts.all(userId)}
                                                />
                                                <Button asChild variant="outline" className="flex-1 min-w-0 h-9 bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-700 flex items-center justify-center gap-1.5 rounded-xl font-black text-[10px] uppercase italic tracking-widest border-white/5 px-6">
                                                    <Link href={`/dashboard/student/workouts/${workout.id}`}>
                                                        <span className="truncate">Editar</span>
                                                    </Link>
                                                </Button>
                                                <DuplicateButton id={workout.id} type="workout" className="h-9 w-9" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })
                        ) : (
                            <div className="col-span-full py-10 text-center border-dashed border border-zinc-800 rounded-3xl">
                                <p className="text-zinc-500 text-[10px] font-bold uppercase">Sua biblioteca está vazia.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
