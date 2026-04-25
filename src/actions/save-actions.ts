'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import crypto from 'crypto'

export async function saveParsedData(
    type: 'workout' | 'diet', 
    data: any, 
    studentId?: string,
    createPlaceholder?: { name: string, email?: string }
) {
    console.log(`[SAVE-ACTIONS] Initiating save for type: ${type}, studentId: ${studentId}`);
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }
    const results = { workouts: [] as string[], diets: [] as string[], cardios: [] as string[], ergogenics: [] as any[], placeholderId: null as string | null };
    const workoutDays: Array<{ id: string, day: number | null }> = [];
    const cardioMetadata: Array<{ id: string, days: number[] | null, duration: number, intensity: string }> = [];
    const dietDays: number[] = (data.days_of_week && data.days_of_week.length > 0) ? data.days_of_week : [0, 1, 2, 3, 4, 5, 6];

    const { data: profile } = await supabase.from('profiles').select('id, role').eq('id', user.id).single();
    const isStudentMode = profile?.role === 'student';
    let targetStudentId = isStudentMode ? user.id : studentId;
    
    // 🚀 UNIFIED ARCHITECTURE: Ensure we have a profile (Real or Ghost)
    if (!targetStudentId && createPlaceholder) {
        console.log(`[SAVE-ACTIONS] No studentId provided. Creating Ghost Profile for ${createPlaceholder.email || createPlaceholder.name}`);
        const { createStudent } = await import('@/actions/trainer-actions');
        const formData = new FormData();
        formData.append('name', createPlaceholder.name);
        if (createPlaceholder.email) formData.append('email', createPlaceholder.email);
        
        const result = await createStudent({}, formData);
        if (result.success && result.studentId) {
            targetStudentId = result.studentId;
            results.placeholderId = result.studentId;
        } else {
            return { error: result.message || 'Falha ao criar perfil para o aluno.' };
        }
    }

    if (!targetStudentId) {
        console.log(`[SAVE-ACTIONS] No target student. Saving to library only.`);
    }

    try {
        // 1. Process Workouts
        const workoutsToProcess = data.workouts || (data.exercises ? [{ name: data.workout_name || 'Treino Importado', exercises: data.exercises }] : []);
        if (workoutsToProcess.length > 0) {
            for (const wData of workoutsToProcess) {
                const wName = wData.name || wData.workout_name || 'Treino Importado';
                const { data: workout, error: wError } = await supabase
                    .from('workouts')
                    .insert({ trainer_id: user.id, name: wName, description: 'Importado via PDF' })
                    .select().single()

                if (wError) {
                    console.error("[SAVE-ACTIONS] Workout insert error:", wError.message);
                    continue;
                }
                results.workouts.push(workout.id);

                const dayOfWeek = (wData.day_of_week !== undefined && wData.day_of_week !== null) ? parseInt(String(wData.day_of_week)) : null;
                workoutDays.push({ id: workout.id, day: dayOfWeek });

                const exercisesArray = wData.exercises || wData.items || [];
                if (Array.isArray(exercisesArray)) {
                    for (let i = 0; i < exercisesArray.length; i++) {
                        const exData = exercisesArray[i];
                        const exName = (exData.name || exData.exercise_name || exData.exercise || '').trim();
                        if (!exName) continue;

                        let exerciseId: string | undefined;
                        const { data: existingEx } = await supabase.from('exercises').select('id').eq('name', exName).maybeSingle();

                        if (existingEx) {
                            exerciseId = existingEx.id;
                        } else {
                            const { data: newEx } = await supabase.from('exercises').insert({ trainer_id: user.id, name: exName }).select('id').single();
                            exerciseId = newEx?.id;
                        }

                        if (!exerciseId) continue;

                        const parseSets = (s: any) => typeof s === 'number' ? s : (parseInt(String(s)) || 3);
                        const parseReps = (r: any) => String(r || '10');

                        await supabase.from('workout_exercises').insert({
                            workout_id: workout.id,
                            exercise_id: exerciseId,
                            order_index: i,
                            working_sets: parseSets(exData.sets),
                            reps: parseReps(exData.reps),
                            rest_seconds: parseInt(exData.rest) || 60,
                            notes: exData.notes || null
                        });
                    }
                }

                // 🚀 Link to student (Real or Ghost)
                if (targetStudentId) {
                    // Deactivate previous assignment for same day
                    await supabase.from('assigned_workouts')
                        .update({ active: false })
                        .eq('student_id', targetStudentId)
                        .eq('active', true)
                        .eq('day_of_week', dayOfWeek);
                    
                    await supabase.from('assigned_workouts').insert({ 
                        workout_id: workout.id, 
                        student_id: targetStudentId, 
                        day_of_week: dayOfWeek, 
                        active: true 
                    });
                }
            }
        }

        // 2. Process Diets
        const dietsToProcess = data.options || data.diets || (data.meals ? [{ diet_name: data.diet_name || 'Dieta Importada', meals: data.meals, days_of_week: dietDays }] : []);
        if (dietsToProcess.length > 0) {
            for (const dData of dietsToProcess) {
                const { data: diet, error: dError } = await supabase
                    .from('diets')
                    .insert({ trainer_id: user.id, name: dData.diet_name || 'Dieta Importada' })
                    .select().single()

                if (dError) {
                    console.error("[SAVE-ACTIONS] Diet insert error:", dError.message);
                    continue;
                }
                results.diets.push(diet.id);

                // 🚀 Link to student (Real or Ghost)
                if (targetStudentId) {
                    await supabase.from('assigned_diets').update({ active: false }).eq('student_id', targetStudentId).eq('active', true);
                    await supabase.from('assigned_diets').insert({ 
                        diet_id: diet.id, 
                        student_id: targetStudentId, 
                        active: true, 
                        days_of_week: (dData.days_of_week && dData.days_of_week.length > 0) ? dData.days_of_week : dietDays 
                    });
                }

                const meals = dData.meals || [];
                for (let i = 0; i < meals.length; i++) {
                    const mealData = meals[i];
                    const { data: meal, error: mError } = await supabase
                        .from('meals')
                        .insert({ diet_id: diet.id, name: mealData.meal_name || mealData.name, order_index: i })
                        .select().single()

                    if (mError) continue;
                    const foods = mealData.foods || mealData.items || [];
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
                        await supabase.from('meal_items').insert(itemsToInsert)
                    }
                }
            }
        }

        // 3. Process Cardios
        if (data.cardios && Array.isArray(data.cardios)) {
            if (targetStudentId) {
                await supabase.from('assigned_cardios').update({ active: false }).eq('student_id', targetStudentId).eq('active', true);
            }
            for (const cData of data.cardios) {
                const { data: cardio, error: cError } = await supabase.from('cardios').insert({
                    trainer_id: user.id,
                    name: cData.type || 'Cardio Importado',
                    description: `${cData.duration || ''} ${cData.intensity || ''} (${cData.frequency || ''})`.trim()
                }).select().single()

                if (!cError && cardio) {
                    results.cardios.push(cardio.id);
                    if (targetStudentId) {
                        await supabase.from('assigned_cardios').insert({
                            student_id: targetStudentId,
                            cardio_id: cardio.id,
                            duration_minutes: parseInt(cData.duration) || 30,
                            suggested_intensity: (cData.intensity || 'Moderado').toString(),
                            days_of_week: (cData.application_days && cData.application_days.length > 0) ? cData.application_days : [0, 1, 2, 3, 4, 5, 6],
                            active: true,
                        });
                    }
                }
            }
        }

        // 4. Process Ergogenics
        if (data.ergogenics && Array.isArray(data.ergogenics) && data.ergogenics.length > 0) {
            if (targetStudentId) {
                await supabase.from('student_details').upsert({ 
                    id: targetStudentId, 
                    steroid_use: true 
                }, { onConflict: 'id' });
                for (const eData of data.ergogenics) {
                    await supabase.from('ergogenics').insert({
                        trainer_id: user.id, 
                        student_id: targetStudentId,
                        name: eData.name, 
                        dosage: eData.dosage, 
                        weekly_dosage: eData.weekly_dosage || 0,
                        unit: (eData.unit === 'mg' || eData.unit === 'ml' || eData.unit === 'un') ? eData.unit : 'ml',
                        application_days: eData.application_days || [], 
                        notes: eData.notes || '',
                        start_date: new Date().toISOString().split('T')[0]
                    });
                }
            }
        }

        // Revalidations
        revalidateTag(`trainer-${user.id}`, 'page')
        revalidatePath('/dashboard/trainer/students')
        revalidatePath('/dashboard/trainer/diets')
        revalidatePath('/dashboard/trainer/workouts')
        revalidatePath('/dashboard/trainer/cardio')
        if (targetStudentId) {
            revalidatePath(`/dashboard/trainer/students/${targetStudentId}`)
            revalidatePath('/dashboard/student/diet')
            revalidatePath('/dashboard/student/cardio')
            revalidatePath('/dashboard/student/ergogenics')
        }

        return { success: true, results, data: results }
    } catch (e: any) {
        console.error("[SAVE-ACTIONS] Critical failure:", e.message);
        return { error: e.message }
    }
}
