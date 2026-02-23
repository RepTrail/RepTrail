'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateStudentWorkoutDay(assignmentId: string, dayOfWeek: number | null) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    console.log('[STUDENT] Updating workout schedule:', { assignmentId, dayOfWeek, userId: user.id })

    const { error } = await supabase
        .from('assigned_workouts')
        .update({ day_of_week: dayOfWeek })
        .eq('id', assignmentId)
        .eq('student_id', user.id)

    if (error) {
        console.error('[STUDENT] Failed to update workout day:', error)
        throw error
    }

    revalidatePath('/dashboard/student/workouts')
    revalidatePath('/dashboard/student')
}
