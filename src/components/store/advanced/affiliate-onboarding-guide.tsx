'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { GlassPanel } from '@/components/store/base/surface'
import { Link as LinkIcon, Users, Award } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

/**
 * AffiliateOnboardingGuide: Educational panel for affiliates.
 * - Encapsulates the visual steps explaining the affiliate program.
 * - Responsibility: User education and onboarding domain.
 */
export function AffiliateOnboardingGuide() {
    return (
        <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="subtle">
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack direction="row" gap={STORE_TOKENS.SPACING.CONTAINER} align="center">
                    <GlassPanel padding={STORE_TOKENS.PADDING.ELEMENT} rounded={STORE_TOKENS.RADIUS.SYSTEM}>
                        <Icon icon={LinkIcon} color={STORE_TOKENS.COLORS.BRAND} size="sm" />
                    </GlassPanel>
                    <Stack gap="none">
                        <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>Divulgue seu link</Font>
                        <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED}>Compartilhe em suas redes sociais ou site.</Font>
                    </Stack>
                </Stack>
                <Stack direction="row" gap={STORE_TOKENS.SPACING.CONTAINER} align="center">
                    <GlassPanel padding={STORE_TOKENS.PADDING.ELEMENT} rounded={STORE_TOKENS.RADIUS.SYSTEM}>
                        <Icon icon={Users} color={STORE_TOKENS.COLORS.INFO} size="sm" />
                    </GlassPanel>
                    <Stack gap="none">
                        <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>Atraia Personais</Font>
                        <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED}>Convide profissionais para a plataforma.</Font>
                    </Stack>
                </Stack>
                <Stack direction="row" gap={STORE_TOKENS.SPACING.CONTAINER} align="center">
                    <GlassPanel padding={STORE_TOKENS.PADDING.ELEMENT} rounded={STORE_TOKENS.RADIUS.SYSTEM}>
                        <Icon icon={Award} color={STORE_TOKENS.COLORS.SUCCESS} size="sm" />
                    </GlassPanel>
                    <Stack gap="none">
                        <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>Ganhe Comissões</Font>
                        <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED}>Receba 10% sobre cada assinatura ativa.</Font>
                    </Stack>
                </Stack>
            </Stack>
        </GlassPanel>
    )
}
