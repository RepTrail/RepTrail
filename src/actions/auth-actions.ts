'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function signOutAction() {
    const supabase = await createClient()
    await supabase.auth.signOut()

    revalidatePath('/', 'layout')
    redirect('/auth/login')
}

export async function signInAction(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signUpAction(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('full_name') as string
    const role = (formData.get('role') as string) || 'trainer'
    const whatsapp = formData.get('whatsapp') as string
    const referredBy = formData.get('referred_by') as string
    
    const supabase = await createClient()

    // Pass ALL data into user_metadata so the handle_new_user trigger
    // picks it up correctly and creates the profile atomically.
    const metadata: Record<string, string> = {
        full_name: fullName,
        role: role,
    }
    if (whatsapp) metadata.whatsapp = whatsapp
    if (referredBy) metadata.referred_by_id = referredBy

    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata }
    })

    if (signUpError || !user) {
        return { error: signUpError?.message || 'Erro ao criar conta.' }
    }

    // Safety-net upsert: ensures profile row exists even if trigger was
    // slow or the DB trigger is not yet deployed in this environment.
    // Uses the authenticated session (established by signUp above).
    const profilePayload: Record<string, any> = {
        id: user.id,
        email: email,
        full_name: fullName,
        role: role,
    }
    profilePayload.plan_tier = 'on_demand'
    if (whatsapp) profilePayload.whatsapp = whatsapp
    if (referredBy) profilePayload.referred_by_id = referredBy

    const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profilePayload, { onConflict: 'id', ignoreDuplicates: false })

    if (profileError) {
        console.error('Profile upsert error:', profileError)
        // Not fatal — the trigger may have already created the row
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function forgotPasswordAction(formData: FormData) {
    const email = formData.get('email') as string
    const origin = formData.get('origin') as string
    
    const supabase = await createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/update-password`,
    })

    if (error) {
        return { error: error.message }
    }

    return { success: 'Email de recuperação enviado com sucesso.' }
}

export async function updatePasswordAction(formData: FormData) {
    const password = formData.get('password') as string
    
    const supabase = await createClient()

    const { error } = await supabase.auth.updateUser({
        password: password,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}
