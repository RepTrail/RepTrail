'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Button } from '@/components/store/base/button'
import { Inline } from '@/components/store/base/layout'
import { Icon } from '@/components/store/base/icon'
import { Surface } from '@/components/store/base/surface'
import { Box } from '@/components/store/base/box'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Wallet, ArrowUpRight } from 'lucide-react'

export function AffiliateWalletPanel() {
    return (
        <RegistrySection
            title="Sua Carteira"
            icon={Wallet}
            subtitle="Gestão de saldo e solicitações de saque de comissões."
        >
            <Surface variant="glass" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM}>
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.BRAND} weight="black" uppercase italic tracking="widest">Saldo Disponível</Font>
                        <Font variant="h1" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} weight="black">R$ 0,00</Font>
                        <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>Saldo disponível para saque</Font>
                    </Stack>

                    <Button variant="primary" fullWidth rounded={STORE_TOKENS.RADIUS.FULL} opacity={STORE_TOKENS.OPACITY.MODAL} grayscale cursor="not-allowed">
                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Icon icon={ArrowUpRight} size="sm" />
                            <Font variant="label-caps">Solicitar Saque</Font>
                        </Inline>
                    </Button>

                    <Box display="flex" justify="center">
                        <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.DIM}>Mínimo de R$ 50,00 para solicitar saque</Font>
                    </Box>
                </Stack>
            </Surface>
        </RegistrySection>
    )
}
