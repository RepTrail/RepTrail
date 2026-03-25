import { Utensils, Flame, ChevronRight, Edit, Dumbbell, Calendar, Clock, Plus, FileUp } from "lucide-react"
import { createClient } from '@/lib/supabase/server'
import { getStudentDailyDiet, getTrainerDiets } from '@/actions/diet-actions'
import { DietAdherence } from '@/components/feature/student/diet-adherence'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { UnifiedCreationDialog } from '@/components/feature/shared/unified-creation-dialog'
import { UnifiedDeleteButton } from '@/components/feature/shared/unified-delete-button'
import { ensureDailyTracking } from '@/actions/tracking-actions'
import { DietCardActions } from '@/components/feature/student/diet-card-actions'
import { cn } from "@/lib/utils"


export default async function StudentDietPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Ensure tracking is initialized for today
    await ensureDailyTracking(user.id)

    const { data: trainerRel } = await supabase
        .from('trainer_students')
        .select('trainer_id')
        .eq('student_id', user.id)
        .eq('active', true)
        .maybeSingle()

    const { data: profile } = await supabase
        .from('profiles')
        .select('auto_training_status')
        .eq('id', user.id)
        .single()

    const isAutoTrainingActive = profile?.auto_training_status === 'active' || profile?.auto_training_status === 'trial'
    const hasTrainer = !!trainerRel
    const studentDailyDiet = await getStudentDailyDiet(user.id)
    const dayNamesShort = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

    const diets = isAutoTrainingActive ? await getTrainerDiets() : []

    const { data: assignments } = await supabase
        .from('assigned_diets')
        .select('diet_id, days_of_week')
        .eq('student_id', user.id)
        .eq('active', true)

    const dietDaysMap = (assignments || []).reduce((acc: any, curr: any) => {
        if (!acc[curr.diet_id]) acc[curr.diet_id] = []
        if (curr.days_of_week) acc[curr.diet_id].push(...curr.days_of_week)
        return acc
    }, {})

    if (isAutoTrainingActive && !hasTrainer) {

        return (
            <div className="max-w-7xl mx-auto flex flex-col gap-section-gap" suppressHydrationWarning>
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                    <div className="space-y-2 sm:space-y-5">
                        <div className="flex items-center gap-3 pb-4">
                            <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                                Minha <span className="text-orange-500">Dieta</span>
                            </h1>
                        </div>
                        <p className="text-zinc-500 text-sm font-medium max-w-md">
                            Gerencie seus modelos de dieta, organize suas refeições e agende seus planos alimentares.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 pb-4w-full sm:w-auto">
                        <Button asChild variant="outline" className="flex-1 sm:flex-none h-11 px-6 bg-zinc-900 border-zinc-800 text-zinc-100 hover:bg-zinc-800 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 border-white/5">
                            <Link href="/dashboard/student/import-pdf">
                                <FileUp className="w-4 h-4" />
                                Importar PDF
                            </Link>
                        </Button>
                        <UnifiedCreationDialog
                            title="Nova Dieta"
                            description="Crie um plano alimentar (modelo) para agendar para seus auto-treinos."
                            trigger={
                                <Button className="flex-1 sm:flex-none h-11 px-6 bg-orange-500 hover:bg-orange-400 text-zinc-950 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2">
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
                        />
                    </div>
                </header>

                <div className="">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {diets.length > 0 ? (
                            diets.map((currentDiet: any) => {
                                const assignedDays = dietDaysMap[currentDiet.id] || []

                                return (
                                    <Card key={currentDiet.id} className="bg-zinc-900/50 border-zinc-800 text-zinc-100 hover:border-orange-500/30 transition-all group rounded-3xl overflow-hidden flex flex-col">
                                        <CardHeader className="p-6 pb-4">
                                            <div className="flex items-start justify-between">
                                                <div className="bg-zinc-800 p-2 rounded-lg text-zinc-400 group-hover:text-orange-500 transition-colors">
                                                    <Utensils className="w-5 h-5 text-orange-500" />
                                                </div>
                                                <UnifiedDeleteButton
                                                    id={currentDiet.id}
                                                    actionType="diet"
                                                    itemName={currentDiet.name}
                                                />
                                            </div>
                                            <CardTitle className="mt-4 text-xl font-black italic uppercase tracking-tighter text-white">{currentDiet.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6 pt-0 flex-1 flex flex-col">
                                            {assignedDays.length > 0 ? (
                                                <div className="flex flex-wrap gap-1.5 mb-6">
                                                    {(Array.from(new Set(assignedDays)) as number[]).sort((a: number, b: number) => a - b).map((day: number) => (
                                                        <span key={day} className="flex items-center shrink-0 gap-1 px-2 py-1 bg-orange-500/10 text-orange-400 text-[9px] font-black uppercase rounded-[0.5rem] border border-orange-500/20">
                                                            <Calendar className="w-2.5 h-2.5" />
                                                            {dayNamesShort[day]}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 px-2 py-1 bg-zinc-800 text-zinc-500 text-[9px] font-black uppercase rounded-[0.5rem] mb-6">
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
                                                userId={user.id}
                                                assignedDays={Array.from(new Set(assignedDays))}
                                            />
                                        </CardContent>
                                    </Card>
                                )
                            })
                        ) : (
                            <div className="col-span-full py-10 text-center border-dashed border border-zinc-800 rounded-3xl w-full">
                                <p className="text-zinc-500 text-[10px] font-bold uppercase">Sua biblioteca de dietas está vazia.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="">
                    <div className="p-8 bg-zinc-900/40 backdrop-blur-sm rounded-3xl border border-zinc-800/50 text-center space-y-4 shadow-2xl">
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
                </div>
            </div>
        )
    }

    // Default: Personal View (Daily Tracker)

    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-section-gap">
            <header className="px-2 space-y-2 sm:space-y-5">
                <div className="flex items-center gap-3 pb-4">
                    <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                        Minha <span className="text-orange-500">Dieta</span>
                    </h1>
                </div>
                <p className="text-zinc-500 text-sm font-medium">
                    {studentDailyDiet ? (studentDailyDiet as any).name : "Acompanhe seu plano alimentar oficial."}
                </p>
            </header>

            {studentDailyDiet?.meals?.length === 0 || !studentDailyDiet ? (
                <div className="">
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-800">
                        <div className="p-6 bg-zinc-950 rounded-full border border-zinc-800 mb-2">
                            <Utensils className="h-10 w-10 text-zinc-700" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-white uppercase italic">Nenhuma dieta encontrada</h3>
                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest max-w-[300px]">
                                Seu treinador ainda não atribuiu um plano alimentar para você.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="max-w-3xl mx-auto ">
                    <DietAdherence diet={studentDailyDiet} allowEstimation={hasTrainer} hasTrainer={hasTrainer} />
                </div>
            )}

            <div className="">
                <div className="p-8 bg-zinc-900/40 backdrop-blur-sm rounded-3xl border border-zinc-800/50 text-center space-y-4 shadow-2xl">
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
            </div>
        </div>
    )
}
