'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { BaseAvatar } from '@/components/store/base/avatar'
import { Badge } from '@/components/store/base/badge'
import { Button } from '@/components/store/base/button'
import { Box } from '@/components/store/base/box'
import { Trash2 } from 'lucide-react'
import { ActionableListCard } from './actionable-list-card'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

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
                <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT} align="center" wrap="wrap">
                    <Badge label={registrationDate} variant="glass" size="xs" />
                    <Badge
                        label={`${referrals.total} / ${referrals.active} ATIVOS`}
                        variant="glass"
                        color={STORE_TOKENS.COLORS.SUCCESS}
                        size="xs"
                    />
                    <Badge label={revenue} variant="glass" color={STORE_TOKENS.COLORS.BACKGROUND} size="xs" />
                    <Badge label={`${commission} ESTIMADO`} variant="glass" color={STORE_TOKENS.COLORS.SUCCESS} size="xs" />
                    <Badge label={`${rate}%`} variant="glass" color={STORE_TOKENS.COLORS.BRAND} size="xs" />
                </Stack>
            }
            actions={onDelete ? (
                <Button
                    variant="outline-red"
                    size="sm"
                    rounded={STORE_TOKENS.RADIUS.FULL}
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
            <Stack direction="row" gap={STORE_TOKENS.SPACING.CONTAINER} align="center">
                <BaseAvatar
                    src={avatarUrl || undefined}
                    initials={name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    variant="zinc"
                    size="md"
                />
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT} minWidth={0}>
                    <Font {...STORE_TOKENS.TYPOGRAPHY.HEADING} variant={{ base: 'body-sm', md: 'body' }} color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>
                        {name}
                    </Font>
                    <Box fullWidth minWidth={0} overflow="hidden" display="flex" align="center">
                        <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color={STORE_TOKENS.COLORS.TEXT.DIM} lowercase>
                            {email}
                        </Font>
                    </Box>
                </Stack>
            </Stack>
        </ActionableListCard>
    )
}
