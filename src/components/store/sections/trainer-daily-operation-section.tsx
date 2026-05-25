'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getTrainerProfile, getTrainerActivityFeed } from '@/actions/trainer-actions'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { Grid } from '@/components/store/base/grid'
import { Box } from '@/components/store/base/box'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Activity } from 'lucide-react'
import { ActivityFeed } from '@/components/store/advanced/activity-feed'
import { TrainerDashboardSidebarPanel } from '@/components/store/advanced/trainer-dashboard-sidebar-panel'
import { CodeAutoGenerator } from '@/components/store/advanced/code-auto-generator'

interface TrainerDailyOperationSectionProps {
    userId: string
    betaTesterMode: boolean
}

export function TrainerDailyOperationSection({ userId, betaTesterMode }: TrainerDailyOperationSectionProps) {
    const { data: profile } = useQuery({
        queryKey: QUERY_KEYS.profile.detail(userId),
        queryFn: () => getTrainerProfile(userId),
    })

    const { data: activities = [] } = useQuery({
        queryKey: QUERY_KEYS.trainer.activity(userId),
        queryFn: () => getTrainerActivityFeed(userId),
    })

    const trainerCode = profile?.trainer_code?.trim().toUpperCase()
    const publicProfileHref = trainerCode ? `/personal/${trainerCode}` : undefined
    const hasCode = !!profile?.trainer_code

    return (
        <RegistrySection
            title="Operação Diária"
            subtitle="Atividade recente, atalhos operacionais e gestão do perfil público."
            icon={Activity}
        >
            <CodeAutoGenerator hasCode={hasCode} />

            <Grid cols={{ base: 1, lg: 12 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Box lgColSpan={8} display="flex" direction="col" gap="container" overflow="hidden" fullWidth minHeight={0}>
                    <ActivityFeed userId={userId} initialData={activities} />
                </Box>

                <Box lgColSpan={4}>
                    <TrainerDashboardSidebarPanel
                        trainerCode={profile?.trainer_code}
                        editProfileHref="/dashboard/trainer/profile"
                        publicProfileHref={publicProfileHref}
                        showImportTeaser={!betaTesterMode}
                        importHref="/dashboard/trainer/import-pdf"
                    />
                </Box>
            </Grid>
        </RegistrySection>
    )
}
