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

    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days + 1) // +1 to include today

    const { data: tracking } = await supabase
        .from('daily_tracking')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0])
        .order('date', { ascending: true })

    // Fill gaps
    const history = []
    for (let i = 0; i < days; i++) {
        const d = new Date(startDate)
        d.setDate(d.getDate() + i)
        const dateStr = d.toISOString().split('T')[0]

        const found = tracking?.find(t => t.date === dateStr)
        history.push(found || {
            date: dateStr,
            diet_percentage: 0,
            workout_status: 'none',
            cardio_status: 'none',
            ergogenics_status: 'none'
        })
    }

    return history
}

// Trainer-side version: fetch adherence history for any student by ID
export async function getStudentAdherenceHistory(studentId: string, days: number = 30) {
    const supabase = await createClient()

    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days + 1)

    const { data: tracking } = await supabase
        .from('daily_tracking')
        .select('*')
        .eq('user_id', studentId)
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0])
        .order('date', { ascending: true })

    const history = []
    for (let i = 0; i < days; i++) {
        const d = new Date(startDate)
        d.setDate(d.getDate() + i)
        const dateStr = d.toISOString().split('T')[0]

        const found = tracking?.find((t: any) => t.date === dateStr)
        history.push(found || {
            date: dateStr,
            diet_percentage: 0,
            workout_status: 'none',
            cardio_status: 'none',
            ergogenics_status: 'none'
        })
    }

    return history
}
