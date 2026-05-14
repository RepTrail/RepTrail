'use client';
import { Utensils, Flame, ChevronRight, Edit, Dumbbell, Calendar, Clock, Plus, FileUp } from "lucide-react"
import { getStudentDailyDiet, getTrainerDiets } from '@/actions/diet-actions'
import { DietAdherence } from './student-diet-adherence'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { UnifiedCreationDialog } from '@/components/store/features(deprecated)/unified-creation-dialog'
import { UnifiedDeleteButton } from '@/components/store/features(deprecated)/unified-delete-button'
import { DietCardActions } from './student-diet-card-actions'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getAssignedDiets } from '@/actions/diet-actions'
import { getStudentProfile, getStudentTrainer } from '@/actions/student-actions'
import { cn } from "@/lib/utils"
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'

interface DietPageClientProps {
    userId: string
}

import { useRealtimeSync } from '@/hooks/use-realtime-sync'

import { STORE_TOKENS } from "../constants/tokens";

export function DietPageClient({ userId }: DietPageClientProps) {
    // 1. Fetching via TanStack Query
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

    const { data: studentDailyDiet } = useQuery({
        queryKey: QUERY_KEYS.diets.today(userId),
        queryFn: () => getStudentDailyDiet(userId),
        staleTime: 1000 * 60 * 5
    })

    const { data: assignments = [] } = useQuery({
        queryKey: QUERY_KEYS.diets.all(userId),
        queryFn: () => getAssignedDiets(userId),
        staleTime: 1000 * 60 * 5
    })

    // 2. Realtime Synchronization
    useRealtimeSync({
        table: 'assigned_diets',
        queryKey: QUERY_KEYS.diets.all(userId),
        filter: `student_id=eq.${userId}`
    })

    const isAutoTrainingActive = profile?.auto_training_status === 'active' || profile?.auto_training_status === 'trial'
    const hasTrainer = !!trainerLink
    const dayNamesShort = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

    const { data: diets = [] } = useQuery({
        queryKey: QUERY_KEYS.diets.library(userId),
        queryFn: () => getTrainerDiets(userId),
        enabled: isAutoTrainingActive,
        staleTime: 1000 * 60 * 5
    })

    const dietDaysMap = (assignments || []).reduce((acc: any, curr: any) => {
        const dietId = curr.diet_id || curr.diet?.id
        if (!dietId) return acc
        if (!acc[dietId]) acc[dietId] = []
        if (curr.days_of_week) {
            const days = Array.isArray(curr.days_of_week) ? curr.days_of_week : []
            acc[dietId].push(...days)
        }
        return acc
    }, {})

    return (
        <Stack gap={STORE_TOKENS.SPACING.EMPTY_STATE}>
            {isAutoTrainingActive && !hasTrainer && (
                <div className="flex items-center justify-end gap-3 w-full">
                    <Button asChild variant="outline" className="h-11 px-6 bg-zinc-900 border-zinc-800 text-zinc-100 hover:bg-zinc-800 hover:text-white rounded-system text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 border-white/5">
                        <Link href="/dashboard/student/import-pdf">
                            <FileUp className="w-4 h-4" />
                            Importar PDF
                        </Link>
                    </Button>
                    <UnifiedCreationDialog
                        title="Nova Dieta"
                        description="Crie um plano alimentar (modelo) para agendar para seus auto-treinos."
                        trigger={
                            <Button className="h-11 px-6 bg-orange-500 hover:bg-orange-400 text-zinc-950 rounded-system text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2">
                                <Utensils className="w-4 h-4" />
                                Criar Modelo
                            </Button>
                        }
                        fields={[
                            { name: 'name', label: 'Nome da Dieta', placeholder: 'Ex: Dieta Cutting 2000kcal', required: true },
                            { name: 'description', label: 'Descrição (Opcional)', placeholder: 'Instruções gerais sobre o plano...', type: 'textarea' }
                        ]}
                        actionType="create-manual-diet"
                        successMessage="Modelo de dieta criado com sucesso!"
                        footerLabel="Salvar Template"
                        colorScheme="orange"
                        queryKey={QUERY_KEYS.diets.library(userId)}
                    />
                </div>
            )}
            {/* Daily Protocol Section */}
            {studentDailyDiet ? (
                <div className="w-full">
                    <DietAdherence diet={studentDailyDiet} allowEstimation={hasTrainer} hasTrainer={hasTrainer} queryKey={QUERY_KEYS.diets.today(userId)} />
                </div>
            ) : !isAutoTrainingActive && (
                <EmptyState
                    icon={Utensils}
                    title="Nenhuma dieta encontrada"
                    description="Seu treinador ainda não atribuiu um plano alimentar para você."
                />
            )}
            {/* Library Section */}
            {isAutoTrainingActive && !hasTrainer && (
                <div className="space-y-8">
                    <Grid gap={STORE_TOKENS.SPACING.CONTAINER} mdCols={2} lgCols={3} className="pt-6 border-t border-zinc-900/50">
                        {diets.length > 0 ? (
                            diets.map((currentDiet: any) => {
                                const assignedDays = dietDaysMap[currentDiet.id] || []

                                return (
                                    <Card key={currentDiet.id} className="bg-zinc-900/50 border-zinc-800 text-zinc-100 hover:border-orange-500/30 transition-all group rounded-system overflow-hidden flex flex-col">
                                        <CardHeader className="p-6 pb-4">
                                            <div className="flex items-start justify-between">
                                                <div className="bg-zinc-800 p-2 rounded-system text-zinc-400 group-hover:text-orange-500 transition-colors">
                                                    <Utensils className="w-5 h-5 text-orange-500" />
                                                </div>
                                                <UnifiedDeleteButton
                                                    id={currentDiet.id}
                                                    actionType="delete-student-diet"
                                                    itemName={currentDiet.name}
                                                    studentId={userId}
                                                    queryKey={QUERY_KEYS.diets.library(userId)}
                                                />
                                            </div>
                                            <CardTitle className="mt-4 text-xl font-black italic uppercase tracking-tighter text-white">{currentDiet.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6 pt-0 flex-1 flex flex-col">
                                            {assignedDays.length > 0 ? (
                                                <div className="flex flex-wrap gap-1.5 mb-6">
                                                    {(Array.from(new Set(assignedDays)) as number[]).sort((a: number, b: number) => {
                                                        const valA = a === 0 ? 7 : a;
                                                        const valB = b === 0 ? 7 : b;
                                                        return valA - valB;
                                                    }).map((day: number) => (
                                                        <span key={day} className="flex items-center shrink-0 gap-1 px-2 py-1 bg-orange-500/10 text-orange-400 text-[9px] font-black uppercase rounded-system border border-orange-500/20">
                                                            <Calendar className="w-2.5 h-2.5" />
                                                            {dayNamesShort[day % 7]}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 px-2 py-1 bg-zinc-800 text-zinc-500 text-[9px] font-black uppercase rounded-system mb-6">
                                                    <Calendar className="w-2.5 h-2.5" />
                                                    Não agendado
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-6">
                                                <span>{currentDiet.meals?.[0]?.count || 0} Refeições</span>
                                                <span>{currentDiet.created_at ? new Date(currentDiet.created_at).toLocaleDateString('pt-BR') : '-'}</span>
                                            </div>

                                            <DietCardActions
                                                dietId={currentDiet.id}
                                                userId={userId}
                                                assignedDays={Array.from(new Set(assignedDays))}
                                                queryKey={QUERY_KEYS.diets.all(userId)}
                                            />
                                        </CardContent>
                                    </Card>
                                )
                            })
                        ) : (
                            <div className="col-span-full">
                                <EmptyState
                                    icon={Utensils}
                                    title="Biblioteca Vazia"
                                    description="Sua biblioteca de dietas está vazia."
                                />
                            </div>
                        )}
                    </Grid>
                </div>
            )}
            <div className="p-8 bg-zinc-900/40 backdrop-blur-sm rounded-system border border-zinc-800/50 text-center space-y-4 shadow-2xl">
                <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                        <Flame className="w-4 h-4 text-orange-500" />
                        Hidratação é chave
                    </div>
                </div>
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-[0.2em] max-w-md mx-auto">
                    Beba pelo menos 3L de água hoje para manter o metabolismo acelerado!
                </p>
            </div>
        </Stack>
    );
}



