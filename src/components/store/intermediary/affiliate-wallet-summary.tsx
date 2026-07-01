'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Button } from '@/components/store/base/button'
import { Inline } from '@/components/store/base/layout'
import { Icon } from '@/components/store/base/icon'
import { Surface } from '@/components/store/base/surface'
import { Box } from '@/components/store/base/box'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { ArrowUpRight } from 'lucide-react'

export function AffiliateWalletSummary() {
    return (
        <Surface variant="glass" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM}>
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Font
                        variant="sub-tiny"
                        weight="black"
                        uppercase
                        italic
                        tracking="widest"
                        {...{
                            color: STORE_TOKENS.COLORS.BRAND,
                        }}>Saldo Disponível</Font>
                    <Font
                        variant="h1"
                        weight="black"
                        {...{
                            color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                        }}>R$ 0,00</Font>
                    <Font
                        variant="description"
                        {...{
                            color: STORE_TOKENS.COLORS.TEXT.MUTED,
                        }}>Saldo disponível para saque</Font>
                </Stack>

                <Button
                    variant="primary"
                    fullWidth
                    rounded={STORE_TOKENS.RADIUS.FULL}
                    cursor="not-allowed"
                    text="Solicitar Saque"
                    iconLeft={ArrowUpRight} />

                <Box display="flex" justify="center">
                    <Font
                        variant="sub-tiny"
                        {...{
                            color: STORE_TOKENS.COLORS.TEXT.DIM,
                        }}>Mínimo de R$ 50,00 para solicitar saque</Font>
                </Box>
            </Stack>
        </Surface>
    );
}
