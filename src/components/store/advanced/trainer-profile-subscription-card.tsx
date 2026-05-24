'use client'

import React from 'react'
import Link from 'next/link'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Surface } from '@/components/store/base/surface'
import { Icon } from '@/components/store/base/icon'
import { Button } from '@/components/store/base/button'
import { Inline } from '@/components/store/base/layout'
import { Badge } from '@/components/store/base/badge'
import { CreditCard, Zap } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { CancelSubscriptionButton } from '@/components/store/advanced/cancel-subscription-button'

interface TrainerProfileSubscriptionCardProps {
    hasActiveSubscription?: boolean
}

export function TrainerProfileSubscriptionCard({ hasActiveSubscription = false }: TrainerProfileSubscriptionCardProps) {
    return (
        <Surface variant="glass" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="none">
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Icon icon={CreditCard} size="sm" color="primary" />
                    <Font variant="auxiliary" color="primary" weight="black" uppercase tracking="widest">
                        Assinatura & Faturamento
                    </Font>
                </Stack>

                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Stack direction="row" align="end" justify="between" gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.DIM} weight="black" uppercase tracking="widest">
                                Status Atual
                            </Font>
                            <Font
                                variant="heading"
                                color={hasActiveSubscription ? 'emerald' : STORE_TOKENS.COLORS.TEXT.MUTED}
                                weight="black"
                                uppercase
                                italic
                            >
                                {hasActiveSubscription ? 'Plano Ativo' : 'Plano Inativo'}
                            </Font>
                        </Stack>
                        {hasActiveSubscription && (
                            <Badge label="Válido" variant="outline" color="emerald" size="xs" />
                        )}
                    </Stack>

                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Box
                                width={6}
                                height={6}
                                rounded="full"
                                bg={hasActiveSubscription ? 'primary' : 'zinc'}
                                bgOpacity={hasActiveSubscription ? 100 : 40}
                            />
                            <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.SECONDARY} weight="bold" uppercase>
                                Ciclo On Demand Mensal
                            </Font>
                        </Inline>
                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Box width={6} height={6} rounded="full" bg="zinc" bgOpacity={40} />
                            <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="bold" uppercase>
                                Pagamento Seguro via Asaas
                            </Font>
                        </Inline>
                    </Stack>
                </Stack>

                {hasActiveSubscription ? (
                    <CancelSubscriptionButton />
                ) : (
                    <Button variant="white" fullWidth size="lg" asChild shine>
                        <Link href="/dashboard/trainer/plans">
                            <Stack direction="row" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Font variant="body-sm" weight="black" uppercase italic color={STORE_TOKENS.COLORS.BLACK}>
                                    Explorar Planos
                                </Font>
                                <Icon icon={Zap} size="xs" color={STORE_TOKENS.COLORS.BLACK} />
                            </Stack>
                        </Link>
                    </Button>
                )}

                <Stack align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Font variant="tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="bold" uppercase tracking="widest">
                        Faturamento por
                    </Font>
                    <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} weight="black" uppercase italic>
                        Asaas
                    </Font>
                </Stack>
            </Stack>
        </Surface>
    )
}
