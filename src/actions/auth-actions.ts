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

    const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .maybeSingle()

        if (!profile) {
            // Tentativa de recuperação de perfil (caso o trigger ou o upsert inicial tenha falhado)
            try {
                const { adminClient } = await import('@/lib/supabase/admin')
                const metadata = user.user_metadata || {}
                const profilePayload: Record<string, any> = {
                    id: user.id,
                    email: user.email,
                    full_name: metadata.full_name || 'Usuário',
                    role: metadata.role || 'trainer',
                }
                if (metadata.whatsapp) profilePayload.whatsapp = metadata.whatsapp

                // Removido a atribuição de plan_id para que caia no paywall

                const { error: recoveryError } = await adminClient
                    .from('profiles')
                    .upsert(profilePayload)
                
                if (recoveryError) {
                    console.error('Erro na recuperação do perfil:', recoveryError)
                    await supabase.auth.signOut()
                    return { error: 'Esta conta foi excluída ou desativada.' }
                }
            } catch (e) {
                console.error('Exceção na recuperação do perfil:', e)
                await supabase.auth.signOut()
                return { error: 'Esta conta foi excluída ou desativada.' }
            }
        }
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

    // --- GHOST PROFILE MIGRATION ---
    // If the trainer created a placeholder with this email, transfer the linkages
    try {
        const { adminClient } = await import('@/lib/supabase/admin')
        
        const targetEmail = user?.email || email.trim().toLowerCase()
        
        const { data: ghost } = await adminClient
            .from('profiles')
            .select('id')
            .eq('email', targetEmail)
            .eq('is_placeholder', true)
            .maybeSingle()

        if (ghost) {
            console.log(`[AUTH] Migrating ghost profile ${ghost.id} to new user ${user.id}`)
            
            if (ghost.id === user.id) {
                // The DB trigger updated the ghost profile in-place!
                // Relationships cascaded automatically. Just unset the placeholder flag.
                await adminClient.from('profiles').update({ is_placeholder: false }).eq('id', user.id)
            } else {
                // Transfer relationships manually
                await adminClient.from('trainer_students').update({ student_id: user.id }).eq('student_id', ghost.id)
                await adminClient.from('assigned_workouts').update({ student_id: user.id }).eq('student_id', ghost.id)
                await adminClient.from('assigned_diets').update({ student_id: user.id }).eq('student_id', ghost.id)
                await adminClient.from('assigned_cardios').update({ student_id: user.id }).eq('student_id', ghost.id)
                await adminClient.from('ergogenics').update({ student_id: user.id }).eq('student_id', ghost.id)
                
                // Delete old ghost profile
                await adminClient.from('profiles').delete().eq('id', ghost.id)
            }
        }
    } catch (migErr) {
        console.error('[AUTH] Ghost migration failed:', migErr)
    }
    // -------------------------------

    // Safety-net upsert: ensures profile row exists even if trigger was
    // slow or the DB trigger is not yet deployed in this environment.
    const profilePayload: Record<string, any> = {
        id: user.id,
        email: email,
        full_name: fullName,
        role: role,
    }
    if (whatsapp) profilePayload.whatsapp = whatsapp
    if (referredBy) profilePayload.referred_by_id = referredBy

    try {
        const { adminClient } = await import('@/lib/supabase/admin')

        // Removido a atribuição de plan_id para que caia no paywall

        const { error: profileError } = await adminClient
            .from('profiles')
            .upsert(profilePayload, { onConflict: 'id', ignoreDuplicates: false })

        if (profileError) {
            console.error('Profile upsert error:', profileError)
        }
    } catch (err) {
        console.error('Error during profile safety-net upsert:', err)
    }

    // Auto-login immediately after sign up
    const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (signInError) {
        console.error('Auto-login error:', signInError)
        return { error: 'Conta criada, mas falha no login automático: ' + signInError.message }
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

export async function selfDeleteAction(password: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user || !user.email) {
        return { error: 'Usuário não autenticado.' }
    }

    // Validar a senha
    const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: password,
    })

    if (signInError) {
        return { error: 'Senha incorreta.' }
    }

    const { adminClient } = await import('@/lib/supabase/admin')
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id)

    if (deleteError) {
        return { error: deleteError.message || 'Erro ao excluir conta.' }
    }

    await supabase.auth.signOut()
    return { success: true }
}
