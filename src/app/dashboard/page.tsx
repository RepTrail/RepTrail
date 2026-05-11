import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_affiliate, full_name')
        .eq('id', user.id)
        .single()

    // Use user_metadata as fallback if DB role is null or mismatched (edge case for some accounts)
    const metadataRole = user.user_metadata?.role
    const effectiveRole = profile?.role || metadataRole

    // Auto-fix if role is missing or mismatched from metadata (source of truth for signup)
    if (metadataRole && profile?.role !== metadataRole) {
        await supabase
            .from('profiles')
            .upsert({ 
                id: user.id, 
                role: metadataRole,
                full_name: user.user_metadata?.full_name || profile?.full_name
            })
    }

    if (effectiveRole === 'admin') {
        redirect('/admin/dashboard')
    }

    if (effectiveRole === 'trainer') {
        redirect('/dashboard/trainer')
    }

    if (effectiveRole === 'affiliate') {
        redirect('/dashboard/affiliate/stats')
    }

    redirect('/dashboard/student')
}
