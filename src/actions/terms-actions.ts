'use server'

import { createClient } from '@/lib/supabase/server'

export async function getTermsStatus(): Promise<{ accepted: boolean; allowImageDisclosure?: boolean; imagePublicationAuthorized?: boolean } | null> {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: profile } = await supabase
        .from('profiles')
        .select('terms_accepted_at, allow_image_disclosure')
        .eq('id', user.id)
        .single()

    const { data: details } = await supabase
        .from('student_details')
        .select('image_publication_authorized')
        .eq('id', user.id)
        .single()

    if (!profile) return null
    return {
        accepted: !!profile.terms_accepted_at,
        allowImageDisclosure: profile.allow_image_disclosure ?? true,
        imagePublicationAuthorized: details?.image_publication_authorized ?? false
    }
}

export async function acceptTerms(allowImageDisclosure: boolean) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Não autenticado' }

    // Update profile
    const { error: profileError } = await supabase
        .from('profiles')
        .update({
            terms_accepted_at: new Date().toISOString(),
            allow_image_disclosure: allowImageDisclosure,
            allow_public_feed: allowImageDisclosure,
            public_profile_enabled: allowImageDisclosure
        })

        .eq('id', user.id)

    if (profileError) return { success: false, error: profileError.message }

    // Also update student_details for consistency
    await supabase
        .from('student_details')
        .update({
            image_publication_authorized: allowImageDisclosure
        })
        .eq('id', user.id)

    return { success: true }
}
