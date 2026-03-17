import { getTrainerWorkouts } from "@/actions/workout-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell, Calendar, ChevronRight, FileUp, Plus } from "lucide-react"
import Link from "next/link"
import { UnifiedDeleteButton } from "@/components/feature/shared/unified-delete-button"
import { UnifiedAssignDialog } from "@/components/feature/shared/unified-assign-dialog"
import { UnifiedCreationDialog } from "@/components/feature/shared/unified-creation-dialog"
import { getTrainerStudents } from "@/actions/trainer-actions"
import { getBetaTesterMode } from "@/actions/app-settings-actions"
import { DuplicateButton } from "@/components/feature/trainer/duplicate-button"

export default async function TrainerWorkoutsPage() {
    const [workouts, students, betaTesterMode] = await Promise.all([
        getTrainerWorkouts(),
        getTrainerStudents(),
        getBetaTesterMode()
    ])

    return (
        <div className="space-y-6" suppressHydrationWarning>
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
                        <Button asChild variant="outline" className="h-11 px-5 border-orange-500/20 bg-orange-500/10 text-orange-500 hover:bg-orange-500/30 hover:border-orange-500/50 hover:text-orange-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all w-full sm:w-auto flex items-center justify-center gap-2 shadow-lg shadow-orange-500/10">
                            <Link href="/dashboard/trainer/import-pdf">
                                <FileUp className="w-4 h-4" />
                                Importar PDF
                            </Link>
                        </Button>
                    )}
                    <UnifiedCreationDialog
                        title="Novo Modelo de Treino"
                        description="Crie um template que poderá ser atribuído para vários alunos."
                        trigger={
                            <Button variant="outline" className="h-11 px-5 border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/30 hover:border-emerald-500/50 hover:text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all w-full sm:w-auto flex items-center justify-center gap-2 active:scale-95 italic shadow-lg shadow-emerald-500/10">
                                <Plus className="w-4 h-4" />
                                Criar Manualmente
                            </Button>
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
                        <Card key={workout.id} className="bg-zinc-900/50 border-zinc-800 text-zinc-100 transition-all group rounded-[2rem] overflow-hidden flex flex-col">
                            <CardHeader className="p-6 pb-4 flex-1">
                                <div className="flex items-start justify-between">
                                    <div className="bg-zinc-800 p-2 rounded-lg text-zinc-400 group-hover:text-orange-500 transition-colors">
                                        <Dumbbell className="w-5 h-5" />
                                    </div>
                                    <div className="flex gap-1">
                                        <DuplicateButton id={workout.id} type="workout" />
                                        <UnifiedDeleteButton
                                            id={workout.id}
                                            actionType="workout"
                                            itemName={workout.name}
                                        />
                                    </div>
                                </div>
                                <CardTitle className="mt-4 text-lg font-black italic uppercase tracking-tight">
                                    {workout.name}
                                </CardTitle>
                                <CardDescription className="text-zinc-400 text-[12px] leading-relaxed line-clamp-3 mt-2">
                                    {workout.description || "Sem descrição adicionada."}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 pt-0">
                                <div className="flex items-center justify-between text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-6">
                                    <span>{workout.exercises?.[0]?.count || 0} Exercícios</span>
                                    <span>{new Date(workout.created_at).toLocaleDateString('pt-BR')}</span>
                                </div>

                                <div className="mt-auto pt-6 border-t border-zinc-800/50 flex items-center justify-center">
                                        <Button asChild variant="outline" className="w-full h-11 bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-700 flex items-center justify-center gap-1.5 rounded-xl font-black text-[10px] uppercase italic tracking-widest border-white/5 px-6 shadow-none transition-all active:scale-[0.98]">
                                            <Link href={`/dashboard/trainer/workouts/${workout.id}`}>
                                                Editar Treino
                                            </Link>
                                        </Button>
                                </div>
                            </CardContent>
                        </Card>
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
