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
            .select('id, name, description, trainer_id, created_at')
            .in('trainer_id', trainerIds)
            .order('name', { ascending: true })
            .limit(100)

        console.log('DEBUG: getCardioLibrary for user:', user.id, { data: data?.length, error })

        if (error) {
            console.error('ERROR: getCardioLibrary failed:', error)
            throw error
        }
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

export async function updateCardioMeta(cardioId: string, name: string, description?: string) {
    const supabase = await createClient()
    try {
        const updateData: any = { name: name.trim(), description: description?.trim() ?? null }

        const { error } = await supabase
            .from('cardios')
            .update(updateData)
            .eq('id', cardioId)
        if (error) throw error
        revalidatePath('/dashboard/trainer/cardio')
        revalidatePath(`/dashboard/trainer/cardio/${cardioId}`)
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
        return { success: true }
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
    // We use the admin client here to ensure that students can see the metadata (name, description)
    // of cardios assigned to them, as RLS on the 'cardios' table might be restricted to trainers.
    const supabase = createAdminClient()
    if (!supabase) throw new Error('Admin client not initialized')

    try {
        const { data, error } = await supabase
            .from('assigned_cardios')
            .select(`
                *,
                cardio:cardios(id, name, description, trainer_id, created_at)
            `)
            .eq('student_id', studentId)
            .eq('active', true)
            .order('created_at', { ascending: false })
            .limit(20) // Limit to prevent timeout

        if (error) {
            console.error('ERROR: Query failed:', error)
            throw error
        }

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

    const { data: { user } } = await supabase.auth.getUser()

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

        // Update Adherence
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

        // 1. Search for ANY in_progress session for this user
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

        // 2. Check if the session is from a previous day
        const sessionDate = new Date(active.started_at).toISOString().split('T')[0]
        const isFromPreviousDay = sessionDate < todayStr

        if (isFromPreviousDay) {
            console.log('Lazy Closing previous day cardio session:', active.id)

            if ((active.elapsed_seconds || 0) < 60) {
                console.log('DEBUG: Deleting short accidental cardio session:', active.id)
                await supabase.from('cardio_logs').delete().eq('id', active.id)
            } else {
                // Calculate percentage based on duration
                const targetSeconds = (active.assignment?.duration_minutes || 30) * 60
                let percentage = Math.min((active.elapsed_seconds / targetSeconds) * 100, 100)

                // Auto-finish it
                await finishCardioSession(active.id, 'Fechamento automático (virada do dia)', undefined, percentage)
            }

            return null // New day, new start
        }

        return active
    } catch (e) {
        console.error('Error fetching/auto-closing cardio session:', e)
        return null
    }
}
