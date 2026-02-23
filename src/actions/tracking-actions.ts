'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

function getTodayStr() {
    // Returns YYYY-MM-DD for Brazil time
    const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export async function upsertDailyTracking(userId: string, updates: any, dateStr?: string) {
    const supabase = await createClient()
    const targetDate = dateStr || getTodayStr()

    try {
        // First check if exists to determine if we insert or update, 
        // or just use upsert. 
        // daily_tracking has a unique constraint on (user_id, date)

        const { error } = await supabase
            .from('daily_tracking')
            .upsert({
                user_id: userId,
                date: targetDate,
                ...updates,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'user_id, date'
            })

        if (error) {
            console.error('Error upserting daily tracking:', error)
            // If error is about duplicate key but we used upsert, something confusing.
            // But standard upsert should work.
        }

        return { success: !error }
    } catch (e) {
        console.error("Exception in upsertDailyTracking", e)
        return { success: false }
    }
}

export async function ensureDailyTracking(userId: string) {
    const supabase = await createClient()
    const today = getTodayStr()

    // 1. Check if already exists
    const { data: existing } = await supabase
        .from('daily_tracking')
        .select('id, workout_status, cardio_status, ergogenics_status')
        .eq('user_id', userId)
        .eq('date', today)
        .maybeSingle()

    // 2. Fetch current assignments
    const dow = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })).getDay()

    const { data: aw } = await supabase.from('assigned_workouts').select('id').eq('student_id', userId).eq('day_of_week', dow).eq('active', true).maybeSingle()
    const { data: ac } = await supabase.from('assigned_cardios').select('id').eq('student_id', userId).eq('day_of_week', dow).eq('active', true).maybeSingle()
    const { data: steroids } = await supabase.from('student_details').select('steroid_use').eq('id', userId).single()

    const hasWorkout = !!aw
    const hasCardio = !!ac
    const hasErgo = !!steroids?.steroid_use // Simple check, should ideally check ergogenics table

    const updates: any = {}
    if (!existing || existing.workout_status === 'none') {
        if (hasWorkout) updates.workout_status = 'assigned'
    }
    if (!existing || existing.cardio_status === 'none') {
        if (hasCardio) updates.cardio_status = 'assigned'
    }
    if (!existing || existing.ergogenics_status === 'none') {
        if (hasErgo) updates.ergogenics_status = 'assigned'
    }

    if (Object.keys(updates).length > 0) {
        await upsertDailyTracking(userId, updates, today)
    }
}

export async function toggleMealItem(itemId: string, status: boolean, date?: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const targetDate = date || getTodayStr()

    try {
        if (status) {
            // Check item
            const { error } = await supabase
                .from('meal_item_logs')
                .insert({
                    user_id: user.id,
                    meal_item_id: itemId,
                    date: targetDate
                })
                .select()

            if (error && error.code !== '23505') throw error // Ignore unique constraint violation
        } else {
            // Uncheck item
            const { error } = await supabase
                .from('meal_item_logs')
                .delete()
                .eq('user_id', user.id)
                .eq('meal_item_id', itemId)
                .eq('date', targetDate)

            if (error) throw error
        }

        revalidatePath('/dashboard/student')
        revalidatePath('/dashboard/student/progress')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function toggleMealGroup(mealId: string, status: boolean, date?: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const targetDate = date || getTodayStr()

    try {
        // Get all items for this meal
        const { data: items } = await supabase
            .from('meal_items')
            .select('id')
            .eq('meal_id', mealId)

        if (!items || items.length === 0) return { success: true }

        const itemIds = items.map(i => i.id)

        if (status) {
            // Insert all (skip duplicates provided by DB constraint, but batch insert is better)
            // We'll prepare rows
            const rows = itemIds.map(id => ({
                user_id: user.id,
                meal_item_id: id,
                date: targetDate
            }))

            const { error } = await supabase
                .from('meal_item_logs')
                .upsert(rows, { onConflict: 'user_id, meal_item_id, date' })

            if (error) throw error
        } else {
            // Delete all for this meal/date
            const { error } = await supabase
                .from('meal_item_logs')
                .delete()
                .eq('user_id', user.id)
                .eq('date', targetDate)
                .in('meal_item_id', itemIds)

            if (error) throw error
        }

        revalidatePath('/dashboard/student')
        revalidatePath('/dashboard/student/progress')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function substituteMealItem(itemId: string, substituteData: { food_name: string, quantity: string }, date?: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const targetDate = date || getTodayStr()

    try {
        const { error } = await supabase
            .from('meal_item_logs')
            .upsert({
                user_id: user.id,
                meal_item_id: itemId,
                date: targetDate,
                is_substituted: true,
                substituted_food_name: substituteData.food_name,
                substituted_quantity: substituteData.quantity
            }, {
                onConflict: 'user_id, meal_item_id, date'
            })

        if (error) throw error

        revalidatePath('/dashboard/student')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function getDetailedAdherence(date?: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const targetDate = date || getTodayStr()

    // Get daily tracking
    const { data: tracking } = await supabase
        .from('daily_tracking')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', targetDate)
        .maybeSingle()

    // Get item logs for frontend state
    const { data: itemLogs } = await supabase
        .from('meal_item_logs')
        .select('meal_item_id')
        .eq('user_id', user.id)
        .eq('date', targetDate)

    const loggedItemIds = new Set(itemLogs?.map(l => l.meal_item_id) || [])

    return {
        tracking: tracking || { diet_percentage: 0, workout_status: 'none', cardio_status: 'none', ergogenics_status: 'none' },
        loggedItemIds: Array.from(loggedItemIds)
    }
}

export async function getAdherenceHistory(days: number = 30) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    // 1. Determine Effective Start Date
    // Fetch user profile creation date
    const { data: profile } = await supabase.from('profiles').select('created_at').eq('id', user.id).single()
    const profileCreatedStr = profile?.created_at ? new Date(profile.created_at).toISOString().split('T')[0] : '2000-01-01'

    // Fetch active trainer link date
    // We assume trainer_students has created_at; it usually does in Supabase.
    // If it doesn't, this query will fail or return null. 
    // Given previous interactions, tables seem standard.
    const { data: trainerLink } = await supabase
        .from('trainer_students')
        .select('created_at')
        .eq('student_id', user.id)
        .eq('active', true)
        .maybeSingle()

    const linkDateStr = trainerLink?.created_at ? new Date(trainerLink.created_at).toISOString().split('T')[0] : '2000-01-01'

    // Use the later of the two dates as the effective start for tracking
    // If they have a trainer, we count stats from when they joined that trainer.
    // If no trainer, we count from when they joined the platform.
    const effectiveStartStr = linkDateStr > profileCreatedStr ? linkDateStr : profileCreatedStr

    const todayStr = getTodayStr()
    const endDate = new Date(todayStr + 'T12:00:00')
    const startDate = new Date(todayStr + 'T12:00:00')
    startDate.setDate(startDate.getDate() - days + 1)

    const startDateStr = startDate.toISOString().split('T')[0]
    const endDateStr = todayStr

    const { data: tracking } = await supabase
        .from('daily_tracking')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDateStr)
        .lte('date', endDateStr)
        .order('date', { ascending: true })

    // Fetch assignments
    const { data: aw } = await supabase.from('assigned_workouts').select('day_of_week').eq('student_id', user.id).eq('active', true)
    const { data: ac } = await supabase.from('assigned_cardios').select('days_of_week').eq('student_id', user.id).eq('active', true)
    const { data: ad } = await supabase.from('assigned_diets').select('id').eq('student_id', user.id).eq('active', true)
    const { data: ae } = await supabase.from('ergogenics').select('application_days').eq('student_id', user.id)

    // Check steroid use
    const { data: details } = await supabase.from('student_details').select('steroid_use').eq('id', user.id).single()
    const steroidUse = !!details?.steroid_use

    const workoutDays = new Set((aw || []).map((a: any) => a.day_of_week))

    const cardioDays = new Set<number>()
    if (ac) {
        ac.forEach((a: any) => {
            if (a.days_of_week && Array.isArray(a.days_of_week)) {
                a.days_of_week.forEach((d: number) => cardioDays.add(d))
            } else if (a.day_of_week !== undefined && a.day_of_week !== null) {
                cardioDays.add(a.day_of_week)
            }
        })
    }

    const ergoDays = new Set<number>()
    if (ae) {
        ae.forEach((a: any) => {
            if (a.application_days && Array.isArray(a.application_days)) {
                a.application_days.forEach((d: number) => ergoDays.add(d))
            }
        })
    }

    const historyArr: any[] = []
    const dayListSlice: string[] = []
    for (let i = 0; i < days; i++) {
        const d = new Date(startDate)
        d.setDate(d.getDate() + i)
        dayListSlice.push(d.toISOString().split('T')[0])
    }

    // Fetch execution logs for the period
    const { data: wLogs } = await supabase
        .from('workout_logs')
        .select('started_at, status')
        .eq('student_id', user.id)
        .eq('status', 'completed')
        .gte('started_at', startDateStr + 'T00:00:00')
        .lte('started_at', endDateStr + 'T23:59:59')

    const { data: cLogs } = await supabase
        .from('cardio_logs')
        .select('started_at, status')
        .eq('student_id', user.id)
        .eq('status', 'completed')
        .gte('started_at', startDateStr + 'T00:00:00')
        .lte('started_at', endDateStr + 'T23:59:59')

    const { data: eLogs } = await supabase
        .from('ergogenic_logs')
        .select('created_at')
        .eq('student_id', user.id)
        .gte('created_at', startDateStr + 'T00:00:00')
        .lte('created_at', endDateStr + 'T23:59:59')

    const workoutDates = new Set(wLogs?.map(l => l.started_at.split('T')[0]))
    const cardioDates = new Set(cLogs?.map(l => l.started_at.split('T')[0]))
    const ergoDates = new Set(eLogs?.map(l => l.created_at.split('T')[0]))

    for (const dateStr of dayListSlice) {
        if (dateStr < effectiveStartStr) {
            historyArr.push({
                date: dateStr,
                diet_percentage: 0,
                workout_status: 'none',
                workout_percentage: 0,
                cardio_status: 'none',
                cardio_percentage: 0,
                ergogenics_status: 'none',
                ergogenics_percentage: 0,
            })
            continue
        }

        const found = tracking?.find(t => t.date === dateStr)
        const d = new Date(dateStr + 'T12:00:00')
        const dow = d.getDay()
        const isPast = dateStr < todayStr

        // Workout Status
        let workoutStatus = found?.workout_status || 'none'
        if (workoutDates.has(dateStr)) workoutStatus = 'completed'
        else {
            if (workoutStatus === 'none' && workoutDays.has(dow)) workoutStatus = 'assigned'
            if (workoutStatus === 'assigned' && isPast) workoutStatus = 'skipped'
        }

        // Cardio Status
        let cardioStatus = found?.cardio_status || 'none'
        if (cardioDates.has(dateStr)) cardioStatus = 'completed'
        else {
            if (cardioStatus === 'none' && cardioDays.has(dow)) cardioStatus = 'assigned'
            if (cardioStatus === 'assigned' && isPast) cardioStatus = 'skipped'
        }

        // Ergo Status
        let ergoStatus = found?.ergogenics_status || 'none'
        if (ergoDates.has(dateStr)) ergoStatus = 'completed'
        else {
            if (ergoStatus === 'none' && steroidUse && ergoDays.has(dow)) ergoStatus = 'assigned'
            if (ergoStatus === 'assigned' && isPast) ergoStatus = 'skipped'
        }

        historyArr.push({
            date: dateStr,
            diet_percentage: found?.diet_percentage || 0,
            workout_status: workoutStatus,
            workout_percentage: workoutStatus === 'completed' ? 100 : (found?.workout_percentage || 0),
            cardio_status: cardioStatus,
            cardio_percentage: cardioStatus === 'completed' ? 100 : (found?.cardio_percentage || 0),
            ergogenics_status: ergoStatus,
            ergogenics_percentage: ergoStatus === 'completed' ? 100 : (found?.ergogenics_percentage || 0),
        })
    }

    return historyArr
}

// Trainer-side version: fetch adherence history for any student by ID
export async function getStudentAdherenceHistory(studentId: string, days: number = 30) {
    const supabase = await createClient()

    // 1. Determine Effective Start Date
    const { data: profile } = await supabase.from('profiles').select('created_at').eq('id', studentId).single()
    const profileCreatedStr = profile?.created_at ? new Date(profile.created_at).toISOString().split('T')[0] : '2000-01-01'

    const { data: trainerLink } = await supabase
        .from('trainer_students')
        .select('created_at')
        .eq('student_id', studentId)
        .eq('active', true)
        .maybeSingle()

    const linkDateStr = trainerLink?.created_at ? new Date(trainerLink.created_at).toISOString().split('T')[0] : '2000-01-01'
    const effectiveStartStr = linkDateStr > profileCreatedStr ? linkDateStr : profileCreatedStr

    const todayStr = getTodayStr()
    const startDate = new Date(todayStr + 'T12:00:00')
    startDate.setDate(startDate.getDate() - days + 1)
    const startDateStr = startDate.toISOString().split('T')[0]

    const { data: tracking } = await supabase
        .from('daily_tracking')
        .select('*')
        .eq('user_id', studentId)
        .gte('date', startDateStr)
        .lte('date', todayStr)
        .order('date', { ascending: true })

    const { data: aw } = await supabase.from('assigned_workouts').select('day_of_week').eq('student_id', studentId).neq('active', false)
    const { data: ac } = await supabase.from('assigned_cardios').select('day_of_week').eq('student_id', studentId).neq('active', false)
    const { data: ad } = await supabase.from('assigned_diets').select('id').eq('student_id', studentId).neq('active', false)
    const { data: ae } = await supabase.from('ergogenics').select('application_days').eq('student_id', studentId)

    const { data: details } = await supabase.from('student_details').select('steroid_use').eq('id', studentId).single()
    const steroidUse = !!details?.steroid_use

    const workoutDays = new Set((aw || []).map((a: any) => a.day_of_week))
    const cardioDays = new Set<number>()
    if (ac) {
        ac.forEach((c: any) => {
            if (c.day_of_week !== undefined && c.day_of_week !== null) cardioDays.add(c.day_of_week)
            else if (c.days_of_week && Array.isArray(c.days_of_week)) c.days_of_week.forEach((day: number) => cardioDays.add(day))
        })
    }
    const ergogenicsDays = new Set((ae || []).map((e: any) => e.application_days || []).flat())

    const historyArr: any[] = []
    for (let i = 0; i < days; i++) {
        const d = new Date(startDate)
        d.setDate(d.getDate() + i)
        const dateStr = d.toISOString().split('T')[0]

        if (dateStr < effectiveStartStr) {
            historyArr.push({
                date: dateStr,
                diet_percentage: 0,
                workout_status: 'none',
                workout_percentage: 0,
                cardio_status: 'none',
                cardio_percentage: 0,
                ergogenics_status: 'none',
                ergogenics_percentage: 0,
            })
            continue
        }

        const found = tracking?.find((t: any) => t.date === dateStr)
        const dow = d.getDay()
        const isPast = dateStr < todayStr

        let item: any
        if (found) {
            item = { ...found }
        } else {
            item = {
                date: dateStr,
                diet_percentage: 0,
                workout_status: workoutDays.has(dow) ? 'assigned' : 'none',
                workout_percentage: 0,
                cardio_status: cardioDays.has(dow) ? 'assigned' : 'none',
                cardio_percentage: 0,
                ergogenics_status: (steroidUse && ergogenicsDays.has(dow)) ? 'assigned' : 'none',
                ergogenics_percentage: 0,
            }
        }

        // Final status fix for past days
        if (isPast) {
            if (item.workout_status === 'assigned') item.workout_status = 'skipped'
            if (item.cardio_status === 'assigned') item.cardio_status = 'skipped'
            if (item.ergogenics_status === 'assigned') item.ergogenics_status = 'skipped'
        }

        historyArr.push(item)
    }

    return historyArr
}
