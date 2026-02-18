'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

/** Retorna beta_tester_mode via função RPC - seguro para qualquer autenticado */
export async function getBetaTesterMode(): Promise<boolean> {
    const supabase = await createClient()
    const { data, error } = await supabase.rpc('get_beta_tester_mode')
    if (error) return false
    return !!data
}

/** Retorna gemini_api_key e stripe_secret_key - usa service role, apenas server-side */
export async function getPlatformSecrets(): Promise<{
    gemini_api_key: string | null
    stripe_secret_key: string | null
}> {
    const admin = createAdminClient()
    if (!admin) {
        return {
            gemini_api_key: process.env.GEMINI_API_KEY || null,
            stripe_secret_key: process.env.STRIPE_SECRET_KEY || null
        }
    }
    const { data: rawData } = await admin
        .from('app_settings')
        .select('gemini_api_key, stripe_secret_key')
        .eq('id', 1)
        .single()

    const data = rawData as { gemini_api_key: string | null; stripe_secret_key: string | null } | null

    return {
        gemini_api_key: data?.gemini_api_key || process.env.GEMINI_API_KEY || null,
        stripe_secret_key: data?.stripe_secret_key || process.env.STRIPE_SECRET_KEY || null
    }
}

/** Retorna a chave do Gemini para uso em AI - prioriza BD, fallback env */
export async function getGeminiApiKey(): Promise<string | null> {
    const { gemini_api_key } = await getPlatformSecrets()
    return gemini_api_key || null
}

/** Retorna a chave do Stripe para uso em checkout - prioriza BD, fallback env */
export async function getStripeSecretKey(): Promise<string | null> {
    const { stripe_secret_key } = await getPlatformSecrets()
    return stripe_secret_key || null
}

/** Admin: obtém app_settings (beta_tester_mode, mascara chaves) */
export async function getAppSettings() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

    if (!profile?.is_admin) return null

    const { data: rawData } = await supabase
        .from('app_settings')
        .select('beta_tester_mode, gemini_api_key, stripe_secret_key')
        .eq('id', 1)
        .single()

    const data = rawData as {
        beta_tester_mode: boolean;
        gemini_api_key: string | null;
        stripe_secret_key: string | null
    } | null

    if (!data) return null
    return {
        beta_tester_mode: !!data.beta_tester_mode,
        gemini_api_key: data.gemini_api_key ? '••••••••' + (data.gemini_api_key.slice(-4) || '') : '',
        stripe_secret_key: data.stripe_secret_key ? '••••••••' + (data.stripe_secret_key.slice(-4) || '') : '',
        has_gemini: !!data.gemini_api_key,
        has_stripe: !!data.stripe_secret_key
    }
}

/** Admin: atualiza app_settings */
export async function updateAppSettings(data: {
    beta_tester_mode?: boolean
    gemini_api_key?: string | null
    stripe_secret_key?: string | null
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Não autorizado' }

    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

    if (!profile?.is_admin) return { error: 'Não autorizado' }

    const update: Record<string, unknown> = {
        updated_at: new Date().toISOString()
    }
    if (data.beta_tester_mode !== undefined) update.beta_tester_mode = data.beta_tester_mode
    if (data.gemini_api_key !== undefined) update.gemini_api_key = data.gemini_api_key || null
    if (data.stripe_secret_key !== undefined) update.stripe_secret_key = data.stripe_secret_key || null

    const { error } = await supabase
        .from('app_settings')
        .update(update)
        .eq('id', 1)

    if (error) return { error: error.message }
    revalidatePath('/admin')
    revalidatePath('/dashboard', 'layout')
    return { success: true }
}
