'use client'

import { useEffect } from 'react'
import { actions, useQuery, useQueryClient, subscribeToActivityFeed } from '@/lib/dal'
import type { ActivityItem } from '@/lib/dal/remote'
import { QUERY_KEYS } from '@/lib/query-keys'
import {
    Clock,
    Activity as ActivityIcon
} from 'lucide-react'

// Design System imports
import { GlassPanel, CardHeader, CardContent } from '@/components/store/base/surface'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Inline } from '@/components/store/base/layout'
import { IconBox } from '@/components/store/base/icon'
import { Badge } from '@/components/store/base/badge'
import { BaseAvatar } from '@/components/store/base/avatar'
import { ActionableListCard } from '@/components/store/intermediary/actionable-list-card'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface ActivityFeedProps {
    userId: string
    initialData?: ActivityItem[]
}

export function ActivityFeed({ userId, initialData }: ActivityFeedProps) {
    const queryClient = useQueryClient()

    const { data: activities = [] } = useQuery({
        queryKey: QUERY_KEYS.trainer.activity(userId),
        queryFn: () => actions.getTrainerActivityFeed(userId),
        initialData
    })

    // ─── Realtime Logic ──────────────────────────────────────────────────────
    useEffect(() => {
        return subscribeToActivityFeed(userId, () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trainer.activity(userId) })
        })
    }, [queryClient, userId])

    // Render all activities and let the custom scrollbar handle the overflow limit dynamically

    const getTypeStyles = (type: string, subType?: string) => {
        switch (type) {
            case 'workout':
                if (subType === 'started') return { color: 'blue', label: 'Iniciou' }
                if (subType === 'success') return { color: 'orange', label: 'Sucesso' }
                if (subType === 'partial') return { color: 'orange', label: 'Parcial' }
                if (subType === 'fail') return { color: 'red', label: 'Falhou' }
                if (subType === 'note') return { color: 'zinc', label: 'Nota' }
                return { color: 'orange', label: 'Treinou' }
            case 'meal':
                return { color: 'orange', label: 'Dieta' }
            case 'cardio':
                if (subType === 'started') return { color: 'blue', label: 'Iniciou' }
                return { color: 'orange', label: 'Cardio' }
            case 'weight':
                return { color: 'zinc', label: 'Peso' }
            case 'photo':
                return { color: 'zinc', label: 'Foto' }
            case 'ergogenic':
                return { color: 'orange', label: 'Ergo' }
            case 'milestone':
                return { color: 'amber', label: 'Meta 100%' }
            case 'alert':
                return { color: 'orange', label: 'Modo Ilha' }
            default:
                return { color: 'zinc', label: 'Atividade' }
        }
    }

    const formatRelativeTime = (timestamp: string) => {
        const date = new Date(timestamp)
        const diff = Date.now() - date.getTime()
        const mins = Math.floor(diff / 60000)
        const hours = Math.floor(mins / 60)
        const days = Math.floor(hours / 24)

        if (mins < 1) return 'Agora mesmo'
        if (mins < 60) return `Há ${mins} min`
        if (hours < 24) return `Há ${hours} hr`
        return `Há ${days} d`
    }

    return (
        <GlassPanel fullWidth padding={STORE_TOKENS.PADDING.NONE} display="flex" direction="col" flex1>
            <CardHeader>
                <Inline justify="between" fullWidth>
                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <IconBox
                            icon={ActivityIcon}
                            variant="primary"
                            size="md"
                            rounded={STORE_TOKENS.RADIUS.SYSTEM}
                        />
                        <Font variant="heading" weight="black" uppercase italic>
                            Atividade Recente
                        </Font>
                    </Inline>
                </Inline>
            </CardHeader>
            <CardContent
                flex1
                display="flex"
                direction="col"
                {...{
                    padding: "none",
                    minHeight: 0,
                }}>
                <Box
                    fullWidth
                    display="flex"
                    direction="col"
                >
                    {activities.length > 0 ? (
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT} padding={STORE_TOKENS.PADDING.CONTAINER} fullWidth>
                            {activities.map((activity) => {
                                const { color, label } = getTypeStyles(activity.type, activity.subType)
                                const initials = activity.studentName ? activity.studentName.substring(0, 2).toUpperCase() : 'AL'
                                return (
                                    <ActionableListCard
                                        key={activity.id}
                                        badges={
                                            <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                                <Badge
                                                    label={label}
                                                    color={color as any}
                                                    variant="glass"
                                                    size="xs"
                                                />
                                                <Badge
                                                    label={formatRelativeTime(activity.timestamp)}
                                                    color={STORE_TOKENS.COLORS.BACKGROUND}
                                                    variant="glass"
                                                    size="xs"
                                                    icon={Clock}
                                                />
                                            </Inline>
                                        }
                                    >
                                        {/* Mobile Layout */}
                                        <Box display={{ base: 'flex', lg: 'none' }} direction="col" gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                                            <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                                <BaseAvatar
                                                    initials={initials}
                                                    src={activity.studentAvatar || undefined}
                                                    size="sm"
                                                    variant="zinc"
                                                />
                                                <Font
                                                    variant="body-sm"
                                                    weight="black"
                                                    uppercase
                                                    italic
                                                    {...{
                                                        color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                                                    }}>
                                                    {activity.studentName}
                                                </Font>
                                            </Inline>
                                            <Font
                                                variant="sub-tiny"
                                                weight="bold"
                                                uppercase
                                                tracking="wide"
                                                {...{
                                                    color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                                }}>
                                                {activity.contentName}
                                            </Font>
                                        </Box>
                                        {/* Desktop Layout */}
                                        <Box display={{ base: 'none', lg: 'flex' }} align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                                            <BaseAvatar
                                                initials={initials}
                                                src={activity.studentAvatar || undefined}
                                                size="sm"
                                                variant="zinc"
                                            />
                                            <Stack gap={STORE_TOKENS.SPACING.NONE}>
                                                <Font
                                                    variant="body-sm"
                                                    weight="black"
                                                    uppercase
                                                    italic
                                                    {...{
                                                        color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                                                    }}>
                                                    {activity.studentName}
                                                </Font>
                                                <Font
                                                    variant="sub-tiny"
                                                    weight="bold"
                                                    uppercase
                                                    tracking="wide"
                                                    {...{
                                                        color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                                    }}>
                                                    {activity.contentName}
                                                </Font>
                                            </Stack>
                                        </Box>
                                    </ActionableListCard>
                                );
                            })}
                        </Stack>
                    ) : (
                        <Box padding={STORE_TOKENS.PADDING.CONTAINER} fullWidth>
                            <EmptyState
                                icon={Clock}
                                title="Nenhuma Atividade"
                                description="Nenhuma atividade registrada hoje por seus alunos."
                            />
                        </Box>
                    )}
                </Box>
            </CardContent>
        </GlassPanel>
    );
}
