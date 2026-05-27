'use client'

import React, { useState } from 'react'
import {
    Dumbbell,
    Utensils,
    Activity as ActivityIcon,
    TrendingUp,
    Camera,
    Eye,
    Clock
} from 'lucide-react'
import { GlassPanel, CardHeader, CardContent } from '@/components/store/base/surface'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Inline } from '@/components/store/base/layout'
import { IconBox } from '@/components/store/base/icon'
import { Badge } from '@/components/store/base/badge'
import { ActionableListCard } from '@/components/store/intermediary/actionable-list-card'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { Button } from '@/components/store/base/button'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface ActivityItem {
    type: string
    name: string
    timestamp: string
    formattedDate: string
    relativeTime: string
}

interface StudentRecentActivitiesProps {
    activities: ActivityItem[]
}

const ICON_MAP: Record<string, any> = {
    workout: Dumbbell,
    meal: Utensils,
    cardio: ActivityIcon,
    weight: TrendingUp,
    photo: Camera,
}

const TYPE_LABEL: Record<string, string> = {
    workout: 'Treino',
    meal: 'Refeição',
    cardio: 'Cardio',
    weight: 'Peso',
    photo: 'Foto',
}

const TYPE_COLOR: Record<string, 'blue' | 'orange' | 'zinc' | 'amber' | 'emerald' | 'red'> = {
    workout: 'orange',
    meal: 'emerald',
    cardio: 'blue',
    weight: 'zinc',
    photo: 'zinc',
}

function ActivityRow({ item }: { item: ActivityItem }) {
    const icon = ICON_MAP[item.type] || Eye
    const color = TYPE_COLOR[item.type] || 'zinc'
    
    return (
        <ActionableListCard
            badges={
                <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                    <Badge
                        label={TYPE_LABEL[item.type] || item.type}
                        color={color}
                        variant="glass"
                        size="xs"
                    />
                    <Badge
                        label={item.relativeTime}
                        color="zinc"
                        variant="glass"
                        size="xs"
                        icon={Clock}
                    />
                </Inline>
            }
        >
            <Box display="flex" align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                <IconBox
                    icon={icon}
                    variant={color as any}
                    size="md"
                    rounded="system"
                />
                <Stack gap="none">
                    <Font
                        variant="body-sm"
                        weight="black"
                        uppercase
                        italic
                        {...{
                            color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                        }}>
                        {item.name}
                    </Font>
                    <Font
                        variant="sub-tiny"
                        weight="bold"
                        uppercase
                        tracking="wide"
                        {...{
                            color: STORE_TOKENS.COLORS.TEXT.MUTED,
                        }}>
                        {item.formattedDate}
                    </Font>
                </Stack>
            </Box>
        </ActionableListCard>
    );
}

export function StudentRecentActivities({ activities }: StudentRecentActivitiesProps) {
    const [expanded, setExpanded] = useState(false)

    const preview = activities.slice(0, 4)
    const extra = activities.slice(4)
    const hasMore = extra.length > 0

    return (
        <GlassPanel fullWidth padding="none" display="flex" direction="col">
            <CardHeader>
                <Inline justify="between" fullWidth>
                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <IconBox
                            icon={Clock}
                            variant="primary"
                            size="md"
                            rounded="system"
                        />
                        <Font variant="heading" weight="black" uppercase italic>
                            Atividades Recentes
                        </Font>
                    </Inline>
                    {hasMore && (
                        <Button
                            variant="outline-zinc"
                            size="xs"
                            onClick={() => setExpanded(v => !v)}
                        >
                            {expanded ? 'Recolher' : 'Ver mais'}
                        </Button>
                    )}
                </Inline>
            </CardHeader>
            <CardContent
                {...{
                    padding: "none",
                }}>
                <Box
                    fullWidth
                    display="flex"
                    direction="col"
                >
                    {activities.length === 0 ? (
                        <Box padding={STORE_TOKENS.PADDING.CONTAINER} fullWidth>
                            <EmptyState
                                icon={Eye}
                                title="Nenhuma Atividade"
                                description="Nenhuma atividade registrada por este aluno."
                            />
                        </Box>
                    ) : (
                        <Stack gap="element" padding={STORE_TOKENS.PADDING.CONTAINER} fullWidth>
                            {preview.map((item, i) => (
                                <ActivityRow
                                    key={`${item.type}-${item.timestamp}-${i}`}
                                    item={item}
                                />
                            ))}

                            {expanded && extra.map((item, i) => (
                                <ActivityRow
                                    key={`extra-${item.type}-${item.timestamp}-${i}`}
                                    item={item}
                                />
                            ))}
                        </Stack>
                    )}
                </Box>
            </CardContent>
        </GlassPanel>
    );
}
