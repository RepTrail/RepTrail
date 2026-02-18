import { createClient } from '@supabase/supabase-js'

let adminClient: ReturnType<typeof createClient> | null = null

/** Cliente com service role - usa SUPABASE_SERVICE_ROLE_KEY (bypassa RLS). Apenas para operações server-side que precisam ler secrets. */
export function createAdminClient() {
    if (adminClient) return adminClient
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!key) return null
    adminClient = createClient(url, key, { auth: { persistSession: false } })
    return adminClient
}
