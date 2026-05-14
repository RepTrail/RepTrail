'use client'

import { STORE_TOKENS } from '@/components/store/constants/tokens'

import { CardioInfoCard } from '@/components/store/features(deprecated)/cardio-info-card'
import { Flame, Activity, History, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { UnifiedCreationDialog } from '@/components/store/features(deprecated)/unified-creation-dialog'
import { DuplicateButton } from '@/components/store/features(deprecated)/duplicate-button'
import { UnifiedAssignDialog } from '@/components/store/features(deprecated)/unified-assign-dialog'
import { UnifiedDeleteButton } from '@/components/store/features(deprecated)/unified-delete-button'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getStudentCardioAssignments, getCardioLibrary } from '@/actions/cardio-actions'
import { getStudentProfile, getStudentTrainer } from '@/actions/student-actions'
import { cn } from "@/lib/utils"
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { useRealtimeSync } from '@/hooks/use-realtime-sync'

interface CardioPageClientProps {
    userId: string
}

export function CardioPageClient({ userId }: CardioPageClientProps) {
    // 1. Data Fetching via TanStack Query (Hydrated)
    const { data: profile } = useQuery({
        queryKey: QUERY_KEYS.student.details(userId),
        queryFn: () => getStudentProfile(userId),
        staleTime: 1000 * 60 * 5
    })

    const { data: trainerRel } = useQuery({
        queryKey: QUERY_KEYS.profile.trainer(userId),
        queryFn: () => getStudentTrainer(userId),
        staleTime: 1000 * 60 * 5
    })

    const { data: assignments = [] } = useQuery({
        queryKey: QUERY_KEYS.cardio.all(userId),
        queryFn: () => getStudentCardioAssignments(userId),
        staleTime: 1000 * 60 * 5
    })

    // 2. Realtime Synchronization
    useRealtimeSync({
        table: 'assigned_cardios',
        queryKey: QUERY_KEYS.cardio.all(userId),
        filter: `student_id=eq.${userId}`
    })

    const isAutoTrainingActive = profile?.auto_training_status === 'active' || profile?.auto_training_status === 'trial'

    const { data: cardios = [] } = useQuery({
        queryKey: QUERY_KEYS.cardio.library(userId),
        queryFn: () => getCardioLibrary(userId),
        enabled: isAutoTrainingActive,
        staleTime: 1000 * 60 * 5
    })

    // Create a map of cardioId to assigned days
    const cardioDaysMap = assignments.reduce((acc: any, assignment: any) => {
        if (!acc[assignment.cardio_id]) {
            acc[assignment.cardio_id] = []
        }
        if (assignment.days_of_week && Array.isArray(assignment.days_of_week) && assignment.days_of_week.length > 0) {
            acc[assignment.cardio_id].push(...assignment.days_of_week)
        } else if (assignment.day_of_week !== undefined && assignment.day_of_week !== null) {
            acc[assignment.cardio_id].push(assignment.day_of_week)
        }
        return acc
    }, {})

    return (
        <Stack gap={10}>
            {isAutoTrainingActive && !trainerRel && (
                <div className="flex items-center justify-end gap-3 w-full">
                    <UnifiedCreationDialog
                        title="Novo Modelo de Cardio"
                        description="Crie um template (ex: Esteira 45min) para agendar para seus auto-treinos."
                        trigger={
                            <Button className="h-12 px-6 bg-orange-500 hover:bg-orange-400 text-zinc-950 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2">
                                <Activity className="w-4 h-4" />
                                Criar Modelo
                            </Button>
                        }
                        fields={[
                            { name: 'name', label: 'Nome do Cardio', placeholder: 'Ex: Corrida na Esteira', required: true },
                            { name: 'duration_minutes', label: 'Duração (min)', placeholder: '30', type: 'number', required: true },
                            {
                                name: 'suggested_intensity', label: 'Intensidade Sugerida', type: 'select', defaultValue: 'Moderada', options: [
                                    { label: 'Leve', value: 'Leve', color: '#10b981' },
                                    { label: 'Moderada', value: 'Moderada', color: '#f59e0b' },
                                    { label: 'Alta', value: 'Alta', color: '#ef4444' },
                                    { label: 'Máxima', value: 'Máxima', color: '#a855f7' }
                                ], required: true
                            },
                            { name: 'description', label: 'Descrição (Opcional)', placeholder: 'Ex: 45 minutos em ritmo moderado', type: 'textarea' }
                        ]}
                        actionType="create-student-cardio"
                        successMessage="Modelo de cardio criado com sucesso!"
                        colorScheme="orange"
                        queryKey={QUERY_KEYS.cardio.library(userId)}
                    />
                </div>
            )}

            <Grid gap={10} lgCols={12}>
                <div className="lg:col-span-8 space-y-10">
                    {trainerRel ? (
                        <div className="space-y-8">
                            <div className="px-2">
                                <h2 className="text-[12px] font-black text-zinc-100 flex items-center gap-2 uppercase tracking-[0.2em]">
                                    <Activity className="w-4 h-4 text-orange-500" />
                                    Sessões Pendentes
                                </h2>
                            </div>
                            {assignments.length > 0 ? (
                                <div className="space-y-6">
                                    {(() => {
                                        const grouped = assignments.reduce((acc: any, curr: any) => {
                                            const key = curr.cardio_id || curr.id;
                                            if (!acc[key]) {
                                                acc[key] = { ...curr, days_of_week: [] };
                                            }
                                            if (curr.day_of_week !== null && curr.day_of_week !== undefined) {
                                                if (!acc[key].days_of_week.includes(curr.day_of_week)) {
                                                    acc[key].days_of_week.push(curr.day_of_week);
                                                }
                                            }
                                            if (curr.days_of_week && Array.isArray(curr.days_of_week)) {
                                                curr.days_of_week.forEach((d: number) => {
                                                    if (!acc[key].days_of_week.includes(d)) {
                                                        acc[key].days_of_week.push(d);
                                                    }
                                                });
                                            }
                                            return acc;
                                        }, {});

                                        return Object.values(grouped).map((assignment: any) => (
                                            <CardioInfoCard key={assignment.id} assignment={assignment} />
                                        ));
                                    })()}
                                </div>
                            ) : (
                                <EmptyState
                                    icon={Activity}
                                    title="Nenhum cardio prescrito"
                                    description="Seu personal ainda não enviou protocolos aeróbicos."
                                />
                            )}
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <Grid gap={STORE_TOKENS.SPACING.CONTAINER} mdCols={2}>
                                {isAutoTrainingActive && (
                                    <>
                                        {cardios.length > 0 ? (
                                            cardios.map((cardio: any) => {
                                                const assignedDays = cardioDaysMap[cardio.id] || []
                                                const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

                                                return (
                                                    <Card key={cardio.id} className="bg-zinc-900/50 border-zinc-800 text-zinc-100 hover:border-orange-500/30 transition-all group rounded-3xl overflow-hidden">
                                                        <CardHeader className="pb-2">
                                                            <div className="flex items-start justify-between">
                                                                <div className="bg-zinc-800 p-2 rounded-lg text-zinc-400 group-hover:text-orange-500 transition-colors">
                                                                    <Activity className="w-5 h-5" />
                                                                </div>
                                                                <UnifiedDeleteButton
                                                                    id={cardio.id}
                                                                    actionType="delete-student-cardio"
                                                                    itemName={cardio.name}
                                                                    studentId={userId}
                                                                    className="text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                                                                    queryKey={QUERY_KEYS.cardio.library(userId)}
                                                                />
                                                            </div>
                                                            <CardTitle className="mt-4 text-lg font-black italic uppercase tracking-tight">{cardio.name}</CardTitle>
                                                            <CardDescription className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest line-clamp-2">
                                                                {cardio.description || "Sem descrição."}
                                                            </CardDescription>
                                                        </CardHeader>
                                                        <CardContent>
                                                            {assignedDays.length > 0 && (
                                                                <div className="flex flex-wrap gap-1.5 mb-6">
                                                                    {(Array.from(new Set(assignedDays)) as number[]).sort((a: number, b: number) => {
                                                                        const valA = a === 0 ? 7 : a;
                                                                        const valB = b === 0 ? 7 : b;
                                                                        return valA - valB;
                                                                    }).map((day: number) => (
                                                                        <span key={day} className="flex items-center shrink-0 gap-1 px-2 py-1 bg-orange-500/10 text-orange-400 text-[9px] font-black uppercase rounded-[0.5rem] border border-orange-500/20">
                                                                            <Calendar className="w-2.5 h-2.5" />
                                                                            {dayNames[day % 7]}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            <div className="mt-auto pt-6 border-t border-zinc-800/50 flex items-center gap-2">
                                                                <UnifiedAssignDialog
                                                                    title="Agendar Cardio"
                                                                    description="Escolha os dias da semana para este protocolo."
                                                                    itemId={cardio.id}
                                                                    fixedStudentId={userId}
                                                                    type="cardio"
                                                                    initialDays={Array.from(new Set(assignedDays))}
                                                                    trigger={
                                                                        <Button className="flex-1 min-w-0 h-9 bg-orange-500 hover:bg-orange-400 text-zinc-950 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-1.5 px-6">
                                                                            <Calendar className="w-3.5 h-3.5" />
                                                                            <span className="truncate">Agendar</span>
                                                                        </Button>
                                                                    }
                                                                    queryKey={QUERY_KEYS.cardio.all(userId)}
                                                                />
                                                                <Button asChild variant="outline" className="flex-1 min-w-0 h-9 bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-700 flex items-center justify-center gap-1.5 rounded-xl font-black text-[10px] uppercase italic tracking-widest border-white/5 px-6">
                                                                    <Link href={`/dashboard/student/cardio/${cardio.id}`}>
                                                                        <span className="truncate">Editar</span>
                                                                    </Link>
                                                                </Button>
                                                                <DuplicateButton id={cardio.id} type="cardio" className="h-9 w-9" />
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                )
                                            })
                                        ) : (
                                            <div className="col-span-full">
                                                <EmptyState
                                                    icon={Activity}
                                                    title="Biblioteca Vazia"
                                                    description="Crie modelos de cardio para agendar sua rotina."
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                            </Grid>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-4 space-y-10">
                    <div className="space-y-6">
                        <h2 className="text-[12px] font-black text-zinc-100 flex items-center gap-2 uppercase tracking-[0.2em] px-2">
                            <History className="w-4 h-4 text-emerald-500" />
                            Dicas de Cardio
                        </h2>
                        <Card className="bg-zinc-900/40 border-zinc-800/50 rounded-3xl p-6 sm:p-10 backdrop-blur-sm shadow-xl">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Intensidade</p>
                                    <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                                        Mantenha uma frequência cardíaca constante para maximizar a queima de gordura.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Hidratação</p>
                                    <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                                        Beber água durante o cardio ajuda a manter a temperatura corporal e a performance.
                                    </p>
                                </div>
                                <div className="space-y-2 pt-4 border-t border-zinc-800">
                                    <div className="flex items-center gap-2">
                                        <Flame className="w-4 h-4 text-orange-500" />
                                        <span className="text-[10px] font-black text-white uppercase italic">Metabolismo em Alta</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </Grid>
        </Stack>
    )
}

