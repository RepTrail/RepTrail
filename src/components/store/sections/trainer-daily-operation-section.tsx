'use client'

import React from 'react'
import { useQuery } from '@/lib/dal'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getTrainerProfile, getTrainerActivityFeed } from '@/lib/dal/remote'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Inline } from '@/components/store/base/layout'
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
        <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT}>
            <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Icon icon={Activity} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                        <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>Operação Diária</Font>
                    </Inline>
                    <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>Atividade recente, atalhos operacionais e gestão do perfil público.</Font>
                </Stack>
            </Stack>
            <CodeAutoGenerator hasCode={hasCode} />
            <Grid cols={{ base: 1, lg: 12 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Box lgColSpan={8} display="flex" direction="col" gap={STORE_TOKENS.SPACING.CONTAINER} overflow="hidden" fullWidth minHeight={0}>
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
        </Stack>
    );
}
