'use client'

import React from 'react'
import { Stack } from '../base/stack'
import { Inline } from '../base/layout'
import { Font } from '../base/font'
import { Box } from '../base/box'
import { Badge } from '../base/badge'
import { Icon, IconBox } from '../base/icon'
import { ActionableListCard } from './actionable-list-card'
import { 
    CheckCircle2, 
    Clock, 
    AlertCircle, 
    QrCode
} from 'lucide-react'

interface WithdrawalItemProps {
    id: string
    amount: string
    date: string
    status: 'pending' | 'completed' | 'rejected'
    method: string
    recipient: string
}

export function WithdrawalItem({
    id,
    amount,
    date,
    status,
    method,
    recipient
}: WithdrawalItemProps) {
    
    const statusConfig = {
        pending: {
            icon: Clock,
            label: 'Processando',
            color: 'amber' as const,
        },
        completed: {
            icon: CheckCircle2,
            label: 'Pago',
            color: 'emerald' as const,
        },
        rejected: {
            icon: AlertCircle,
            label: 'Recusado',
            color: 'red' as const,
        }
    }

    const config = statusConfig[status]

    return (
        <ActionableListCard isStrictHorizontal>
            <Inline gap={5} align="center" fullWidth>
                {/* Transaction Icon */}
                <Box shrink={0}>
                    <IconBox 
                        icon={config.icon} 
                        variant={config.color} 
                        size="md"
                    />
                </Box>

                {/* Details Area - Strictly Horizontal even on mobile */}
                <Box flex1 display="flex" direction="row" align="center" justify="between" overflow="hidden">
                    <Stack gap={0} flex1 overflow="hidden">
                        <Font weight="black" uppercase italic color="white" variant="body-sm" tracking="wider" truncate>
                            Saque #{id.slice(-6).toUpperCase()}
                        </Font>
                        <Box display={{ base: 'none', sm: 'block' }}>
                            <Font variant="sub-tiny" color="zinc-600" truncate>
                                {date} • {recipient}
                            </Font>
                        </Box>
                        <Box display={{ base: 'block', sm: 'none' }}>
                            <Font variant="sub-tiny" color="zinc-600">
                                {date}
                            </Font>
                        </Box>
                    </Stack>

                    <Box shrink={0}>
                        <Inline gap={{ base: 2.5, md: 5 }} align="center">
                            <Stack gap={1} align="end">
                                <Font weight="black" italic color="white" variant={{ base: 'body', md: 'h4' }} nowrap>
                                    {amount}
                                </Font>
                            <Inline gap={1} align="center">
                                <Icon icon={QrCode} size="xs" color="zinc-600" />
                                <Font variant="sub-tiny" color="zinc-600" uppercase weight="black">{method}</Font>
                            </Inline>
                        </Stack>

                            <Box display={{ base: 'none', lg: 'flex' }}>
                                <Badge 
                                    label={config.label} 
                                    color={config.color} 
                                    variant="glass" 
                                    rounded="full"
                                    size="xs"
                                />
                            </Box>
                        </Inline>
                    </Box>
                </Box>

                {/* Hover Indicator */}
                <Box 
                    position="absolute" 
                    right={-5} 
                    top={-5} 
                    bottom={-5} 
                    width="px" 
                    bg="emerald" 
                    opacity={0} 
                    groupHoverOpacity={100} 
                    transition 
                />
            </Inline>
        </ActionableListCard>
    )
}
