'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getCardioLibrary() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    try {
        const { data, error } = await supabase
            .from('cardios')
            .select('*')
            .eq('trainer_id', user.id)
            .order('name', { ascending: true })

        if (error) throw error
        return data || []
    } catch (e) {
        console.error('Error fetching cardio library:', e)
        return []
    }
}

export async function createCardio(name: string, description?: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    try {
        const { data, error } = await supabase
            .from('cardios')
            .insert({
                trainer_id: user.id,
                name,
                description
            })
            .select()
            .single()

        if (error) throw error
        return { success: true, cardio: data }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function assignCardio(data: {
    studentId: string,
    cardioId: string,
    duration: number,
    intensity: string,
    daysOfWeek?: number[]
}) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('assigned_cardios')
            .insert({
                student_id: data.studentId,
                cardio_id: data.cardioId,
                duration_minutes: data.duration,
                suggested_intensity: data.intensity,
                days_of_week: data.daysOfWeek
            })

        if (error) throw error
        revalidatePath('/dashboard/trainer/students/[id]', 'page')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function removeCardioAssignment(assignmentId: string) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('assigned_cardios')
            .delete()
            .eq('id', assignmentId)

        if (error) throw error
        revalidatePath('/dashboard/trainer/students/[id]', 'page')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function getStudentCardioAssignments(studentId: string) {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('assigned_cardios')
            .select(`
                *,
                cardio:cardios(*)
            `)
            .eq('student_id', studentId)
            .eq('active', true)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data || []
    } catch (e) {
        console.error('Error fetching student cardios:', e)
        return []
    }
}

// Player / Logging Actions
export async function startCardioSession(assignmentId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    try {
        const { data, error } = await supabase
            .from('cardio_logs')
            .insert({
                student_id: user.id,
                assigned_cardio_id: assignmentId,
                status: 'in_progress',
                is_running: true,
                started_at: new Date().toISOString()
            })
            .select()
            .single()

        if (error) throw error
        return { success: true, logId: data.id }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function updateCardioSession(logId: string, seconds: number, running: boolean) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('cardio_logs')
            .update({
                elapsed_seconds: seconds,
                is_running: running,
                last_heartbeat_at: new Date().toISOString()
            })
            .eq('id', logId)

        if (error) throw error
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function finishCardioSession(logId: string, feedback?: string, intensity?: string) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('cardio_logs')
            .update({
                status: 'completed',
                completed_at: new Date().toISOString(),
                feedback,
                intensity_used: intensity,
                is_running: false
            })
            .eq('id', logId)

        if (error) throw error
        revalidatePath('/dashboard/student', 'page')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function getActiveCardioSession() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    try {
        const { data, error } = await supabase
            .from('cardio_logs')
            .select(`
                *,
                assignment:assigned_cardios(
                    *,
                    cardio:cardios(*)
                )
            `)
            .eq('student_id', user.id)
            .eq('status', 'in_progress')
            .order('last_heartbeat_at', { ascending: false })
            .limit(1)
            .maybeSingle()

        if (error) throw error
        return data
    } catch (e) {
        console.error('Error fetching active cardio session:', e)
        return null
    }
}
