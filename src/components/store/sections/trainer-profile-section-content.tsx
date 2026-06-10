'use client'

import React from 'react'
import { Grid } from '@/components/store/base/grid'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { TrainerProfileSummary } from '@/components/store/advanced/trainer-profile-summary'
import { TrainerProfileForm } from '@/components/store/advanced/trainer-profile-form'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface TrainerProfileSectionContentProps {
    userId: string
    profile: any
    hasPublicProfile?: boolean
}

export function TrainerProfileSectionContent({ userId, profile, hasPublicProfile = true }: TrainerProfileSectionContentProps) {
    if (!profile) {
        return (
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
                <Box height={280} rounded={STORE_TOKENS.RADIUS.SYSTEM} bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.SUBTLE} />
                <Box height={400} rounded={STORE_TOKENS.RADIUS.SYSTEM} bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.SUBTLE} />
            </Stack>
        );
    }

    return (
        <Grid mdCols={12} gap={STORE_TOKENS.SPACING.SECTION} fullWidth>
            <Box mdColSpan={4}>
                <TrainerProfileSummary
                    name={(profile.full_name || 'Personal').toUpperCase()}
                    email={(profile.email || '').toUpperCase()}
                    avatarUrl={profile.avatar_url}
                    trainerCode={profile.trainer_code}
                    hasPublicProfile={hasPublicProfile}
                />
            </Box>

            <Box mdColSpan={8}>
                <TrainerProfileForm profile={profile} userId={userId} />
            </Box>
        </Grid>
    )
}
