'use client'

import React from 'react'
import { Font } from '@/components/store/base/font'
import { Inline } from '@/components/store/base/layout'
import { Icon } from '@/components/store/base/icon'
import { Stack } from '@/components/store/base/stack'
import { FlaskConical } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { TrainerStudentErgogenicsHeaderActions } from '@/components/store/advanced/trainer-student-ergogenics-header-actions'
import { TrainerStudentErgogenicsSmart } from '@/components/store/advanced/trainer-student-ergogenics-smart'

interface TrainerStudentErgogenicsShellProps {
    effectiveStudentId: string
    studentName: string
    betaTesterMode?: boolean
}

export function TrainerStudentErgogenicsShell({
    effectiveStudentId,
    studentName,
    betaTesterMode = false,
}: TrainerStudentErgogenicsShellProps) {
    const subtitle = `Organize o protocolo farmacológico de ${studentName.toUpperCase()}`

    return (
        <Stack gap={STORE_TOKENS.SPACING.SECTION} fullWidth>
            <TrainerStudentErgogenicsSmart effectiveStudentId={effectiveStudentId} />
        </Stack>
    )
}
