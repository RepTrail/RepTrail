'use client'

import React from 'react'
import { useQueryClient, useQuery, actions } from '@/lib/dal'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { ErgogenicManagementList } from '@/components/store/advanced/ergogenic-management-list'
import { QUERY_KEYS } from '@/lib/query-keys'
import { Surface } from '@/components/store/base/surface'

interface TrainerStudentErgogenicsSmartProps {
    effectiveStudentId: string
    isPersonalMode?: boolean
    hideImportPdf?: boolean
}

export function TrainerStudentErgogenicsSmart({
    effectiveStudentId,
    isPersonalMode = false,
    hideImportPdf = false
}: TrainerStudentErgogenicsSmartProps) {
    const queryClient = useQueryClient()

    const { data: items = [], isLoading } = useQuery({
        queryKey: QUERY_KEYS.ergogenics.all(effectiveStudentId),
        queryFn: async () => {
            const res = await actions.getStudentErgogenics(effectiveStudentId)
            return Array.isArray(res) ? res : []
        }
    })

    if (isLoading) {
        return (
            <Surface animation="pulse" variant="sunken" border="none" gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Box bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.SURFACE} {...{ width: 160, height: 32 }} rounded={STORE_TOKENS.RADIUS.SYSTEM} />
                <Box bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.SURFACE} height="120px" rounded={STORE_TOKENS.RADIUS.SYSTEM} />
                <Box bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.SURFACE} height="400px" rounded={STORE_TOKENS.RADIUS.SYSTEM} />
            </Surface>
        )
    }

    return (
        <Stack gap={STORE_TOKENS.SPACING.SECTION}>
            <Box>
                <ErgogenicManagementList 
                    items={items}
                    mode={isPersonalMode ? 'personal' : 'trainer'}
                    isEmpty={items.length === 0}
                />
            </Box>
        </Stack>
    )
}
