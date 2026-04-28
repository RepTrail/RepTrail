'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { DietService } from '@/services/DietService'

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

export async function getTrainerDiets(trainerId?: string) {
    const supabase = await createClient()
    let tid = trainerId

    if (!tid) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            console.log('[getTrainerDiets] No user found, returning []');
            return []
        }
        tid = user.id
    }

    console.log(`[getTrainerDiets] Fetching diets for trainerId: ${tid}`);
    return DietService.getTrainerDiets(tid)
}

export async function createManualDiet(payload: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { name = 'Nova Dieta', clientMutationId, clientId } = payload

    try {
        const { data, error } = await supabase
            .from('diets')
            .insert({
                trainer_id: user.id,
                name,
                client_mutation_id: clientMutationId
            })
            .select()
            .maybeSingle()

        if (error) throw error

        revalidateTag('diets', 'page')
        revalidateTag(`trainer-diets-${user.id}`, 'page')
        revalidatePath('/dashboard/trainer/diets')
        revalidatePath('/dashboard/student/diet')

        return { success: true, dietId: data.id, data }

    } catch (e: any) {
        if (e.code === '23505') {
            const { data } = await supabase
                .from('diets')
                .select()
                .eq('client_mutation_id', clientMutationId)
                .maybeSingle()
            return { success: true, dietId: data?.id, data }
        }
        return { error: e.message }
    }
}

export async function deleteDiet(dietId: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

    try {
        const { error } = await supabase
            .from('diets')
            .delete()
            .eq('id', dietId)

        if (error) throw error

        revalidateTag('diets', 'page')
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            revalidateTag(`trainer-diets-${user.id}`, 'page')
        }
        revalidatePath('/dashboard/trainer/diets')
        revalidatePath('/dashboard/student/diet')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function updateDietMeta(dietId: string, name: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

    try {
        const { error } = await supabase
            .from('diets')
            .update({ name: name.trim() })
            .eq('id', dietId)

        if (error) throw error

        if (error) throw error

        revalidateTag('diets', 'page')
        revalidatePath('/dashboard/trainer/diets')
        revalidatePath('/dashboard/student/diet')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function duplicateDiet(dietId: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
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

        revalidateTag('diets', 'page')
        revalidatePath('/dashboard/trainer/diets')
        revalidatePath('/dashboard/student/diet')
        return { success: true, newId: newDiet.id }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function assignDiet(dietId: string, studentId: string, daysOfWeek: number[] = [0, 1, 2, 3, 4, 5, 6]) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

    try {
        // 1. Handle conflicts: remove these days from all other active diets for this student
        const { data: others } = await supabase
            .from('assigned_diets')
            .select('id, days_of_week')
            .eq('student_id', studentId)
            .eq('active', true)
            .neq('diet_id', dietId)

        if (others) {
            for (const other of others) {
                const currentDays = other.days_of_week || []
                const newDays = currentDays.filter((d: number) => !daysOfWeek.includes(d))

                if (newDays.length === 0) {
                    await supabase.from('assigned_diets').update({ active: false, days_of_week: [] }).eq('id', other.id)
                } else if (newDays.length !== currentDays.length) {
                    await supabase.from('assigned_diets').update({ days_of_week: newDays }).eq('id', other.id)
                }
            }
        }

        // 2. Assign/Update target diet
        const { data: existing } = await supabase
            .from('assigned_diets')
            .select('id, active, days_of_week')
            .eq('diet_id', dietId)
            .eq('student_id', studentId)
            .maybeSingle()

        if (existing) {
            // Update existing assignment with new days and reactivate
            const { error } = await supabase
                .from('assigned_diets')
                .update({
                    active: true,
                    days_of_week: daysOfWeek
                })
                .eq('id', existing.id)

            if (error) throw error
        } else {
            // New assignment
            const { error } = await supabase
                .from('assigned_diets')
                .insert({
                    diet_id: dietId,
                    student_id: studentId,
                    active: true,
                    days_of_week: daysOfWeek
                })

            if (error) throw error
        }

        revalidatePath('/dashboard/trainer/students')
        revalidatePath(`/dashboard/trainer/students/${studentId}`)
        revalidatePath(`/dashboard/trainer/students/${studentId}/diet`)
        revalidatePath('/dashboard/student')
        revalidatePath('/dashboard/student/diet')

        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function unassignDiet(dietId: string, studentId: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

    try {
        if (!dietId || !studentId || dietId === 'undefined' || studentId === 'undefined') {
            console.error(`[DIET-ACTIONS] Invalid IDs for unassignDiet: dietId=${dietId}, studentId=${studentId}`);
            return { error: 'IDs inválidos para desatribuir dieta.' };
        }

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: 'Unauthorized' }

        // 🚀 CHECK IF PLACEHOLDER
        const { data: placeholder } = await supabase
            .from('pending_student_links')
            .select('*')
            .eq('id', studentId)
            .eq('trainer_id', user.id)
            .maybeSingle()

        if (placeholder) {
            console.log(`[DIET-ACTIONS] Unassigning from placeholder: ${studentId}`)
            if (!dietId) {
                console.warn(`[DIET-ACTIONS] unassignDiet called without dietId for placeholder student: ${studentId}`);
                return { success: true }; // Idempotent
            }
            const cleanId = dietId.replace('pd-', '')
            
            // Filter diet_ids
            const newDietIds = (placeholder.diet_ids || []).filter((id: string) => id !== cleanId)
            
            const { error: pendingError } = await supabase
                .from('pending_student_links')
                .update({ diet_ids: newDietIds })
                .eq('id', studentId)

            if (pendingError) throw pendingError

            revalidatePath('/dashboard/trainer/students')
            return { success: true }
        }

        // 🚀 TRAINER AUTHORITY: Check if user is the student's trainer
        const { data: link } = await supabase
            .from('trainer_students')
            .select('id')
            .eq('trainer_id', user.id)
            .eq('student_id', studentId)
            .eq('active', true)
            .maybeSingle()

        const isTrainer = !!link

        // 2. Use Admin Client to force deactivation
        const { createAdminClient } = await import('@/lib/supabase/server')
        const adminSupabase = await createAdminClient()

        const { error } = await adminSupabase
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
    const { createAdminClient } = await import('@/lib/supabase/server')
    const adminSupabase = await createAdminClient()

    const { data: diet, error } = await adminSupabase
        .from('diets')
        .select(`
            *,
            assignments:assigned_diets(
                id,
                student_id,
                days_of_week,
                active,
                student:profiles(full_name)
            ),
            meals(
                *,
                meal_items(*)
            )
        `)
        .eq('id', dietId)
        .maybeSingle()

    if (error) {
        console.error('Error in getDietDetails:', error.message, error)
        return null
    }

    if (!diet) return null

    if (diet) {
        const studentMap: Record<string, any> = {}
        ;(diet.assignments || []).forEach((a: any) => {
            if (!a.active) return // Only process active assignments

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
        diet.assignments = Object.values(studentMap)
    }

    // Sort meals and items by order_index
    if (diet.meals) {
        diet.meals.sort((a: any, b: any) => a.order_index - b.order_index)
        diet.meals.forEach((meal: any) => {
            if (meal.meal_items) {
                meal.meal_items.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0))
            }
        })
    }

    if (!diet) return null

    // We keep the details fetch as partial for now or fully migrate to service if needed
    // But the service doesn't have the exactly same structure as the current details action (which fetches meals/items)
    // Actually, DietService.getByStudent fetches meals/items.
    // Let's use a specialized method if needed, or leave it for now.
    // For now, I'll just add the revalidateTag to the mutation actions.
    return diet
}

export async function addMealToDiet(dietId: string, name: string, timeOfDay: string, clientMutationId?: string, clientId?: string) {
    const supabase = await createClient()

    try {
        const { data: existingJobs } = await supabase
            .from('meals')
            .select('order_index')
            .eq('diet_id', dietId)
            .order('order_index', { ascending: false })
            .limit(1)

        const nextIndex = (existingJobs?.[0]?.order_index ?? -1) + 1

        const { data: newRow, error } = await supabase
            .from('meals')
            .insert({
                diet_id: dietId,
                name,
                time_of_day: timeOfDay,
                order_index: nextIndex,
                client_mutation_id: clientMutationId
            })
            .select()
            .maybeSingle()

        if (error) throw error

        return { success: true, data: { ...newRow, meal_items: [] } }
    } catch (e: any) {
        if (e.code === '23505' && clientMutationId) {
            const { data } = await supabase
                .from('meals')
                .select()
                .eq('client_mutation_id', clientMutationId)
                .maybeSingle()
            return { success: true, data: { ...data, meal_items: [] } }
        }
        return { error: e.message }
    }
}

export async function addMealItem(mealId: string, dietId: string, data: any) {
    const supabase = await createClient()
    const { clientMutationId, clientId, dietId: _d, mealId: _m, foodId: _f, ...fields } = data

    try {
        const { data: existingItems } = await supabase
            .from('meal_items')
            .select('order_index')
            .eq('meal_id', mealId)
            .order('order_index', { ascending: false })
            .limit(1)

        const nextIndex = (existingItems?.[0]?.order_index ?? -1) + 1

        const { data: newRow, error } = await supabase
            .from('meal_items')
            .insert({
                meal_id: mealId,
                ...fields,
                order_index: nextIndex
            })
            .select()
            .maybeSingle()

        if (error) throw error

        return { success: true, data: newRow }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function updateMealItem(id: string, dietId: string, data: any) {
    const { createAdminClient } = await import('@/lib/supabase/server')
    const adminSupabase = await createAdminClient()
    
    // Sanitize: remove known non-db fields
    const { clientMutationId, clientId, dietId: _d, mealId: _m, foodId: _f, ...cleanData } = data

    try {
        const { error } = await adminSupabase
            .from('meal_items')
            .update(cleanData)
            .eq('id', id)

        if (error) throw error

        revalidatePath(`/dashboard/trainer/diets/${dietId}`)
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function removeMealItem(id: string, dietId: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

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
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

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
        console.log('DEBUG: estimateMacros called with:', { foodName, quantity })
        const { createOpenRouterClient, callAI } = await import('@/lib/ai-client');
        const client = createOpenRouterClient();
        console.log('DEBUG: AI client created')

        const prompt = `
You are a nutrition expert. Estimate the macronutrients for this food item.
Food: ${foodName}
Quantity: ${quantity || '1 portion'}

Return ONLY a JSON object with this exact structure (no markdown):
{"protein": number, "carbs": number, "fat": number, "fiber": number}
Use integers or decimals.
`;
        console.log('DEBUG: Calling AI with prompt:', prompt)

        const macros = await callAI<{ protein: number; carbs: number; fat: number; fiber: number }>(client, prompt);
        console.log('DEBUG: AI response:', macros)
        return { success: true, macros };
    } catch (e: any) {
        console.error("AI Macro Estimation Error:", e.message);
        return { error: e.message };
    }
}

export async function suggestSubstitution(foodName: string, quantity: string) {
    try {
        console.log('DEBUG: suggestSubstitution called with:', { foodName, quantity })
        const { createOpenRouterClient, callAI } = await import('@/lib/ai-client');
        const client = createOpenRouterClient();
        console.log('DEBUG: AI client created for substitution')

        const prompt = `
You are a nutrition expert. Suggest a SIMILAR and healthy substitution for this food item.
Original Food: ${foodName}
Original Quantity: ${quantity || '1 portion'}

IMPORTANT: You MUST adjust the "quantity" of the suggested food so that its macronutrients (Protein, Carbs, Fat) match the original food's macros as closely as possible. 
For example, if the original item has 40g of carbs and you suggest bread, calculate how many slices are needed to reach ~40g of carbs.

Return ONLY a JSON object with this exact structure (no markdown):
{
  "food_name": "string",
  "quantity": "string",
  "protein": number,
  "carbs": number,
  "fat": number,
  "fiber": number
}
Ensure the macros returned are calculated specifically for the suggested quantity.
`;
        console.log('DEBUG: Calling AI with substitution prompt:', prompt)

        const suggestion = await callAI<{ food_name: string; quantity: string; protein: number; carbs: number; fat: number; fiber: number }>(client, prompt);
        console.log('DEBUG: AI substitution response:', suggestion)
        return { success: true, suggestion };
    } catch (e: any) {
        console.error("AI Substitution Suggestion Error:", e.message);
        return { error: e.message };
    }
}

export async function estimateMacrosForFoodList(allItems: any[]) {
    if (allItems.length === 0) return [];

    try {
        const { createOpenRouterClient, callAI } = await import('@/lib/ai-client');
        const client = createOpenRouterClient();

        const itemsList = allItems.map((item, idx) => `${idx}: ${item.food_name || item.name} (${item.quantity || '1 portion'})`).join('\n')

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

        console.log(`[MACRO_ESTIMATE] Requesting AI calculation with Fiber for ${allItems.length} items...`)
        const results = await callAI<any[]>(client, prompt);
        console.log(`[MACRO_ESTIMATE] AI returned ${results?.length || 0} items with fiber data.`)

        if (!results || !Array.isArray(results)) {
            console.error(`[MACRO_ESTIMATE] Invalid AI response:`, results)
            throw new Error('AI returned invalid format')
        }

        return results;
    } catch (e: any) {
        console.error(`[MACRO_ESTIMATE] Error:`, e.message);
        throw e;
    }
}

export async function estimateAllDietMacros(dietId: string) {
    console.log(`[MACRO_ESTIMATE] Starting for diet: ${dietId}`)
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

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
            if (m.meal_items) {
                // Ensure name is present for the helper
                m.meal_items.forEach((mi: any) => {
                    allItems.push({ ...mi, food_name: mi.food_name || mi.name });
                });
            }
        })

        console.log(`[MACRO_ESTIMATE] Found ${allItems.length} items.`)
        if (allItems.length === 0) return { success: true }

        // 2. Call the helper
        const results = await estimateMacrosForFoodList(allItems);

        // 3. Update database
        console.log(`[MACRO_ESTIMATE] AI Result Sample:`, JSON.stringify(results.slice(0, 2)))

        // Verify column
        const { data: colCheck } = await supabase.from('meal_items').select('*').limit(1)
        if (colCheck && colCheck[0]) {
            console.log(`[MACRO_ESTIMATE] Database Columns present:`, Object.keys(colCheck[0]).join(', '))
            if (!('fiber' in colCheck[0])) {
                console.error(`[MACRO_ESTIMATE] CRITICAL: 'fiber' column is MISSING in meal_items table!`)
            }
        }

        console.log(`[MACRO_ESTIMATE] Starting parallel database updates for ${results.length} items...`)
        
        await Promise.all(results.map(async (res) => {
            const item = allItems[res.index]
            if (item) {
                console.log(`[MACRO_ESTIMATE] Upd: ${item.food_name} -> P:${res.protein} C:${res.carbs} G:${res.fat} F:${res.fiber}`)
                const { error: upErr } = await supabase
                    .from('meal_items')
                    .update({
                        protein: res.protein,
                        carbs: res.carbs,
                        fat: res.fat,
                        fiber: res.fiber || 0,
                        calories: (res.protein * 4) + (res.carbs * 4) + (res.fat * 9)
                    })
                    .eq('id', item.id)

                if (upErr) console.error(`[MACRO_ESTIMATE] SQL Error for ${item.food_name}:`, upErr)
            }
        }));

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
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
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
    const { createAdminClient } = await import('@/lib/supabase/server')
    const adminSupabase = await createAdminClient()

    try {
        const todayDow = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })).getDay()

        const todayStr = getTodayStrBrazil()
        const { start, end } = getTodayRangeBrazil()

        // Fetch diet, logs and potential trainer links in parallel using admin client
        const [
            { data: assignments, error: assignErr },
            { data: logs },
            { data: itemLogs },
            { data: trainerLinks }
        ] = await Promise.all([
            adminSupabase
                .from('assigned_diets')
                .select(`
                    diet:diets!inner(
                        *,
                        trainer_id,
                        meals(
                            *,
                            meal_items(*)
                        )
                    )
                `)
                .eq('student_id', studentId)
                .eq('active', true)
                .contains('days_of_week', [todayDow])
                .order('created_at', { ascending: false })
                .limit(1),
            adminSupabase
                .from('meal_logs')
                .select('meal_id')
                .eq('student_id', studentId)
                .gte('consumed_at', start)
                .lt('consumed_at', end),
            adminSupabase
                .from('meal_item_logs')
                .select('*')
                .eq('user_id', studentId)
                .eq('date', todayStr),
            adminSupabase
                .from('trainer_students')
                .select('trainer_id')
                .eq('student_id', studentId)
                .eq('active', true)
        ])

        if (assignErr) {
            console.error('[GET_DAILY_DIET] Error:', assignErr.message)
            return null
        }

        const assignment = assignments?.[0]
        if (!assignment || !assignment.diet) return null

        const diet = assignment.diet as any

        // Data Pruning: Check if trainer is still linked (using pre-fetched links)
        if (diet.trainer_id && diet.trainer_id !== studentId) {
            const isLinked = trainerLinks?.some(l => l.trainer_id === diet.trainer_id)
            if (!isLinked) return null // Unlinked trainer's data is hidden
        }

        const loggedMealIds = new Set(logs?.map(l => l.meal_id) || [])
        const itemLogMap = new Map(itemLogs?.map(l => [l.meal_item_id, l]) || [])

        if (diet.meals) {
            diet.meals.sort((a: any, b: any) => a.order_index - b.order_index)
            diet.meals = diet.meals.map((meal: any) => {
                // Sort items
                if (meal.meal_items) {
                    meal.meal_items.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0))
                }

                // Check items first
                const itemsWithStatus = meal.meal_items?.map((item: any) => {
                    const log = itemLogMap.get(item.id)
                    return {
                        ...item,
                        is_checked: !!log,
                        is_substituted: log?.is_substituted || false,
                        substituted_food_name: log?.substituted_food_name,
                        substituted_quantity: log?.substituted_quantity,
                        substituted_protein: log?.substituted_protein,
                        substituted_carbs: log?.substituted_carbs,
                        substituted_fat: log?.substituted_fat,
                        substituted_fiber: log?.substituted_fiber,
                    }
                }) || []

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

export async function updateMealsOrder(dietId: string, orderedIds: string[]) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    try {
        for (let i = 0; i < orderedIds.length; i++) {
            await supabase
                .from('meals')
                .update({ order_index: i })
                .eq('id', orderedIds[i])
                .eq('diet_id', dietId)
        }
        revalidatePath(`/dashboard/trainer/diets/${dietId}`)
        revalidatePath(`/dashboard/student/diet`)
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function updateMealItemsOrder(mealId: string, orderedIds: string[]) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    try {
        for (let i = 0; i < orderedIds.length; i++) {
            await supabase
                .from('meal_items')
                .update({ order_index: i })
                .eq('id', orderedIds[i])
                .eq('meal_id', mealId)
        }
        // We need the dietId to revalidate. We can fetch it or just revalidate parent paths.
        revalidatePath('/dashboard/trainer/diets')
        revalidatePath('/dashboard/student/diet')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}
export async function getAssignedDiets(studentId: string) {
    const { createAdminClient } = await import('@/lib/supabase/server')
    const adminSupabase = await createAdminClient()

    try {
        const { data, error } = await adminSupabase
            .from('assigned_diets')
            .select(`
                id,
                diet_id,
                days_of_week,
                active,
                diet:diets(
                    id,
                    name,
                    created_at,
                    meals(count)
                )
            `)
            .eq('student_id', studentId)
            .eq('active', true)

        if (error) {
            console.error('Supabase Query Error (assigned_diets):', error.message, error)
            throw error
        }
        return data || []
    } catch (e: any) {
        console.error('Error fetching assigned diets (Full Error):', e)
        return []
    }
}
