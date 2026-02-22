import { getTrainerDiets } from "@/actions/diet-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Utensils, ChevronRight } from "lucide-react"
import Link from "next/link"
import { DeleteDietButton } from "@/components/feature/trainer/delete-diet-button"
import { CreateDietDialog } from "@/components/feature/trainer/create-diet-dialog"
import { AssignDietDialog } from "@/components/feature/trainer/assign-diet-dialog"
import { getTrainerStudents } from "@/actions/trainer-actions"
import { getBetaTesterMode } from "@/actions/app-settings-actions"
import { DuplicateButton } from "@/components/feature/trainer/duplicate-button"

export default async function TrainerDietsPage() {
    const [diets, students, betaTesterMode] = await Promise.all([
        getTrainerDiets(),
        getTrainerStudents(),
        getBetaTesterMode()
    ])

    return (
        <div className="space-y-6" suppressHydrationWarning>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-zinc-800/50">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight text-white font-sans italic uppercase">
                        Biblioteca de Dietas
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium">
                        Gerencie seus planos alimentares e atribua-os aos seus alunos.
                    </p>
                </div>
                <CreateDietDialog />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {diets.length > 0 ? (
                    diets.map((diet: any) => (
                        <Card key={diet.id} className="bg-zinc-900 border-zinc-800 text-zinc-100 hover:border-zinc-700 transition-colors group">
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                    <div className="bg-zinc-800 p-2 rounded-lg text-zinc-400 group-hover:text-white transition-colors">
                                        <Utensils className="w-5 h-5" />
                                    </div>
                                    <div className="flex gap-2">
                                        <DuplicateButton id={diet.id} type="diet" />
                                        <DeleteDietButton dietId={diet.id} />
                                    </div>
                                </div>
                                <CardTitle className="mt-4 text-xl">{diet.name}</CardTitle>
                                <CardDescription className="text-zinc-500">
                                    Plano alimentar completo.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between text-sm text-zinc-400 mb-6">
                                    <span>{diet.meals?.[0]?.count || 0} Refeições</span>
                                    <span>Criado em {new Date(diet.created_at).toLocaleDateString('pt-BR')}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <AssignDietDialog dietId={diet.id} students={students} />
                                    <Button asChild size="sm" className="bg-zinc-100 text-zinc-900 hover:bg-white flex items-center justify-center gap-2">
                                        <Link href={`/dashboard/trainer/diets/${diet.id}`}>
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
                                <Utensils className="w-12 h-12" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-zinc-300">Nenhuma dieta encontrada</h3>
                                <p className="text-zinc-500 mt-1">{betaTesterMode ? 'Crie uma nova dieta para começar.' : 'Importe um PDF ou crie uma nova dieta para começar.'}</p>
                            </div>
                            {!betaTesterMode && (
                                <Button asChild className="bg-zinc-100 text-zinc-900 hover:bg-white">
                                    <Link href="/dashboard/trainer/import-pdf">Importar Primeira Dieta</Link>
                                </Button>
                            )}
                        </div>
                    </Card>
                )}
            </div>
        </div>
    )
}
