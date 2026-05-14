'use client'

import React from 'react'
import { Surface } from '@/components/store/base/surface'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Inline } from '@/components/store/base/layout'
import { Clock } from 'lucide-react'
import { RequestPayoutButton } from '@/components/store/advanced/request-payout-button'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface AffiliateWalletSectionProps {
    balance: number
    pendingAmount?: number
}

/**
 * AffiliateWalletSection: A standardized wallet card for the affiliate dashboard.
 * Following strict "Zero-Manual-Styling" governance.
 */
export function AffiliateWalletSection({ balance, pendingAmount = 0 }: AffiliateWalletSectionProps) {
    return (
        <Surface variant="glass" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM}>
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.BRAND} weight="black" uppercase italic tracking="widest">
                        Saldo Disponível
                    </Font>
                    <Font variant="h3" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} weight="black">
                        R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Font>
                    <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>
                        Valor disponível para transferência imediata
                    </Font>
                </Stack>

                {pendingAmount > 0 && (
                    <Box padding={STORE_TOKENS.PADDING.ELEMENT} rounded={STORE_TOKENS.RADIUS.SYSTEM} bg={STORE_TOKENS.COLORS.WARNING} bgOpacity={STORE_TOKENS.OPACITY.LOW}>
                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Icon icon={Clock} size="xs" color={STORE_TOKENS.COLORS.WARNING} />
                            <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.WARNING} weight="black">
                                R$ {pendingAmount.toFixed(2)} aguardando confirmação
                            </Font>
                        </Inline>
                    </Box>
                )}

                <RequestPayoutButton availableBalance={balance} />

                <Box display="flex" justify="center">
                    <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.DIM}>
                        Mínimo de R$ 50,00 para sacar comissões
                    </Font>
                </Box>
            </Stack>
        </Surface>
    )
}
