'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { redirect } from 'next/navigation'
import { setupAutoTrainingForStudent } from './auto-training-setup'

const onboardingSchema = z.object({
    birthDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Data inválida"),
    height: z.coerce.number().min(50, "Altura mínima 50cm").max(300, "Altura máxima 300cm"),
    startingWeight: z.coerce.number().min(20, "Peso mínimo 20kg").max(500, "Peso máximo 500kg"),
    estimatedBf: z.coerce.number().min(1, "BF Mínimo 1%").max(60, "BF Máximo 60%").optional(),
    activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'athlete']),
    goal: z.string().min(3, "Objetivo muito curto"),
    steroidUse: z.boolean().default(false),
    observations: z.string().optional(),
    trainerCode: z.string().optional(),
    imageAuth: z.boolean().default(false),
})

export type OnboardingState = {
    errors?: {
        [key: string]: string[]
    }
    message?: string
}

export async function submitOnboarding(prevState: OnboardingState, formData: FormData) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { message: 'Unauthorized' }
    }

    // Parse Data (empty string -> undefined para campos opcionais)
    const get = (k: string) => {
        const val = formData.get(k) as string | null
        if (!val || val.trim() === '') return undefined
        return val
    }

    const rawData = {
        birthDate: get('birthDate'),
        height: get('height'),
        startingWeight: get('startingWeight'),
        estimatedBf: get('estimatedBf'),
        activityLevel: get('activityLevel') || 'moderate', // fallback se hidden input falhar
        goal: get('goal'),
        steroidUse: formData.get('steroidUse') === 'on',
        observations: get('observations'),
        trainerCode: get('trainerCode'),
        imageAuth: get('imageAuth') === 'true',
    }

    const validatedFields = onboardingSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Erro na validação dos dados.',
        }
    }

    const data = validatedFields.data

    // 1. Save Student Details
    const { error: detailsError } = await supabase
        .from('student_details')
        .upsert({
            id: user.id,
            birth_date: data.birthDate,
            height: data.height,
            starting_weight: data.startingWeight,
            body_fat: data.estimatedBf, // Add BF
            activity_level: data.activityLevel,
            goal: data.goal,
            steroid_use: data.steroidUse,
            observations: data.observations,
            image_publication_authorized: data.imageAuth,
        })

    if (detailsError) {
        return { message: 'Erro ao salvar detalhes: ' + detailsError.message }
    }

    // 2. Initial Weight History
    await supabase.from('weight_history').insert({
        student_id: user.id,
        weight_kg: data.startingWeight,
    })

    // 2.1 Initial BF History (if provided)
    if (data.estimatedBf) {
        await supabase.from('bf_history').insert({
            student_id: user.id,
            bf_percentage: data.estimatedBf,
        })
    }

    // 3. Trainer Linking (if code provided)
    if (data.trainerCode) {
        // Find trainer by code (case-insensitive)
        const { data: trainer } = await supabase
            .from('profiles')
            .select('id')
            .ilike('trainer_code', data.trainerCode)
            .maybeSingle()

        if (trainer) {
            console.log(`[ONBOARDING] Linking student ${user.id} to trainer ${trainer.id}`);
            // Link student to trainer
            const { error: linkErr } = await supabase.from('trainer_students').upsert({
                trainer_id: trainer.id,
                student_id: user.id,
                billing_source: 'external',
                active: true
            }, { onConflict: 'trainer_id,student_id' })

            if (linkErr) {
                console.error('[ONBOARDING] Link error:', linkErr);
            } else {
                // If linked to a trainer, they are NOT auto-training
                await supabase
                    .from('profiles')
                    .update({ 
                        auto_training_status: 'inactive',
                        onboarding_completed: true
                    })
                    .eq('id', user.id);
            }
        } else {
            console.warn(`[ONBOARDING] Trainer code not found: ${data.trainerCode}`);
            // Still mark as completed even if trainer code fails
            await supabase
                .from('profiles')
                .update({ onboarding_completed: true })
                .eq('id', user.id);
        }
    } else {
        // If no personal trainer code, set them up with the Auto Training default plan
        console.log(`[ONBOARDING] No trainer code, setting up Auto-Training data for ${user.id}, but keeping status as none until accepted`);

        await supabase
            .from('profiles')
            .update({ 
                auto_training_status: 'none',
                onboarding_completed: true
            })
            .eq('id', user.id);

        await setupAutoTrainingForStudent(user.id, data)
    }

    redirect('/dashboard/student')
}
