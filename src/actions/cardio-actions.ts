'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { upsertDailyTracking } from '@/actions/tracking-actions'

export async function getCardioLibrary() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    try {
        // Fetch student's trainer
        const { data: trainerRel } = await supabase
            .from('trainer_students')
            .select('trainer_id')
            .eq('student_id', user.id)
            .eq('active', true)
            .maybeSingle()

        const trainerIds = [user.id]
        if (trainerRel?.trainer_id) {
            trainerIds.push(trainerRel.trainer_id)
        }

        const { data, error } = await supabase
            .from('cardios')
            .select('id, name, description, trainer_id, created_at, duration_minutes, suggested_intensity')
            .in('trainer_id', trainerIds)
            .order('name', { ascending: true })
            .limit(100)

        if (error) throw error
        return data || []
    } catch (e) {
        console.error('Error fetching cardio library:', e)
        return []
    }
}

export async function createCardio(nameOrData: string | FormData, description?: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    let name = ''
    let desc = description
    let duration = 30
    let intensity = 'Moderada'

    if (nameOrData instanceof FormData) {
        name = nameOrData.get('name') as string
        desc = (nameOrData.get('description') as string) || undefined
        duration = parseInt(nameOrData.get('duration_minutes')?.toString() || '30')
        intensity = nameOrData.get('suggested_intensity')?.toString() || 'Moderada'
    } else {
        name = nameOrData
    }

    try {
        const { data, error } = await supabase
            .from('cardios')
            .insert({
                trainer_id: user.id,
                name,
                description: desc,
                duration_minutes: duration,
                suggested_intensity: intensity
            })
            .select()
            .single()

        if (error) throw error

        revalidatePath('/dashboard/trainer/cardio')
        revalidatePath('/dashboard/student/cardio')
        return { success: true, cardio: data }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function getCardioDetails(cardioId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('cardios')
        .select('*')
        .eq('id', cardioId)
        .single()
    if (error) return null
    return data
}

export async function updateCardioMeta(cardioId: string, name: string, description?: string, duration?: number, intensity?: string) {
    const supabase = await createClient()
    try {
        const updateData: any = {
            name: name.trim(),
            description: description?.trim() ?? null,
            duration_minutes: duration,
            suggested_intensity: intensity
        }

        const { error } = await supabase
            .from('cardios')
            .update(updateData)
            .eq('id', cardioId)

        if (error) throw error
        revalidatePath('/dashboard/trainer/cardio')
        revalidatePath(`/dashboard/trainer/cardio/${cardioId}`)
        revalidatePath('/dashboard/student/cardio')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function duplicateCardio(cardioId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    try {
        const { data: original, error: fetchErr } = await supabase
            .from('cardios')
            .select('*')
            .eq('id', cardioId)
            .single()
        if (fetchErr || !original) throw fetchErr || new Error('Cardio not found')

        const { id, created_at, ...rest } = original
        const { error: insertErr } = await supabase
            .from('cardios')
            .insert({ ...rest, trainer_id: user.id, name: `${original.name} (cópia)` })

        if (insertErr) throw insertErr

        revalidatePath('/dashboard/trainer/cardio')
        revalidatePath('/dashboard/student/cardio')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function assignCardio(data: {
    studentId: string,
    cardioId: string,
    duration?: number,
    intensity?: string,
    daysOfWeek?: number[]
}) {
    const supabase = await createClient()

    try {
        // Fetch cardio defaults from template if not provided
        const { data: template, error: templateErr } = await supabase
            .from('cardios')
            .select('duration_minutes, suggested_intensity')
            .eq('id', data.cardioId)
            .single()

        if (templateErr) throw templateErr

        const duration = data.duration ?? template.duration_minutes ?? 30
        const intensity = data.intensity ?? template.suggested_intensity ?? 'Moderada'

        const { error } = await supabase
            .from('assigned_cardios')
            .insert({
                student_id: data.studentId,
                cardio_id: data.cardioId,
                duration_minutes: duration,
                suggested_intensity: intensity,
                days_of_week: data.daysOfWeek
            })

        if (error) throw error
        revalidatePath('/dashboard/trainer/students/[id]', 'page')
        revalidatePath('/dashboard/student/cardio')
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
        revalidatePath('/dashboard/student/cardio')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function getStudentCardioAssignments(studentId: string) {
    const supabase = createAdminClient()
    if (!supabase) throw new Error('Admin client not initialized')

    try {
        const { data, error } = await supabase
            .from('assigned_cardios')
            .select(`
                *,
                cardio:cardios(id, name, description, trainer_id, created_at, duration_minutes, suggested_intensity)
            `)
            .eq('student_id', studentId)
            .eq('active', true)
            .order('created_at', { ascending: false })
            .limit(20)

        if (error) throw error
        return data || []
    } catch (e) {
        console.error('Error fetching student cardios:', e)
        return []
    }
}

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
                started_at: new Date().toISOString(),
                last_resumed_at: new Date().toISOString(),
                last_heartbeat_at: new Date().toISOString()
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
        const updateData: any = {
            elapsed_seconds: seconds,
            is_running: running,
            last_heartbeat_at: new Date().toISOString()
        }

        if (running) {
            updateData.last_resumed_at = new Date().toISOString()
        } else {
            updateData.last_paused_at = new Date().toISOString()
        }

        const { error } = await supabase
            .from('cardio_logs')
            .update(updateData)
            .eq('id', logId)

        if (error) throw error
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function finishCardioSession(logId: string, feedback?: string, intensity?: string, percentage?: number) {
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

        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const finalPercentage = percentage !== undefined ? percentage : 100
            const status = finalPercentage >= 100 ? 'completed' : 'partial'

            await upsertDailyTracking(user.id, {
                cardio_status: status,
                cardio_percentage: finalPercentage
            })
        }

        revalidatePath('/dashboard/student', 'page')
        revalidatePath('/dashboard/student/cardio')
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
        const tzNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
        const todayStr = tzNow.toISOString().split('T')[0]

        const { data: active, error } = await supabase
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
            .order('started_at', { ascending: false })
            .limit(1)
            .maybeSingle()

        if (error) throw error
        if (!active) return null

        const sessionDate = new Date(active.started_at).toISOString().split('T')[0]
        if (sessionDate < todayStr) {
            if ((active.elapsed_seconds || 0) < 60) {
                await supabase.from('cardio_logs').delete().eq('id', active.id)
            } else {
                const targetSeconds = (active.assignment?.duration_minutes || 30) * 60
                let percentage = Math.min((active.elapsed_seconds / targetSeconds) * 100, 100)
                await finishCardioSession(active.id, 'Fechamento automático', undefined, percentage)
            }
            return null
        }

        return active
    } catch (e) {
        console.error('Error fetching/auto-closing cardio session:', e)
        return null
    }
}

export async function deleteCardio(cardioId: string) {
    const supabase = await createClient()
    try {
        const { error } = await supabase
            .from('cardios')
            .delete()
            .eq('id', cardioId)

        if (error) throw error
        revalidatePath('/dashboard/trainer/cardio')
        revalidatePath('/dashboard/student/cardio')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}
