'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'

// === WORKOUTS ===
export async function createStudentWorkout(formData: FormData) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const providedId = formData.get('id')?.toString()
    const name = formData.get('name')?.toString().trim() || 'Novo Treino'
    const description = formData.get('description')?.toString().trim() || ''

    try {
        const { data, error } = await supabase
            .from('workouts')
            .upsert({
                ...(providedId ? { id: providedId } : {}),
                trainer_id: user.id,
                name,
                description,
            })
            .select('id')
            .single()

        if (error) throw error
        const workoutId = data.id

        // Deactivate previous for same day (if scheduled)
        // If it's a general assignment, deactivate all active for student?
        // Usually for auto-training it's better to manage per day if scheduled, 
        // but if no day is specified, maybe just deactivate all active ones?
        // Let's assume they want to replace their current plan.
        await supabase
            .from('assigned_workouts')
            .update({ active: false })
            .eq('student_id', user.id)
            .eq('active', true)

        // Auto-assign to self
        const { error: assignErr } = await supabase
            .from('assigned_workouts')
            .insert({
                workout_id: workoutId,
                student_id: user.id,
                active: true,
            })

        if (assignErr) {
            console.error('[STUDENT] Failed to auto-assign workout:', assignErr)
        }


        revalidateTag('workouts', 'page')
        revalidatePath('/dashboard/student/workouts')
        return { success: true, workoutId, redirectUrl: `/dashboard/student/workouts/${workoutId}` }
    } catch (e: any) {
        console.error('[STUDENT] Error creating workout:', e.message)
        return { success: false, error: e.message }
    }
}

export async function updateStudentWorkout(workoutId: string, formData: FormData) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const name = formData.get('name')?.toString().trim()
    const description = formData.get('description')?.toString().trim()

    try {
        const { error } = await supabase
            .from('workouts')
            .update({ name, description })
            .eq('id', workoutId)
            .eq('trainer_id', user.id)

        if (error) throw error

        revalidatePath('/dashboard/student/workouts')
        revalidatePath(`/dashboard/student/workout/${workoutId}`)
        redirect('/dashboard/student/workouts')
    } catch (e: any) {
        console.error('[STUDENT] Error updating workout:', e.message)
    }
}

export async function deleteStudentWorkout(workoutId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    console.log('[STUDENT] Deleting workout:', { workoutId, userId: user.id })

    try {
        // 1. First, unassign from self (deactivate)
        const { error: unassignError } = await supabase
            .from('assigned_workouts')
            .update({ active: false })
            .eq('workout_id', workoutId)
            .eq('student_id', user.id)

        if (unassignError) {
            console.error('[STUDENT] Failed to unassign workout:', unassignError)
        }

        // 2. 🚀 THE FIX: If the student created the workout (Auto-Training), hard-delete it 
        // so it actually disappears from the library and doesn't "reappear" on refetch.
        const { error: deleteError } = await supabase
            .from('workouts')
            .delete()
            .eq('id', workoutId)
            .eq('trainer_id', user.id)

        if (deleteError) {
            console.warn('[STUDENT] Workout not hard-deleted (may be owned by trainer):', deleteError.message)
        } else {
            console.log('[STUDENT] ✅ Workout hard-deleted from library')
        }

        revalidatePath('/dashboard/student/workouts')
        revalidatePath('/dashboard/student')
        return { success: true }
    } catch (e: any) {
        console.error('[STUDENT] Error deleting workout:', e.message)
        throw e
    }
}

import { assignDiet } from './diet-actions'

// === DIETS ===
export async function createStudentDiet(formData: FormData) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const providedId = formData.get('id')?.toString()
    const name = formData.get('name')?.toString().trim() || 'Nova Dieta'
    const daysOfWeekJson = formData.get('daysOfWeek')?.toString()
    const daysOfWeek = daysOfWeekJson ? JSON.parse(daysOfWeekJson) : [0, 1, 2, 3, 4, 5, 6]

    try {
        const { data, error } = await supabase
            .from('diets')
            .upsert({
                ...(providedId ? { id: providedId } : {}),
                trainer_id: user.id,
                name,
            })
            .select('id')
            .single()

        if (error) throw error
        const dietId = data.id

        // Use the unified assignDiet function which handles overlaps
        const assignResult = /* ❌ OUTBOX VIOLATION */ await assignDiet(dietId, user.id, daysOfWeek)

        if (assignResult.error) {
            console.error('[STUDENT] Failed to auto-assign diet:', assignResult.error)
        }


        revalidateTag('diets', 'page')
        revalidatePath('/dashboard/student/diet')
        return { success: true, dietId: data.id }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function updateStudentDiet(dietId: string, formData: FormData) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const name = formData.get('name')?.toString().trim()

    try {
        const { error } = await supabase
            .from('diets')
            .update({ name })
            .eq('id', dietId)
            .eq('trainer_id', user.id)

        if (error) throw error

        revalidatePath('/dashboard/student/diet')
        revalidatePath(`/dashboard/student/diet/${dietId}`)
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function deleteStudentDiet(dietId: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    try {
        // 1. Delete assignment first (if it's not cascaded)
        await supabase
            .from('assigned_diets')
            .delete()
            .eq('diet_id', dietId)
            .eq('student_id', user.id)

        // 2. Delete the diet record itself if the student is the "trainer" (owner)
        // This ensures the item disappears from the library
        await supabase
            .from('diets')
            .delete()
            .eq('id', dietId)
            .eq('trainer_id', user.id)

        revalidatePath('/dashboard/student/diet')
        revalidatePath('/dashboard/trainer/diets')
        revalidatePath('/dashboard/student')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

// === CARDIO ===
export async function createStudentCardio(formData: FormData) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const providedId = formData.get('id')?.toString()
    const name = formData.get('name')?.toString().trim() || 'Novo Cardio'
    const description = formData.get('description')?.toString().trim() || ''
    const duration = parseInt(formData.get('duration_minutes')?.toString() || '30')
    const intensity = formData.get('suggested_intensity')?.toString() || 'Moderada'

    try {
        const { data, error } = await supabase
            .from('cardios')
            .upsert({
                ...(providedId ? { id: providedId } : {}),
                trainer_id: user.id,
                name,
                description,
                duration_minutes: duration,
                suggested_intensity: intensity,
            })
            .select('id')
            .single()

        if (error) throw error

        // Auto-assign to self
        const { error: assignErr } = await supabase
            .from('assigned_cardios')
            .insert({
                student_id: user.id,
                cardio_id: data.id,
                duration_minutes: duration,
                suggested_intensity: intensity,
                active: true,
            })

        if (assignErr) {
            console.error('[STUDENT] Failed to auto-assign cardio:', assignErr)
        }

        revalidatePath('/dashboard/student/cardio')
        return { success: true, cardioId: data.id }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function updateStudentCardio(cardioId: string, formData: FormData) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const name = formData.get('name')?.toString().trim()
    const description = formData.get('description')?.toString().trim()

    try {
        const { error } = await supabase
            .from('cardios')
            .update({ name, description })
            .eq('id', cardioId)
            .eq('trainer_id', user.id)

        if (error) throw error

        revalidatePath('/dashboard/student/cardio')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function deleteStudentCardio(assignmentId: string, studentId?: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    try {
        // 1. If no studentId provided, we are likely in a generic delete template mode
        if (!studentId) {
            const { error: delError } = await supabase
                .from('cardios')
                .delete()
                .eq('id', assignmentId)
                .eq('trainer_id', user.id)
            
            if (delError) throw delError
            revalidatePath('/dashboard/trainer/cardio')
            return { success: true }
        }

        // 2. Handle Placeholder Assignment (ID starts with pc-)
        if (assignmentId.startsWith('pc-')) {
            const cardioId = assignmentId.replace('pc-', '')
            const { data: placeholder } = await supabase
                .from('pending_student_links')
                .select('*')
                .eq('id', studentId)
                .eq('trainer_id', user.id)
                .maybeSingle()

            if (!placeholder) throw new Error('Permission denied')

            const newCardioIds = (placeholder.cardio_ids || []).filter((id: string) => id !== cardioId)
            const ergo = (placeholder.ergogenic_data as any[]) || []
            const metaIdx = ergo.findIndex(e => e.__metadata)
            if (metaIdx !== -1) {
                const metadata = ergo[metaIdx]
                if (metadata.cardio_metadata) {
                    metadata.cardio_metadata = metadata.cardio_metadata.filter((m: any) => m.id !== cardioId)
                    ergo[metaIdx] = metadata
                }
            }

            const { error } = await supabase
                .from('pending_student_links')
                .update({ cardio_ids: newCardioIds, ergogenic_data: ergo })
                .eq('id', placeholder.id)

            if (error) throw error
        } else {
            // 3. Real Assignment Management
            // 🚀 THE FIX: If this is an auto-training student (user.id === studentId),
            // also try to delete the template from the 'cardios' table.
            if (user.id === studentId) {
                // Delete assignment
                await supabase
                    .from('assigned_cardios')
                    .delete()
                    .eq('id', assignmentId)
                    .eq('student_id', user.id)

                // Delete template (if owner)
                // Note: assignmentId might be the template ID or the assignment UUID.
                // In CardioPageClient, it passes cardio.id as the ID.
                await supabase
                    .from('cardios')
                    .delete()
                    .eq('id', assignmentId)
                    .eq('trainer_id', user.id)
            } else {
                // Trainer deleting a student's assignment
                const { error } = await supabase
                    .from('assigned_cardios')
                    .delete()
                    .eq('id', assignmentId)

                if (error) throw error
            }
        }

        revalidatePath('/dashboard/student/cardio')
        revalidatePath('/dashboard/trainer/cardio')
        revalidatePath('/dashboard/student')
        return { success: true }
    } catch (e: any) {
        console.error('[STUDENT-CONTENT] Error deleting cardio:', e.message)
        return { error: e.message }
    }
}

// === ERGOGENICS ===
export async function createStudentErgogenic(formData: FormData) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const providedId = formData.get('id')?.toString()
    const student_id = formData.get('student_id')?.toString() || user.id
    const name = formData.get('name')?.toString().trim() || ''
    const dosage = formData.get('dosage')?.toString().trim() || ''
    const weekly_dosage = parseInt(formData.get('weekly_dosage')?.toString() || '0')
    const unit = formData.get('unit')?.toString().trim() || 'ml'
    const application_days = JSON.parse(formData.get('application_days')?.toString() || '[]')
    const notes = formData.get('notes')?.toString().trim() || ''

    try {
        const { data, error } = await supabase
            .from('ergogenics')
            .upsert({
                ...(providedId ? { id: providedId } : {}),
                trainer_id: user.id,
                student_id: student_id,
                name,
                dosage,
                weekly_dosage,
                unit: (unit === 'mg' || unit === 'ml') ? unit : 'ml',
                application_days,
                notes,
                start_date: new Date().toISOString().split('T')[0]
            })
            .select('id')
            .single()

        if (error) throw error

        revalidatePath('/dashboard/student/ergogenics')
        revalidatePath(`/dashboard/trainer/students/${student_id}/ergogenics`)
        
        return { success: true, ergogenicId: data.id }
    } catch (e: any) {
        return { error: e.message }
    }
}
export async function updateStudentErgogenic(ergogenicId: string, formData: FormData) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const name = formData.get('name')?.toString().trim()
    const dosage = formData.get('dosage')?.toString().trim()
    const weekly_dosage = parseInt(formData.get('weekly_dosage')?.toString() || '0')
    const unit = formData.get('unit')?.toString().trim() || 'ml'
    const application_days = JSON.parse(formData.get('application_days')?.toString() || '[]')
    const notes = formData.get('notes')?.toString().trim()

    try {
        const { error } = await supabase
            .from('ergogenics')
            .update({
                name,
                dosage,
                weekly_dosage,
                unit: (unit === 'mg' || unit === 'ml') ? unit : 'ml',
                application_days,
                notes,
            })
            .eq('id', ergogenicId)
            .eq('student_id', user.id)

        if (error) throw error

        revalidatePath('/dashboard/student/ergogenics')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function deleteStudentErgogenic(ergogenicId: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    try {
        const { error } = await supabase
            .from('ergogenics')
            .delete()
            .eq('id', ergogenicId)
            .eq('student_id', user.id)

        if (error) throw error

        revalidatePath('/dashboard/student/ergogenics')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function assignCardioToStudent(cardioId: string, studentId: string | undefined | null, data: {
    duration?: number
    intensity?: string
    daysOfWeek: number[]
}) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    try {
        // Fetch cardio defaults from template if not provided
        const { data: template, error: templateErr } = await supabase
            .from('cardios')
            .select('duration_minutes, suggested_intensity')
            .eq('id', cardioId)
            .single()

        if (templateErr) throw templateErr

        const duration = data.duration ?? template.duration_minutes ?? 30
        const intensity = data.intensity ?? template.suggested_intensity ?? 'Moderada'

        const finalStudentId = studentId || user.id
        
        await supabase
            .from('assigned_cardios')
            .update({ active: false })
            .eq('cardio_id', cardioId)
            .eq('student_id', finalStudentId)

        // Create assignments for each selected day
        const assignments = data.daysOfWeek.map(day => ({
            student_id: finalStudentId,
            cardio_id: cardioId,
            duration_minutes: duration,
            suggested_intensity: intensity,
            day_of_week: day,
            active: true
        }))

        // Use timeout option and limit batch size
        const { error } = await supabase
            .from('assigned_cardios')
            .insert(assignments)
            .select('id')
            .limit(1)

        if (error) throw error

        revalidatePath('/dashboard/student/cardio')
        return { success: true }
    } catch (e: any) {
        return { error: e.message || 'Failed to assign cardio' }
    }
}

export async function assignErgogenic(ergogenicId: string, studentId: string, daysOfWeek: number[]) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    try {
        const { error } = await supabase
            .from('ergogenics')
            .update({
                application_days: daysOfWeek
            })
            .eq('id', ergogenicId)
            .eq('student_id', studentId)

        if (error) throw error

        revalidatePath('/dashboard/student/ergogenics')
        return { success: true }
    } catch (e: any) {
        return { error: e.message || 'Failed to assign ergogenic' }
    }
}

// Alias for registry compatibility
export const createManualCardio = createStudentCardio;
