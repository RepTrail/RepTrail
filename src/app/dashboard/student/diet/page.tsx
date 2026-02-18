import { Utensils, Flame } from "lucide-react"
import { createClient } from '@/lib/supabase/server'
import { getStudentDailyDiet } from '@/actions/diet-actions'
import { DietAdherence } from '@/components/feature/student/diet-adherence'

export default async function StudentDietPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const diet = await getStudentDailyDiet(user.id)
    const meals = diet?.meals || []

    return (
        <div className="space-y-10 pb-20">
            <div className="space-y-2">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-8 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
                    <h1 className="text-4xl font-black tracking-tight text-white uppercase italic">
                        Minha Dieta
                    </h1>
                </div>
                <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">
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
