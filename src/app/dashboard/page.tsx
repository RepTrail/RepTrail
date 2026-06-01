import { getProfile } from '@/lib/dal/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export default async function DashboardPage() {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')
    if (!userId) redirect('/auth/login')

    const profile = await getProfile(userId)

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
