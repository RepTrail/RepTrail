'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Inline } from '@/components/store/base/layout'
import { Font } from '@/components/store/base/font'
import { Box } from '@/components/store/base/box'
import { Badge } from '@/components/store/base/badge'
import { Icon, IconBox } from '@/components/store/base/icon'
import { ActionableListCard } from './actionable-list-card'
import {
    CheckCircle2,
    Clock,
    AlertCircle,
    QrCode
} from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

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
        <ActionableListCard 
            badges={
                <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center" fullWidth>
                    <Font
                        {...STORE_TOKENS.TYPOGRAPHY.HEADING}
                        variant="body-sm"
                        {...{
                            color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                        }}>
                        {amount}
                    </Font>
                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Icon icon={QrCode} size="xs" color={STORE_TOKENS.COLORS.TEXT.DIM} />
                        <Font
                            {...STORE_TOKENS.TYPOGRAPHY.LABEL}
                            {...{
                                color: STORE_TOKENS.COLORS.TEXT.DIM,
                            }}>{method}</Font>
                    </Inline>
                    <Badge
                        label={config.label}
                        color={config.color}
                        variant="glass"
                        size="xs"
                    />
                </Inline>
            }
        >
            <Inline gap={STORE_TOKENS.SPACING.CONTAINER} align="center" fullWidth>
                {/* Transaction Icon */}
                <Box shrink={0}>
                    <IconBox
                        icon={config.icon}
                        variant={config.color}
                        size="md"
                    />
                </Box>

                {/* Details Area */}
                <Stack gap={STORE_TOKENS.SPACING.NONE} flex1 overflow="hidden">
                    <Font
                        {...STORE_TOKENS.TYPOGRAPHY.HEADING}
                        variant="body-sm"
                        {...{
                            color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                        }}>
                        Saque #{id.slice(-6).toUpperCase()}
                    </Font>
                    <Box display={{ base: 'none', sm: 'block' }}>
                        <Font
                            {...STORE_TOKENS.TYPOGRAPHY.LABEL}
                            {...{
                                color: STORE_TOKENS.COLORS.TEXT.DIM,
                            }}>
                            {date} • {recipient}
                        </Font>
                    </Box>
                    <Box display={{ base: 'block', sm: 'none' }}>
                        <Font
                            {...STORE_TOKENS.TYPOGRAPHY.LABEL}
                            {...{
                                color: STORE_TOKENS.COLORS.TEXT.DIM,
                            }}>
                            {date}
                        </Font>
                    </Box>
                </Stack>
            </Inline>
        </ActionableListCard>
    );
}
