'use server'

import { createClient } from '@/lib/supabase/server'

export async function getTermsStatus(): Promise<{ accepted: boolean; allowImageDisclosure?: boolean } | null> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data } = await supabase
        .from('profiles')
        .select('terms_accepted_at, allow_image_disclosure')
        .eq('id', user.id)
        .single()

    if (!data) return null
    return {
        accepted: !!data.terms_accepted_at,
        allowImageDisclosure: data.allow_image_disclosure ?? true
    }
}

export async function acceptTerms(allowImageDisclosure: boolean) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Não autenticado' }

    const { error } = await supabase
        .from('profiles')
        .update({
            terms_accepted_at: new Date().toISOString(),
            allow_image_disclosure: allowImageDisclosure
        })
        .eq('id', user.id)

    if (error) return { success: false, error: error.message }
    return { success: true }
}
