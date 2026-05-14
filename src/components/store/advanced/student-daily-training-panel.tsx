'use client'

import React from 'react'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { Stack } from '@/components/store/base/stack'
import { ProtocolCard } from '@/components/store/intermediary/protocol-card'
import { CardioTimerCard } from '@/components/store/intermediary/cardio-timer-card'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Dumbbell, Activity, CheckCircle } from 'lucide-react'

export function StudentDailyTrainingPanel() {
    return (
        <Stack gap={STORE_TOKENS.SPACING.SECTION}>
            {/* 1. Seção de Treino */}
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

            {/* 2. Seção de Cardio */}
            <RegistrySection
                title="SEÇÃO DE CARDIO"
                subtitle="Monitoramento de atividades aeróbicas e cronômetros."
                icon={Activity}
            >
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <CardioTimerCard
                        title="ESTEIRA OU BIKE"
                        duration="30 MIN"
                        intensity="MODERADA"
                        remainingTime="30:00"
                        estimatedBurn="0"
                        status="not_started"
                    />
                    <CardioTimerCard
                        title="CAMINHADA PÓS TREINO"
                        duration="20 MIN"
                        intensity="LEVE"
                        remainingTime="00:00"
                        estimatedBurn="150"
                        status="completed"
                    />
                    <CardioTimerCard
                        title="SEM CARDIO EXTRA"
                        duration="0 MIN"
                        intensity="NENHUMA"
                        remainingTime="00:00"
                        estimatedBurn="0"
                        status="empty"
                    />
                </Stack>
            </RegistrySection>
        </Stack>
    )
}
