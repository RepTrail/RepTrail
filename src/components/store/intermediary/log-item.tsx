'use client'

import React from 'react'
import { Stack } from '../base/stack'
import { Box } from '../base/box'
import { Font } from '../base/font'
import { IconBox, Icon } from '../base/icon'
import { Zap, User, Info } from 'lucide-react'
import { Inline } from '../base/layout'
import { Badge } from '../base/badge'
import { ActionableListCard } from './actionable-list-card'

interface LogItemProps {
    action: string
    admin?: string
    target?: string
    details?: string | Record<string, unknown>
    date: string
    variant?: 'blue' | 'red' | 'amber' | 'emerald' | 'orange' | 'zinc'
}

export function LogItem({ 
    action, 
    admin, 
    target, 
    details, 
    date,
    variant = 'zinc'
}: LogItemProps) {
    const detailString = typeof details === 'object' ? JSON.stringify(details) : details

    return (
        <ActionableListCard
            isLogItem
            badges={
                <Inline gap={2.5} align="center" wrap>
                    {target && (
                        <Badge 
                            label={target} 
                            variant="glass" 
                            color="orange" 
                            rounded="full" 
                            size="xs"
                        />
                    )}
                    <Badge 
                        label={date} 
                        variant="glass" 
                        color="zinc"
                        rounded="full" 
                        size="xs"
                    />
                </Inline>
            }
            footer={detailString ? (
                <Inline gap={2.5} align="center" fullWidth>
                    <Icon icon={Info} size="xs" color="blue" />
                    <Box flex1 truncate>
                        <Font variant="sub-tiny" color="zinc-500" mono truncate>
                            {detailString}
                        </Font>
                    </Box>
                </Inline>
            ) : undefined}
        >
            <Inline gap={5} align="center">
                <IconBox icon={Zap} variant={variant as any} size="md" rounded="full" />
                
                <Stack gap={0}>
                    <Font weight="black" uppercase italic color="white" variant="body-sm" tracking="wider">
                        {action.replace(/_/g, ' ')}
                    </Font>
                    <Box opacity={40}>
                        <Inline gap={2.5} align="center">
                            <Icon icon={User} size="xs" color="zinc-500" />
                            <Font variant="sub-tiny" color="zinc-400">por {admin || 'Sistema'}</Font>
                        </Inline>
                    </Box>
                </Stack>
            </Inline>
        </ActionableListCard>
    )
}
