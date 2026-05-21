'use client'

import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { createClient } from '@/lib/supabase/client'
import { DashboardShell } from '@/components/store/advanced/dashboard-shell'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { HeartHandshake } from 'lucide-react'
import { AdminAffiliatesContent } from '@/components/store/sections/admin-affiliates-content'

/**
 * AdminAfiliadosPage: Standardized entry point.
 * Logic is decoupled into AdminAffiliatesContent section.
 */
import { RegistryProvider } from '@/components/store/advanced/registry-context'

export default function AdminAfiliadosPage() {
    const { data: adminUser } = useQuery({
        queryKey: QUERY_KEYS.auth.user,
        queryFn: async () => {
            const supabase = createClient()
            const { data: { user: authUser } } = await supabase.auth.getUser()
            if (!authUser) return null
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', authUser.id).single()
            return profile || authUser
        }
    })

    return (
        <RegistryProvider defaultColor="red">
            <DashboardShell
                color="red"
                links={[
                    { href: '/admin/dashboard', label: 'Início', icon: 'BarChart3', exact: true },
                    { href: '/admin/personais', label: 'Personais', icon: 'UserCheck' },
                    { href: '/admin/alunos', label: 'Alunos', icon: 'Users' },
                    { href: '/admin/afiliados', label: 'Afiliados', icon: 'HeartHandshake' },
                    { href: '/admin/loja', label: 'Loja', icon: 'ShoppingBag' },
                    { href: '/admin/logs', label: 'Logs', icon: 'Activity' },
                ]}
                user={{
                    id: adminUser?.id || 'admin',
                    name: adminUser?.full_name || 'Admin RepTrail',
                    email: adminUser?.email || 'admin@reptrail.com.br',
                    avatar_url: adminUser?.avatar_url || null,
                    isAdmin: true,
                    isAffiliate: adminUser?.is_affiliate || false,
                }}
                profileHref="/dashboard"
                profileIcon="ArrowRightLeft"
            >
                <RegistryMain
                    title="GESTÃO DE AFILIADOS"
                    subtitle="Administração de parceiros comerciais, comissões e indicações."
                    icon={HeartHandshake}
                    contextLabel="Painel Admin"
                    showTabs={false}
                >
                    <AdminAffiliatesContent />
                </RegistryMain>
            </DashboardShell>
        </RegistryProvider>
    )
}

