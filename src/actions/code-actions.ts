'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { customAlphabet } from 'nanoid'

export async function generateTrainerCode() {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    // Check if user already has a code
    const { data: profile } = await supabase
        .from('profiles')
        .select('trainer_code')
        .eq('id', user.id)
        .single()

    if (profile?.trainer_code) {
        return { code: profile.trainer_code }
    }

    const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6)
    const code = `TR-${nanoid()}`

    const { error } = await supabase
        .from('profiles')
        .update({ trainer_code: code })
        .eq('id', user.id)

    if (error) return { error: error.message }

    revalidatePath('/dashboard/trainer')
    return { code }
}
