'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

function getTodayRangeBrazil() {
    // Get current UTC time
    const now = new Date()

    // Brazil is UTC-3, so add 3 hours to get Brazil time
    const brazilOffsetMs = 3 * 60 * 60 * 1000 // +3 hours in milliseconds
    const brazilNow = new Date(now.getTime() + brazilOffsetMs)

    // Get start of day in Brazil (00:00:00 Brazil time)
    const startBrazil = new Date(brazilNow)
    startBrazil.setUTCHours(0, 0, 0, 0)

    // Get end of day in Brazil (23:59:59.999 Brazil time)
    const endBrazil = new Date(brazilNow)
    endBrazil.setUTCHours(23, 59, 59, 999)

    // Convert back to UTC (subtract the offset we added)
    const startUTC = new Date(startBrazil.getTime() - brazilOffsetMs)
    const endUTC = new Date(endBrazil.getTime() - brazilOffsetMs)

    return {
        start: startUTC.toISOString(),
        end: endUTC.toISOString()
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
        const { getGeminiApiKey } = await import('@/actions/app-settings-actions');
        const apiKey = await getGeminiApiKey();
        if (!apiKey) return { error: 'IA indisponível' };

        const { GoogleGenerativeAI } = require("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        You are a nutrition expert. Estimate the macros for this food item.
        Food: ${foodName}
        Quantity: ${quantity || '1 portion'}

        Return ONLY a JSON object with this exact structure:
        {
          "protein": number,
          "carbs": number,
          "fat": number
        }
        Use integers or decimals. Do not include any text or markdown formatting.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textResponse = response.text();

        // Clean markdown if present
        const jsonString = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const macros = JSON.parse(jsonString);

        return { success: true, macros };
    } catch (e: any) {
        console.error("AI Macro Estimation Error:", e.message);
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
        const { data: assignment } = await supabase
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
            .maybeSingle()

        if (!assignment || !assignment.diet) return null

        const diet = assignment.diet as any
        const { start, end } = getTodayRangeBrazil()

        const todayStr = new Date().toISOString().split('T')[0]

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
