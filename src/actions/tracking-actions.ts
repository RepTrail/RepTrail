'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { formatToBrazilDate } from '@/lib/date-utils'

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

        return { success: !error }
    } catch (e) {
        console.error("Exception in upsertDailyTracking", e)
        return { success: false }
    }
}

export async function ensureDailyTracking(userId: string) {
    const supabase = await createClient()
    const today = getTodayStr()
    const dow = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })).getDay()

    const [
        { data: existing },
        { data: aw },
        { data: ac },
        { data: steroids },
        { data: ae }
    ] = await Promise.all([
        supabase.from('daily_tracking').select('id, workout_status, cardio_status, ergogenics_status').eq('user_id', userId).eq('date', today).maybeSingle(),
        supabase.from('assigned_workouts').select('id').eq('student_id', userId).eq('day_of_week', dow).eq('active', true).maybeSingle(),
        supabase.from('assigned_cardios').select('id').eq('student_id', userId).eq('day_of_week', dow).eq('active', true).maybeSingle(),
        supabase.from('student_details').select('steroid_use').eq('id', userId).single(),
        supabase.from('ergogenics').select('application_days').eq('student_id', userId)
    ])

    const hasWorkout = !!aw
    const hasCardio = !!ac

    let hasErgo = false
    if (ae) {
        ae.forEach((a: any) => {
            let days = a.application_days
            if (typeof days === 'string') {
                try { days = JSON.parse(days) } catch { days = [] }
            }
            if (Array.isArray(days)) {
                if (days.map(Number).includes(dow)) hasErgo = true
            }
        })
    }

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
            await supabase
                .from('meal_item_logs')
                .insert({
                    user_id: user.id,
                    meal_item_id: itemId,
                    date: targetDate
                })
        } else {
            const { getTodayRangeBrazil } = await import('@/lib/date-utils')
            const { start, end } = getTodayRangeBrazil()

            // 1. Delete item log
            await supabase
                .from('meal_item_logs')
                .delete()
                .eq('user_id', user.id)
                .eq('meal_item_id', itemId)
                .eq('date', targetDate)

            // 2. Delete meal summary log (legacy) if it exists for this meal
            // Fetch the meal_id for this item to clean up meal_logs
            const { data: item } = await supabase
                .from('meal_items')
                .select('meal_id')
                .eq('id', itemId)
                .single()

            if (item?.meal_id) {
                await supabase
                    .from('meal_logs')
                    .delete()
                    .eq('student_id', user.id)
                    .eq('meal_id', item.meal_id)
                    .gte('consumed_at', start)
                    .lt('consumed_at', end)
            }
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
        const { data: items } = await supabase
            .from('meal_items')
            .select('id')
            .eq('meal_id', mealId)

        if (!items || items.length === 0) return { success: true }

        const itemIds = items.map(i => i.id)
        const { getTodayRangeBrazil } = await import('@/lib/date-utils')
        const { start, end } = getTodayRangeBrazil()

        if (status) {
            const rows = itemIds.map(id => ({
                user_id: user.id,
                meal_item_id: id,
                date: targetDate
            }))

            const { error } = await supabase
                .from('meal_item_logs')
                .insert(rows)

            if (error) throw error

            // Also log the meal summary
            await supabase
                .from('meal_logs')
                .insert({
                    student_id: user.id,
                    meal_id: mealId,
                    consumed_at: new Date().toISOString()
                })
        } else {
            // 1. Delete item logs
            const { error: itemError } = await supabase
                .from('meal_item_logs')
                .delete()
                .eq('user_id', user.id)
                .eq('date', targetDate)
                .in('meal_item_id', itemIds)

            if (itemError) throw itemError

            // 2. Delete meal summary log
            await supabase
                .from('meal_logs')
                .delete()
                .eq('student_id', user.id)
                .eq('meal_id', mealId)
                .gte('consumed_at', start)
                .lt('consumed_at', end)
        }

        revalidatePath('/dashboard/student')
        revalidatePath('/dashboard/student/diet')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function substituteMealItem(itemId: string, substituteData: any, date?: string) {
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
                substituted_quantity: substituteData.quantity,
                substituted_protein: substituteData.protein || 0,
                substituted_carbs: substituteData.carbs || 0,
                substituted_fat: substituteData.fat || 0,
                substituted_fiber: substituteData.fiber || 0
            }, {
                onConflict: 'user_id, meal_item_id, date'
            })

        if (error) throw error

        revalidatePath('/dashboard/student')
        revalidatePath('/dashboard/student/diet')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function toggleSubstitution(itemId: string, date?: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const targetDate = date || getTodayStr()

    try {
        const { data: log } = await supabase
            .from('meal_item_logs')
            .select('*')
            .eq('user_id', user.id)
            .eq('meal_item_id', itemId)
            .eq('date', targetDate)
            .maybeSingle()

        const { data: item } = await supabase
            .from('meal_items')
            .select('*')
            .eq('id', itemId)
            .single()

        if (!item) throw new Error('Item not found')

        if (log) {
            const newIsSubstituted = !log.is_substituted
            const { error: updateError } = await supabase
                .from('meal_item_logs')
                .update({
                    is_substituted: newIsSubstituted,
                    substituted_food_name: newIsSubstituted ? (item.sub_food_name || item.food_name) : null,
                    substituted_quantity: newIsSubstituted ? (item.sub_quantity || item.quantity) : null,
                    substituted_protein: newIsSubstituted ? (item.sub_protein ?? 0) : 0,
                    substituted_carbs: newIsSubstituted ? (item.sub_carbs ?? 0) : 0,
                    substituted_fat: newIsSubstituted ? (item.sub_fat ?? 0) : 0,
                    substituted_fiber: newIsSubstituted ? (item.sub_fiber ?? 0) : 0,
                })
                .eq('id', log.id)

            if (updateError) throw updateError
        } else {
            const { error: insertError } = await supabase
                .from('meal_item_logs')
                .insert({
                    user_id: user.id,
                    meal_item_id: itemId,
                    date: targetDate,
                    is_substituted: true,
                    substituted_food_name: item.sub_food_name || item.food_name,
                    substituted_quantity: item.sub_quantity || item.quantity,
                    substituted_protein: item.sub_protein || 0,
                    substituted_carbs: item.sub_carbs || 0,
                    substituted_fat: item.sub_fat || 0,
                    substituted_fiber: item.sub_fiber || 0,
                })

            if (insertError) throw insertError
        }

        revalidatePath('/dashboard/student')
        revalidatePath('/dashboard/student/diet')
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

    const { data: tracking } = await supabase
        .from('daily_tracking')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', targetDate)
        .maybeSingle()

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

    const todayStr = getTodayStr()
    const today = new Date(todayStr + 'T12:00:00')
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - (days - 1))
    const startDateStr = startDate.toISOString().split('T')[0]
    const endDateStr = todayStr

    const [
        { data: profile },
        { data: trainerLink },
        { data: tracking },
        { data: aw },
        { data: ac },
        { data: ad },
        { data: ae },
        { data: details },
        { data: wLogs },
        { data: cLogs },
        { data: eLogs },
        { data: mLogs }
    ] = await Promise.all([
        supabase.from('profiles').select('created_at').eq('id', user.id).single(),
        supabase.from('trainer_students').select('created_at').eq('student_id', user.id).eq('active', true).maybeSingle(),
        supabase.from('daily_tracking').select('*').eq('user_id', user.id).gte('date', startDateStr).lte('date', endDateStr).order('date', { ascending: true }),
        supabase.from('assigned_workouts').select('day_of_week').eq('student_id', user.id).eq('active', true),
        supabase.from('assigned_cardios').select('days_of_week, day_of_week').eq('student_id', user.id).eq('active', true),
        supabase.from('assigned_diets').select('days_of_week, diet:diets(meals(meal_items(id)))').eq('student_id', user.id).eq('active', true),
        supabase.from('ergogenics').select('application_days').eq('student_id', user.id),
        supabase.from('student_details').select('steroid_use').eq('id', user.id).single(),
        supabase.from('workout_logs').select('id, started_at, status').eq('student_id', user.id).eq('status', 'completed').gte('started_at', startDateStr + 'T00:00:00-03:00').lte('started_at', endDateStr + 'T23:59:59-03:00'),
        supabase.from('cardio_logs').select('started_at, status, elapsed_seconds, assignment:assigned_cardios(duration_minutes)').eq('student_id', user.id).in('status', ['completed', 'in_progress']).gte('started_at', startDateStr + 'T00:00:00-03:00').lte('started_at', endDateStr + 'T23:59:59-03:00'),
        supabase.from('ergogenic_logs').select('created_at').eq('student_id', user.id).gte('created_at', startDateStr + 'T00:00:00-03:00').lte('created_at', endDateStr + 'T23:59:59-03:00'),
        supabase.from('meal_item_logs').select('date, meal_item_id').eq('user_id', user.id).gte('date', startDateStr).lte('date', endDateStr)
    ])

    const historyArr: any[] = []
    const profileCreatedStr = profile?.created_at ? new Date(profile.created_at).toISOString().split('T')[0] : '2000-01-01'
    const linkDateStr = trainerLink?.created_at ? new Date(trainerLink.created_at).toISOString().split('T')[0] : '2000-01-01'
    const effectiveStartStr = linkDateStr > profileCreatedStr ? linkDateStr : profileCreatedStr

    const workoutDates = new Set(wLogs?.map(l => formatToBrazilDate(l.started_at)))
    const cardioDataMap = new Map<string, { status: string, percentage: number }>()
    cLogs?.forEach((l: any) => {
        const dateKey = formatToBrazilDate(l.started_at)
        const targetSeconds = (l.assignment?.duration_minutes || 30) * 60
        const percentage = Math.min(Math.round((l.elapsed_seconds / targetSeconds) * 100), 100)
        const existing = cardioDataMap.get(dateKey)
        if (!existing || percentage > existing.percentage) {
            cardioDataMap.set(dateKey, { status: l.status, percentage })
        }
    })

    const ergoLogsCount = new Map<string, number>()
    eLogs?.forEach((l: any) => {
        const dateKey = formatToBrazilDate(l.created_at)
        ergoLogsCount.set(dateKey, (ergoLogsCount.get(dateKey) || 0) + 1)
    })
    const steroidUse = !!details?.steroid_use
    const workoutDays = new Set((aw || []).map((a: any) => a.day_of_week))
    const cardioDays = new Set<number>()
    if (ac) {
        ac.forEach((a: any) => {
            if (Array.isArray(a.days_of_week)) {
                a.days_of_week.forEach((d: number) => cardioDays.add(d))
            } else if (a.day_of_week !== undefined && a.day_of_week !== null) {
                cardioDays.add(a.day_of_week)
            }
        })
    }
    const ergoDays = new Set<number>()
    if (ae) {
        ae.forEach((a: any) => {
            let days = a.application_days
            if (typeof days === 'string') {
                try { days = JSON.parse(days) } catch { days = [] }
            }
            if (Array.isArray(days)) {
                days.forEach((d: any) => ergoDays.add(Number(d)))
            }
        })
    }

    for (let i = 0; i < days; i++) {
        const currentDate = new Date(startDate)
        currentDate.setDate(startDate.getDate() + i)
        const dateStr = currentDate.toISOString().split('T')[0]
        const dow = currentDate.getDay()
        const isPast = dateStr < todayStr

        if (dateStr < effectiveStartStr) {
            historyArr.push({ date: dateStr, diet_percentage: 0, workout_status: 'none', workout_percentage: 0, cardio_status: 'none', cardio_percentage: 0, ergogenics_status: 'none', ergogenics_percentage: 0 })
            continue
        }

        const found = tracking?.find(t => t.date === dateStr)
        let workoutStatus = found?.workout_status || 'none'
        let workoutPercentage = found?.workout_percentage || 0
        if (workoutDates.has(dateStr)) {
            if (workoutStatus !== 'partial') workoutStatus = 'completed'
            if (workoutStatus === 'completed') workoutPercentage = 100
        } else {
            if (workoutStatus === 'none' && workoutDays.has(dow)) workoutStatus = 'assigned'
            if (workoutStatus === 'assigned' && isPast) workoutStatus = 'skipped'
        }

        let cardioStatus = found?.cardio_status || 'none'
        let cardioPercentage = found?.cardio_percentage || 0
        const logData = cardioDataMap.get(dateStr)
        if (logData) {
            if (cardioStatus === 'none' || cardioStatus === 'assigned' || cardioStatus === 'skipped') {
                cardioStatus = logData.status === 'completed' ? (logData.percentage >= 100 ? 'completed' : 'partial') : 'partial'
                cardioPercentage = logData.percentage
            } else if (cardioStatus === 'partial' && logData.percentage > cardioPercentage) {
                cardioPercentage = logData.percentage
            } else if (cardioStatus === 'completed') {
                cardioPercentage = 100
            }
        } else {
            if (cardioStatus === 'none' && cardioDays.has(dow)) cardioStatus = 'assigned'
            if (cardioStatus === 'assigned' && isPast) cardioStatus = 'skipped'
        }

        let ergoStatus = found?.ergogenics_status || 'none'
        let ergoPercentage = found?.ergogenics_percentage || 0
        
        let assignedErgosCount = 0
        if (ae) {
            ae.forEach((a: any) => {
                let days = a.application_days
                if (typeof days === 'string') {
                    try { days = JSON.parse(days) } catch { days = [] }
                }
                if (Array.isArray(days) && days.map(Number).includes(dow)) {
                    assignedErgosCount++
                }
            })
        }

        const logsCount = ergoLogsCount.get(dateStr) || 0

        if (logsCount > 0) {
            ergoPercentage = assignedErgosCount > 0 ? Math.min(Math.round((logsCount / assignedErgosCount) * 100), 100) : 100
            ergoStatus = ergoPercentage >= 100 ? 'completed' : 'partial'
        } else {
            if (assignedErgosCount === 0) {
                ergoStatus = 'none'
            } else {
                if (ergoStatus === 'none') ergoStatus = 'assigned'
                if (ergoStatus === 'assigned' && isPast) ergoStatus = 'skipped'
            }
        }

        let dietPercentage = found?.diet_percentage || 0
        let dietStatus = 'none'
        const dowDiets = (ad as any[] || []).filter((a: any) => { let days = a.days_of_week; if (typeof days === "string") { try { days = JSON.parse(days) } catch { days = [] } } return Array.isArray(days) && days.map(Number).includes(dow) })
        const totalItems = dowDiets.reduce((acc: number, a: any) => {
            const meals = a.diet?.meals || []
            return acc + meals.reduce((mAcc: number, m: any) => mAcc + (m.meal_items?.length || 0), 0)
        }, 0)

        if (dietPercentage === 0 && totalItems > 0) {
            const dayLogsCount = (mLogs || []).filter((l: any) => l.date === dateStr).length
            dietPercentage = Math.min(Math.round((dayLogsCount / totalItems) * 100), 100)
        }
        if (dietPercentage >= 100) dietStatus = 'completed'
        else if (dietPercentage > 0) dietStatus = 'partial'
        else if (totalItems > 0) {
            dietStatus = isPast ? 'skipped' : 'assigned'
        }

        historyArr.push({ date: dateStr, diet_percentage: dietPercentage, diet_status: dietStatus, workout_status: workoutStatus, workout_percentage: workoutPercentage, cardio_status: cardioStatus, cardio_percentage: cardioPercentage, ergogenics_status: ergoStatus, ergogenics_percentage: ergoPercentage })
    }

    return historyArr
}

export async function getStudentAdherenceHistory(studentId: string, days: number = 30) {
    const supabase = await createClient()
    const todayStr = getTodayStr()
    const today = new Date(todayStr + 'T12:00:00')
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - (days - 1))
    const startDateStr = startDate.toISOString().split('T')[0]

    const [
        { data: profile },
        { data: trainerLink },
        { data: tracking },
        { data: aw },
        { data: ac },
        { data: ae },
        { data: details },
        { data: wLogs },
        { data: cLogs },
        { data: eLogs },
        { data: ad },
        { data: mLogs }
    ] = await Promise.all([
        supabase.from('profiles').select('created_at').eq('id', studentId).single(),
        supabase.from('trainer_students').select('created_at').eq('student_id', studentId).eq('active', true).maybeSingle(),
        supabase.from('daily_tracking').select('*').eq('user_id', studentId).gte('date', startDateStr).lte('date', todayStr).order('date', { ascending: true }),
        supabase.from('assigned_workouts').select('day_of_week').eq('student_id', studentId).neq('active', false),
        supabase.from('assigned_cardios').select('day_of_week, days_of_week').eq('student_id', studentId).neq('active', false),
        supabase.from('ergogenics').select('application_days').eq('student_id', studentId),
        supabase.from('student_details').select('steroid_use').eq('id', studentId).single(),
        supabase.from('workout_logs').select('started_at, status').eq('student_id', studentId).eq('status', 'completed').gte('started_at', startDateStr + 'T00:00:00-03:00').lte('started_at', todayStr + 'T23:59:59-03:00'),
        supabase.from('cardio_logs').select('started_at, status, elapsed_seconds, assignment:assigned_cardios(duration_minutes)').eq('student_id', studentId).in('status', ['completed', 'in_progress']).gte('started_at', startDateStr + 'T00:00:00-03:00').lte('started_at', todayStr + 'T23:59:59-03:00'),
        supabase.from('ergogenic_logs').select('created_at').eq('student_id', studentId).gte('created_at', startDateStr + 'T00:00:00-03:00').lte('created_at', todayStr + 'T23:59:59-03:00'),
        supabase.from('assigned_diets').select('days_of_week, diet:diets(meals(meal_items(id)))').eq('student_id', studentId).eq('active', true),
        supabase.from('meal_item_logs').select('date, meal_item_id').eq('user_id', studentId).gte('date', startDateStr).lte('date', todayStr)
    ])

    const historyArr: any[] = []
    const profileCreatedStr = profile?.created_at ? new Date(profile.created_at).toISOString().split('T')[0] : '2000-01-01'
    const linkDateStr = trainerLink?.created_at ? new Date(trainerLink.created_at).toISOString().split('T')[0] : '2000-01-01'
    const effectiveStartStr = linkDateStr > profileCreatedStr ? linkDateStr : profileCreatedStr

    const workoutDates = new Set(wLogs?.map(l => formatToBrazilDate(l.started_at)))
    const cardioDataMap = new Map<string, { status: string, percentage: number }>()
    cLogs?.forEach((l: any) => {
        const dateKey = formatToBrazilDate(l.started_at)
        const targetSeconds = (l.assignment?.duration_minutes || 30) * 60
        const percentage = Math.min(Math.round((l.elapsed_seconds / targetSeconds) * 100), 100)
        const existing = cardioDataMap.get(dateKey)
        if (!existing || percentage > existing.percentage) {
            cardioDataMap.set(dateKey, { status: l.status, percentage })
        }
    })

    const ergoLogsCount = new Map<string, number>()
    eLogs?.forEach((l: any) => {
        const dateKey = formatToBrazilDate(l.created_at)
        ergoLogsCount.set(dateKey, (ergoLogsCount.get(dateKey) || 0) + 1)
    })
    const steroidUse = !!details?.steroid_use
    const workoutDays = new Set((aw || []).map((a: any) => a.day_of_week))
    const cardioDays = new Set<number>()
    if (ac) {
        ac.forEach((c: any) => {
            if (Array.isArray(c.days_of_week)) {
                c.days_of_week.forEach((day: number) => cardioDays.add(day))
            } else if (c.day_of_week !== undefined && c.day_of_week !== null) {
                cardioDays.add(c.day_of_week)
            }
        })
    }
    const ergogenicsDays = new Set<number>()
    if (ae) {
        ae.forEach((e: any) => {
            let days = e.application_days
            if (typeof days === 'string') {
                try { days = JSON.parse(days) } catch { days = [] }
            }
            if (Array.isArray(days)) {
                days.forEach((d: any) => ergogenicsDays.add(Number(d)))
            }
        })
    }

    for (let i = 0; i < days; i++) {
        const currentDate = new Date(startDate)
        currentDate.setDate(startDate.getDate() + i)
        const dateStr = currentDate.toISOString().split('T')[0]
        const dow = currentDate.getDay()
        const isPast = dateStr < todayStr

        if (dateStr < effectiveStartStr) {
            historyArr.push({ date: dateStr, diet_percentage: 0, workout_status: 'none', workout_percentage: 0, cardio_status: 'none', cardio_percentage: 0, ergogenics_status: 'none', ergogenics_percentage: 0 })
            continue
        }

        const found = tracking?.find((t: any) => t.date === dateStr)
        let workoutStatus = found?.workout_status || 'none'
        let workoutPercentage = found?.workout_percentage || 0
        if (workoutDates.has(dateStr)) {
            if (workoutStatus !== 'partial') workoutStatus = 'completed'
            if (workoutStatus === 'completed') workoutPercentage = 100
        } else {
            if (workoutStatus === 'none' && workoutDays.has(dow)) workoutStatus = 'assigned'
            if (workoutStatus === 'assigned' && isPast) workoutStatus = 'skipped'
        }

        let cardioStatus = found?.cardio_status || 'none'
        let cardioPercentage = found?.cardio_percentage || 0
        const logData = cardioDataMap.get(dateStr)
        if (logData) {
            if (cardioStatus === 'none' || cardioStatus === 'assigned' || cardioStatus === 'skipped') {
                cardioStatus = logData.status === 'completed' ? (logData.percentage >= 100 ? 'completed' : 'partial') : 'partial'
                cardioPercentage = logData.percentage
            } else if (cardioStatus === 'partial' && logData.percentage > cardioPercentage) {
                cardioPercentage = logData.percentage
            } else if (cardioStatus === 'completed') {
                cardioPercentage = 100
            }
        } else {
            if (cardioStatus === 'none' && cardioDays.has(dow)) cardioStatus = 'assigned'
            if (cardioStatus === 'assigned' && isPast) cardioStatus = 'skipped'
        }

        let ergoStatus = found?.ergogenics_status || 'none'
        let ergoPercentage = found?.ergogenics_percentage || 0
        
        let assignedErgosCount = 0
        if (ae) {
            ae.forEach((e: any) => {
                let days = e.application_days
                if (typeof days === 'string') {
                    try { days = JSON.parse(days) } catch { days = [] }
                }
                if (Array.isArray(days) && days.map(Number).includes(dow)) {
                    assignedErgosCount++
                }
            })
        }

        const logsCount = ergoLogsCount.get(dateStr) || 0

        if (logsCount > 0) {
            ergoPercentage = assignedErgosCount > 0 ? Math.min(Math.round((logsCount / assignedErgosCount) * 100), 100) : 100
            ergoStatus = ergoPercentage >= 100 ? 'completed' : 'partial'
        } else {
            if (assignedErgosCount === 0) {
                ergoStatus = 'none'
            } else {
                if (ergoStatus === 'none') ergoStatus = 'assigned'
                if (ergoStatus === 'assigned' && isPast) ergoStatus = 'skipped'
            }
        }

        let dietPercentage = found?.diet_percentage || 0
        let dietStatus = 'none'
        const dowDiets = (ad as any[] || []).filter((a: any) => { let days = a.days_of_week; if (typeof days === "string") { try { days = JSON.parse(days) } catch { days = [] } } return Array.isArray(days) && days.map(Number).includes(dow) })
        const totalItems = dowDiets.reduce((acc: number, a: any) => {
            const meals = a.diet?.meals || []
            return acc + meals.reduce((mAcc: number, m: any) => mAcc + (m.meal_items?.length || 0), 0)
        }, 0)

        if (dietPercentage === 0 && totalItems > 0) {
            const dayLogsCount = (mLogs || []).filter((l: any) => l.date === dateStr).length
            dietPercentage = Math.min(Math.round((dayLogsCount / totalItems) * 100), 100)
        }
        if (dietPercentage >= 100) dietStatus = 'completed'
        else if (dietPercentage > 0) dietStatus = 'partial'
        else if (totalItems > 0) {
            dietStatus = isPast ? 'skipped' : 'assigned'
        }

        historyArr.push({ date: dateStr, diet_percentage: dietPercentage, diet_status: dietStatus, workout_status: workoutStatus, workout_percentage: workoutPercentage, cardio_status: cardioStatus, cardio_percentage: cardioPercentage, ergogenics_status: ergoStatus, ergogenics_percentage: ergoPercentage })
    }

    return historyArr
}
