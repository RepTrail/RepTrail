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
        <Surface variant="glass" padding={5} rounded="system">
            <Stack gap={5}>
                <Stack gap={1}>
                    <Font variant="sub-tiny" color="primary" weight="black" uppercase italic tracking="widest">
                        Saldo Disponível
                    </Font>
                    <Font variant="h3" color="white" weight="black">
                        R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Font>
                    <Font variant="description" color="zinc-500">
                        Valor disponível para transferência imediata
                    </Font>
                </Stack>

                {pendingAmount > 0 && (
                    <Box padding={2.5} rounded="system" bg="amber" bgOpacity={5}>
                        <Inline gap={2.5} align="center">
                            <Icon icon={Clock} size="xs" color="amber" />
                            <Font variant="sub-tiny" color="amber" weight="black">
                                R$ {pendingAmount.toFixed(2)} aguardando confirmação
                            </Font>
                        </Inline>
                    </Box>
                )}

                <RequestPayoutButton availableBalance={balance} />

                <Box display="flex" justify="center">
                    <Font variant="sub-tiny" color="zinc-600">
                        Mínimo de R$ 50,00 para sacar comissões
                    </Font>
                </Box>
            </Stack>
        </Surface>
    )
}
