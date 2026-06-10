'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { TrainerStudentErgogenicsSmart } from '@/components/store/advanced/trainer-student-ergogenics-smart'

interface TrainerStudentErgogenicsShellProps {
    effectiveStudentId: string
    studentName: string
    betaTesterMode?: boolean
    hideImportPdf?: boolean
}

export function TrainerStudentErgogenicsShell({
    effectiveStudentId,
    studentName,
    betaTesterMode = false,
    hideImportPdf = false,
}: TrainerStudentErgogenicsShellProps) {
    const subtitle = `Organize o protocolo farmacológico de ${studentName.toUpperCase()}`

    return (
        <Stack gap={STORE_TOKENS.SPACING.SECTION} fullWidth>
            <TrainerStudentErgogenicsSmart 
                effectiveStudentId={effectiveStudentId} 
                hideImportPdf={hideImportPdf}
            />
        </Stack>
    )
}
