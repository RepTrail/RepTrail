'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { IconBox, Icon } from '@/components/store/base/icon'
import { Zap, User, Info } from 'lucide-react'
import { Inline } from '@/components/store/base/layout'
import { Badge } from '@/components/store/base/badge'
import { ActionableListCard } from './actionable-list-card'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

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
                <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center" wrap>
                    {target && (
                        <Badge 
                            label={target} 
                            variant="glass" 
                            color="orange" 
                            size="xs"
                        />
                    )}
                    <Badge 
                        label={date} 
                        variant="glass" 
                        color={STORE_TOKENS.COLORS.BACKGROUND}
                        size="xs"
                    />
                </Inline>
            }
            footer={detailString ? (
                <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center" fullWidth>
                    <Icon icon={Info} size="xs" color={STORE_TOKENS.COLORS.INFO} />
                    <Box flex1 truncate>
                        <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color={STORE_TOKENS.COLORS.TEXT.MUTED} mono truncate>
                            {detailString}
                        </Font>
                    </Box>
                </Inline>
            ) : undefined}
        >
            <Inline gap={STORE_TOKENS.SPACING.CONTAINER} align="center">
                <IconBox icon={Zap} variant={variant as any} size="md" rounded={STORE_TOKENS.RADIUS.FULL} />
                
                <Stack gap={0}>
                    <Font {...STORE_TOKENS.TYPOGRAPHY.HEADING} variant="body-sm" color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>
                        {action.replace(/_/g, ' ')}
                    </Font>
                    <Box opacity={STORE_TOKENS.OPACITY.MEDIUM}>
                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Icon icon={User} size="xs" color={STORE_TOKENS.COLORS.TEXT.MUTED} />
                            <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color={STORE_TOKENS.COLORS.TEXT.SECONDARY}>por {admin || 'Sistema'}</Font>
                        </Inline>
                    </Box>
                </Stack>
            </Inline>
        </ActionableListCard>
    );
}
