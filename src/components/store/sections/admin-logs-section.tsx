'use client'

import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { useState } from 'react'
import { useQuery, actions } from '@/lib/dal'
import { QUERY_KEYS } from '@/lib/query-keys'
import { Stack } from '@/components/store/base/stack'
import { LogItem } from '@/components/store/intermediary/log-item'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { Input } from '@/components/store/base/input'
import { Activity, Search } from 'lucide-react'

const ACTION_VARIANT_MAP: Record<string, 'blue' | 'orange' | 'red'> = {
    UPDATE_USER_ROLE: 'blue',
    ACTIVATE_ONDEMAND: 'orange',
    DELETE_PRODUCT: 'red',
    DELETE_USER: 'red',
    GRANT_ELITE: 'orange',
    REVOKE_ELITE: 'red',
    GRANT_TRIAL: 'blue',
}

export function AdminLogsSection() {
    const [search, setSearch] = useState('')
    const { data: logs = [], isLoading } = useQuery({
        queryKey: QUERY_KEYS.admin.logs,
        queryFn: () => actions.getAdminLogs()
    })

    const filtered = logs.filter(log =>
        !search ||
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.admin?.full_name?.toLowerCase().includes(search.toLowerCase())
    )

    return (

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

    )
}
