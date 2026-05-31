import { STORE_TOKENS } from '@/components/store/constants/tokens';
import { getSupabaseServer } from '@/lib/dal'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/store/advanced/dashboard-shell'
import { RegistryProvider } from '@/components/store/advanced/registry-context'
import { headers } from 'next/headers'

export default async function AffiliateLayout({ children }: { children: React.ReactNode }) {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')

    if (!userId) redirect('/auth/login')

    const supabase = await getSupabaseServer()

    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, email, is_affiliate, role, is_admin')
        .eq('id', userId)
        .single()

    if (!profile) redirect('/auth/login')
    if (profile.role !== 'affiliate' && !profile.is_affiliate) redirect('/dashboard')

    const links = [
        { href: '/dashboard/affiliate',           label: 'Visão Geral',  icon: 'Home',       exact: true },
        { href: '/dashboard/affiliate/referrals', label: 'Indicados',    icon: 'Users' },
        { href: '/dashboard/affiliate/earnings',  label: 'Ganhos',       icon: 'DollarSign' },
    ]

    return (
        <RegistryProvider defaultColor="amber">
            <DashboardShell
                color={STORE_TOKENS.COLORS.WARNING}
                links={links}
                user={{ id: userId, name: profile.full_name, email: profile.email, avatar_url: profile.avatar_url, isAdmin: profile.is_admin, isAffiliate: profile.is_affiliate, role: profile.role }}
                profileHref="/dashboard/affiliate/profile"
                settingsHref="/dashboard"
                profileIcon="ArrowRightLeft"
            >
                {children}
            </DashboardShell>
        </RegistryProvider>
    );
}
