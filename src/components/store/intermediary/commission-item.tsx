
'use client'

import React from 'react'
import { Stack } from '../base/stack'
import { Inline } from '../base/layout'
import { Font } from '../base/font'
import { Box } from '../base/box'
import { Badge } from '../base/badge'
import { IconBox } from '../base/icon'
import { ActionableListCard } from './actionable-list-card'
import { DollarSign } from 'lucide-react'

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
        <ActionableListCard isStrictHorizontal>
            <Inline gap={5} align="center" fullWidth>
                <Box shrink={0}>
                    <IconBox 
                        icon={DollarSign} 
                        variant="emerald" 
                        size="md"
                    />
                </Box>

                <Box flex1 display="flex" direction="row" align="center" justify="between" overflow="hidden">
                    <Stack gap={0} flex1 overflow="hidden">
                        <Font weight="black" uppercase italic color="white" variant="body-sm" tracking="wider" truncate>
                            {description}
                        </Font>
                        <Font variant="sub-tiny" color="zinc-600" truncate>
                            {date} • {time}
                        </Font>
                    </Stack>

                    <Box shrink={0}>
                        <Stack gap={1} align="end">
                            <Font weight="black" italic color="emerald" variant={{ base: 'body', md: 'h4' }} nowrap>
                                + {amount}
                            </Font>
                            <Badge 
                                label={statusLabel.toUpperCase()} 
                                color={statusColor} 
                                variant="glass" 
                                rounded="full"
                                size="xs"
                            />
                        </Stack>
                    </Box>
                </Box>
            </Inline>
        </ActionableListCard>
    )
}
