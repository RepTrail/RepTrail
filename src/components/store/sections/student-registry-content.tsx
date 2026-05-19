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
import { ManagementRegistrySection } from '@/components/store/advanced/management-registry-section'
import { ShareTransformation } from '@/components/store/advanced/student-share-transformation'

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
                        <StudentTrainingProtocols userId="mock-id" />
                        <StudentCardioTracker userId="mock-id" />
                    </Stack>
                </Box>

                {/* Right Column: Dieta & Ergogênicos (4 cols) */}
                <Box mdColSpan={4}>
                    <Stack gap={STORE_TOKENS.SPACING.SECTION}>
                        <StudentNutritionAdherence userId="mock-id" />
                        <StudentBioactivesManagement userId="mock-id" />
                    </Stack>
                </Box>
            </Grid>
            {/* 5. Seção de Gerenciamento de Treinos (Auto Treino) */}
            <ManagementRegistrySection
                title="GERENCIAMENTO DE TREINOS (AUTO TREINO)"
                subtitle="Versão com permissões completas de edição e organização."
                icon={Dumbbell}
                ContentComponent={WorkoutManagementSectionContent}
                mode="auto"
            />

            {/* 6. Seção de Gerenciamento de Treinos (Personal Trainer) */}
            <ManagementRegistrySection
                title="GERENCIAMENTO DE TREINOS (PERSONAL TRAINER)"
                subtitle="Versão para alunos com acompanhamento de personal (Apenas visualização)."
                icon={Dumbbell}
                ContentComponent={WorkoutManagementSectionContent}
                mode="personal"
            />

            {/* 7. Seção de Gerenciamento de Dieta (Auto Dieta) */}
            <ManagementRegistrySection
                title="GERENCIAMENTO DE DIETA (AUTO DIETA)"
                subtitle="Visualize e organize seus protocolos alimentares ativos."
                icon={Utensils}
                ContentComponent={DietManagementSectionContent}
                mode="auto"
            />

            {/* 8. Seção de Gerenciamento de Dieta (Personal Diet) */}
            <ManagementRegistrySection
                title="GERENCIAMENTO DE DIETA (PERSONAL DIET)"
                subtitle="Versão para alunos com acompanhamento nutricional (Apenas visualização)."
                icon={Utensils}
                ContentComponent={DietManagementSectionContent}
                mode="personal"
            />

            {/* 9. Seção de Gestão de Ergogênicos (Auto) */}
            <ManagementRegistrySection
                title="GESTÃO DE ERGOGÊNICOS (AUTO)"
                subtitle="Visualize e organize seus protocolos de substâncias."
                icon={FlaskConical}
                ContentComponent={ErgogenicManagementSectionContent}
                mode="auto"
            />

            {/* 10. Seção de Gestão de Ergogênicos (Personal) */}
            <ManagementRegistrySection
                title="GESTÃO DE ERGOGÊNICOS (PERSONAL)"
                subtitle="Versão para alunos com acompanhamento de coach (Apenas visualização)."
                icon={FlaskConical}
                ContentComponent={ErgogenicManagementSectionContent}
                mode="personal"
            />

            {/* 11. Feed da Comunidade */}
            <ManagementRegistrySection
                title="FEED DA COMUNIDADE"
                subtitle="Explore os resultados, treinos e conquistas da nossa comunidade de alta performance."
                icon={Users}
                ContentComponent={CommunityFeedSectionContent}
            />
            {/* 12. Ranking & Pódio */}
            <RankingSectionContent />
            {/* 13. Marketplace & Performance (Loja) */}
            <ManagementRegistrySection
                title="MARKETPLACE & PERFORMANCE"
                subtitle="Suplementos de alta performance selecionados criteriosamente para acelerar seus resultados."
                icon={ShoppingBag}
                ContentComponent={MarketplaceSectionContent}
                fullWidth
            />
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

            {/* 18. Compartilhamento de Evolução (Antes e Depois) */}
            <RegistrySection
                title="COMPARTILHAMENTO DE EVOLUÇÃO (ANTES E DEPOIS)"
                icon={TrendingUp}
                subtitle="Modal premium de geração de imagem de evolução."
            >
                <Stack align="start" padding={STORE_TOKENS.PADDING.CONTAINER}>
                    <ShareTransformation
                        studentName="Marcos Roberto"
                        beforeUrl="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400"
                        afterUrl="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400"
                        beforeDate="2026-01-01"
                        afterDate="2026-05-19"
                    />
                </Stack>
            </RegistrySection>
        </Stack>
    );
}
