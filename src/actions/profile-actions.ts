'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateTrainerProfile(data: {
    full_name?: string
    bio?: string
    specialties?: string[]
    whatsapp?: string
    trainer_code?: string
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, error: 'Não autorizado' }
    }

    try {
        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: data.full_name,
                bio: data.bio,
                specialties: data.specialties,
                whatsapp: data.whatsapp,
                trainer_code: data.trainer_code,
            })
            .eq('id', user.id)

        if (error) throw error

        revalidatePath('/dashboard/trainer')
        revalidatePath('/dashboard', 'layout')
        revalidatePath(`/trainer`) // Revalidate public profiles if needed
        return { success: true }
    } catch (error: any) {
        console.error('Error updating trainer profile:', error)
        return { success: false, error: error.message }
    }
}
