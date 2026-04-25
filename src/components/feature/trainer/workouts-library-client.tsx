'use client'

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
import { UnifiedLibraryCard } from "@/components/feature/shared/unified-library-card"
import { UnifiedCreationDialog } from "@/components/feature/shared/unified-creation-dialog"

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
        queryFn: () => getTrainerWorkouts(),
        staleTime: 0,
        refetchOnMount: 'always'
    })

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-zinc-800/50">
                <div className="space-y-2 sm:space-y-5">
                    <h1 className="text-4xl font-black tracking-tight text-white font-sans italic uppercase">
                        Biblioteca de Treinos
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium">
                        Gerencie seus modelos de treino e atribua-os aos seus alunos.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto pb-4">
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

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                    <Card className="col-span-full bg-zinc-900/40 border-dashed border-zinc-800 rounded-[3rem] p-20 text-center">
                        <div className="flex flex-col items-center gap-6">
                            <div className="p-6 bg-zinc-900 rounded-[2rem] text-zinc-700 border border-zinc-800">
                                <Dumbbell className="w-12 h-12" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">Nenhum treino encontrado</h3>
                                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                                    {betaTesterMode ? 'Crie um novo treino para começar.' : 'Importe um PDF ou crie um novo treino para começar.'}
                                </p>
                            </div>
                            {!betaTesterMode && (
                                <Button asChild className="bg-orange-500 hover:bg-orange-400 text-zinc-950 font-bold rounded-xl shadow-lg shadow-orange-500/20">
                                    <Link href="/dashboard/trainer/import-pdf">Importar Primeiro PDF</Link>
                                </Button>
                            )}
                        </div>
                    </Card>
                )}
            </div>
        </div>
    )
}
