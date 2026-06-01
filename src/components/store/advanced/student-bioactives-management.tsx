'use client'

import React from 'react'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { ErgogenicsList } from '@/components/store/intermediary/ergogenics-list'
import { FlaskConical } from 'lucide-react'
import { useQuery, useQueryClient, useOptimisticMutation } from '@/lib/dal'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getStudentErgogenics, getTodayErgogenicLogs, toggleErgogenicLog } from '@/lib/dal/remote'
import { Box } from '@/components/store/base/box'

interface StudentBioactivesManagementProps {
    userId: string
}

/**
 * StudentBioactivesManagement (Smart): Manages ergogenic data and logs.
 * Now functional with toggle capabilities.
 */
export function StudentBioactivesManagement({ userId }: StudentBioactivesManagementProps) {
    const queryClient = useQueryClient()

    const { data: items, isLoading } = useQuery<any[]>({
        queryKey: QUERY_KEYS.ergogenics.all(userId),
        queryFn: async () => {
            const res = await getStudentErgogenics(userId)
            return Array.isArray(res) ? res : []
        },
        staleTime: 1000 * 60 * 5,
        refetchOnMount: false,
    })

    const { data: logs } = useQuery<any[]>({
        queryKey: QUERY_KEYS.ergogenics.logs(userId),
        queryFn: () => getTodayErgogenicLogs(userId),
        staleTime: 1000 * 60 * 5,
        refetchOnMount: false,
    })

    const toggleMutation = useOptimisticMutation({
        queryKey: QUERY_KEYS.ergogenics.logs(userId),
        actionName: 'toggle-ergogenic-log',
        entity: 'ergogenic_log' as any,
        entityId: 'none',
        updateFn: (oldData: any, variables: any) => {
            if (!Array.isArray(oldData)) return []
            const exists = oldData.some((l: any) => l.ergogenic_id === variables.id)
            if (exists) {
                return oldData.filter((l: any) => l.ergogenic_id !== variables.id)
            } else {
                return [...oldData, { id: crypto.randomUUID(), student_id: userId, ergogenic_id: variables.id, created_at: new Date().toISOString() }]
            }
        }
    })

    if (isLoading) return <RegistrySection title="BIOATIVOS DE HOJE" subtitle="Gestão diária de protocolos auxiliares." icon={FlaskConical}><Box /></RegistrySection>

    // Timezone logic for Brazil
    const today = (() => {
        try {
            const brazilTime = new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })
            return new Date(brazilTime).getDay()
        } catch {
            return new Date().getDay()
        }
    })()

    const todayItems = Array.isArray(items) ? items.filter((item: any) => {
        const days = Array.isArray(item.application_days) ? item.application_days : []
        return days.map((d: any) => Number(d)).includes(today)
    }) : []

    if (todayItems.length === 0) {
        return (
            <RegistrySection title="BIOATIVOS DE HOJE" subtitle="Gestão diária de protocolos auxiliares." icon={FlaskConical}>
                <ErgogenicsList items={[]} status="empty" />
            </RegistrySection>
        )
    }

    return (
        <RegistrySection
            title="BIOATIVOS DE HOJE"
            subtitle="Gestão diária de protocolos auxiliares."
            icon={FlaskConical}
        >
            <ErgogenicsList
                items={todayItems.map((item: any) => ({
                    id: item.id,
                    name: item.name.toUpperCase(),
                    dosage: `${(item.weekly_dosage / (item.application_days?.length || 1)).toFixed(2)} ${item.unit?.toUpperCase() || 'MG'}`,
                    isCompleted: !!logs?.some((l: any) => l.ergogenic_id === item.id)
                }))}
                status="active"
                onToggle={(id, currentStatus) => toggleMutation.mutate({ id, currentStatus })}
            />
        </RegistrySection>
    )
}
