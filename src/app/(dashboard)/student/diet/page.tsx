import { createClient } from '@/lib/supabase/server'
import { Utensils, CheckCircle } from 'lucide-react'

export default async function StudentDietPage() {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // 1. Get Assigned Diet
    // For MVP/Demo, we fetch the first diet associated with the student (via assign table or direct link)
    // Let's assume there's a diet or use a placeholder if none.

    // Checking assigned_diets
    const { data: assignment } = await supabase
        .from('assigned_diets')
        .select('diet_id')
        .eq('student_id', user?.id)
        .eq('active', true)
        .single()

    let diet = null
    let meals = []

    if (assignment) {
        const { data: dietData } = await supabase
            .from('diets')
            .select('*')
            .eq('id', assignment.diet_id)
            .single()

        if (dietData) {
            diet = dietData
            const { data: m } = await supabase
                .from('meals')
                .select(`
                *,
                items:meal_items(*)
            `)
                .eq('diet_id', diet.id)
                .order('order_index', { ascending: true })
            meals = m || []
        }
    }

    // Mock data if no diet found for demo purposes (so the user sees something)
    if (!diet) {
        diet = { name: "Dieta Exemplo (Demo)" }
        meals = [
            {
                id: 'm1',
                name: 'Café da Manhã',
                time_of_day: '08:00',
                items: [
                    { id: 'i1', food_name: 'Ovos Mexidos', quantity: '3 un', approx_measure: '3 ovos grandes' },
                    { id: 'i2', food_name: 'Pão Integral', quantity: '2 fatias', approx_measure: '50g' }
                ]
            },
            {
                id: 'm2',
                name: 'Almoço',
                time_of_day: '12:00',
                items: [
                    { id: 'i3', food_name: 'Frango Grelhado', quantity: '150g', approx_measure: '1 filé grande (palma da mão)' },
                    { id: 'i4', food_name: 'Arroz Branco', quantity: '100g', approx_measure: '4 colheres de sopa cheias' },
                    { id: 'i5', food_name: 'Feijão', quantity: '1 concha', approx_measure: '140g' }
                ]
            }
        ]
    }

    // Calculate Progress (Mocked for now)
    const progress = 33 // 1/3 meals checked

    return (
        <div className="space-y-6 max-w-2xl mx-auto px-4 py-8 bg-zinc-950 text-white min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black italic uppercase tracking-tight">Minha Dieta</h1>
                    <p className="text-zinc-500 font-bold uppercase tracking-wider text-xs">{diet?.name}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                    <div className="text-xs font-black text-emerald-400 uppercase tracking-widest">{progress}% Concluído</div>
                    <div className="w-32 h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                {meals.map((meal: any) => (
                    <div key={meal.id} className="bg-zinc-900/45 border border-zinc-800 border-l-4 border-l-orange-500 shadow-2xl rounded-2xl overflow-hidden flex flex-col gap-4">
                        <div className="pb-3 pt-6 px-6 bg-zinc-950/20 flex flex-row items-center justify-between border-b border-zinc-800/40">
                            <div className="flex items-center gap-2.5">
                                <Utensils className="h-5 w-5 text-orange-500" />
                                <h3 className="text-base font-black uppercase italic tracking-wider text-white">{meal.name}</h3>
                            </div>
                            {meal.time_of_day && (
                                <span className="text-xs px-2.5 py-1 bg-zinc-950 rounded border border-zinc-800 text-zinc-400 font-mono font-bold">
                                    {meal.time_of_day.slice(0, 5)}
                                </span>
                            )}
                        </div>
                        <div className="p-6 pt-0 space-y-4 flex flex-col">
                            {meal.items?.map((item: any) => (
                                <div key={item.id} className="flex items-start space-x-3.5 p-3 hover:bg-zinc-900/60 rounded-xl transition-all border border-transparent hover:border-zinc-800/50">
                                    <input 
                                        type="checkbox" 
                                        id={item.id} 
                                        className="w-5 h-5 rounded border border-zinc-700 bg-zinc-950 text-emerald-500 focus:ring-emerald-500/20 shrink-0 cursor-pointer"
                                    />
                                    <div className="grid gap-1.5 leading-none w-full">
                                        <label
                                            htmlFor={item.id}
                                            className="text-sm font-black uppercase tracking-wider leading-none text-zinc-200 cursor-pointer hover:text-white transition-colors"
                                        >
                                            {item.food_name}
                                        </label>
                                        <div className="flex justify-between text-xs font-bold text-zinc-500">
                                            <span>{item.quantity}</span>
                                            {item.approx_measure && (
                                                <span className="italic text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/10 text-[10px] uppercase tracking-wide">
                                                    Medida: {item.approx_measure}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="pt-4 border-t border-zinc-800 flex justify-end">
                                <button className="text-xs text-emerald-400 hover:text-emerald-300 font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors">
                                    <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" /> Marcar Refeição Completa
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
