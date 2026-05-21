import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Home, Users, DollarSign, BarChart2, User, ArrowRightLeft } from 'lucide-react'
import { DashboardShell } from '@/components/store/advanced/dashboard-shell'
import { RegistryProvider } from '@/components/store/advanced/registry-context'

export default async function AffiliateLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/auth/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, is_affiliate, role, is_admin')
        .eq('id', user.id)
        .single()

    const links = [
        { href: '/dashboard/affiliate',           label: 'Visão Geral',  icon: 'Home',       exact: true },
        { href: '/dashboard/affiliate/referrals', label: 'Indicados',    icon: 'Users' },
        { href: '/dashboard/affiliate/earnings',  label: 'Ganhos',       icon: 'DollarSign' },
    ]

    return (
        <RegistryProvider defaultColor="amber">
            <DashboardShell
                color="amber"
                links={links}
                user={{ id: user.id, name: profile?.full_name, email: user.email, avatar_url: profile?.avatar_url, isAdmin: profile?.is_admin, role: profile?.role }}
                profileHref="/dashboard/affiliate/profile"
                settingsHref="/dashboard"
                profileIcon="ArrowRightLeft"
            >
                {children}
            </DashboardShell>
        </RegistryProvider>
    )
}
