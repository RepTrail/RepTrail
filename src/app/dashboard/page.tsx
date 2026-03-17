
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
        .select('role, is_affiliate')
        .eq('id', user.id)
        .single()

    // Use user_metadata as fallback if DB role is null (edge case for some accounts)
    const effectiveRole = profile?.role || user.user_metadata?.role

    // Auto-fix if role is missing from DB
    if (!profile?.role && user.user_metadata?.role) {
        await supabase
            .from('profiles')
            .update({ role: user.user_metadata.role })
            .eq('id', user.id)
    }

    if (effectiveRole === 'admin') {
        redirect('/admin/dashboard')
    }

    if (effectiveRole === 'trainer') {
        redirect('/dashboard/trainer')
    }

    redirect('/dashboard/student')
}
