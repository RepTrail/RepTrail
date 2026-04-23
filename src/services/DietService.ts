
import { adminClient } from '@/lib/supabase/admin'
import { unstable_cache } from 'next/cache'

export class DietService {
    static async getByStudent(studentId: string) {
        return unstable_cache(
            async () => {
                const { data, error } = await adminClient
                    .from('diets')
                    .select(`
                        *,
                        meals(
                            *,
                            items:meal_items(*)
                        )
                    `)
                    .eq('student_id', studentId)
                    .eq('active', true)
                    .maybeSingle()

                if (error) {
                    console.error('Error in DietService.getByStudent:', error)
                    return null
                }
                
                if (data && data.meals) {
                    data.meals.sort((a: any, b: any) => a.order_index - b.order_index)
                    data.meals.forEach((m: any) => {
                        if (m.items) m.items.sort((a: any, b: any) => a.order_index - b.order_index)
                    })
                }

                return data
            },
            [`diet-student-${studentId}`],
            { tags: ['diets', `student-diet-${studentId}`] }
        )()
    }

    static async getTrainerDiets(trainerId: string) {
        return unstable_cache(
            async () => {
                const { data, error } = await adminClient
                    .from('diets')
                    .select(`
                        *,
                        meals(count),
                        assignments:assigned_diets(
                            id,
                            student_id,
                            days_of_week,
                            active,
                            student:profiles(full_name)
                        )
                    `)
                    .eq('trainer_id', trainerId)
                    .order('created_at', { ascending: false })

                if (error) {
                    console.error('Error in DietService.getTrainerDiets:', error)
                    return []
                }
                
                // Grouping logic for trainer view
                const grouped = (data || []).map(diet => {
                    const studentMap: Record<string, any> = {}
                    ;(diet.assignments || []).forEach((a: any) => {
                        if (!a.active) return
                        
                        if (!studentMap[a.student_id]) {
                            studentMap[a.student_id] = { 
                                ...a, 
                                days_of_week: Array.isArray(a.days_of_week) ? [...a.days_of_week] : 
                                               (typeof a.days_of_week === 'string' ? JSON.parse(a.days_of_week) : []) 
                            }
                        }
                    })
                    return { ...diet, assignments: Object.values(studentMap) }
                })

                return grouped || []
            },
            [`diet-trainer-${trainerId}`],
            { tags: ['diets', `trainer-diets-${trainerId}`] }
        )()
    }
}
