'use client'

import React from 'react'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import {
    Utensils,
    Dumbbell,
    FlaskConical,
    Activity,
    TrendingUp,
    Users,
    ShoppingBag,
    CheckCircle,
    User,
    Sparkles,
    Zap
} from 'lucide-react'
import { CommunityFeedSectionContent } from '@/components/store/sections/community-feed-section-content'
import { MarketplaceSectionContent } from '@/components/store/sections/marketplace-section-content'
import { StudentTrainingProtocols } from '@/components/store/advanced/student-training-protocols'
import { StudentCardioTracker } from '@/components/store/advanced/student-cardio-tracker'
import { StudentNutritionAdherence } from '@/components/store/advanced/student-nutrition-adherence'
import { StudentBioactivesManagement } from '@/components/store/advanced/student-bioactives-management'
import { WorkoutManagementSectionContent } from '@/components/store/sections/workout-management-section-content'
import { DietManagementSectionContent } from '@/components/store/sections/diet-management-section-content'
import { ErgogenicManagementSectionContent } from '@/components/store/sections/ergogenic-management-section-content'
import { RankingSectionContent } from '@/components/store/sections/ranking-section-content'
import { StudentOnboardingSectionContent } from '@/components/store/sections/student-onboarding-section-content'
import { StudentProfileSectionContent } from '@/components/store/sections/student-profile-section-content'
import { AIProtocolSectionContent } from '@/components/store/sections/ai-protocol-section-content'
import { StudentSubscriptionStatus } from '@/components/store/advanced/student-subscription-status'
import { AIProtocolEmptyStateSectionContent } from '@/components/store/sections/ai-protocol-empty-state-section-content'
import { Box } from '@/components/store/base/box'
import { STORE_TOKENS } from '@/components/store/constants/tokens';
import { Font } from '@/components/store/base/font'

/**
 * StudentRegistryContent: Full Catalog of Student Dashboard Components.
 */
export function StudentRegistryContent({ id }: { id: string }) {
    return (
        <Stack id={id} gap="section" fullWidth>
            <Grid mdCols={12} gap="section" fullWidth>
                {/* Left Column: Treino & Cardio (8 cols) */}
                <Box mdColSpan={8}>
                    <Stack gap={STORE_TOKENS.SPACING.SECTION}>
                        <StudentTrainingProtocols />
                        <StudentCardioTracker />
                    </Stack>
                </Box>

                {/* Right Column: Dieta & Ergogênicos (4 cols) */}
                <Box mdColSpan={4}>
                    <Stack gap={STORE_TOKENS.SPACING.SECTION}>
                        <StudentNutritionAdherence />
                        <StudentBioactivesManagement />
                    </Stack>
                </Box>
            </Grid>
            {/* 5. Seção de Gerenciamento de Treinos (Auto Treino) */}
            <RegistrySection
                title="GERENCIAMENTO DE TREINOS (AUTO TREINO)"
                subtitle="Versão com permissões completas de edição e organização."
                icon={Dumbbell}
            >
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <WorkoutManagementSectionContent mode="auto" />
                    <WorkoutManagementSectionContent mode="auto" isEmpty={true} />
                </Stack>
            </RegistrySection>
            {/* 6. Seção de Gerenciamento de Treinos (Personal Trainer) */}
            <RegistrySection
                title="GERENCIAMENTO DE TREINOS (PERSONAL TRAINER)"
                subtitle="Versão para alunos com acompanhamento de personal (Apenas visualização)."
                icon={Dumbbell}
            >
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <WorkoutManagementSectionContent mode="personal" />
                    <WorkoutManagementSectionContent mode="personal" isEmpty={true} />
                </Stack>
            </RegistrySection>
            {/* 7. Seção de Gerenciamento de Dieta (Auto Dieta) */}
            <RegistrySection
                title="GERENCIAMENTO DE DIETA (AUTO DIETA)"
                subtitle="Visualize e organize seus protocolos alimentares ativos."
                icon={Utensils}
            >
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <DietManagementSectionContent mode="auto" />
                    <DietManagementSectionContent mode="auto" isEmpty={true} />
                </Stack>
            </RegistrySection>
            {/* 8. Seção de Gerenciamento de Dieta (Personal Diet) */}
            <RegistrySection
                title="GERENCIAMENTO DE DIETA (PERSONAL DIET)"
                subtitle="Versão para alunos com acompanhamento nutricional (Apenas visualização)."
                icon={Utensils}
            >
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <DietManagementSectionContent mode="personal" />
                    <DietManagementSectionContent mode="personal" isEmpty={true} />
                </Stack>
            </RegistrySection>
            {/* 9. Seção de Gestão de Ergogênicos (Auto) */}
            <RegistrySection
                title="GESTÃO DE ERGOGÊNICOS (AUTO)"
                subtitle="Visualize e organize seus protocolos de substâncias."
                icon={FlaskConical}
            >
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <ErgogenicManagementSectionContent mode="auto" />
                    <ErgogenicManagementSectionContent mode="auto" isEmpty={true} />
                </Stack>
            </RegistrySection>
            {/* 10. Seção de Gestão de Ergogênicos (Personal) */}
            <RegistrySection
                title="GESTÃO DE ERGOGÊNICOS (PERSONAL)"
                subtitle="Versão para alunos com acompanhamento de coach (Apenas visualização)."
                icon={FlaskConical}
            >
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <ErgogenicManagementSectionContent mode="personal" />
                    <ErgogenicManagementSectionContent mode="personal" isEmpty={true} />
                </Stack>
            </RegistrySection>
            {/* 11. Feed da Comunidade */}
            <RegistrySection
                title="FEED DA COMUNIDADE"
                subtitle="Explore os resultados, treinos e conquistas da nossa comunidade de alta performance."
                icon={Users}
            >
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <CommunityFeedSectionContent />
                    <CommunityFeedSectionContent isEmpty={true} />
                </Stack>
            </RegistrySection>
            {/* 12. Ranking & Pódio */}
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
                <RankingSectionContent />
                <RankingSectionContent isEmpty={true} />
            </Stack>
            {/* 13. Marketplace & Performance (Loja) */}
            <RegistrySection
                title="MARKETPLACE & PERFORMANCE"
                subtitle="Suplementos de alta performance selecionados criteriosamente para acelerar seus resultados."
                icon={ShoppingBag}
            >
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
                    <MarketplaceSectionContent />
                    <MarketplaceSectionContent isEmpty={true} />
                </Stack>
            </RegistrySection>
            {/* 14. Fluxo de Onboarding (Aluno) */}
            <RegistrySection
                title="FLUXO DE ONBOARDING (ALUNO)"
                icon={Activity}
                subtitle="Visualização sequencial das etapas de cadastro inicial do ecossistema RepTrail."
            >
                <StudentOnboardingSectionContent />
            </RegistrySection>
            {/* 15. Perfil do Aluno (Reconstrução DS) */}
            <RegistrySection
                title="MEU PERFIL (RECONSTRUÇÃO DS)"
                icon={User}
                subtitle="Versão ultra-premium reconstruída 100% com componentes base do design system."
            >
                <StudentProfileSectionContent showVariants={true} />
            </RegistrySection>

            {/* 16. Gerador de Protocolo IA (Reconstrução DS) */}
            <RegistrySection
                title="GERADOR DE PROTOCOLO IA (RECONSTRUÇÃO DS)"
                icon={Sparkles}
                subtitle="O cérebro da plataforma. Reconstruído com a estética premium do onboarding."
            >
                <AIProtocolSectionContent />
            </RegistrySection>

            {/* 17. Empty State Auto Treino (Reconstrução DS) */}
            <RegistrySection
                title="EMPTY STATE AUTO TREINO (RECONSTRUÇÃO DS)"
                icon={Sparkles}
                subtitle="Banner de boas-vindas exibido quando o aluno tem auto treino mas sem protocolo."
            >
                <AIProtocolEmptyStateSectionContent />
            </RegistrySection>
        </Stack>
    );
}
