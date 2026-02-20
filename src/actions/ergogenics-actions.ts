'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getTodayRangeBrazil } from '@/lib/date-utils'

export async function getStudentErgogenics(studentId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('ergogenics')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })

    if (error) return { error: error.message }
    return { data }
}

export async function addErgogenic(data: {
    student_id: string
    name: string
    weekly_dosage: number
    unit: 'ml' | 'mg'
    application_days: number[]
    notes?: string
    start_date: string
    end_date?: string
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Clean dates to avoid invalid syntax errors
    const cleanedData = {
        ...data,
        start_date: data.start_date || new Date().toISOString().split('T')[0],
        end_date: data.end_date === '' ? null : data.end_date
    }

    const { data: ergogenic, error } = await supabase
        .from('ergogenics')
        .insert({
            ...cleanedData,
            trainer_id: user.id
        })
        .select()
        .single()

    if (error) return { error: error.message }
    revalidatePath(`/dashboard/trainer/students/${data.student_id}/ergogenics`)
    revalidatePath('/dashboard/student/ergogenics')
    return { success: true, data: ergogenic }
}

export async function updateErgogenic(id: string, studentId: string, data: any) {
    const supabase = await createClient()

    // Clean dates if they exist in the update payload
    const cleanedData = { ...data }
    if (data.start_date === '') delete cleanedData.start_date
    if (data.end_date === '') cleanedData.end_date = null

    const { error } = await supabase
        .from('ergogenics')
        .update(cleanedData)
        .eq('id', id)

    if (error) return { error: error.message }
    revalidatePath(`/dashboard/trainer/students/${studentId}/ergogenics`)
    revalidatePath('/dashboard/student/ergogenics')
    return { success: true }
}

export async function deleteErgogenic(id: string, studentId: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('ergogenics')
        .delete()
        .eq('id', id)

    if (error) return { error: error.message }
    revalidatePath(`/dashboard/trainer/students/${studentId}/ergogenics`)
    revalidatePath('/dashboard/student/ergogenics')
    return { success: true }
}



export async function toggleErgogenicLog(studentId: string, ergogenicId: string, status: boolean) {
    const supabase = await createClient()

    if (status) {
        // Log Intake
        const { data: log, error } = await supabase
            .from('ergogenic_logs')
            .insert({
                student_id: studentId,
                ergogenic_id: ergogenicId
            })
            .select()
            .single()

        if (error) return { error: error.message }
    } else {
        // Remove logs for today
        const { start, end } = getTodayRangeBrazil()
        const { error } = await supabase
            .from('ergogenic_logs')
            .delete()
            .eq('student_id', studentId)
            .eq('ergogenic_id', ergogenicId)
            .gte('created_at', start)
            .lte('created_at', end)

        if (error) return { error: error.message }
    }

    // Update Adherence (count logs relative to planned)
    const { start, end } = getTodayRangeBrazil()
    const { data: logs } = await supabase
        .from('ergogenic_logs')
        .select('id')
        .eq('student_id', studentId)
        .gte('created_at', start)
        .lte('created_at', end)

    const { data: planned } = await supabase
        .from('ergogenics')
        .select('id, application_days')
        .eq('student_id', studentId)

    const todayDow = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })).getDay()
    const plannedTodayCount = (planned || []).filter(e => e.application_days?.includes(todayDow)).length
    const logsCount = logs?.length || 0

    const adherenceStatus = plannedTodayCount > 0
        ? (logsCount >= plannedTodayCount ? 'completed' : (logsCount > 0 ? 'partial' : 'none'))
        : 'none'

    await import('./tracking-actions').then(mod =>
        mod.upsertDailyTracking(studentId, { ergogenics_status: adherenceStatus })
    )

    revalidatePath('/dashboard/student')
    revalidatePath('/dashboard/student/ergogenics')
    return { success: true }
}

export async function logErgogenicIntake(data: {
    student_id: string
    ergogenic_id: string
    notes?: string
}) {
    // Deprecated? Keeping for compatibility but toggle is better for UI checkbox
    return toggleErgogenicLog(data.student_id, data.ergogenic_id, true)
}

export async function getErgogenicLogs(studentId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('ergogenic_logs')
        .select('*, ergogenics(name)')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })

    if (error) return { error: error.message }
    return { data }
}
