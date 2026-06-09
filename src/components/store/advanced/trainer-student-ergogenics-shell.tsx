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
            <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
                <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Icon icon={FlaskConical} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                            <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>{"ERGOGÊNICOS E CICLOS"}</Font>
                        </Inline>
                        <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>{subtitle}</Font>
                    </Stack>
                    <TrainerStudentErgogenicsHeaderActions
                        effectiveStudentId={effectiveStudentId}
                        studentName={studentName}
                        betaTesterMode={betaTesterMode}
                    />
                </Stack>
            </Stack>
            <TrainerStudentErgogenicsSmart effectiveStudentId={effectiveStudentId} />
        </Stack>
    )
}
