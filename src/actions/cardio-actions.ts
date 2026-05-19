'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath, revalidateTag } from 'next/cache'
import { upsertDailyTracking } from '@/actions/tracking-actions'

export async function getCardioLibrary(userId?: string) {
    const supabase = await createClient()
    let uid = userId

    if (!uid) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return []
        uid = user.id
    }

    try {
        // Fetch student's trainer
        const { data: trainerRel } = await supabase
            .from('trainer_students')
            .select('trainer_id')
            .eq('student_id', uid)
            .eq('active', true)
            .maybeSingle()

        const trainerIds = [uid]
        if (trainerRel?.trainer_id) {
            trainerIds.push(trainerRel.trainer_id)
        }

        const { data, error } = await supabase
            .from('cardios')
            .select(`
                id, name, description, trainer_id, created_at, duration_minutes, suggested_intensity,
                assignments:assigned_cardios(
                    id,
                    student_id,
                    student:profiles(full_name),
                    day_of_week,
                    days_of_week,
                    active
                )
            `)
            .in('trainer_id', trainerIds)
            .order('name', { ascending: true })
            .limit(100)

        if (error) throw error
        
        // Group by student and merge days
    const grouped = (data || []).map(cardio => {
        const studentMap: Record<string, any> = {}
        
        ;(cardio.assignments || []).forEach((a: any) => {
            if (!a.active || a.student_id === uid) return
            
            if (!studentMap[a.student_id]) {
                studentMap[a.student_id] = { 
                    ...a, 
                    days_of_week: Array.isArray(a.days_of_week) ? [...a.days_of_week] : [] 
                }
            }
            // Merge singular day_of_week if present
            if (a.day_of_week !== null && a.day_of_week !== undefined) {
                if (!studentMap[a.student_id].days_of_week.includes(a.day_of_week)) {
                    studentMap[a.student_id].days_of_week.push(a.day_of_week)
                }
            }
        })

        return {
            ...cardio,
            assignments: Object.values(studentMap)
        }
    })

    return grouped || []
    } catch (e) {
        console.error('Error fetching cardio library:', e)
        return []
    }
}

export async function createCardio(nameOrData: string | FormData, description?: string, durationMinutes?: number, suggestedIntensity?: string, daysOfWeek?: number[]) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    let name = ''
    let desc = description
    let duration = durationMinutes ?? 30
    let intensity = suggestedIntensity ?? 'Moderada'
    let days = daysOfWeek

    if (nameOrData instanceof FormData) {
        name = nameOrData.get('name') as string
        desc = (nameOrData.get('description') as string) || undefined
        duration = parseInt(nameOrData.get('duration_minutes')?.toString() || '30')
        intensity = nameOrData.get('suggested_intensity')?.toString() || 'Moderada'
        const dJson = nameOrData.get('daysOfWeek')?.toString()
        if (dJson) days = JSON.parse(dJson)
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
        
        // Auto-assign if days are provided
        if (days && days.length > 0) {
            const assignments = days.map(day => ({
                student_id: user.id,
                cardio_id: data.id,
                duration_minutes: duration,
                suggested_intensity: intensity,
                day_of_week: day,
                active: true
            }))

            const { error: assignErr } = await supabase
                .from('assigned_cardios')
                .insert(assignments)

            if (assignErr) console.error('[Cardio] Failed to auto-assign:', assignErr)
        }

        revalidateTag('cardio', 'page')
        revalidateTag(`trainer-cardio-${user.id}`, 'page')
        revalidatePath('/dashboard/trainer/cardio')
        revalidatePath('/dashboard/student/cardio')
        return { success: true, cardio: data }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function getCardioDetails(cardioId: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data, error } = await supabase
        .from('cardios')
        .select(`
            *,
            assignments:assigned_cardios(
                id,
                student_id,
                student:profiles!student_id(full_name),
                day_of_week,
                days_of_week,
                active
            )
        `)
        .eq('id', cardioId)
        .maybeSingle()

    const { data: { user } } = await supabase.auth.getUser()

    if (error || !data) return null

    // Grouping logic for details
    const studentMap: Record<string, any> = {}
    ;(data.assignments || []).forEach((a: any) => {
        if (!a.active || a.student_id === user?.id) return
        
        if (!studentMap[a.student_id]) {
            studentMap[a.student_id] = { 
                ...a, 
                days_of_week: Array.isArray(a.days_of_week) ? [...a.days_of_week] : 
                               (typeof a.days_of_week === 'string' ? JSON.parse(a.days_of_week) : []) 
            }
        }
        if (a.day_of_week !== null && a.day_of_week !== undefined) {
             if (!studentMap[a.student_id].days_of_week.includes(a.day_of_week)) {
                 studentMap[a.student_id].days_of_week.push(a.day_of_week)
             }
        }
    })

    return {
        ...data,
        assignments: Object.values(studentMap)
    }
}

export async function updateCardioMeta(cardioId: string, name: string, description?: string, duration?: number, intensity?: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
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
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
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
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

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
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    try {
        // 🚀 CHECK IF PLACEHOLDER
        if (assignmentId.startsWith('pc-')) {
            if (!user) return { error: 'Unauthorized' }
            const cardioId = assignmentId.replace('pc-', '')

            // Find any pending link for this trainer that has this cardio
            const { data: pending } = await supabase
                .from('pending_student_links')
                .select('*')
                .contains('cardio_ids', [cardioId])
                .eq('trainer_id', user.id)
                .eq('status', 'pending')
                .maybeSingle()

            if (pending) {
                const newCardioIds = (pending.cardio_ids || []).filter((id: string) => id !== cardioId)
                
                // Also clean up metadata
                const ergo = (pending.ergogenic_data as any[]) || []
                const metaIdx = ergo.findIndex(e => e.__metadata)
                if (metaIdx !== -1) {
                    const metadata = ergo[metaIdx]
                    if (metadata.cardio_metadata) {
                        metadata.cardio_metadata = metadata.cardio_metadata.filter((m: any) => m.id !== cardioId)
                        ergo[metaIdx] = metadata
                    }
                }

                const { error: pendingError } = await supabase
                    .from('pending_student_links')
                    .update({ 
                        cardio_ids: newCardioIds,
                        ergogenic_data: ergo
                    })
                    .eq('id', pending.id)

                if (pendingError) throw pendingError
                revalidatePath('/dashboard/trainer/students/[id]', 'page')
                return { success: true }
            }
        }

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

    const clientSupabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await clientSupabase.auth.getUser()

    try {
        // 1. Try to fetch from real assigned_cardios table
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

        if (data && data.length > 0) return data

        // 2. If no data and we have a user (trainer), check placeholder link
        if (user) {
            const { data: pending } = await supabase
                .from('pending_student_links')
                .select('*')
                .eq('id', studentId)
                .eq('trainer_id', user.id)
                .maybeSingle()

            if (pending && pending.cardio_ids?.length) {
                const { data: cardios } = await supabase
                    .from('cardios')
                    .select('*')
                    .in('id', pending.cardio_ids)

                const metadata = (pending.ergogenic_data as any[])?.find(e => e.__metadata) || {};
                const cardioMeta = metadata.cardio_metadata || [];

                return (cardios || []).map(c => {
                    const meta = cardioMeta.find((m: any) => m.id === c.id);
                    return {
                        id: `pc-${c.id}`,
                        active: true,
                        student_id: studentId,
                        cardio_id: c.id,
                        duration_minutes: meta?.duration || c.duration_minutes || 30,
                        suggested_intensity: meta?.intensity || c.suggested_intensity || 'Moderada',
                        days_of_week: (meta?.days && meta.days.length > 0) ? meta.days : [0, 1, 2, 3, 4, 5, 6],
                        cardio: c
                    }
                });
            }
        }

        return []
    } catch (e) {
        console.error('Error fetching student cardios:', e)
        return []
    }
}

export async function startCardioSession(assignmentId: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
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
        
        revalidatePath('/dashboard/trainer/cardio')
        revalidatePath('/dashboard/student/cardio')
        
        return { success: true, logId: data.id }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function updateCardioSession(logId: string, seconds: number, running: boolean) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

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
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

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
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
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
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
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
export async function getAssignedCardios(studentId: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

    try {
        // Get active trainer for filtering
        const { data: trainerRel } = await supabase
            .from('trainer_students')
            .select('trainer_id')
            .eq('student_id', studentId)
            .eq('active', true)
            .maybeSingle()

        const activeTrainerId = trainerRel?.trainer_id

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

        // Filter: only active trainer or student themselves (AI/Personal)
        const filtered = (data || []).filter((a: any) => {
            const templateTrainerId = a.cardio?.trainer_id
            return templateTrainerId === studentId || (activeTrainerId && templateTrainerId === activeTrainerId)
        })

        return filtered
    } catch (e) {
        console.error('Error fetching assigned cardios:', e)
        return []
    }
}

export async function getTodayCardio(studentId: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const tzNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
    const today = tzNow.getDay()

    try {
        // Get active trainer for filtering
        const { data: trainerRel } = await supabase
            .from('trainer_students')
            .select('trainer_id')
            .eq('student_id', studentId)
            .eq('active', true)
            .maybeSingle()

        const activeTrainerId = trainerRel?.trainer_id

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

        // Filter by day of week AND active relationship
        const filtered = (data || []).filter((a: any) => {
            // 1. Ownership check: Only active trainer or self can show
            const templateTrainerId = a.cardio?.trainer_id
            const isAllowedTrainer = templateTrainerId === studentId || (activeTrainerId && templateTrainerId === activeTrainerId)
            if (!isAllowedTrainer) return false

            // 2. Day check
            const hasDaysArray = a.days_of_week && Array.isArray(a.days_of_week) && a.days_of_week.length > 0;
            const hasDaySingular = a.day_of_week !== undefined && a.day_of_week !== null;

            if (hasDaysArray) return a.days_of_week.includes(today);
            if (hasDaySingular) return a.day_of_week === today;

            return true;
        })

        return filtered
    } catch (e) {
        console.error('Error in getTodayCardio:', e)
        return []
    }
}

export async function getCardioStatus(userId: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { start, end } = getTodayRangeBrazil()
    
    try {
        const { data, error } = await supabase
            .from('cardio_logs')
            .select('assigned_cardio_id, status, elapsed_seconds')
            .eq('student_id', userId)
            .gte('started_at', start)
            .lte('started_at', end)

        if (error) throw error
        return data || []
    } catch (e) {
        console.error('Error in getCardioStatus:', e)
        return []
    }
}

import { getTodayRangeBrazil } from '@/lib/date-utils'
