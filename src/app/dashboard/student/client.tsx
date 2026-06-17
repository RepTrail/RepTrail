'use client'

import { Activity, Dumbbell, Pill } from 'lucide-react'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { Box } from '@/components/store/base/box'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { PremiumLockOverlay } from '@/components/store/intermediary/premium-lock-overlay'

// Store Advanced Components (Smart Layer)
import { StudentPaymentWarning } from '@/components/store/advanced/student-payment-warning'
import { StudentTrainingProtocols } from '@/components/store/advanced/student-training-protocols'
import { StudentCardioTracker } from '@/components/store/advanced/student-cardio-tracker'
import { StudentBioactivesManagement } from '@/components/store/advanced/student-bioactives-management'
import { StudentNutritionAdherence } from '@/components/store/advanced/student-nutrition-adherence'

// Sections
import { AIProtocolEmptyState } from '@/components/store/advanced/ai-protocol-empty-state'

// Preserved Logic Components (Wrapped)
import { AnamnesisForm } from '@/components/store/advanced/student-anamnesis-form'
import { StudentDashboardModals } from '@/components/store/advanced/student-dashboard-modals'

interface StudentDashboardClientProps {
    userId: string
    trainerRel: any
    details: any
    protocolStatus: {
        hasWorkout: boolean
        hasDiet: boolean
    }
    showAutoTrainingModal: boolean
    showAnamnesis: boolean
    trainerFeatures?: any
}

/**
 * StudentDashboardClient (Migrated): Orchestrates the student home experience.
 * Moved to app layer to allow use of RegistryMain and RegistrySection structurally.
 */
export function StudentDashboardClient({
    userId,
    trainerRel,
    details,
    protocolStatus,
    showAutoTrainingModal,
    showAnamnesis,
    trainerFeatures
}: StudentDashboardClientProps) {
    const hasProtocol = protocolStatus.hasWorkout || protocolStatus.hasDiet

    // Se não tem trainer (Auto Treino) e não tem protocolo, esconde o header.
    // Se tiver trainer, continua igual. Se tiver protocolo, continua igual.
    const showHeader = !!trainerRel || hasProtocol

    const hasWorkouts = trainerFeatures ? (trainerFeatures.has_workouts ?? false) : true
    const hasCardio = trainerFeatures ? (trainerFeatures.has_cardio ?? false) : true
    const hasErgogenics = trainerFeatures ? (trainerFeatures.has_ergogenics ?? false) : true
    const hasDiets = trainerFeatures ? (trainerFeatures.has_diets ?? false) : true

    return (
        <RegistryMain
            title="DASHBOARD DO ALUNO"
            subtitle="Protocolos, treinos e acompanhamento da sua evolução."
            icon={Activity}
            contextLabel="Área do Aluno"
            showTabs={false}
            showHeader={showHeader}
        >
            <Stack gap={STORE_TOKENS.SPACING.SECTION} flex1={!hasProtocol && !trainerRel}>
                {/* 1. Notifications (Overlay/Hidden logic preserved) */}
                <StudentPaymentWarning relationship={trainerRel} />

                {/* 3. Domain Logic Blocks (Conditional) */}
                {showAnamnesis && (
                    <Box fullWidth>
                        <AnamnesisForm initialData={details} />
                    </Box>
                )}

                {!hasProtocol && !trainerRel && (
                    <AIProtocolEmptyState userId={userId} />
                )}

                {/* 4. Main Performance Grid (8/4 Split) */}
                {(hasProtocol || !!trainerRel) && (
                    <Grid gap={STORE_TOKENS.SPACING.SECTION} lgCols={12} fullWidth>
                        {/* Left Column: Intensity & Volume (8 cols) */}
                        <Box lgColSpan={8} fullWidth>
                            <Stack gap={STORE_TOKENS.SPACING.SECTION} fullWidth>
                                <RegistrySection title="TREINO DE HOJE" subtitle="Protocolos de musculação e treinamento de força." icon={Dumbbell}>
                                    <PremiumLockOverlay variant="area" locked={!hasWorkouts} title="Módulo de Treinos" description="O plano atual do seu personal trainer não inclui o módulo de treinos.">
                                        {hasWorkouts && <StudentTrainingProtocols userId={userId} />}
                                    </PremiumLockOverlay>
                                </RegistrySection>
                                <RegistrySection title="CARDIO DE HOJE" subtitle="Monitoramento de atividades aeróbicas e cronômetros." icon={Activity}>
                                    <PremiumLockOverlay variant="area" locked={!hasCardio} title="Módulo de Cardios" description="O plano atual do seu personal trainer não inclui o módulo de cardios.">
                                        {hasCardio && <StudentCardioTracker userId={userId} />}
                                    </PremiumLockOverlay>
                                </RegistrySection>
                                <RegistrySection title="BIOATIVOS" subtitle="Gestão de suplementos e ergogênicos." icon={Pill}>
                                    <PremiumLockOverlay variant="area" locked={!hasErgogenics} title="Módulo de Ergogênicos" description="O plano atual do seu personal trainer não inclui o módulo de ergogênicos.">
                                        {hasErgogenics && <StudentBioactivesManagement userId={userId} />}
                                    </PremiumLockOverlay>
                                </RegistrySection>
                            </Stack>
                        </Box>

                        {/* Right Column: Nutrition & Fuel (4 cols) */}
                        <Box lgColSpan={4} fullWidth>
                            <Stack gap={STORE_TOKENS.SPACING.SECTION} fullWidth>
                                <StudentNutritionAdherence userId={userId} locked={!hasDiets} />
                            </Stack>
                        </Box>
                    </Grid>
                )}

                {/* 5. System Orchestration Modals */}
                <StudentDashboardModals
                    userId={userId}
                    showModal={showAutoTrainingModal}
                    hasTrainer={!!trainerRel}
                />
            </Stack>
        </RegistryMain>
    )
}
