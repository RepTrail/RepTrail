'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { redirect } from 'next/navigation'

const onboardingSchema = z.object({
    birthDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Data inválida"),
    height: z.coerce.number().min(50, "Altura mínima 50cm").max(300, "Altura máxima 300cm"),
    startingWeight: z.coerce.number().min(20, "Peso mínimo 20kg").max(500, "Peso máximo 500kg"),
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
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { message: 'Unauthorized' }
    }

    // Parse Data (empty string -> undefined para campos opcionais)
    const get = (k: string) => (formData.get(k) as string | null) || undefined
    const rawData = {
        birthDate: get('birthDate'),
        height: get('height'),
        startingWeight: get('startingWeight'),
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

    // 3. Trainer Linking (if code provided)
    if (data.trainerCode) {
        // Find trainer by code
        const { data: trainer } = await supabase
            .from('profiles')
            .select('id')
            .eq('trainer_code', data.trainerCode)
            .single()

        if (trainer) {
            // Link student to trainer
            await supabase.from('trainer_students').insert({
                trainer_id: trainer.id,
                student_id: user.id,
                billing_source: 'external', // Default to external for code invites? Or prompt pay?
                // Master Prompt says: "Aluno cria conta -> insere código -> vínculo automático."
                // We assume 'external' or 'manual' billing for now.
                active: true
            })
        } else {
            // Should we fail? Or just warn?
            // For now, let's proceed but maybe return a warning in a real app.
        }
    }

    // 4. Update Profile to set "onboarding_completed" (if we had that flag, or just check existing details)
    // For now, we just redirect.

    redirect('/dashboard/student')
}
