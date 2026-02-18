'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

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

export async function logErgogenicIntake(data: {
    student_id: string
    ergogenic_id: string
    notes?: string
}) {
    const supabase = await createClient()
    const { data: log, error } = await supabase
        .from('ergogenic_logs')
        .insert(data)
        .select()
        .single()

    if (error) return { error: error.message }
    revalidatePath('/dashboard/student/ergogenics')
    return { success: true, data: log }
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
