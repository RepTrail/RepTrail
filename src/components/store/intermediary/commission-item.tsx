
'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Inline } from '@/components/store/base/layout'
import { Font } from '@/components/store/base/font'
import { Box } from '@/components/store/base/box'
import { Badge } from '@/components/store/base/badge'
import { IconBox } from '@/components/store/base/icon'
import { ActionableListCard } from './actionable-list-card'
import { DollarSign } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface CommissionItemProps {
    description: string
    amount: string
    date: string
    time: string
    status: string
    statusLabel: string
    statusColor: 'emerald' | 'amber' | 'red' | 'blue' | 'zinc'
}

export function CommissionItem({
    description,
    amount,
    date,
    time,
    statusLabel,
    statusColor
}: CommissionItemProps) {
    return (
        <ActionableListCard 
            badges={
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align={{ base: 'start', lg: 'end' }} fullWidth>
                    <Font {...STORE_TOKENS.TYPOGRAPHY.HEADING} color={STORE_TOKENS.COLORS.SUCCESS} variant="body-sm">
                        + {amount}
                    </Font>
                    <Badge
                        label={statusLabel.toUpperCase()}
                        color={statusColor}
                        variant="glass"
                        size="xs"
                    />
                </Stack>
            }
        >
            <Inline gap={STORE_TOKENS.SPACING.CONTAINER} align="center" fullWidth>
                <Box shrink={0}>
                    <IconBox
                        icon={DollarSign}
                        variant="emerald"
                        size="md"
                    />
                </Box>

                <Stack gap={0} flex1 overflow="hidden">
                    <Font {...STORE_TOKENS.TYPOGRAPHY.HEADING} variant="body-sm" color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>
                        {description}
                    </Font>
                    <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color={STORE_TOKENS.COLORS.TEXT.DIM}>
                        {date} • {time}
                    </Font>
                </Stack>
            </Inline>
        </ActionableListCard>
    )
}
