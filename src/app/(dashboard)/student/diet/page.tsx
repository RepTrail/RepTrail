
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Apple, Utensils, CheckCircle } from 'lucide-react'

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
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Minha Dieta</h1>
                    <p className="text-gray-500">{diet?.name}</p>
                </div>
                <div className="text-right">
                    <div className="text-sm font-medium text-green-600 mb-1">{progress}% Concluído</div>
                    <Progress value={progress} className="w-32 h-2" />
                </div>
            </div>

            <div className="grid gap-6">
                {meals.map((meal: any) => (
                    <Card key={meal.id} className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3 bg-gray-50/50">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Utensils className="h-5 w-5 text-gray-400" />
                                    <CardTitle className="text-lg">{meal.name}</CardTitle>
                                </div>
                                {meal.time_of_day && (
                                    <span className="text-sm px-2 py-1 bg-white rounded border text-gray-500 font-mono">
                                        {meal.time_of_day.slice(0, 5)}
                                    </span>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            {meal.items?.map((item: any) => (
                                <div key={item.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                    <Checkbox id={item.id} />
                                    <div className="grid gap-1.5 leading-none w-full">
                                        <label
                                            htmlFor={item.id}
                                            className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                        >
                                            {item.food_name}
                                        </label>
                                        <div className="flex justify-between text-sm text-muted-foreground">
                                            <span>{item.quantity}</span>
                                            {item.approx_measure && (
                                                <span className="italic text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs">
                                                    Medida: {item.approx_measure}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="pt-2 border-t flex justify-end">
                                <button className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center">
                                    <CheckCircle className="h-4 w-4 mr-1" /> Marcar Refeição Completa
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
