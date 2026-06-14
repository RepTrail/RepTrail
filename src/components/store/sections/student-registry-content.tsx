'use client'

import React from 'react'
import { Font } from '@/components/store/base/font'
import { Inline } from '@/components/store/base/layout'
import { Icon } from '@/components/store/base/icon'
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
    User,
    Sparkles
} from 'lucide-react'
import { CommunityFeedSectionContent } from '@/components/store/sections/community-feed-section-content'
import { MarketplaceSectionContent } from '@/components/store/sections/marketplace-section-content'
import { StudentTrainingProtocols } from '@/components/store/advanced/student-training-protocols'
import { StudentCardioTracker } from '@/components/store/advanced/student-cardio-tracker'
import { StudentNutritionAdherence } from '@/components/store/advanced/student-nutrition-adherence'
import { StudentBioactivesManagement } from '@/components/store/advanced/student-bioactives-management'
import { WorkoutManagementList } from '@/components/store/advanced/workout-management-list'
import { DietManagementList } from '@/components/store/advanced/diet-management-list'
import { ErgogenicManagementList } from '@/components/store/advanced/ergogenic-management-list'
import { RankingSectionContent } from '@/components/store/sections/ranking-section-content'
import { StudentOnboardingSectionContent } from '@/components/store/sections/student-onboarding-section-content'
import { StudentProfileSectionContent } from '@/components/store/sections/student-profile-section-content'
import { AIProtocolContent } from '@/components/store/advanced/ai-protocol-content'
import { AIProtocolEmptyState } from '@/components/store/advanced/ai-protocol-empty-state'
import { Box } from '@/components/store/base/box'
import { STORE_TOKENS } from '@/components/store/constants/tokens';
import { ManagementRegistrySection } from '@/components/store/intermediary/management-registry-section'
import { ShareTransformation } from '@/components/store/advanced/student-share-transformation'

/**
 * StudentRegistryContent: Full Catalog of Student Dashboard Components.
 */
export function StudentRegistryContent({ id }: { id: string }) {
    return (
        <Stack id={id} gap={STORE_TOKENS.SPACING.SECTION} fullWidth>
            <Grid mdCols={12} gap={STORE_TOKENS.SPACING.SECTION} fullWidth>
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
                ContentComponent={WorkoutManagementList}
                mode="auto"
            />
            {/* 6. Seção de Gerenciamento de Treinos (Personal Trainer) */}
            <ManagementRegistrySection
                title="GERENCIAMENTO DE TREINOS (PERSONAL TRAINER)"
                subtitle="Versão para alunos com acompanhamento de personal (Apenas visualização)."
                icon={Dumbbell}
                ContentComponent={WorkoutManagementList}
                mode="personal"
            />
            {/* 7. Seção de Gerenciamento de Dieta (Auto Dieta) */}
            <ManagementRegistrySection
                title="GERENCIAMENTO DE DIETA (AUTO DIETA)"
                subtitle="Visualize e organize seus protocolos alimentares ativos."
                icon={Utensils}
                ContentComponent={DietManagementList}
                mode="auto"
            />
            {/* 8. Seção de Gerenciamento de Dieta (Personal Diet) */}
            <ManagementRegistrySection
                title="GERENCIAMENTO DE DIETA (PERSONAL DIET)"
                subtitle="Versão para alunos com acompanhamento nutricional (Apenas visualização)."
                icon={Utensils}
                ContentComponent={DietManagementList}
                mode="personal"
            />
            {/* 9. Seção de Gestão de Ergogênicos (Auto) */}
            <ManagementRegistrySection
                title="GESTÃO DE ERGOGÊNICOS (AUTO)"
                subtitle="Visualize e organize seus protocolos de substâncias."
                icon={FlaskConical}
                ContentComponent={ErgogenicManagementList}
                mode="auto"
            />
            {/* 10. Seção de Gestão de Ergogênicos (Personal) */}
            <ManagementRegistrySection
                title="GESTÃO DE ERGOGÊNICOS (PERSONAL)"
                subtitle="Versão para alunos com acompanhamento de coach (Apenas visualização)."
                icon={FlaskConical}
                ContentComponent={ErgogenicManagementList}
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
            <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
                <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Icon icon={Activity} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                            <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>FLUXO DE ONBOARDING (ALUNO)</Font>
                        </Inline>
                        <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>Visualização sequencial das etapas de cadastro inicial do ecossistema RepTrail.</Font>
                    </Stack>
                </Stack>
                <StudentOnboardingSectionContent />
            </Stack>
            {/* 15. Perfil do Aluno (Reconstrução DS) */}
            <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
                <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Icon icon={User} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                            <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>MEU PERFIL (RECONSTRUÇÃO DS)</Font>
                        </Inline>
                        <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>Versão ultra-premium reconstruída 100% com componentes base do design system.</Font>
                    </Stack>
                </Stack>
                <StudentProfileSectionContent showVariants={true} />
            </Stack>
            {/* 16. Gerador de Protocolo IA (Reconstrução DS) */}
            <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
                <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Icon icon={Sparkles} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                            <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>GERADOR DE PROTOCOLO IA (RECONSTRUÇÃO DS)</Font>
                        </Inline>
                        <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>O cérebro da plataforma. Reconstruído com a estética premium do onboarding.</Font>
                    </Stack>
                </Stack>
                <AIProtocolContent />
            </Stack>
            {/* 17. Empty State Auto Treino (Reconstrução DS) */}
            <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
                <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Icon icon={Sparkles} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                            <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>EMPTY STATE AUTO TREINO (RECONSTRUÇÃO DS)</Font>
                        </Inline>
                        <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>Banner de boas-vindas exibido quando o aluno tem auto treino mas sem protocolo.</Font>
                    </Stack>
                </Stack>
                <AIProtocolEmptyState />
            </Stack>
            {/* 18. Compartilhamento de Evolução (Antes e Depois) */}
            <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
                <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Icon icon={TrendingUp} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                            <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>COMPARTILHAMENTO DE EVOLUÇÃO (ANTES E DEPOIS)</Font>
                        </Inline>
                        <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>Modal premium de geração de imagem de evolução.</Font>
                    </Stack>
                </Stack>
                <Stack align="start" padding={STORE_TOKENS.PADDING.CONTAINER}>
                    <ShareTransformation
                        studentName="Marcos Roberto"
                        beforeUrl="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400"
                        afterUrl="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400"
                        beforeDate="2026-01-01"
                        afterDate="2026-05-19"
                    />
                </Stack>
            </Stack>
        </Stack>
    );
}
