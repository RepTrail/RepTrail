'use client'

import React from 'react'
import { Surface } from '../base/surface'
import { Stack } from '../base/stack'
import { Box } from '../base/box'
import { Skeleton } from '../base/skeleton'

export function AuthFormSkeleton() {
    return (
        <Surface variant="glass" padding={0} rounded="system" width="full" maxWidth="auth-form">
            <Stack gap={0}>
                <Box padding={5}>
                    <Stack gap={2.5} align="center">
                        <Skeleton width={120} height={32} />
                        <Skeleton width={200} height={16} />
                    </Stack>
                </Box>
                <Box padding={5}>
                    <Stack gap={5}>
                        <Skeleton height={44} width="full" />
                        <Skeleton height={44} width="full" />
                        <Skeleton height={64} width="full" rounded="full" />
                    </Stack>
                </Box>
            </Stack>
        </Surface>
    )
}
