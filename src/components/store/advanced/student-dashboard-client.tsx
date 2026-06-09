'use client'

import { Activity } from 'lucide-react'
import { Font } from '@/components/store/base/font'
import { Inline } from '@/components/store/base/layout'
import { Icon } from '@/components/store/base/icon'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { Box } from '@/components/store/base/box'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

// Store Advanced Components (Smart Layer)
import { StudentPaymentWarning } from '@/components/store/advanced/student-payment-warning'
import { StudentTrainingProtocols } from '@/components/store/advanced/student-training-protocols'
import { StudentCardioTracker } from '@/components/store/advanced/student-cardio-tracker'
import { StudentBioactivesManagement } from '@/components/store/advanced/student-bioactives-management'
import { StudentNutritionAdherence } from '@/components/store/advanced/student-nutrition-adherence'

// Sections
import { AIProtocolEmptyStateSectionContent } from '@/components/store/sections/ai-protocol-empty-state-section-content'

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
}

/**
 * StudentDashboardClient (Migrated): Orchestrates the student home experience.
 * Now follows strict RepTrail Store architecture and governance.
 */
export function StudentDashboardClient({
    userId,
    trainerRel,
    details,
    protocolStatus,
    showAutoTrainingModal,
    showAnamnesis
}: StudentDashboardClientProps) {
    const hasProtocol = protocolStatus.hasWorkout || protocolStatus.hasDiet

    // Se não tem trainer (Auto Treino) e não tem protocolo, esconde o header.
    // Se tiver trainer, continua igual. Se tiver protocolo, continua igual.
    const showHeader = !!trainerRel || hasProtocol

    return (
        <Stack gap={STORE_TOKENS.SPACING.SECTION} fullWidth>
            {showHeader && (
                <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
                    <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                <Icon icon={Activity} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                                <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>{"DASHBOARD DO ALUNO"}</Font>
                            </Inline>
                            <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>{"Protocolos, treinos e acompanhamento da sua evolução."}</Font>
                        </Stack>
                    </Stack>
                </Stack>
            )}
            <Stack gap={STORE_TOKENS.SPACING.SECTION} flex1={!hasProtocol}>
                {/* 1. Notifications (Overlay/Hidden logic preserved) */}
                <StudentPaymentWarning relationship={trainerRel} />

                {/* 3. Domain Logic Blocks (Conditional) */}
                {showAnamnesis && (
                    <Box fullWidth>
                        <AnamnesisForm initialData={details} />
                    </Box>
                )}

                {!hasProtocol && (
                    <AIProtocolEmptyStateSectionContent userId={userId} />
                )}

                {/* 4. Main Performance Grid (8/4 Split) */}
                {hasProtocol && (
                    <Grid gap={STORE_TOKENS.SPACING.SECTION} lgCols={12} fullWidth>
                        {/* Left Column: Intensity & Volume (8 cols) */}
                        <Box lgColSpan={8} fullWidth>
                            <Stack gap={STORE_TOKENS.SPACING.SECTION} fullWidth>
                                <StudentTrainingProtocols userId={userId} />
                                <StudentCardioTracker userId={userId} />
                                <StudentBioactivesManagement userId={userId} />
                            </Stack>
                        </Box>

                        {/* Right Column: Nutrition & Fuel (4 cols) */}
                        <Box lgColSpan={4} fullWidth>
                            <Stack gap={STORE_TOKENS.SPACING.SECTION} fullWidth>
                                <StudentNutritionAdherence userId={userId} />
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
        </Stack>
    )
}
