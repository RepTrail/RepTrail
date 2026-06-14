'use client'

import React from 'react'
import { notFound } from 'next/navigation'
import { useProfile, useDietDetails } from '@/lib/dal'
import { DietBuilderSmart } from "@/components/store/advanced/diet-builder-smart"
import { RegistryMain } from "@/components/store/advanced/registry-main"
import { Box } from "@/components/store/base/box"
import { Icon } from '@/components/store/base/icon'
import { Loader2 } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface StudentDietDetailClientProps {
    id: string
    userId: string
}

export function StudentDietDetailClient({ id, userId }: StudentDietDetailClientProps) {
    const { data: profile, isLoading: isProfileLoading } = useProfile(userId)
    const { data: diet, isLoading: isDietLoading } = useDietDetails(id)

    const isLoading = isProfileLoading || isDietLoading

    if (isLoading) {
        return (
            <RegistryMain
                title="DETALHES DA DIETA"
                subtitle="Veja o planejamento alimentar enviado pelo seu treinador."
                icon="Utensils"
                contextLabel="Dieta & Nutrição"
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
    
    if (!isAutoTrainingActive || !diet) {
        return notFound()
    }

    return (
        <RegistryMain
            title={`Protocolo Alimentar - ${diet.name}`}
            subtitle={diet?.description || "Criador de Dieta Automático"}
            icon="Utensils"
            contextLabel="Dieta & Nutrição"
            showTabs={false}
            showHeader={false}
        >
            <DietBuilderSmart 
                diet={diet}
                backHref="/dashboard/student"
                canAssign={false}
                showAssignmentBadge={false}
                contextLabel="Dieta & Nutrição"
                icon="Utensils"
                contextColor="primary"
            />
        </RegistryMain>
    )
}
