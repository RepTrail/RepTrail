'use client'
import { Icon } from '@/components/store/base/icon'
import { Inline } from '@/components/store/base/layout'
import { Font } from '@/components/store/base/font'
import { Stack } from '@/components/store/base/stack'
import { STORE_TOKENS } from '@/components/store/constants/tokens';

import React from 'react'
import { History } from 'lucide-react'
import { GlassPanel } from '@/components/store/base/surface'
import { UnifiedAdherenceChart } from '@/components/store/advanced/unified-adherence-chart'
import { Box } from '@/components/store/base/box'

interface StudentPublicHistoryProps {
    history: any[]
}

export function StudentPublicHistory({ history }: StudentPublicHistoryProps) {
    return (
        <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
            <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Icon icon={History} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                        <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>{"Histórico de Treinos"}</Font>
                    </Inline>
                    <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>{"Relação completa de todos os treinos executados e registrados na plataforma."}</Font>
                </Stack>
            </Stack>
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
            <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER} minWidth={0}>
                <Box fullWidth minWidth={0} overflow="hidden">
                    <UnifiedAdherenceChart
                        history={history}
                        noCard={true}
                    />
                </Box>
            </GlassPanel>
          </Stack>
        </Stack>
    );
}
