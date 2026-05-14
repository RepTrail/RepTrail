'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Surface } from '@/components/store/base/surface'
import { Icon } from '@/components/store/base/icon'
import { Button } from '@/components/store/base/button'
import { Crown, Zap, AlertCircle, XCircle } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface StudentSubscriptionStatusProps {
    status: 'active' | 'trial_available' | 'expired'
    onActivateTrial: () => void
    onCancelSubscription: () => void
    onRenewSubscription: () => void
}

/**
 * StudentSubscriptionStatus: Advanced component managing the visual and interactive states of student subscriptions.
 * Extracted from StudentProfileSectionContent.
 * Preserves the exact sequence and styling of the three status variants.
 */
export function StudentSubscriptionStatus({ status, onActivateTrial, onCancelSubscription, onRenewSubscription }: StudentSubscriptionStatusProps) {
    return (
        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
            {status === 'active' && (
                <Surface variant="tonal-emerald" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="none">
                    <Stack align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Stack align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Icon icon={Crown} size="xs" color="emerald" />
                                <Font variant="sub-tiny" color="emerald" weight="black" uppercase tracking="widest">
                                    STATUS AUTO-TREINO
                                </Font>
                            </Stack>
                            <Font variant="h4" color="emerald" weight="black" uppercase italic>
                                ASSINANTE ATIVO
                            </Font>
                            <Font variant="sub-tiny" color="emerald" opacity={60} weight="bold" uppercase tracking="tight" align="center">
                                Você tem acesso total a todas as ferramentas de performance.
                            </Font>
                        </Stack>
                        <Button variant="outline-red" fullWidth size="sm" onClick={onCancelSubscription}>
                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Icon icon={XCircle} size="xs" />
                                <Font variant="body-sm" weight="black" uppercase italic>CANCELAR ASSINATURA</Font>
                            </Stack>
                        </Button>
                    </Stack>
                </Surface>
            )}

            {status === 'trial_available' && (
                <Surface variant="tonal-amber" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="none">
                    <Stack align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Stack align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Icon icon={Zap} size="xs" color="amber" />
                                <Font variant="sub-tiny" color="amber" weight="black" uppercase tracking="widest">
                                    STATUS AUTO-TREINO
                                </Font>
                            </Stack>
                            <Font variant="h4" color="amber" weight="black" uppercase italic>
                                TESTE GRÁTIS DISPONÍVEL
                            </Font>
                            <Font variant="sub-tiny" color="amber" opacity={60} weight="bold" uppercase tracking="tight" align="center">
                                Comece hoje mesmo sua jornada de alta performance sem custos.
                            </Font>
                        </Stack>
                        <Button variant="outline-amber" fullWidth size="sm" onClick={onActivateTrial}>
                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Icon icon={Zap} size="xs" />
                                <Font variant="body-sm" weight="black" uppercase italic>ATIVAR 7 DIAS GRÁTIS</Font>
                            </Stack>
                        </Button>
                    </Stack>
                </Surface>
            )}

            {status === 'expired' && (
                <Surface variant="tonal-red" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="none">
                    <Stack align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Stack align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Icon icon={AlertCircle} size="xs" color="red" />
                                <Font variant="sub-tiny" color="red" weight="black" uppercase tracking="widest">
                                    STATUS AUTO-TREINO
                                </Font>
                            </Stack>
                            <Font variant="h4" color="red" weight="black" uppercase italic>
                                TESTE GRÁTIS EXPIRADO
                            </Font>
                            <Font variant="sub-tiny" color="red" opacity={60} weight="bold" uppercase tracking="tight" align="center">
                                Seu período de teste acabou. Assine agora para não perder sua evolução.
                            </Font>
                        </Stack>
                        <Button variant="outline-emerald" fullWidth size="sm" onClick={onRenewSubscription}>
                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Icon icon={Crown} size="xs" />
                                <Font variant="body-sm" weight="black" uppercase italic>ASSINAR AGORA</Font>
                            </Stack>
                        </Button>
                    </Stack>
                </Surface>
            )}
        </Stack>
    )
}
