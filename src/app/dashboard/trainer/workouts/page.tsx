import { getTrainerWorkouts } from "@/actions/workout-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell, UserPlus, ChevronRight } from "lucide-react"
import Link from "next/link"
import { DeleteWorkoutButton } from "@/components/feature/trainer/delete-workout-button"
import { CreateWorkoutDialog } from "@/components/feature/trainer/create-workout-dialog"
import { AssignWorkoutDialog } from "@/components/feature/trainer/assign-workout-dialog"
import { getTrainerStudents } from "@/actions/trainer-actions"
import { getBetaTesterMode } from "@/actions/app-settings-actions"

export default async function TrainerWorkoutsPage() {
    const [workouts, students, betaTesterMode] = await Promise.all([
        getTrainerWorkouts(),
        getTrainerStudents(),
        getBetaTesterMode()
    ])

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-zinc-800/50">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight text-white font-sans italic uppercase">
                        Biblioteca de Treinos
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium">
                        Gerencie seus modelos de treino e atribua-os aos seus alunos.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <CreateWorkoutDialog />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {workouts.length > 0 ? (
                    workouts.map((workout: any) => (
                        <Card key={workout.id} className="bg-zinc-900 border-zinc-800 text-zinc-100 hover:border-zinc-700 transition-colors group">
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                    <div className="bg-zinc-800 p-2 rounded-lg text-zinc-400 group-hover:text-white transition-colors">
                                        <Dumbbell className="w-5 h-5" />
                                    </div>
                                    <div className="flex gap-2">
                                        <DeleteWorkoutButton workoutId={workout.id} />
                                    </div>
                                </div>
                                <CardTitle className="mt-4 text-xl">{workout.name}</CardTitle>
                                <CardDescription className="text-zinc-500 line-clamp-2">
                                    {workout.description || "Nenhuma descrição fornecida."}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between text-sm text-zinc-400 mb-6">
                                    <span>{workout.exercises?.[0]?.count || 0} Exercícios</span>
                                    <span>Criado em {new Date(workout.created_at).toLocaleDateString('pt-BR')}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <AssignWorkoutDialog workoutId={workout.id} students={students} />
                                    <Button asChild size="sm" className="bg-zinc-100 text-zinc-900 hover:bg-white flex items-center justify-center gap-2">
                                        <Link href={`/dashboard/trainer/workouts/${workout.id}`}>
                                            Editar
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="col-span-full bg-zinc-900/50 border-dashed border-zinc-800 p-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="p-4 bg-zinc-900 rounded-full text-zinc-600">
                                <Dumbbell className="w-12 h-12" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-zinc-300">Nenhum treino encontrado</h3>
                                <p className="text-zinc-500 mt-1">{betaTesterMode ? 'Crie um novo treino para começar.' : 'Importe um PDF ou crie um novo treino para começar.'}</p>
                            </div>
                            {!betaTesterMode && (
                                <Button asChild className="bg-zinc-100 text-zinc-900 hover:bg-white">
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
