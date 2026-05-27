'use client'

import { STORE_TOKENS } from '@/components/store/constants/tokens'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getAdminLogs } from '@/actions/admin-actions'
import { createClient } from '@/lib/supabase/client'
import { RegistryProvider } from '@/components/store/advanced/registry-context'
import { DashboardShell } from '@/components/store/advanced/dashboard-shell'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { Stack } from '@/components/store/base/stack'
import { LogItem } from '@/components/store/intermediary/log-item'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { Input } from '@/components/store/base/input'
import { Activity, Search } from 'lucide-react'

const ACTION_VARIANT_MAP: Record<string, 'blue' | 'orange' | 'red'> = {
    UPDATE_USER_ROLE:    'blue',
    ACTIVATE_ONDEMAND:  'orange',
    DELETE_PRODUCT:     'red',
    DELETE_USER:        'red',
    GRANT_ELITE:        'orange',
    REVOKE_ELITE:       'red',
    GRANT_TRIAL:        'blue',
}

export default function AdminLogsPage() {
    const [search, setSearch] = useState('')
    const { data: logs = [], isLoading } = useQuery({
        queryKey: QUERY_KEYS.admin.logs,
        queryFn: () => getAdminLogs()
    })

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

    const filtered = logs.filter(log => 
        !search || 
        log.action.toLowerCase().includes(search.toLowerCase()) || 
        log.admin?.full_name?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <RegistryProvider defaultColor="red">
            <DashboardShell
                color={STORE_TOKENS.COLORS.ERROR}
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
                    title="LOGS DE ATIVIDADE"
                    subtitle="Rastro de auditoria de todas as ações realizadas no painel administrativo."
                    icon={Activity}
                    contextLabel="Auditoria do Sistema"
                    showTabs={false}
                >
                    <RegistrySection
                        title="Registro de Eventos"
                        subtitle="Acompanhe todas as ações administrativas realizadas na plataforma."
                        icon={Activity}
                    >
                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Filtrar logs por ação ou administrador..."
                                icon={<Search size={16} />}
                                rounded={STORE_TOKENS.RADIUS.FULL}
                            />

                            {isLoading && (
                                <EmptyState icon={Activity} title="Carregando logs..." description="Buscando registros de auditoria." />
                            )}

                            {!isLoading && filtered.map(log => (
                                <LogItem
                                    key={log.id}
                                    action={log.action}
                                    admin={log.admin?.full_name || 'Sistema'}
                                    target={log.target_id || '—'}
                                    details={log.details || undefined}
                                    date={new Date(log.created_at).toLocaleString('pt-BR')}
                                    variant={ACTION_VARIANT_MAP[log.action] ?? 'blue'}
                                />
                            ))}

                            {!isLoading && filtered.length === 0 && (
                                <EmptyState icon={Activity} title="Sem atividades" description="Não há registros de auditoria para o período selecionado." />
                            )}
                        </Stack>
                    </RegistrySection>
                </RegistryMain>
            </DashboardShell>
        </RegistryProvider>
    );
}
