'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Helper para pegar a data atual no Brasil (Y-m-d)
function getTodayStrBrazil() {
    const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

function getTodayRangeBrazil() {
    const todayStr = getTodayStrBrazil()

    // Cria data start as 00:00 BRT (UTC-3)
    const start = new Date(`${todayStr}T00:00:00-03:00`)
    // Cria data end as 23:59:59.999 BRT
    const end = new Date(`${todayStr}T23:59:59.999-03:00`)

    return {
        start: start.toISOString(),
        end: end.toISOString()
    }
}

export async function getTrainerDiets() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data } = await supabase
        .from('diets')
        .select(`
            *,
            meals(count)
        `)
        .eq('trainer_id', user.id)
        .order('created_at', { ascending: false })

    return data || []
}

export async function createManualDiet(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const name = formData.get('name')?.toString().trim() || 'Nova Dieta'

    try {
        const { data, error } = await supabase
            .from('diets')
            .insert({
                trainer_id: user.id,
                name
            })
            .select('id')
            .single()

        if (error) throw error

        revalidatePath('/dashboard/trainer/diets')
        return { success: true, dietId: data.id }

    } catch (e: any) {
        return { error: e.message }
    }
}

export async function deleteDiet(dietId: string) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('diets')
            .delete()
            .eq('id', dietId)

        if (error) throw error

        revalidatePath('/dashboard/trainer/diets')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function updateDietMeta(dietId: string, name: string) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('diets')
            .update({ name: name.trim() })
            .eq('id', dietId)

        if (error) throw error

        revalidatePath('/dashboard/trainer/diets')
        revalidatePath(`/dashboard/trainer/diets/${dietId}`)
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function duplicateDiet(dietId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    try {
        // 1. Fetch original diet with all meals and items
        const { data: original, error: fetchErr } = await supabase
            .from('diets')
            .select(`*, meals(*, meal_items(*))`)
            .eq('id', dietId)
            .single()
        if (fetchErr || !original) throw fetchErr || new Error('Diet not found')

        // 2. Create copy of diet
        const { data: newDiet, error: dietErr } = await supabase
            .from('diets')
            .insert({ trainer_id: user.id, name: `${original.name} (cópia)` })
            .select('id')
            .single()
        if (dietErr || !newDiet) throw dietErr || new Error('Failed to create diet copy')

        // 3. Copy each meal and its items
        const meals: any[] = original.meals || []
        for (const meal of meals) {
            const { data: newMeal, error: mealErr } = await supabase
                .from('meals')
                .insert({
                    diet_id: newDiet.id,
                    name: meal.name,
                    time_of_day: meal.time_of_day,
                    order_index: meal.order_index,
                    notes: meal.notes
                })
                .select('id')
                .single()
            if (mealErr || !newMeal) continue

            if (meal.meal_items && meal.meal_items.length > 0) {
                const newItems = meal.meal_items.map(({ id, meal_id, ...rest }: any) => ({
                    ...rest,
                    meal_id: newMeal.id
                }))
                await supabase.from('meal_items').insert(newItems)
            }
        }

        revalidatePath('/dashboard/trainer/diets')
        return { success: true, newId: newDiet.id }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function assignDiet(dietId: string, studentId: string) {
    const supabase = await createClient()

    try {
        // Check if already assigned (even if inactive)
        const { data: existing } = await supabase
            .from('assigned_diets')
            .select('id, active')
            .eq('diet_id', dietId)
            .eq('student_id', studentId)
            .maybeSingle()

        if (existing) {
            if (existing.active) {
                return { success: true, message: 'Esta dieta já está assinada.' }
            }
            // Reactivate inactive one
            const { error } = await supabase
                .from('assigned_diets')
                .update({ active: true })
                .eq('id', existing.id)

            if (error) throw error
        } else {
            // New assignment
            const { error } = await supabase
                .from('assigned_diets')
                .insert({
                    diet_id: dietId,
                    student_id: studentId,
                    active: true
                })

            if (error) throw error
        }

        revalidatePath('/dashboard/trainer/students')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function unassignDiet(dietId: string, studentId: string) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('assigned_diets')
            .update({ active: false })
            .eq('diet_id', dietId)
            .eq('student_id', studentId)
            .eq('active', true)

        if (error) throw error

        revalidatePath('/dashboard/trainer/students')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function getDietDetails(dietId: string) {
    const supabase = await createClient()

    const { data: diet } = await supabase
        .from('diets')
        .select(`
            *,
            meals(
                *,
                meal_items(*)
            )
        `)
        .eq('id', dietId)
        .single()

    if (!diet) return null

    // Sort meals by order_index
    if (diet.meals) {
        diet.meals.sort((a: any, b: any) => a.order_index - b.order_index)
        diet.meals.forEach((meal: any) => {
            if (meal.meal_items) {
                // Keep order if we had one, for now they are insertion order
            }
        })
    }

    return diet
}

export async function addMealToDiet(dietId: string, name: string, timeOfDay: string) {
    const supabase = await createClient()

    try {
        const { data: existing } = await supabase
            .from('meals')
            .select('order_index')
            .eq('diet_id', dietId)
            .order('order_index', { ascending: false })
            .limit(1)

        const nextIndex = (existing?.[0]?.order_index ?? -1) + 1

        const { error } = await supabase
            .from('meals')
            .insert({
                diet_id: dietId,
                name,
                time_of_day: timeOfDay,
                order_index: nextIndex
            })

        if (error) throw error

        revalidatePath(`/dashboard/trainer/diets/${dietId}`)
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function addMealItem(mealId: string, dietId: string, data: any) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('meal_items')
            .insert({
                meal_id: mealId,
                ...data
            })

        if (error) throw error

        revalidatePath(`/dashboard/trainer/diets/${dietId}`)
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function updateMealItem(id: string, dietId: string, data: any) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('meal_items')
            .update(data)
            .eq('id', id)

        if (error) throw error

        revalidatePath(`/dashboard/trainer/diets/${dietId}`)
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function removeMealItem(id: string, dietId: string) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('meal_items')
            .delete()
            .eq('id', id)

        if (error) throw error

        revalidatePath(`/dashboard/trainer/diets/${dietId}`)
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function removeMeal(id: string, dietId: string) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('meals')
            .delete()
            .eq('id', id)

        if (error) throw error

        revalidatePath(`/dashboard/trainer/diets/${dietId}`)
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}
export async function estimateMacros(foodName: string, quantity: string) {
    try {
        const { createOpenRouterClient, callAI } = await import('@/lib/ai-client');
        const client = createOpenRouterClient();

        const prompt = `
You are a nutrition expert. Estimate the macronutrients for this food item.
Food: ${foodName}
Quantity: ${quantity || '1 portion'}

Return ONLY a JSON object with this exact structure (no markdown):
{"protein": number, "carbs": number, "fat": number}
Use integers or decimals.
`;

        const macros = await callAI<{ protein: number; carbs: number; fat: number }>(client, prompt);
        return { success: true, macros };
    } catch (e: any) {
        console.error("AI Macro Estimation Error:", e.message);
        return { error: e.message };
    }
}

export async function estimateAllDietMacros(dietId: string) {
    console.log(`[MACRO_ESTIMATE] Starting for diet: ${dietId}`)
    const supabase = await createClient()

    try {
        // 1. Get all items
        const { data: diet, error: fetchErr } = await supabase
            .from('diets')
            .select(`*, meals(*, meal_items(*))`)
            .eq('id', dietId)
            .single()

        if (fetchErr || !diet) {
            console.error(`[MACRO_ESTIMATE] Fetch error:`, fetchErr)
            throw fetchErr || new Error('Diet not found')
        }

        const allItems: any[] = []
        diet.meals.forEach((m: any) => {
            if (m.meal_items) allItems.push(...m.meal_items)
        })

        console.log(`[MACRO_ESTIMATE] Found ${allItems.length} items.`)
        if (allItems.length === 0) return { success: true }

        const { createOpenRouterClient, callAI } = await import('@/lib/ai-client');
        const client = createOpenRouterClient();

        const itemsList = allItems.map((item, idx) => `${idx}: ${item.food_name} (${item.quantity || '1 portion'})`).join('\n')

        const prompt = `
You are a nutrition expert. Estimate the macronutrients (Protein, Carbs, Fat) AND Dietary Fiber for each food item in the list below. 
It is very important to provide realistic fiber values for vegetables, grains, and fruits.

Items:
${itemsList}

Return ONLY a JSON array of objects with this exact structure (no markdown):
[
  {"index": 0, "protein": number, "carbs": number, "fat": number, "fiber": number},
  ...
]
`;

        console.log(`[MACRO_ESTIMATE] Requesting AI calculation with Fiber...`)
        const results = await callAI<any[]>(client, prompt);
        console.log(`[MACRO_ESTIMATE] AI returned ${results?.length || 0} items with fiber data.`)

        if (!results || !Array.isArray(results)) {
            console.error(`[MACRO_ESTIMATE] Invalid AI response:`, results)
            throw new Error('AI returned invalid format')
        }

        // 2. Update database
        console.log(`[MACRO_ESTIMATE] AI Result Sample:`, JSON.stringify(results.slice(0, 2)))

        // Verify column
        const { data: colCheck } = await supabase.from('meal_items').select('*').limit(1)
        if (colCheck && colCheck[0]) {
            console.log(`[MACRO_ESTIMATE] Database Columns present:`, Object.keys(colCheck[0]).join(', '))
            if (!('fiber' in colCheck[0])) {
                console.error(`[MACRO_ESTIMATE] CRITICAL: 'fiber' column is MISSING in meal_items table!`)
            }
        }

        console.log(`[MACRO_ESTIMATE] Starting database updates for ${results.length} items...`)
        for (const res of results) {
            const item = allItems[res.index]
            if (item) {
                console.log(`[MACRO_ESTIMATE] Upd: ${item.food_name} -> P:${res.protein} C:${res.carbs} G:${res.fat} F:${res.fiber}`)
                const { error: upErr } = await supabase
                    .from('meal_items')
                    .update({
                        protein: res.protein,
                        carbs: res.carbs,
                        fat: res.fat,
                        fiber: res.fiber || 0
                    })
                    .eq('id', item.id)

                if (upErr) console.error(`[MACRO_ESTIMATE] SQL Error for ${item.food_name}:`, upErr)
            }
        }

        console.log(`[MACRO_ESTIMATE] All updates finished.`)
        revalidatePath(`/dashboard/trainer/diets/${dietId}`)
        revalidatePath(`/dashboard/student/diet`)
        revalidatePath(`/dashboard/student`)

        return { success: true }
    } catch (e: any) {
        console.error("[MACRO_ESTIMATE] Fatal error:", e.message);
        return { error: e.message };
    }
}
export async function logMealCheck(mealId: string, status: boolean = true) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    try {
        if (status) {
            const { error } = await supabase
                .from('meal_logs')
                .insert({
                    student_id: user.id,
                    meal_id: mealId,
                    consumed_at: new Date().toISOString()
                })
            if (error) throw error
        } else {
            const { start, end } = getTodayRangeBrazil()
            const { error } = await supabase
                .from('meal_logs')
                .delete()
                .eq('student_id', user.id)
                .eq('meal_id', mealId)
                .gte('consumed_at', start)
                .lt('consumed_at', end)
            if (error) throw error
        }

        revalidatePath('/dashboard/student')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function getStudentDailyDiet(studentId: string) {
    const supabase = await createClient()

    try {
        const { data: assignments, error: assignErr } = await supabase
            .from('assigned_diets')
            .select(`
                diet:diets(
                    *,
                    meals(
                        *,
                        meal_items(*)
                    )
                )
            `)
            .eq('student_id', studentId)
            .eq('active', true)
            .order('id', { ascending: false }) // Fallback order
            .limit(1)

        if (assignErr) {
            console.error('[GET_DAILY_DIET] Error:', assignErr)
            return null
        }

        const assignment = assignments?.[0]
        console.log('[GET_DAILY_DIET] Assignment found:', !!assignment, (assignment?.diet as any)?.id)

        if (!assignment || !assignment.diet) return null

        const diet = assignment.diet as any
        const { start, end } = getTodayRangeBrazil()

        const todayStr = getTodayStrBrazil()

        const { data: logs } = await supabase
            .from('meal_logs')
            .select('meal_id')
            .eq('student_id', studentId)
            .gte('consumed_at', start)
            .lt('consumed_at', end)

        // Fetch detailed item logs — query by 'date' column (DATE), not consumed_at
        const { data: itemLogs } = await supabase
            .from('meal_item_logs')
            .select('meal_item_id')
            .eq('user_id', studentId)
            .eq('date', todayStr)

        const loggedMealIds = new Set(logs?.map(l => l.meal_id) || [])
        const loggedItemIds = new Set(itemLogs?.map(l => l.meal_item_id) || [])

        if (diet.meals) {
            diet.meals.sort((a: any, b: any) => a.order_index - b.order_index)
            diet.meals = diet.meals.map((meal: any) => {
                // Check items first
                const itemsWithStatus = meal.meal_items?.map((item: any) => ({
                    ...item,
                    is_checked: loggedItemIds.has(item.id)
                })) || []

                // Meal is fully checked if all items are checked OR if explicitly logged (legacy)
                const allItemsChecked = itemsWithStatus.length > 0 && itemsWithStatus.every((i: any) => i.is_checked)
                const isMealChecked = loggedMealIds.has(meal.id) || allItemsChecked

                return {
                    ...meal,
                    is_checked: isMealChecked,
                    meal_items: itemsWithStatus
                }
            })
        }

        return diet
    } catch (e) {
        console.error('Error fetching student daily diet:', e)
        return null
    }
}
