'use client'

import React from 'react'
import { Surface } from '@/components/store/base/surface'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Skeleton } from '@/components/store/base/skeleton'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

export function AuthFormSkeleton() {
    return (
        <Surface variant="glass" padding={0} rounded={STORE_TOKENS.RADIUS.SYSTEM} width="full" maxWidth="auth-form">
            <Stack gap={0}>
                <Box padding={STORE_TOKENS.PADDING.CONTAINER}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Skeleton width={120} height={32} />
                        <Skeleton width={200} height={16} />
                    </Stack>
                </Box>
                <Box padding={STORE_TOKENS.PADDING.CONTAINER}>
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Skeleton height={44} width="full" />
                        <Skeleton height={44} width="full" />
                        <Skeleton height={64} width="full" rounded={STORE_TOKENS.RADIUS.SYSTEM} />
                    </Stack>
                </Box>
            </Stack>
        </Surface>
    )
}
