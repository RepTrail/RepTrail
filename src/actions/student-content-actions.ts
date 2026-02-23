'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// === WORKOUTS ===
export async function createStudentWorkout(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const name = formData.get('name')?.toString().trim() || 'Novo Treino'
    const description = formData.get('description')?.toString().trim() || ''

    try {
        const { data, error } = await supabase
            .from('workouts')
            .insert({
                trainer_id: user.id,
                name,
                description,
            })
            .select('id')
            .single()

        if (error) throw error

        // Auto-assign to self
        const { error: assignErr } = await supabase
            .from('assigned_workouts')
            .insert({
                workout_id: data.id,
                student_id: user.id,
                active: true,
            })

        if (assignErr) {
            console.error('[STUDENT] Failed to auto-assign workout:', assignErr)
        }

        revalidatePath('/dashboard/student/workouts')
        redirect('/dashboard/student/workouts')
    } catch (e: any) {
        console.error('[STUDENT] Error creating workout:', e.message)
    }
}

export async function updateStudentWorkout(workoutId: string, formData: FormData) {
    const supabase = await createClient()
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
        // First, unassign from self
        const { error: unassignError } = await supabase
            .from('assigned_workouts')
            .update({ active: false })
            .eq('workout_id', workoutId)
            .eq('student_id', user.id)

        if (unassignError) {
            console.error('[STUDENT] Failed to unassign workout:', unassignError)
        }

        // NOTE: In auto-training student flow we do NOT hard-delete workouts.
        // We only deactivate the assignment so it disappears from the library/home.
        console.log('[STUDENT] ✅ Workout unassigned (soft delete)')
        revalidatePath('/dashboard/student/workouts')
    } catch (e: any) {
        console.error('[STUDENT] Error deleting workout:', e.message)
        throw e
    }
}

// === DIETS ===
export async function createStudentDiet(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const name = formData.get('name')?.toString().trim() || 'Nova Dieta'

    try {
        const { data, error } = await supabase
            .from('diets')
            .insert({
                trainer_id: user.id,
                name,
            })
            .select('id')
            .single()

        if (error) throw error

        // Auto-assign to self
        const { error: assignErr } = await supabase
            .from('assigned_diets')
            .insert({
                diet_id: data.id,
                student_id: user.id,
                active: true,
            })

        if (assignErr) {
            console.error('[STUDENT] Failed to auto-assign diet:', assignErr)
        }

        revalidatePath('/dashboard/student/diet')
        return { success: true, dietId: data.id }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function updateStudentDiet(dietId: string, formData: FormData) {
    const supabase = await createClient()
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
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    try {
        // Unassign first
        await supabase
            .from('assigned_diets')
            .update({ active: false })
            .eq('diet_id', dietId)
            .eq('student_id', user.id)

        // NOTE: In auto-training student flow we do NOT hard-delete diets.
        // We only deactivate the assignment so it disappears from the daily view.
        revalidatePath('/dashboard/student/diet')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

// === CARDIO ===
export async function createStudentCardio(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const name = formData.get('name')?.toString().trim() || 'Novo Cardio'
    const description = formData.get('description')?.toString().trim() || ''

    try {
        const { data, error } = await supabase
            .from('cardios')
            .insert({
                trainer_id: user.id,
                name,
                description,
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
                duration_minutes: 30,
                suggested_intensity: 'Moderado',
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
    const supabase = await createClient()
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

export async function deleteStudentCardio(cardioId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    try {
        // Unassign first
        await supabase
            .from('assigned_cardios')
            .update({ active: false })
            .eq('cardio_id', cardioId)
            .eq('student_id', user.id)

        // Delete cardio
        const { error } = await supabase
            .from('cardios')
            .delete()
            .eq('id', cardioId)
            .eq('trainer_id', user.id)

        if (error) throw error

        revalidatePath('/dashboard/student/cardio')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

// === ERGOGENICS ===
export async function createStudentErgogenic(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const name = formData.get('name')?.toString().trim() || ''
    const dosage = formData.get('dosage')?.toString().trim() || ''
    const weekly_dosage = parseInt(formData.get('weekly_dosage')?.toString() || '0')
    const unit = formData.get('unit')?.toString().trim() || 'ml'
    const application_days = JSON.parse(formData.get('application_days')?.toString() || '[]')
    const notes = formData.get('notes')?.toString().trim() || ''

    try {
        const { data, error } = await supabase
            .from('ergogenics')
            .insert({
                trainer_id: user.id,
                student_id: user.id,
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
        return { success: true, ergogenicId: data.id }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function updateStudentErgogenic(ergogenicId: string, formData: FormData) {
    const supabase = await createClient()
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
            .eq('trainer_id', user.id)
            .eq('student_id', user.id)

        if (error) throw error

        revalidatePath('/dashboard/student/ergogenics')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function deleteStudentErgogenic(ergogenicId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    try {
        const { error } = await supabase
            .from('ergogenics')
            .delete()
            .eq('id', ergogenicId)
            .eq('trainer_id', user.id)
            .eq('student_id', user.id)

        if (error) throw error

        revalidatePath('/dashboard/student/ergogenics')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function assignCardioToStudent(cardioId: string, data: {
    duration: number
    intensity: string
    daysOfWeek: number[]
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    try {
        // Create assignments for each selected day
        const assignments = data.daysOfWeek.map(day => ({
            student_id: user.id,
            cardio_id: cardioId,
            duration_minutes: data.duration,
            intensity: data.intensity,
            day_of_week: day,
            active: true
        }))

        const { error } = await supabase
            .from('assigned_cardios')
            .insert(assignments)

        if (error) throw error

        revalidatePath('/dashboard/student/cardio')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}
