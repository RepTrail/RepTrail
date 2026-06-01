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

    if (!isAdmin) {
        redirect('/dashboard')
    }

    return <>{children}</>
}

