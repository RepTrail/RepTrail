import { Utensils, Flame, ChevronRight, Edit } from "lucide-react"
import { createClient } from '@/lib/supabase/server'
import { getStudentDailyDiet } from '@/actions/diet-actions'
import { DietAdherence } from '@/components/feature/student/diet-adherence'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { CreateDietDialog } from '@/components/feature/student/create-diet-dialog'
import { DeleteDietButton } from '@/components/feature/student/delete-diet-button'

export default async function StudentDietPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

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

    // Auto-training (no trainer): show diet library + CRUD
    if (!trainerRel && isAutoTrainingActive) {
        const diet = await getStudentDailyDiet(user.id)

        const { data: assigned } = await supabase
            .from('assigned_diets')
            .select(`
                id,
                diet_id,
                diet:diets(
                    id,
                    name,
                    created_at,
                    meals:diet_meals(count)
                )
            `)
            .eq('student_id', user.id)
            .eq('active', true)

        const diets = (assigned || []).map((a: any) => ({
            assignmentId: a.id,
            ...(a.diet || {})
        }))

        return (
            <div className="space-y-6" suppressHydrationWarning>
                <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-orange-500 rounded-xl">
                            <Utensils className="w-5 h-5 text-zinc-950" />
                        </div>
                        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
                            Minha <span className="text-orange-500">Dieta</span>
                        </h1>
                    </div>
                    <p className="text-zinc-500 text-sm font-medium max-w-md">
                        {diet ? (diet as any).name : "Siga o plano para maximizar seus ganhos."}
                    </p>
                </div>

                {diet ? (
                    <div className="space-y-4">
                        <div className="flex justify-end gap-2">
                            <Button asChild size="sm" variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800">
                                <Link href={`/dashboard/student/diet/${(diet as any).id}`}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Editar
                                </Link>
                            </Button>
                            <DeleteDietButton dietId={(diet as any).id} />
                        </div>
                        <div className="max-w-3xl mx-auto">
                            <DietAdherence diet={diet} />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-800">
                        <div className="p-6 bg-zinc-950 rounded-full border border-zinc-800 mb-2">
                            <Utensils className="h-10 w-10 text-zinc-700" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-white uppercase italic">Nenhuma dieta ativa</h3>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest max-w-[300px]">
                                Crie ou importe uma dieta para começar.
                            </p>
                        </div>
                    </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-zinc-800/50 pt-6">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-black tracking-tight text-white font-sans italic uppercase">
                            Biblioteca de Dietas
                        </h2>
                        <p className="text-zinc-500 text-sm font-medium">
                            Gerencie seus planos alimentares.
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
                                        <span>Criado em {diet.created_at ? new Date(diet.created_at).toLocaleDateString('pt-BR') : '-'}</span>
                                    </div>

                                    <Button asChild size="sm" className="w-full bg-zinc-100 text-zinc-900 hover:bg-white flex items-center justify-center gap-2">
                                        <Link href={`/dashboard/student/diet/${diet.id}`}>
                                            Editar
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </Button>
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
                                    <p className="text-zinc-500 mt-1">Crie uma nova dieta para começar.</p>
                                </div>
                                <CreateDietDialog />
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        )
    }

    // Personal student: daily diet view
    const diet = await getStudentDailyDiet(user.id)
    const meals = diet?.meals || []

    return (
        <div className="space-y-10 pb-20">
            <div className="space-y-2">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-500 rounded-xl">
                        <Utensils className="w-5 h-5 text-zinc-950" />
                    </div>
                    <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
                        Minha <span className="text-orange-500">Dieta</span>
                    </h1>
                </div>
                <p className="text-zinc-500 text-sm font-medium max-w-md">
                    {diet ? (diet as any).name : "Siga o plano para maximizar seus ganhos."}
                </p>
            </div>

            {meals.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-800">
                    <div className="p-6 bg-zinc-950 rounded-full border border-zinc-800 mb-2">
                        <Utensils className="h-10 w-10 text-zinc-700" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-white uppercase italic">Nenhuma dieta encontrada</h3>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest max-w-[300px]">
                            Seu treinador ainda não atribuiu um plano alimentar para você.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="max-w-3xl mx-auto">
                    <DietAdherence diet={diet} />
                </div>
            )}

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
    )
}
