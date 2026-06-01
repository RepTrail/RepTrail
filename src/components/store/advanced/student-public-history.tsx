'use client';
import { STORE_TOKENS } from '@/components/store/constants/tokens';

import React from 'react'
import { History } from 'lucide-react'
import { GlassPanel } from '@/components/store/base/surface'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { UnifiedAdherenceChart } from '@/components/store/advanced/unified-adherence-chart'
import { Box } from '@/components/store/base/box'

interface StudentPublicHistoryProps {
    history: any[]
}

export function StudentPublicHistory({ history }: StudentPublicHistoryProps) {
    return (
        <RegistrySection
            title="Histórico de Treinos"
            subtitle="Relação completa de todos os treinos executados e registrados na plataforma."
            icon={History}
        >
            <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER} minWidth={0}>
                <Box fullWidth minWidth={0} overflow="hidden">
                    <UnifiedAdherenceChart
                        history={history}
                        noCard={true}
                    />
                </Box>
            </GlassPanel>
        </RegistrySection>
    );
}
