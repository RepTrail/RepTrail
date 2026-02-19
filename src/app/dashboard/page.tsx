
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    // Read from profiles to get is_affiliate (not available in user_metadata for existing users)
    const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_affiliate')
        .eq('id', user.id)
        .single()

    // Redirect based on role
    // Affiliates should access their dashboard via sidebar link, not forced redirect

    if (profile?.role === 'admin') {
        redirect('/admin/dashboard')
    }

    if (profile?.role === 'trainer') {
        redirect('/dashboard/trainer')
    }

    redirect('/dashboard/student')
}
