import { checkAdminSession } from '@/lib/dal/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, isAdmin } = await checkAdminSession()

    if (!user) {
        redirect('/auth/login')
    }

    const { getProfile } = await import('@/lib/dal/server')
    const profile = await getProfile(user.id)
    if (!profile) {
        redirect('/auth/logout')
    }

    if (!isAdmin) {
        redirect('/dashboard')
    }

    return <>{children}</>
}

