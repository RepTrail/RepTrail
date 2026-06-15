'use client'
import { Icon } from '@/components/store/base/icon'
import { Inline } from '@/components/store/base/layout'
import { Font } from '@/components/store/base/font'
import { Stack } from '@/components/store/base/stack'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import React from 'react'
import { ErgogenicsList } from '@/components/store/intermediary/ergogenics-list'
import { FlaskConical } from 'lucide-react'
import { useQuery, useQueryClient, useOptimisticMutation } from '@/lib/dal'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getStudentErgogenics, getTodayErgogenicLogs } from '@/lib/dal/remote'
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
            const exists = oldData.some((l: any) => l.ergogenic_id === variables.ergogenic_id)
            if (exists) {
                return oldData.filter((l: any) => l.ergogenic_id !== variables.ergogenic_id)
            } 
                return [...oldData, { id: crypto.randomUUID(), student_id: userId, ergogenic_id: variables.ergogenic_id, created_at: new Date().toISOString() }]
            
        }
    })

    if (isLoading) return <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
            <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Icon icon={FlaskConical} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                        <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>{"BIOATIVOS DE HOJE"}</Font>
                    </Inline>
                    <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>{"Gestão diária de protocolos auxiliares."}</Font>
                </Stack>
            </Stack>
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth><Box />  </Stack>
        </Stack>

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
            <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
            <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Icon icon={FlaskConical} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                        <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>{"BIOATIVOS DE HOJE"}</Font>
                    </Inline>
                    <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>{"Gestão diária de protocolos auxiliares."}</Font>
                </Stack>
            </Stack>
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                <ErgogenicsList items={[]} status="empty" />
              </Stack>
        </Stack>
        )
    }

    return (
        <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
            <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Icon icon={FlaskConical} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                        <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>{"BIOATIVOS DE HOJE"}</Font>
                    </Inline>
                    <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>{"Gestão diária de protocolos auxiliares."}</Font>
                </Stack>
            </Stack>
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
            <ErgogenicsList
                items={todayItems.map((item: any) => ({
                    id: item.id,
                    name: item.name.toUpperCase(),
                    dosage: `${(item.weekly_dosage / (item.application_days?.length || 1)).toFixed(2)} ${item.unit?.toUpperCase() || 'MG'}`,
                    isCompleted: !!logs?.some((l: any) => l.ergogenic_id === item.id)
                }))}
                status="active"
                onToggle={(id, currentStatus) => toggleMutation.mutate({ 
                    student_id: userId, 
                    ergogenic_id: id, 
                    status: !currentStatus 
                })}
            />
          </Stack>
        </Stack>
    )
}
