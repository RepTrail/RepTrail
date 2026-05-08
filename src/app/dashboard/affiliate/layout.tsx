import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Home, Users, DollarSign, BarChart2, User } from 'lucide-react'
import { DashboardShell } from '@/components/store/advanced/dashboard-shell'

export default async function AffiliateLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/auth/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, is_affiliate, role')
        .eq('id', user.id)
        .single()

    const links = [
        { href: '/dashboard/affiliate',            label: 'Visão Geral',  icon: Home,       exact: true },
        { href: '/dashboard/affiliate/referrals',   label: 'Indicados',    icon: Users },
        { href: '/dashboard/affiliate/earnings',    label: 'Ganhos',       icon: DollarSign },
        { href: '/dashboard/affiliate/stats',       label: 'Estatísticas', icon: BarChart2 },
        // Link de retorno ao painel de origem
        ...(profile?.role === 'trainer'
            ? [{ href: '/dashboard/trainer', label: 'Meu Painel', icon: User }]
            : profile?.role === 'student'
                ? [{ href: '/dashboard/student', label: 'Meu Painel', icon: User }]
                : []
        ),
    ]

    return (
        <DashboardShell
            color="amber"
            links={links}
            user={{ id: user.id, name: profile?.full_name, email: user.email, avatar_url: profile?.avatar_url }}
        >
            {children}
        </DashboardShell>
    )
}
