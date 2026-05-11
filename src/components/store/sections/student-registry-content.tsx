'use client'

import React from 'react'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { Box } from '@/components/store/base/box'
import { 
    Utensils, 
    Dumbbell, 
    FlaskConical, 
    Activity
} from 'lucide-react'
import { ProtocolCard } from '@/components/store/intermediary/protocol-card'
import { DietAdherenceCard } from '@/components/store/intermediary/diet-adherence-card'
import { CardioTimerCard } from '@/components/store/intermediary/cardio-timer-card'
import { ErgogenicsList } from '@/components/store/intermediary/ergogenics-list'
import { WorkoutManagementSectionContent } from '@/components/store/sections/workout-management-section-content'
import { DietManagementSectionContent } from '@/components/store/sections/diet-management-section-content'
import { ErgogenicManagementSectionContent } from '@/components/store/sections/ergogenic-management-section-content'

/**
 * StudentRegistryContent: Full Catalog of Student Dashboard Components.
 * Restored to sequential list of all 10 sections as requested.
 * - Removed internal tabs and redundant RegistryMain.
 * - Maintained 1:1 parity with design requirements.
 */
export function StudentRegistryContent({ id }: { id: string }) {
    return (
        <Box id={id}>
            <Grid mdCols={12} gap="section">
                {/* Left Column: Treino & Cardio (8 cols) */}
                <Box className="md:col-span-8">
                    <Stack gap="section">
                        {/* 1. Seção de Treino */}
                        <RegistrySection
                            title="SEÇÃO DE TREINO"
                            subtitle="Protocolos de musculação e treinamento de força."
                            icon={Dumbbell}
                        >
                            <ProtocolCard
                                title="TREINO A"
                                subtitle="12 EXERCÍCIOS • FOCO DO DIA"
                                icon={Dumbbell}
                                status="not_started"
                                statusLabel="PRONTO PARA TREINAR"
                                color="emerald"
                                actionLabel="INICIAR TREINO"
                            />
                        </RegistrySection>

                        {/* 2. Seção de Cardio */}
                        <RegistrySection
                            title="SEÇÃO DE CARDIO"
                            subtitle="Monitoramento de atividades aeróbicas e cronômetros."
                            icon={Activity}
                        >
                            <CardioTimerCard 
                                title="ESTEIRA OU BIKE"
                                duration="30 MIN"
                                intensity="MODERADA"
                                remainingTime="30:00"
                                estimatedBurn="0"
                            />
                        </RegistrySection>
                    </Stack>
                </Box>

                {/* Right Column: Dieta & Ergogênicos (4 cols) */}
                <Box className="md:col-span-4">
                    <Stack gap="section">
                        {/* 3. Seção de Dieta */}
                        <RegistrySection
                            title="SEÇÃO DE DIETA"
                            subtitle="Acompanhamento nutricional."
                            icon={Utensils}
                        >
                            <DietAdherenceCard
                                completedItems={1}
                                totalItems={12}
                                percentage={8}
                                macros={{
                                    calories: 2478,
                                    protein: 206,
                                    carbs: 301,
                                    fat: 50,
                                    fiber: 0
                                }}
                                meals={[
                                    { name: 'Refeição 1', itemsCount: '1/2' },
                                    { name: 'Refeição 2', itemsCount: '0/4' }
                                ]}
                            />
                        </RegistrySection>

                        {/* 4. Seção de Ergogênicos */}
                        <RegistrySection
                            title="ERGOGÊNICOS"
                            subtitle="Gestão diária."
                            icon={FlaskConical}
                        >
                            <ErgogenicsList 
                                items={[
                                    { name: 'DURATESTON', dosage: 'PADRÃO' },
                                    { name: 'IOIMBINA', dosage: 'PADRÃO' },
                                    { name: 'NAC', dosage: 'PADRÃO' },
                                    { name: 'CAFEINA', dosage: 'PADRÃO' }
                                ]}
                            />
                        </RegistrySection>
                    </Stack>
                </Box>
            </Grid>

            {/* 5. Seção de Gerenciamento de Treinos (Auto Treino) */}
            <Box paddingTop={12.5}>
                <RegistrySection
                    title="GERENCIAMENTO DE TREINOS (AUTO TREINO)"
                    subtitle="Versão com permissões completas de edição e organização."
                    icon={Dumbbell}
                >
                    <WorkoutManagementSectionContent mode="auto" />
                </RegistrySection>
            </Box>

            {/* 6. Seção de Gerenciamento de Treinos (Personal Trainer) */}
            <Box paddingTop={12.5}>
                <RegistrySection
                    title="GERENCIAMENTO DE TREINOS (PERSONAL TRAINER)"
                    subtitle="Versão para alunos com acompanhamento de personal (Apenas visualização)."
                    icon={Dumbbell}
                >
                    <WorkoutManagementSectionContent mode="personal" />
                </RegistrySection>
            </Box>

            {/* 7. Seção de Gerenciamento de Dieta (Auto Dieta) */}
            <Box paddingTop={12.5}>
                <RegistrySection
                    title="GERENCIAMENTO DE DIETA (AUTO DIETA)"
                    subtitle="Visualize e organize seus protocolos alimentares ativos."
                    icon={Utensils}
                >
                    <DietManagementSectionContent mode="auto" />
                </RegistrySection>
            </Box>

            {/* 8. Seção de Gerenciamento de Dieta (Personal Diet) */}
            <Box paddingTop={12.5}>
                <RegistrySection
                    title="GERENCIAMENTO DE DIETA (PERSONAL DIET)"
                    subtitle="Versão para alunos com acompanhamento nutricional (Apenas visualização)."
                    icon={Utensils}
                >
                    <DietManagementSectionContent mode="personal" />
                </RegistrySection>
            </Box>

            {/* 9. Seção de Gestão de Ergogênicos (Auto) */}
            <Box paddingTop={12.5}>
                <RegistrySection
                    title="GESTÃO DE ERGOGÊNICOS (AUTO)"
                    subtitle="Visualize e organize seus protocolos de substâncias."
                    icon={FlaskConical}
                >
                    <ErgogenicManagementSectionContent mode="auto" />
                </RegistrySection>
            </Box>

            {/* 10. Seção de Gestão de Ergogênicos (Personal) */}
            <Box paddingTop={12.5}>
                <RegistrySection
                    title="GESTÃO DE ERGOGÊNICOS (PERSONAL)"
                    subtitle="Versão para alunos com acompanhamento de coach (Apenas visualização)."
                    icon={FlaskConical}
                >
                    <ErgogenicManagementSectionContent mode="personal" />
                </RegistrySection>
            </Box>
        </Box>
    )
}
