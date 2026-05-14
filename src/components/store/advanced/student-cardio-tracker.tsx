'use client'

import React from 'react'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { Stack } from '@/components/store/base/stack'
import { CardioTimerCard } from '@/components/store/intermediary/cardio-timer-card'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Activity } from 'lucide-react'

export function StudentCardioTracker() {
    return (
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
    )
}
