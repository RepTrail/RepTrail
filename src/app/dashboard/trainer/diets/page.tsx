import { getTrainerDiets } from "@/actions/diet-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Utensils, Calendar, ChevronRight, FileUp, Plus } from "lucide-react"
import Link from "next/link"
import { UnifiedDeleteButton } from "@/components/feature/shared/unified-delete-button"
import { UnifiedAssignDialog } from "@/components/feature/shared/unified-assign-dialog"
import { UnifiedCreationDialog } from "@/components/feature/shared/unified-creation-dialog"
import { getTrainerStudents } from "@/actions/trainer-actions"
import { getBetaTesterMode } from "@/actions/app-settings-actions"
import { DuplicateButton } from "@/components/feature/trainer/duplicate-button"
import { createClient } from "@/lib/supabase/server"

const dayNamesShort = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

export default async function TrainerDietsPage() {
    const [diets, students, betaTesterMode] = await Promise.all([
        getTrainerDiets(),
        getTrainerStudents(),
        getBetaTesterMode()
    ])

    // Fetch assigned days for each diet across all students
    const supabase = await createClient()
    const { data: assignments } = await supabase
        .from('assigned_diets')
        .select('diet_id, days_of_week')
        .eq('active', true)

    const dietDaysMap = (assignments || []).reduce((acc: any, curr: any) => {
        if (!acc[curr.diet_id]) acc[curr.diet_id] = []
        if (curr.days_of_week) acc[curr.diet_id].push(...curr.days_of_week)
        return acc
    }, {})

    return (
        <div className="space-y-6" suppressHydrationWarning>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-zinc-800/50">
                <div className="space-y-2 sm:space-y-5">
                    <h1 className="text-4xl font-black tracking-tight text-white font-sans italic uppercase">
                        Biblioteca de Dietas
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium">
                        Gerencie seus planos alimentares e atribua-os aos seus alunos.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto pb-4">
                    {!betaTesterMode && (
                        <Button asChild className="h-11 px-5 border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/30 hover:border-emerald-500/50 hover:text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border w-full sm:w-auto flex items-center justify-center gap-2">
                            <Link href="/dashboard/trainer/import-pdf">
                                <FileUp className="w-4 h-4" />
                                Importar PDF
                            </Link>
                        </Button>
                    )}
                    <UnifiedCreationDialog
                        title="Novo Modelo de Dieta"
                        description="Crie um template de dieta (Cutting, Bulking, etc) para atribuir aos seus alunos."
                        trigger={
                            <Button className="h-11 px-5 border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/30 hover:border-emerald-500/50 hover:text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border w-full sm:w-auto flex items-center justify-center gap-2 active:scale-95 italic">
                                <Plus className="w-4 h-4" />
                                Criar Manualmente
                            </Button>
                        }
                        fields={[
                            { name: 'name', label: 'Nome da Dieta', placeholder: 'Ex: Dieta para Secar (Low Carb)', required: true }
                        ]}
                        actionType="create-manual-diet"
                        successMessage="Template de dieta criado!"
                        footerLabel="Salvar Template"
                        colorScheme="orange"
                    />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {diets.length > 0 ? (
                    diets.map((diet: any) => {
                        const assignedDays = dietDaysMap[diet.id] || []
                        const uniqueDays = (Array.from(new Set(assignedDays)) as number[]).sort((a, b) => a - b)

                        return (
                            <Card key={diet.id} className="bg-zinc-900/50 border-zinc-800 text-zinc-100 transition-all group rounded-[2rem] overflow-hidden flex flex-col">
                                <CardHeader className="p-6 pb-4">
                                    <div className="flex items-start justify-between">
                                        <div className="bg-zinc-800 p-2 rounded-lg text-zinc-400 group-hover:text-orange-500 transition-colors">
                                            <Utensils className="w-5 h-5 text-orange-500" />
                                        </div>
                                        <div className="flex gap-1">
                                            <DuplicateButton id={diet.id} type="diet" />
                                            <UnifiedDeleteButton
                                                id={diet.id}
                                                actionType="diet"
                                                itemName={diet.name}
                                            />
                                        </div>
                                    </div>
                                    <CardTitle className="mt-4 text-xl font-black italic uppercase tracking-tighter text-white">
                                        {diet.name}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="p-6 pt-0 flex-1 flex flex-col">
                                    {/* Assigned days badges */}
                                    {uniqueDays.length > 0 ? (
                                        <div className="flex flex-wrap gap-1.5 mb-6">
                                            {uniqueDays.map((day) => (
                                                <span key={day} className="flex items-center shrink-0 gap-1 px-2 py-1 bg-orange-500/10 text-orange-400 text-[9px] font-black uppercase rounded-[0.5rem] border border-orange-500/20">
                                                    <Calendar className="w-2.5 h-2.5" />
                                                    {dayNamesShort[day]}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 px-2 py-1 bg-zinc-800 text-zinc-500 text-[9px] font-black uppercase rounded-[0.5rem] mb-6 w-fit">
                                            <Calendar className="w-2.5 h-2.5" />
                                            Não atribuído
                                        </div>
                                    )}

                                    {/* Meal count + date row */}
                                    <div className="flex items-center justify-between text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-6">
                                        <span>{diet.meals?.[0]?.count || 0} Refeições</span>
                                        <span>{new Date(diet.created_at).toLocaleDateString('pt-BR')}</span>
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-zinc-800/50 flex items-center justify-center">
                                        <Button asChild variant="outline" className="w-full h-11 bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-700 flex items-center justify-center gap-1.5 rounded-xl font-black text-[10px] uppercase italic tracking-widest border-white/5 px-6">
                                            <Link href={`/dashboard/trainer/diets/${diet.id}`}>
                                                Editar Dieta
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                ) : (
                    <Card className="col-span-full bg-zinc-900/40 border-dashed border-zinc-800 rounded-[3rem] p-20 text-center">
                        <div className="flex flex-col items-center gap-6">
                            <div className="p-6 bg-zinc-900 rounded-[2rem] text-zinc-700 border border-zinc-800">
                                <Utensils className="w-12 h-12" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">Nenhuma dieta encontrada</h3>
                                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                                    {betaTesterMode ? 'Crie uma nova dieta para começar.' : 'Importe um PDF ou crie uma nova dieta para começar.'}
                                </p>
                            </div>
                            {!betaTesterMode && (
                                <Button asChild className="bg-orange-500 hover:bg-orange-400 text-zinc-950 font-bold rounded-xl">
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
