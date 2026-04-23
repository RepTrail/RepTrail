'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getTodayRangeBrazil } from '@/lib/date-utils'
import { upsertDailyTracking } from '@/actions/tracking-actions'

export async function getStudentErgogenics(studentId: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: records, error } = await supabase
        .from('ergogenics')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })

    if (error) return { error: error.message }

    // Data Pruning: Filter by active trainer link
    const filteredRecords = []
    for (const record of (records || [])) {
        if (record.trainer_id && record.trainer_id !== studentId) {
            const { data: link } = await supabase
                .from('trainer_students')
                .select('id')
                .eq('trainer_id', record.trainer_id)
                .eq('student_id', studentId)
                .eq('active', true)
                .maybeSingle()

            if (link) filteredRecords.push(record)
        } else {
            // Se foi o próprio aluno que adicionou (Auto-Treino), mantém
            filteredRecords.push(record)
        }
    }

    return { data: filteredRecords }
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
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Clean dates and remove sync metadata to avoid Supabase schema errors
    const { clientId, clientMutationId, parentId, ...filteredData } = data as any
    const cleanedData = {
        ...filteredData,
        start_date: filteredData.start_date || new Date().toISOString().split('T')[0],
        end_date: filteredData.end_date === '' ? null : filteredData.end_date
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
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

    // Clean data and remove sync metadata to avoid Supabase schema errors
    const { clientId, clientMutationId, parentId, ...filteredData } = data as any
    const cleanedData = { ...filteredData }
    if (filteredData.start_date === '') delete cleanedData.start_date
    if (filteredData.end_date === '') cleanedData.end_date = null

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
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
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
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    let logData = null

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
        logData = log
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

    await upsertDailyTracking(studentId, { ergogenics_status: adherenceStatus })

    revalidatePath('/dashboard/student')
    revalidatePath('/dashboard/student/ergogenics')
    return { success: true, data: logData }
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
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data, error } = await supabase
        .from('ergogenic_logs')
        .select('*, ergogenics(name)')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })

    if (error) return { error: error.message }
    return { data }
}
export async function getAssignedErgogenics(studentId: string) {
    const result = await getStudentErgogenics(studentId)
    return result.data || []
}

export async function getTodayErgogenicLogs(studentId: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { start, end } = getTodayRangeBrazil()
    const { data, error } = await supabase
        .from('ergogenic_logs')
        .select('ergogenic_id')
        .eq('student_id', studentId)
        .gte('created_at', start)
        .lte('created_at', end)

    if (error) throw error
    return data || []
}
