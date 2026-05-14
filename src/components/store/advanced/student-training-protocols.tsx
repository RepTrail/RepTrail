'use client'

import React from 'react'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { Stack } from '@/components/store/base/stack'
import { ProtocolCard } from '@/components/store/intermediary/protocol-card'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Dumbbell, CheckCircle } from 'lucide-react'

export function StudentTrainingProtocols() {
    return (
        <RegistrySection
            title="SEÇÃO DE TREINO"
            subtitle="Protocolos de musculação e treinamento de força."
            icon={Dumbbell}
        >
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                <ProtocolCard
                    title="TREINO A"
                    subtitle="12 EXERCÍCIOS • FOCO DO DIA"
                    icon={Dumbbell}
                    status="not_started"
                />
                <ProtocolCard
                    title="TREINO B"
                    subtitle="10 EXERCÍCIOS • COMPLEMENTAR"
                    icon={Dumbbell}
                    status="in_progress"
                />
                <ProtocolCard
                    title="TREINO C"
                    subtitle="8 EXERCÍCIOS • RECUPERAÇÃO"
                    icon={CheckCircle}
                    status="completed"
                    logId="mock-log-id"
                    userId="mock-user-id"
                />
                <ProtocolCard
                    title="SEM TREINO CADASTRADO"
                    subtitle="ENTRE EM CONTATO COM SEU TREINADOR"
                    icon={Dumbbell}
                    status="empty"
                />
            </Stack>
        </RegistrySection>
    )
}
