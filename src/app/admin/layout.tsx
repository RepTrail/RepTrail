import { checkAdminSession } from '@/lib/dal/server'
import { redirect } from 'next/navigation'
import { RegistryProvider } from '@/components/store/base/registry-context'
import { DashboardShell } from '@/components/store/advanced/dashboard-shell'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

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

    return (
        <RegistryProvider defaultColor="red">
            <DashboardShell
                color={STORE_TOKENS.COLORS.ERROR}
                links={[
                    { href: '/admin/dashboard', label: 'Início', icon: 'BarChart3', exact: true },
                    { href: '/admin/personais', label: 'Personais', icon: 'UserCheck' },
                    { href: '/admin/alunos', label: 'Alunos', icon: 'Users' },
                    { href: '/admin/plans', label: 'Planos', icon: 'CreditCard' },
                    { href: '/admin/afiliados', label: 'Afiliados', icon: 'HeartHandshake' },
                    { href: '/admin/loja', label: 'Loja', icon: 'ShoppingBag' },
                    { href: '/admin/logs', label: 'Logs', icon: 'Activity' },
                ]}
                user={{
                    id: profile.id,
                    name: profile?.full_name || 'Admin',
                    email: user.email || '',
                    avatar_url: profile.avatar_url,
                    isAdmin: true,
                    isAffiliate: profile.is_affiliate || false,
                }}
                profileHref="/dashboard"
                profileIcon="ArrowRightLeft"
            >
                {children}
            </DashboardShell>
        </RegistryProvider>
    )
}

