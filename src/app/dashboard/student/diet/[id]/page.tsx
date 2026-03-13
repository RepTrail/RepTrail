import dynamic from "next/dynamic"
import { createClient } from '@/lib/supabase/server'
import { notFound } from "next/navigation"

const DietBuilder = dynamic(
    () => import("@/components/feature/trainer/diet-builder").then(mod => ({ default: mod.DietBuilder }))
)

export default async function StudentDietEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    console.log('[STUDENT DIET EDIT] Starting for dietId:', id)

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        console.log('[STUDENT DIET EDIT] No authenticated user')
        return notFound()
    }

    console.log('[STUDENT DIET EDIT] Authenticated user:', user.id)

    const { data: profile } = await supabase
        .from('profiles')
        .select('auto_training_status')
        .eq('id', user.id)
        .single()

    const isAutoTrainingActive = profile?.auto_training_status === 'active' || profile?.auto_training_status === 'trial'
    console.log('[STUDENT DIET EDIT] Auto-training status:', profile?.auto_training_status, 'isAutoTrainingActive:', isAutoTrainingActive)

    if (!isAutoTrainingActive) {
        console.log('[STUDENT DIET EDIT] Auto-training not active, returning 404')
        return notFound()
    }

    // Fetch diet via assigned_diets join (same as getStudentDailyDiet)
    console.log('[STUDENT DIET EDIT] Fetching assigned diet for user:', user.id, 'dietId:', id)
    const { data: assignment, error: assignmentError } = await supabase
        .from('assigned_diets')
        .select(`
            id,
            diet_id,
            diet:diets(
                id,
                name,
                meals:meals(
                    id,
                    name,
                    time_of_day,
                    order_index,
                    notes,
                    meal_items:meal_items(
                        id,
                        food_name,
                        quantity,
                        approx_measure,
                        protein,
                        carbs,
                        fat,
                        calories
                    )
                )
            )
        `)
        .eq('student_id', user.id)
        .eq('active', true)
        .eq('diet_id', id)
        .single()

    console.log('[STUDENT DIET EDIT] Assignment query result:', { assignment, assignmentError })

    if (!assignment || !assignment.diet) {
        console.log('[STUDENT DIET EDIT] No assignment or diet found, returning 404')
        return notFound()
    }
    const diet = assignment.diet as any
    console.log('[STUDENT DIET EDIT] Diet found:', { id: diet.id, name: diet.name, mealsCount: diet.meals?.length })

    return (
        <div className="max-w-5xl mx-auto  sm:px-6 lg:px-8 py-8" suppressHydrationWarning>
            <DietBuilder diet={diet as any} backHref="/dashboard/student/diet" />
        </div>
    )
}
