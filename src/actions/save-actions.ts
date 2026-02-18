'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveParsedData(type: 'workout' | 'diet', data: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    try {
        if (type === 'workout') {
            const results = { workouts: [] as string[], cardios: [] as string[] };

            // 1. Save Workouts
            if (data.workouts && Array.isArray(data.workouts)) {
                for (const wData of data.workouts) {
                    const { data: workout, error: wError } = await supabase
                        .from('workouts')
                        .insert({
                            trainer_id: user.id,
                            name: wData.name || 'Treino Importado',
                            description: 'Importado via PDF'
                        })
                        .select()
                        .single()

                    if (wError) throw wError

                    for (let i = 0; i < wData.exercises.length; i++) {
                        const exData = wData.exercises[i]

                        // Get or create exercise in library
                        let exerciseId;
                        const { data: existingEx } = await supabase
                            .from('exercises')
                            .select('id')
                            .eq('trainer_id', user.id)
                            .eq('name', exData.name)
                            .maybeSingle();

                        if (existingEx) {
                            exerciseId = existingEx.id;
                        } else {
                            const { data: newEx, error: exError } = await supabase
                                .from('exercises')
                                .insert({
                                    trainer_id: user.id,
                                    name: exData.name
                                })
                                .select()
                                .single()
                            if (exError) throw exError
                            exerciseId = newEx.id;
                        }

                        // Link to Workout
                        await supabase
                            .from('workout_exercises')
                            .insert({
                                workout_id: workout.id,
                                exercise_id: exerciseId,
                                order_index: i,
                                working_sets: exData.sets || 3,
                                reps: String(exData.reps || '10-12'),
                                rest_seconds: exData.rest || 60
                            })
                    }
                    results.workouts.push(workout.id);
                }
            }

            // 2. Save Cardios
            if (data.cardios && Array.isArray(data.cardios)) {
                for (const cData of data.cardios) {
                    const { data: cardio, error: cError } = await supabase
                        .from('cardios')
                        .insert({
                            trainer_id: user.id,
                            name: cData.type || 'Cardio Importado',
                            description: `${cData.duration || ''} ${cData.intensity || ''} (${cData.frequency || ''})`.trim()
                        })
                        .select()
                        .single()

                    if (cError) throw cError
                    results.cardios.push(cardio.id);
                }
            }

            revalidatePath('/dashboard/trainer/workouts')
            return { success: true, results }

        } else {
            // DIET
            const dietIds = [];
            if (data.diets && Array.isArray(data.diets)) {
                // Since our current DB structure handles one diet per save call usually, 
                // but AI might return multiple "diets" for different days if they are separated.
                // Usually it's one diet with multiple meals. 
                // If AI returns multiple in 'diets' array, we create multiple.

                for (const dData of data.diets) {
                    const { data: diet, error: dError } = await supabase
                        .from('diets')
                        .insert({
                            trainer_id: user.id,
                            name: dData.diet_name || 'Dieta Importada'
                        })
                        .select()
                        .single()

                    if (dError) throw dError
                    dietIds.push(diet.id);

                    if (dData.meals || dData.diet_meals) {
                        const meals = dData.meals || dData.diet_meals;
                        for (let i = 0; i < meals.length; i++) {
                            const mealData = meals[i];
                            const { data: meal, error: mError } = await supabase
                                .from('meals')
                                .insert({
                                    diet_id: diet.id,
                                    name: mealData.meal_name || mealData.name,
                                    order_index: i
                                })
                                .select()
                                .single()

                            if (mError) throw mError

                            if (mealData.foods || mealData.items) {
                                const foods = mealData.foods || mealData.items;
                                const itemsToInsert = foods.map((f: any) => ({
                                    meal_id: meal.id,
                                    food_name: f.name || f.food,
                                    quantity: f.quantity,
                                    protein: f.protein || 0,
                                    carbs: f.carbs || 0,
                                    fat: f.fat || 0,
                                    calories: f.calories || 0
                                }))

                                const { error: iError } = await supabase
                                    .from('meal_items')
                                    .insert(itemsToInsert)

                                if (iError) throw iError
                            }
                        }
                    }
                }
            }
            revalidatePath('/dashboard/trainer/diets')
            return { success: true, ids: dietIds }
        }

    } catch (e: any) {
        return { error: e.message }
    }
}
