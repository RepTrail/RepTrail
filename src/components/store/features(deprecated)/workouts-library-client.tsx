'use client'

import { STORE_TOKENS } from '@/components/store/constants/tokens'

import { useQuery } from '@tanstack/react-query'
import { getTrainerWorkouts } from "@/actions/workout-actions"
import { getTrainerStudents } from "@/actions/trainer-actions"
import { getBetaTesterMode } from "@/actions/app-settings-actions"
import { QUERY_KEYS } from '@/lib/query-keys'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dumbbell, FileUp, Plus } from "lucide-react"
import Link from "next/link"
import { PillButton } from "@/components/ui/pill-button"
import { UnifiedLibraryCard } from "@/components/store/features(deprecated)/unified-library-card"
import { UnifiedCreationDialog } from "@/components/store/features(deprecated)/unified-creation-dialog"
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'

interface WorkoutsLibraryClientProps {
    initialWorkouts: any[]
    initialStudents: any[]
    betaTesterMode: boolean
    userId: string
}

export function WorkoutsLibraryClient({
    initialWorkouts,
    initialStudents,
    betaTesterMode,
    userId
}: WorkoutsLibraryClientProps) {
    const { data: workouts = initialWorkouts } = useQuery({
        queryKey: QUERY_KEYS.workouts.library(userId),
        queryFn: () => getTrainerWorkouts(userId),
        staleTime: 0,
        refetchOnMount: 'always'
    })

    return (
        <RegistryMain
            title="BIBLIOTECA DE TREINOS"
            subtitle="Gerencie seus modelos de treino e atribua-os aos seus alunos."
            icon={Dumbbell}
            contextLabel="Área do Personal"
            showTabs={false}
        >
            <Stack gap={10}>
                <div className="flex flex-col md:flex-row md:items-center justify-end gap-6">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                        {!betaTesterMode && (
                            <PillButton asChild variant="orange" className="w-full sm:w-auto">
                                <Link href="/dashboard/trainer/import-pdf">
                                    <FileUp className="w-4 h-4" />
                                    Importar PDF
                                </Link>
                            </PillButton>
                        )}
                        <UnifiedCreationDialog
                            title="Novo Modelo de Treino"
                            description="Crie um template que poderá ser atribuído para vários alunos."
                            trigger={
                                <PillButton variant="emerald" className="w-full sm:w-auto">
                                    <Plus className="w-4 h-4" />
                                    Criar Manualmente
                                </PillButton>
                            }
                            fields={[
                                { name: 'name', label: 'Nome do Treino', placeholder: 'Ex: Hipertrofia A - Peito/Tríceps', required: true },
                                { name: 'description', label: 'Descrição (Opcional)', placeholder: 'Instruções gerais, foco do treino, etc.', type: 'textarea' }
                            ]}
                            actionType="create-manual-workout"
                            successMessage="Template de treino criado!"
                            footerLabel="Salvar Template"
                            colorScheme="emerald"
                        />
                    </div>
                </div>

                <Grid gap={STORE_TOKENS.SPACING.CONTAINER} mdCols={2} lgCols={3}>
                    {workouts.length > 0 ? (
                        workouts.map((workout: any) => (
                            <UnifiedLibraryCard
                                key={workout.id}
                                id={workout.id}
                                name={workout.name}
                                description={workout.description}
                                studentId={userId}
                                queryKey={QUERY_KEYS.workouts.library(userId)}
                                icon={<Dumbbell className="w-5 h-5" />}
                                type="workout"
                                created_at={workout.created_at}
                                assignments={workout.assignments}
                                stats={{
                                    label: 'Exercícios',
                                    value: workout.workout_exercises?.[0]?.count || 0,
                                    icon: <Dumbbell className="w-3 h-3 text-zinc-700" />
                                }}
                                href={`/dashboard/trainer/workouts/${workout.id}`}
                                colorScheme="orange"
                                onEditLabel="Editar Treino"
                            />
                        ))
                    ) : (
                        <div className="col-span-full">
                            <EmptyState
                                icon={Dumbbell}
                                title="Nenhum treino encontrado"
                                description={betaTesterMode ? 'Crie um novo treino para começar.' : 'Importe um PDF ou crie um novo treino para começar.'}
                            />
                        </div>
                    )}
                </Grid>
            </Stack>
        </RegistryMain>
    )
}

