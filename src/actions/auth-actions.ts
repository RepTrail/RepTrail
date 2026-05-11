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
    const role = formData.get('role') as string || 'trainer'
    const referredBy = formData.get('referred_by') as string
    
    const supabase = await createClient()

    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                role: role,
            }
        }
    })

    if (signUpError || !user) {
        return { error: signUpError?.message || 'Erro ao criar conta.' }
    }

    // Additional profile updates if needed
    const updates: any = {
        full_name: fullName,
        role: role,
    }

    if (referredBy) {
        updates.referred_by_id = referredBy
    }

    const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
            id: user.id,
            ...updates
        })

    if (profileError) {
        console.error('Profile upsert error:', profileError)
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
