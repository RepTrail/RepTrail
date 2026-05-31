import { getSupabaseServer } from '@/lib/dal'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export default async function DashboardPage() {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')
    if (!userId) redirect('/auth/login')

    const supabase = await getSupabaseServer()

    const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_affiliate, full_name')
        .eq('id', userId)
        .single()

    const role = profile?.role

    if (role === 'admin') {
        redirect('/admin/dashboard')
    }

    if (role === 'trainer') {
        redirect('/dashboard/trainer')
    }

    if (role === 'affiliate') {
        redirect('/dashboard/affiliate/stats')
    }

    redirect('/dashboard/student')
}
