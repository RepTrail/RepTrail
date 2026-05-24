'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getTodayRangeBrazil } from '@/lib/date-utils'
import crypto from 'crypto'
import { upsertDailyTracking } from '@/actions/tracking-actions'

export async function getStudentErgogenics(studentId: string) {
    const { createAdminClient, createClient } = await import('@/lib/supabase/server')
    const adminSupabase = await createAdminClient()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // 1. Try to fetch from real ergogenics table
    const { data: records, error } = await adminSupabase
        .from('ergogenics')
        .select(`
            *,
            trainer:profiles!trainer_id(id, full_name)
        `)
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })

    if (error) return { error: error.message }

    // If we have records, we are dealing with a real student
    if (records && records.length > 0) {
        // Fetch active trainer links for this student to filter
        const { data: activeLinks } = await adminSupabase
            .from('trainer_students')
            .select('trainer_id')
            .eq('student_id', studentId)
            .eq('active', true)

        const activeTrainerIds = new Set(activeLinks?.map((l: any) => l.trainer_id) || [])

        return (records || []).filter(record => {
            if (!record.trainer_id || record.trainer_id === studentId) return true
            return activeTrainerIds.has(record.trainer_id)
        })
    }

    // 2. If no records and we have a user (likely trainer), check if it's a placeholder
    if (user) {
        const { data: placeholder } = await adminSupabase
            .from('pending_student_links')
            .select('*')
            .eq('id', studentId)
            .eq('trainer_id', user.id)
            .maybeSingle()

        if (placeholder && placeholder.ergogenic_data) {
            // Return raw items for UI to handle, filtering metadata
            const items = (placeholder.ergogenic_data as any[])
                .filter(e => e && typeof e === 'object' && !e.__metadata)
                .map((e, index) => ({
                    ...e,
                    id: e.id || `pc-${index}`, // Simple fallback ID
                    is_placeholder: true
                }));
            return items;
        }
    }

    return []
}

export async function addErgogenic(data: {
    student_id: string
    name: string
    weekly_dosage: number
    unit: 'ml' | 'mg' | 'un'
    application_days: number[]
    notes?: string
    start_date: string
    end_date?: string
}) {
    const { createAdminClient, createClient } = await import('@/lib/supabase/server')
    const adminSupabase = await createAdminClient()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Clean dates and remove sync metadata to avoid Supabase schema errors
    const { clientId, clientMutationId, parentId, ...filteredData } = data as any
    const cleanedData = {
        ...filteredData,
        id: filteredData.id || crypto.randomUUID(),
        start_date: filteredData.start_date || new Date().toISOString().split('T')[0],
        end_date: filteredData.end_date === '' ? null : filteredData.end_date
    }

    // Check if it's a placeholder
    const { data: placeholder } = await adminSupabase
        .from('pending_student_links')
        .select('*')
        .eq('id', data.student_id)
        .eq('trainer_id', user.id)
        .maybeSingle()

    if (placeholder) {
        const ergo = (placeholder.ergogenic_data as any[]) || []
        const newErgo = [...ergo, { ...cleanedData, trainer_id: user.id }]
        
        const { error: pendingError } = await adminSupabase
            .from('pending_student_links')
            .update({ ergogenic_data: newErgo })
            .eq('id', data.student_id)

        if (pendingError) return { error: pendingError.message }
        revalidatePath(`/dashboard/trainer/students/${data.student_id}/ergogenics`)
        return { success: true, data: cleanedData }
    }

    const { data: ergogenic, error } = await adminSupabase
        .from('ergogenics')
        .insert({
            ...cleanedData,
            trainer_id: user.id
        })
        .select()
        .single()

    if (error) return { error: error.message }

    // 🚀 AUTO-ENABLE: Enable hormonal protocol in student configurations
    await adminSupabase.from('student_details').upsert({ 
        id: data.student_id, 
        steroid_use: true 
    }, { onConflict: 'id' });

    revalidatePath(`/dashboard/trainer/students/${data.student_id}/ergogenics`)
    revalidatePath('/dashboard/student/ergogenics')
    return { success: true, data: ergogenic }
}

export async function updateErgogenic(id: string, studentId: string, data: any) {
    const { createAdminClient, createClient } = await import('@/lib/supabase/server')
    const adminSupabase = await createAdminClient()
    const supabase = await createClient()

    // Clean data and remove sync metadata to avoid Supabase schema errors
    const { clientId, clientMutationId, parentId, ...filteredData } = data as any
    const cleanedData = { ...filteredData }
    if (filteredData.start_date === '') delete cleanedData.start_date
    if (filteredData.end_date === '') cleanedData.end_date = null

    // Check if it's a placeholder
    const { data: placeholder } = await adminSupabase
        .from('pending_student_links')
        .select('*')
        .eq('id', studentId)
        .maybeSingle()

    if (placeholder) {
        const ergo = (placeholder.ergogenic_data as any[]) || []
        const newErgo = ergo.map((e: any) => {
            if (e.id === id || (e.name === id && !e.id)) {
                return { ...e, ...cleanedData }
            }
            return e
        })

        const { error: pendingError } = await adminSupabase
            .from('pending_student_links')
            .update({ ergogenic_data: newErgo })
            .eq('id', studentId)

        if (pendingError) return { error: pendingError.message }
        revalidatePath(`/dashboard/trainer/students/${studentId}/ergogenics`)
        return { success: true }
    }

    const { error } = await adminSupabase
        .from('ergogenics')
        .update(cleanedData)
        .eq('id', id)

    if (error) return { error: error.message }
    revalidatePath(`/dashboard/trainer/students/${studentId}/ergogenics`)
    revalidatePath('/dashboard/student/ergogenics')
    revalidatePath(`/dashboard/student/ergogenics/${studentId}`)
    return { success: true }
}

export async function deleteErgogenic(id: string, studentId: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    try {
        let effectiveStudentId = studentId
        
        // 🚨 RECOVERY: If studentId is missing (old mutations), fetch it from the record
        if (!effectiveStudentId) {
            const { createAdminClient } = await import('@/lib/supabase/server')
            const adminSupabase = await createAdminClient()
            
            // 1. Try real ergogenics table
            const { data: record } = await adminSupabase
                .from('ergogenics')
                .select('student_id')
                .eq('id', id)
                .maybeSingle()
            
            if (record) {
                effectiveStudentId = record.student_id
            } else {
                // 2. Try pending links (placeholder) - Search by ID in ergogenic_data
                const { data: placeholder } = await adminSupabase
                    .from('pending_student_links')
                    .select('id')
                    .contains('ergogenic_data', [{ id: id }])
                    .maybeSingle()
                
                if (placeholder) {
                    effectiveStudentId = placeholder.id
                }
            }
        }

        let hasLink = false
        if (effectiveStudentId) {
            const { data: link } = await supabase
                .from('trainer_students')
                .select('id')
                .eq('trainer_id', user.id)
                .eq('student_id', effectiveStudentId)
                .eq('active', true)
                .maybeSingle()
            hasLink = !!link
        }

        if (!hasLink && user.id !== effectiveStudentId) {
            if (!effectiveStudentId) {
                 return { error: 'You do not have permission to manage this student (ID missing).' }
            }
            // Check if effectiveStudentId is a placeholder (link ID)
            const { data: placeholder } = await supabase
                .from('pending_student_links')
                .select('*')
                .eq('id', effectiveStudentId)
                .eq('trainer_id', user.id)
                .maybeSingle()

            if (placeholder) {
                console.log(`[ERGOGENICS-ACTIONS] Deleting ergogenic from placeholder: ${effectiveStudentId}`)
                
                // Filter ergogenic_data array
                const ergo = (placeholder.ergogenic_data as any[]) || []
                
                // The 'id' passed here is actually the index or the full object for placeholders?
                // Actually, for placeholders, the UI passes the object usually, but the outbox might have the ID.
                // Looking at how we generate IDs for placeholders in getStudentRelationship:
                // We don't really have IDs for individual ergo entries in the link yet, but we can match by name or index.
                // If no ID is provided, we can't safely delete, but we shouldn't block the outbox forever.
                // We'll proceed and if nothing matches, it's effectively a no-op (idempotent).
                if (!id) {
                    console.warn(`[ERGOGENICS-ACTIONS] Deletion requested without ID for student: ${effectiveStudentId}`)
                }

                let found = false;
                const newErgo = ergo.filter((e: any) => {
                    if (e.__metadata) return true;
                    if (found) return true; // Only delete ONE per call

                    // 1. Try exact ID match
                    if (e.id && e.id === id) {
                        found = true;
                        return false;
                    }

                    // 2. Try Name match (for legacy data or name-as-id payloads)
                    if (e.name && e.name === id) {
                        found = true;
                        return false;
                    }

                    // 3. Try legacy pc-ID match (extract name)
                    if (id.startsWith('pc-') && !e.id) {
                        const targetName = id.split('-').slice(2).join('-');
                        if (e.name === targetName) {
                            found = true;
                            return false;
                        }
                    }

                    return true;
                })

                const { error: pendingError } = await supabase
                    .from('pending_student_links')
                    .update({ ergogenic_data: newErgo })
                    .eq('id', effectiveStudentId)

                if (pendingError) throw pendingError

                revalidatePath(`/dashboard/trainer/students/${effectiveStudentId}/ergogenics`)
                return { success: true }
            } else {
                return { error: 'You do not have permission to manage this student.' }
            }
        }

        // 2. Use Admin Client to bypass RLS for this specific deletion
        const { createAdminClient } = await import('@/lib/supabase/server')
        const adminSupabase = await createAdminClient()
        
        const { error } = await adminSupabase
            .from('ergogenics')
            .delete()
            .eq('id', id)

        if (error) throw error

        revalidatePath(`/dashboard/trainer/students/${effectiveStudentId}/ergogenics`)
        revalidatePath('/dashboard/student/ergogenics')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
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

    if (error) return []
    return data || []
}
export async function getAssignedErgogenics(studentId: string) {
    const result = await getStudentErgogenics(studentId)
    // getStudentErgogenics returns any[] directly, or { error: string } on failure
    if (Array.isArray(result)) return result
    return []
}

export type TrainerErgogenicHubStudent = {
    id: string
    full_name: string
    avatar_url: string | null
    is_placeholder: boolean
}

export async function getTrainerErgogenicStudents(trainerId?: string): Promise<TrainerErgogenicHubStudent[]> {
    const supabase = await createClient()
    let tid = trainerId

    if (!tid) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return []
        tid = user.id
    }

    const [{ data: students }, { data: placeholders }] = await Promise.all([
        supabase
            .from('trainer_students')
            .select(`
                id,
                student:profiles!student_id(
                    id,
                    full_name,
                    avatar_url,
                    details:student_details!id(steroid_use)
                )
            `)
            .eq('trainer_id', tid)
            .eq('active', true),
        supabase
            .from('pending_student_links')
            .select('id, student_name, ergogenic_data')
            .eq('trainer_id', tid)
            .eq('status', 'pending'),
    ])

    const realStudents = (students || [])
        .filter((s: any) => s.student?.details?.steroid_use)
        .map((s: any) => ({
            id: s.id,
            full_name: s.student.full_name,
            avatar_url: s.student.avatar_url,
            is_placeholder: false,
        }))

    const placeholderStudents = (placeholders || [])
        .filter((p: any) => {
            const metadata = (p.ergogenic_data as any[])?.find((e: any) => e?.__metadata)
            return metadata?.steroid_use === true
        })
        .map((p: any) => ({
            id: p.id,
            full_name: p.student_name,
            avatar_url: null,
            is_placeholder: true,
        }))

    return [...realStudents, ...placeholderStudents]
}

export async function getTodayErgogenicLogs(studentId: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { start, end } = getTodayRangeBrazil()
    const { data, error } = await supabase
        .from('ergogenic_logs')
        .select('ergogenic_id, created_at')
        .eq('student_id', studentId)
        .gte('created_at', start)
        .lte('created_at', end)

    if (error) throw error
    return data || []
}
