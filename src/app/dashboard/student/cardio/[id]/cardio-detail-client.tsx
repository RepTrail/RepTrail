'use client'

import React from 'react'
import { notFound } from 'next/navigation'
import { useProfile, useCardioDetails } from '@/lib/dal'
import { CardioBuilderSmart } from "@/components/store/advanced/cardio-builder-smart"
import { RegistryMain } from "@/components/store/advanced/registry-main"
import { Box } from "@/components/store/base/box"
import { Icon } from '@/components/store/base/icon'
import { Loader2 } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface StudentCardioDetailClientProps {
    id: string
    userId: string
}

export function StudentCardioDetailClient({ id, userId }: StudentCardioDetailClientProps) {
    const { data: profile, isLoading: isProfileLoading } = useProfile(userId)
    const { data: cardio, isLoading: isCardioLoading } = useCardioDetails(id)

    const isLoading = isProfileLoading || isCardioLoading

    if (isLoading) {
        return (
            <RegistryMain
                title="DETALHES DO CARDIO"
                subtitle="Acompanhe e registre suas sessões de treinamento aeróbico."
                icon="Flame"
                contextLabel="Condicionamento & Saúde"
                showTabs={false}
                showHeader={false}
            >
                <Box display="flex" align="center" justify="center" padding={STORE_TOKENS.PADDING.CONTAINER} height="full">
                    <Icon icon={Loader2} size="md" color={STORE_TOKENS.COLORS.BRAND} animate="spin" />
                </Box>
            </RegistryMain>
        )
    }

    const isAutoTrainingActive = profile?.auto_training_status === 'active' || profile?.auto_training_status === 'trial'
    
    if (!isAutoTrainingActive || !cardio || cardio.trainer_id !== userId) {
        return notFound()
    }

    return (
        <RegistryMain
            title={cardio.name.toUpperCase()}
            subtitle={cardio.description || "Protocolo de Cardio"}
            icon="Flame"
            contextLabel="Condicionamento & Saúde"
            showTabs={false}
            showHeader={false}
        >
            <CardioBuilderSmart 
                cardio={cardio}
                backHref="/dashboard/student/cardio"
                contextLabel="Condicionamento & Saúde"
                icon="Flame"
                contextColor="orange"
            />
        </RegistryMain>
    )
}
