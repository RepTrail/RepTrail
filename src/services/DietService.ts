
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
                const [
                    { data: diets, error: dError },
                    { data: pendingLinks }
                ] = await Promise.all([
                    adminClient
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
                        .order('created_at', { ascending: false }),
                    adminClient
                        .from('pending_student_links')
                        .select('id, student_name, diet_ids')
                        .eq('trainer_id', trainerId)
                        .eq('status', 'pending')
                ])

                if (dError) {
                    console.error('Error in DietService.getTrainerDiets:', dError)
                    return []
                }

                console.log(`[DietService] Found ${diets?.length || 0} diets for trainer ${trainerId}`);
                if (diets && diets.length > 0) {
                    console.log(`[DietService] First diet trainer_id: ${diets[0].trainer_id}`);
                }
                
                // Grouping logic for trainer view
                const grouped = (diets || []).map(diet => {
                    const studentMap: Record<string, any> = {}

                    // 1. Process real assignments
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

                    // 2. Process pending assignments (Placeholders)
                    ;(pendingLinks || []).forEach(link => {
                        if (link.diet_ids?.includes(diet.id)) {
                            const placeholderId = `pending-${link.id}`
                            if (!studentMap[placeholderId]) {
                                studentMap[placeholderId] = {
                                    id: link.id,
                                    student_id: null,
                                    active: true,
                                    is_placeholder: true,
                                    student: { full_name: link.student_name },
                                    days_of_week: []
                                }
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
