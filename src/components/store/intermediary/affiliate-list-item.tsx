'use client'

import React from 'react'
import { Stack } from '../base/stack'
import { Inline } from '../base/layout'
import { Font } from '../base/font'
import { BaseAvatar } from '../base/avatar'
import { Badge } from '../base/badge'
import { Button } from '../base/button'
import { Box } from '../base/box'
import { Trash2 } from 'lucide-react'
import { ActionableListCard } from './actionable-list-card'

interface AffiliateListItemProps {
    name: string
    email: string
    affiliateId: string
    registrationDate: string
    referrals: {
        total: number
        active: number
    }
    revenue: string
    commission: string
    rate: number
    avatarUrl?: string | null
    onDelete?: () => void
}

export function AffiliateListItem({
    name,
    email,
    affiliateId,
    registrationDate,
    referrals,
    revenue,
    commission,
    rate,
    avatarUrl,
    onDelete
}: AffiliateListItemProps) {
    return (
        <ActionableListCard
            badges={
                <Inline gap={2.5} align="center" wrap>
                    <Badge label={registrationDate} variant="glass" rounded="full" size="xs" />
                    <Badge
                        label={`${referrals.total} / ${referrals.active} ATIVOS`}
                        variant="glass"
                        color="emerald"
                        rounded="full"
                        size="xs"
                    />
                    <Badge label={revenue} variant="glass" color="zinc" rounded="full" size="xs" />
                    <Badge label={`${commission} ESTIMADO`} variant="glass" color="emerald" rounded="full" size="xs" />
                    <Badge label={`${rate}%`} variant="glass" color="blue" rounded="full" size="xs" />
                </Inline>
            }
            actions={onDelete ? (
                <Button
                    variant="outline-red"
                    size="sm"
                    rounded="full"
                    isIconOnly
                    onClick={onDelete}
                    hoverScale={110}
                    activeScale={95}
                    transition
                >
                    <Trash2 size={16} />
                </Button>
            ) : undefined}
        >
            <Inline gap={5} align="center">
                <BaseAvatar
                    src={avatarUrl || undefined}
                    initials={name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    variant="zinc"
                    size="md"
                />
                <Stack gap={1} minWidth={0}>
                    <Font weight="black" uppercase italic color="white" variant={{ base: 'body-sm', md: 'body' }} tracking="wider" truncate display="block">{name}</Font>
                    <Box fullWidth minWidth={0} overflow="hidden">
                        <Font variant="sub-tiny" color="zinc-600" lowercase truncate display="block">{email}</Font>
                    </Box>
                    <Box display="flex">
                        <Badge label={affiliateId} variant="glass" size="xs" color="zinc" rounded="system" />
                    </Box>
                </Stack>
            </Inline>
        </ActionableListCard>
    )
}
