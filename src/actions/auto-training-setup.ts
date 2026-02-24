import { createClient } from '@/lib/supabase/server'

export async function setupAutoTrainingForStudent(studentId: string, profileData: any) {
    const supabase = await createClient()

    try {
        // 1. Mark profile with public feed permission if requested during onboarding
        // The `image_publication_authorized` flag maps to `allow_public_feed` in profiles
        if (profileData.imageAuth) {
            await supabase
                .from('profiles')
                .update({ allow_public_feed: true })
                .eq('id', studentId)
        }

        // 2. Create Default Auto-Training Workout Plan
        const { data: workoutParams, error: workoutErr } = await supabase
            .from('workouts')
            .insert({
                trainer_id: studentId, // Student is their own trainer
                name: 'Treino Auto-Trial (4 Dias)',
                description: 'Gerado automaticamente para o seu perfil. Treino de adaptação focado em hipertrofia básica (Upper/Lower).'
            })
            .select('id')
            .single()

        if (workoutErr) throw workoutErr;
        const workoutId = workoutParams.id;

        // 3. Find 8 basic system exercises
        const { data: exercises } = await supabase
            .from('exercises')
            .select('id, name, is_system_default')
            .eq('is_system_default', true)
            .limit(20)

        // Find or create exercises
        async function getExercise(name: string, muscleGroup: string) {
            let ex = exercises?.find(e => e.name.toLowerCase().includes(name.toLowerCase()));
            if (!ex) {
                const { data } = await supabase.from('exercises').insert({
                    name,
                    is_system_default: true,
                    muscle_group: muscleGroup,
                    trainer_id: studentId
                }).select('id').single();
                return data?.id;
            }
            return ex.id;
        }

        const benchPressId = await getExercise('Supino Reto', 'Peito');
        const pulldownId = await getExercise('Puxada Frontal', 'Dorsais');
        const shoulderPressId = await getExercise('Desenvolvimento Halteres', 'Ombros');
        const bicepCurlId = await getExercise('Rosca Direta', 'Bíceps');
        const tricepPushdownId = await getExercise('Tríceps Pulley', 'Tríceps');
        const squatId = await getExercise('Agachamento Livre', 'Quadríceps');
        const legpressId = await getExercise('Leg Press 45', 'Quadríceps');
        const calfRaiseId = await getExercise('Panturrilha em Pé', 'Panturrilhas');

        // 4. Insert Exercises into the Workout Plan (with the specific structure requested)
        // 2 Warm Up, 1 Feeder, 2 Working Sets
        const exercisesToInsert = [
            { workout_id: workoutId, exercise_id: benchPressId, order_index: 1, warmup_sets: 2, feeder_sets: 1, working_sets: 2, reps: '8-10', rest_seconds: 90 },
            { workout_id: workoutId, exercise_id: pulldownId, order_index: 2, warmup_sets: 2, feeder_sets: 1, working_sets: 2, reps: '10-12', rest_seconds: 90 },
            { workout_id: workoutId, exercise_id: shoulderPressId, order_index: 3, warmup_sets: 1, feeder_sets: 0, working_sets: 3, reps: '10-12', rest_seconds: 60 },
            { workout_id: workoutId, exercise_id: bicepCurlId, order_index: 4, warmup_sets: 0, feeder_sets: 0, working_sets: 3, reps: '12-15', rest_seconds: 60 },
            { workout_id: workoutId, exercise_id: tricepPushdownId, order_index: 5, warmup_sets: 0, feeder_sets: 0, working_sets: 3, reps: '12-15', rest_seconds: 60 },
            { workout_id: workoutId, exercise_id: squatId, order_index: 6, warmup_sets: 2, feeder_sets: 1, working_sets: 2, reps: '8-10', rest_seconds: 120 },
            { workout_id: workoutId, exercise_id: legpressId, order_index: 7, warmup_sets: 1, feeder_sets: 1, working_sets: 2, reps: '10-12', rest_seconds: 90 },
            { workout_id: workoutId, exercise_id: calfRaiseId, order_index: 8, warmup_sets: 0, feeder_sets: 0, working_sets: 4, reps: '15-20', rest_seconds: 45 },
        ].filter(e => e.exercise_id);

        if (exercisesToInsert.length > 0) {
            await supabase.from('workout_exercises').insert(exercisesToInsert as any);
        }

        // 5. Schedule the Workout (Seg: Upper, Ter: Lower, Qui: Upper, Sex: Lower)
        // We only have 1 workout object so we schedule it on those days.
        const schedule = [
            { student_id: studentId, workout_id: workoutId, day_of_week: 1, active: true }, // Segunda
            { student_id: studentId, workout_id: workoutId, day_of_week: 2, active: true }, // Terça
            { student_id: studentId, workout_id: workoutId, day_of_week: 4, active: true }, // Quinta
            { student_id: studentId, workout_id: workoutId, day_of_week: 5, active: true }, // Sexta
        ]
        await supabase.from('assigned_workouts').insert(schedule);

        // 6. Create Default Recomp Diet
        const { data: dietData } = await supabase
            .from('diets')
            .insert({
                trainer_id: studentId,
                name: 'Dieta Base - Recomposição Corporal'
            })
            .select('id')
            .single()

        if (dietData) {
            const dietId = dietData.id;

            // Meal 1
            const { data: meal1 } = await supabase.from('meals').insert({ diet_id: dietId, name: 'Café da Manhã', order_index: 1, time_of_day: '08:00' }).select('id').single();
            if (meal1) {
                await supabase.from('meal_items').insert([
                    { meal_id: meal1.id, food_name: 'Ovos Inteiros', quantity: '3 unidades', protein: 18, fat: 15, carbs: 0, calories: 210 },
                    { meal_id: meal1.id, food_name: 'Pão de Forma Tradicional', quantity: '2 fatias', protein: 4, fat: 1, carbs: 25, calories: 120 },
                    { meal_id: meal1.id, food_name: 'Mamão Papaia', quantity: '150g', protein: 1, fat: 0, carbs: 15, calories: 65 },
                ])
            }

            // Meal 2
            const { data: meal2 } = await supabase.from('meals').insert({ diet_id: dietId, name: 'Almoço', order_index: 2, time_of_day: '13:00' }).select('id').single();
            if (meal2) {
                await supabase.from('meal_items').insert([
                    { meal_id: meal2.id, food_name: 'Arroz Branco Cozido', quantity: '150g', protein: 3, fat: 0, carbs: 42, calories: 195 },
                    { meal_id: meal2.id, food_name: 'Feijão Carioca Cozido', quantity: '100g', protein: 5, fat: 0.5, carbs: 14, calories: 75 },
                    { meal_id: meal2.id, food_name: 'Peito de Frango Grelhado', quantity: '120g', protein: 38, fat: 3, carbs: 0, calories: 190 },
                    { meal_id: meal2.id, food_name: 'Salada Verde (Alface/Tomate)', quantity: 'à vontade', protein: 0, fat: 0, carbs: 0, calories: 0 },
                ])
            }

            // Meal 3
            const { data: meal3 } = await supabase.from('meals').insert({ diet_id: dietId, name: 'Lanche da Tarde', order_index: 3, time_of_day: '16:30' }).select('id').single();
            if (meal3) {
                await supabase.from('meal_items').insert([
                    { meal_id: meal3.id, food_name: 'Banana Prata', quantity: '2 unidades', protein: 2, fat: 0, carbs: 46, calories: 180 },
                    { meal_id: meal3.id, food_name: 'Aveia em Flocos', quantity: '30g', protein: 4, fat: 2, carbs: 17, calories: 105 },
                    { meal_id: meal3.id, food_name: 'Iogurte Natural', quantity: '1 copo (170g)', protein: 6, fat: 6, carbs: 9, calories: 120 },
                ])
            }

            // Meal 4
            const { data: meal4 } = await supabase.from('meals').insert({ diet_id: dietId, name: 'Jantar', order_index: 4, time_of_day: '20:30' }).select('id').single();
            if (meal4) {
                await supabase.from('meal_items').insert([
                    { meal_id: meal4.id, food_name: 'Batata Doce Cozida', quantity: '150g', protein: 2, fat: 0, carbs: 28, calories: 120 },
                    { meal_id: meal4.id, food_name: 'Carne Moída (Patinho)', quantity: '120g', protein: 32, fat: 8, carbs: 0, calories: 210 },
                    { meal_id: meal4.id, food_name: 'Azeite de Oliva Extra Virgem', quantity: '1 colher de sopa', protein: 0, fat: 12, carbs: 0, calories: 108 },
                ])
            }

            // Assign the diet to the student
            await supabase.from('assigned_diets').insert({
                student_id: studentId,
                diet_id: dietId,
                active: true
            });
        }

        console.log(`Auto Training setup completed for student ${studentId}`)
        return { success: true }
    } catch (e) {
        console.error('Failed to setup auto training environment:', e)
        return { success: false }
    }
}
