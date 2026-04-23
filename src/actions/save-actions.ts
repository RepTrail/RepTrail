'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveParsedData(type: 'workout' | 'diet', data: any, studentId?: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    const isStudentMode = profile?.role === 'student';
    const targetStudentId = isStudentMode ? user.id : studentId;

    try {
        if (type === 'workout') {
            const results = { workouts: [] as string[], cardios: [] as string[], ergogenics: [] as string[] };
            console.log(`[SAVE] Starting workout save. User: ${user.id}`);
            console.log(`[SAVE] Incoming data keys: ${Object.keys(data)}`);

            // 1. Deep Normalization of Workouts
            let workoutsToProcess: any[] = [];

            if (data.workouts && Array.isArray(data.workouts)) {
                console.log(`[SAVE] Found workouts array: ${data.workouts.length} items`);
                workoutsToProcess = data.workouts;
            } else if (data.exercises && Array.isArray(data.exercises)) {
                console.log(`[SAVE] Found flat exercises array: ${data.exercises.length} items`);
                workoutsToProcess = [{
                    name: 'Treino Importado',
                    exercises: data.exercises
                }];
            } else if (Array.isArray(data)) {
                console.log(`[SAVE] Root data is array: ${data.length} items`);
                workoutsToProcess = data;
            } else {
                console.log(`[SAVE] Unknown structure. Keys: ${Object.keys(data)}`);
            }

            for (const [wIdx, wData] of workoutsToProcess.entries()) {
                if (!wData || (typeof wData !== 'object')) {
                    console.log(`[SAVE] Skipping invalid workout at index ${wIdx}`);
                    continue;
                }

                const wName = wData.name || wData.workout_name || 'Treino Importado';
                console.log(`[SAVE] Creating workout ${wIdx + 1}: "${wName}"`);

                const { data: workout, error: wError } = await supabase
                    .from('workouts')
                    .insert({
                        trainer_id: user.id,
                        name: wName,
                        description: 'Importado via PDF'
                    })
                    .select()
                    .single()

                if (wError) {
                    console.error(`[SAVE] Failed to create workout "${wName}":`, wError);
                    continue;
                }
                console.log(`[SAVE] Workout created with ID: ${workout.id}`);

                // Normalizing exercise array from possible AI keys
                const exercisesArray = wData.exercises || wData.items || [];
                console.log(`[SAVE] Processing ${exercisesArray.length} exercises for "${wName}"`);

                if (Array.isArray(exercisesArray)) {
                    for (let i = 0; i < exercisesArray.length; i++) {
                        const exData = exercisesArray[i];
                        if (!exData || typeof exData !== 'object') continue;

                        // Property names can vary with AI
                        const exName = exData.name || exData.exercise_name || exData.exercise;
                        if (!exName) {
                            console.log(`[SAVE] [Ex ${i}] Exercise has no name, skipping.`);
                            continue;
                        }

                        const cleanExName = exName.trim();
                        let exerciseId: string | undefined;

                        console.log(`[SAVE] [Ex ${i}] Looking for exercise: "${cleanExName}"`);

                        // Try to find existing (the trainer's own or system default)
                        const { data: existingEx, error: findError } = await supabase
                            .from('exercises')
                            .select('id')
                            .eq('name', cleanExName)
                            .maybeSingle();

                        if (findError) console.error(`[SAVE] [Ex ${i}] Error finding exercise:`, findError);

                        if (existingEx) {
                            console.log(`[SAVE] [Ex ${i}] Found existing exercise: ${existingEx.id}`);
                            exerciseId = existingEx.id;
                        } else {
                            console.log(`[SAVE] [Ex ${i}] Not found. Creating new for trainer...`);
                            const { data: newEx, error: exError } = await supabase
                                .from('exercises')
                                .insert({ trainer_id: user.id, name: cleanExName })
                                .select('id').single()

                            if (exError) {
                                // Fallback: if it failed because it exists but RLS hid it, 
                                // it means it's a global exercise NOT owned by this trainer.
                                // In a strictly private model, the trainer should have their own.
                                // But if the insert failed with 23505, we MUST get the ID.
                                if (exError.code === '23505') {
                                    console.log(`[SAVE] [Ex ${i}] Collision/Race condition. Attempting to resolve...`);
                                    // Try one more time without RLS filter if we had a RPC or similar, 
                                    // but here we just try to fetch again.
                                    const { data: raceEx } = await supabase
                                        .from('exercises')
                                        .select('id')
                                        .eq('name', cleanExName)
                                        .maybeSingle()

                                    exerciseId = raceEx?.id;

                                    if (!exerciseId) {
                                        console.error(`[SAVE] [Ex ${i}] Collision occurred but exercise is invisible (RLS). This indicates a global name conflict.`);
                                    }
                                } else {
                                    console.error(`[SAVE] [Ex ${i}] Error creating exercise "${cleanExName}":`, exError);
                                }
                            } else if (newEx) {
                                console.log(`[SAVE] [Ex ${i}] New exercise created: ${newEx.id}`);
                                exerciseId = newEx.id;
                            }
                        }

                        if (!exerciseId) {
                            console.error(`[SAVE] [Ex ${i}] Could not resolve exercise ID for "${exName}"`);
                            continue;
                        }

                        const parseSets = (s: any) => {
                            if (typeof s === 'number') return s;
                            if (typeof s === 'string') {
                                const match = s.match(/^(\d+)/);
                                return match ? parseInt(match[1]) : 1;
                            }
                            return 3;
                        };

                        const parseReps = (r: any): string => {
                            if (!r) return '10';
                            const s = String(r);
                            // Se for no formato 2x15, pegamos o segundo número
                            if (s.includes('x') || s.includes('X')) {
                                const parts = s.split(/[xX]/);
                                const lastPart = parts[parts.length - 1].match(/\d+/);
                                return lastPart ? lastPart[0] : '10';
                            }
                            // Se for intervalo 10-12, pegamos o maior
                            if (s.includes('-')) {
                                const nums = s.match(/\d+/g);
                                if (nums && nums.length >= 2) {
                                    return Math.max(parseInt(nums[0]), parseInt(nums[1])).toString();
                                }
                            }
                            // Pega o primeiro número que encontrar
                            const match = s.match(/\d+/);
                            return match ? match[0] : '10';
                        };

                        console.log(`[SAVE] [Ex ${i}] Linking to workout. Sets: ${exData.sets}, Reps: ${exData.reps}`);
                        const { error: linkErr } = await supabase.from('workout_exercises').insert({
                            workout_id: workout.id,
                            exercise_id: exerciseId,
                            order_index: i,
                            working_sets: parseSets(exData.sets),
                            reps: parseReps(exData.reps),
                            rest_seconds: parseInt(exData.rest) || 60,
                            warmup_sets: parseSets(exData.warmup_sets || 0),
                            warmup_reps: parseReps(exData.warmup_reps || exData.warmup_sets),
                            warmup_rest_seconds: 45,
                            feeder_sets: parseSets(exData.feeder_sets || 0),
                            feeder_reps: parseReps(exData.feeder_reps || exData.feeder_sets),
                            feeder_rest_seconds: 60,
                            notes: exData.notes || null
                        })

                        if (linkErr) {
                            console.error(`[SAVE] [Ex ${i}] Error linking exercise:`, linkErr);
                        } else {
                            console.log(`[SAVE] [Ex ${i}] Link successful.`);
                        }
                    }
                }
                results.workouts.push(workout.id);

                if (isStudentMode && targetStudentId) {
                    const dayOfWeek = typeof wData.day_of_week === 'number' ? wData.day_of_week : null
                    console.log(`[SAVE] Student mode: deactivating previous workouts for ${targetStudentId} on dayOfWeek=${dayOfWeek}`);

                    const query = supabase
                        .from('assigned_workouts')
                        .update({ active: false })
                        .eq('student_id', targetStudentId)
                        .eq('active', true);

                    if (dayOfWeek !== null) {
                        query.eq('day_of_week', dayOfWeek);
                    }

                    await query;

                    console.log(`[SAVE] Student mode: assigning workout ${workout.id} to student ${targetStudentId} dayOfWeek=${dayOfWeek}`)
                    const { error: assignErr } = await supabase
                        .from('assigned_workouts')
                        .insert({
                            workout_id: workout.id,
                            student_id: targetStudentId,
                            day_of_week: dayOfWeek,
                            active: true,
                        })

                    if (assignErr) {
                        console.error(`[SAVE] Failed to assign imported workout ${workout.id} to student ${targetStudentId}:`, assignErr)
                    } else {
                        console.log(`[SAVE] ✅ Assigned workout ${workout.id} to student ${targetStudentId}`)
                    }
                }
            }
            console.log(`[SAVE] Finished. Saved ${results.workouts.length} workouts.`);

            // 2. Save Cardios
            if (data.cardios && Array.isArray(data.cardios)) {
                if (isStudentMode && targetStudentId) {
                    console.log(`[SAVE] Student mode: deactivating previous cardios for ${targetStudentId}`);
                    await supabase
                        .from('assigned_cardios')
                        .update({ active: false })
                        .eq('student_id', targetStudentId)
                        .eq('active', true);
                }

                for (const cData of data.cardios) {
                    const { data: cardio, error: cError } = await supabase
                        .from('cardios')
                        .insert({
                            trainer_id: user.id,
                            name: cData.type || 'Cardio Importado',
                            description: `${cData.duration || ''} ${cData.intensity || ''} (${cData.frequency || ''})`.trim()
                        })
                        .select().single()

                    if (cError) throw cError
                    results.cardios.push(cardio.id);

                    if (isStudentMode && targetStudentId) {
                        const durationMinutes = parseInt(cData.duration) || 30
                        const intensity = (cData.intensity || cData.suggested_intensity || 'Moderado').toString()
                        const daysOfWeek = Array.isArray(cData.days_of_week) ? cData.days_of_week : undefined

                        const { error: assignCardioErr } = await supabase
                            .from('assigned_cardios')
                            .insert({
                                student_id: targetStudentId,
                                cardio_id: cardio.id,
                                duration_minutes: durationMinutes,
                                suggested_intensity: intensity,
                                days_of_week: daysOfWeek,
                                active: true,
                            })

                        if (assignCardioErr) {
                            console.error(`[SAVE] Failed to assign imported cardio ${cardio.id} to student ${targetStudentId}:`, assignCardioErr)
                        }
                    }
                }
            }

            // 3. Save Ergogenics (Only if targetStudentId is provided)
            if (targetStudentId && data.ergogenics && Array.isArray(data.ergogenics)) {
                for (const eData of data.ergogenics) {
                    const { data: ergo, error: eError } = await supabase
                        .from('ergogenics')
                        .insert({
                            trainer_id: user.id,
                            student_id: targetStudentId,
                            name: eData.name,
                            dosage: eData.dosage,
                            weekly_dosage: eData.weekly_dosage || 0,
                            unit: (eData.unit === 'mg' || eData.unit === 'ml') ? eData.unit : 'ml',
                            application_days: eData.application_days || [],
                            notes: eData.notes || '',
                            start_date: new Date().toISOString().split('T')[0]
                        })
                        .select().single()
                    if (eError) console.error("Error saving ergogenic:", eError.message)
                    else results.ergogenics.push(ergo.id)
                }
            }

            if (isStudentMode) {
                revalidatePath('/dashboard/student/workouts')
                revalidatePath('/dashboard/student/cardio')
                revalidatePath('/dashboard/student/ergogenics')
            } else {
                revalidatePath('/dashboard/trainer/workouts')
                if (targetStudentId) revalidatePath(`/dashboard/trainer/students/${targetStudentId}/ergogenics`)
            }
            return { success: true, results }

        } else {
            // DIET
            const results = { diets: [] as string[], ergogenics: [] as string[] };
            console.log(`[SAVE] Starting diet save. User: ${user.id}, isStudentMode: ${isStudentMode}`);

            // Normalize diet data: if it's the new flattened structure (no 'diets' key but has 'meals' at top)
            // wrap it in a mock diet so the loop below works.
            let dietsToProcess = data.diets || [];
            if (!data.diets && data.meals) {
                console.log(`[SAVE] No 'diets' key found, but found 'meals'. Wrapping into ${data.diet_name || 'Dieta Importada'}.`);
                dietsToProcess = [{
                    diet_name: data.diet_name || 'Dieta Importada',
                    meals: data.meals
                }];
            }

            if (Array.isArray(dietsToProcess)) {
                console.log(`[SAVE] Processing ${dietsToProcess.length} diets.`);
                for (const [dIdx, dData] of dietsToProcess.entries()) {
                    console.log(`[SAVE] [Diet ${dIdx}] Creating diet: "${dData.diet_name || 'Dieta Importada'}"`);
                    const { data: diet, error: dError } = await supabase
                        .from('diets')
                        .insert({
                            trainer_id: user.id,
                            name: dData.diet_name || 'Dieta Importada'
                        })
                        .select().single()

                    if (dError) {
                        console.error(`[SAVE] [Diet ${dIdx}] Error creating diet:`, dError);
                        throw dError;
                    }
                    console.log(`[SAVE] [Diet ${dIdx}] Diet created with ID: ${diet.id}`);
                    results.diets.push(diet.id);

                    if (isStudentMode && targetStudentId) {
                        console.log(`[SAVE] [Diet ${dIdx}] Student mode: deactivating previous diets for ${targetStudentId}`);
                        await supabase
                            .from('assigned_diets')
                            .update({ active: false })
                            .eq('student_id', targetStudentId)
                            .eq('active', true);

                        console.log(`[SAVE] [Diet ${dIdx}] Student mode: assigning diet to ${targetStudentId}`);
                        const { error: assignDietErr } = await supabase
                            .from('assigned_diets')
                            .insert({
                                diet_id: diet.id,
                                student_id: targetStudentId,
                                active: true,
                            })

                        if (assignDietErr) {
                            console.error(`[SAVE] [Diet ${dIdx}] Failed to assign imported diet ${diet.id} to student ${targetStudentId}:`, assignDietErr)
                            // We don't throw here to allow partial success, but it's critical for student mode
                        } else {
                            console.log(`[SAVE] [Diet ${dIdx}] Diet assignment successful.`);
                        }
                    }

                    const meals = dData.meals || dData.diet_meals || [];
                    console.log(`[SAVE] [Diet ${dIdx}] Processing ${meals.length} meals.`);
                    for (let i = 0; i < meals.length; i++) {
                        const mealData = meals[i];
                        console.log(`[SAVE] [Diet ${dIdx}] [Meal ${i}] Creating meal: "${mealData.meal_name || mealData.name}"`);
                        const { data: meal, error: mError } = await supabase
                            .from('meals')
                            .insert({
                                diet_id: diet.id,
                                name: mealData.meal_name || mealData.name,
                                order_index: i
                            })
                            .select().single()

                        if (mError) {
                            console.error(`[SAVE] [Diet ${dIdx}] [Meal ${i}] Error creating meal:`, mError);
                            throw mError;
                        }
                        console.log(`[SAVE] [Diet ${dIdx}] [Meal ${i}] Meal created with ID: ${meal.id}`);

                        const foods = mealData.foods || mealData.items || [];
                        console.log(`[SAVE] [Diet ${dIdx}] [Meal ${i}] Processing ${foods.length} items.`);
                        const itemsToInsert = foods.map((f: any) => ({
                            meal_id: meal.id,
                            food_name: f.name || f.food,
                            quantity: f.quantity,
                            protein: Math.round(f.protein || 0),
                            carbs: Math.round(f.carbs || 0),
                            fat: Math.round(f.fat || 0),
                            calories: Math.round(f.calories || 0)
                        }))

                        if (itemsToInsert.length > 0) {
                            const { error: iError } = await supabase.from('meal_items').insert(itemsToInsert)
                            if (iError) {
                                console.error(`[SAVE] [Diet ${dIdx}] [Meal ${i}] Error creating items:`, iError);
                                throw iError;
                            }
                            console.log(`[SAVE] [Diet ${dIdx}] [Meal ${i}] Successfully inserted ${itemsToInsert.length} items.`);
                        }
                    }
                }
            }

            if (isStudentMode) {
                revalidatePath('/dashboard/student/diet')
                revalidatePath('/dashboard/student')
            } else {
                revalidatePath('/dashboard/trainer/students/[id]', 'page')
                revalidatePath('/dashboard/trainer/diets')
            }
            console.log(`[SAVE] Diet save complete. Diets: ${results.diets.length}`);
            return { success: true, results }
        }
    } catch (e: any) {
        console.error(`[SAVE] FATAL ERROR during saveParsedData (${type}):`, e);
        return { error: e.message }
    }
}
