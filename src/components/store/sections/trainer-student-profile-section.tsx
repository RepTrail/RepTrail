'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Inline } from '@/components/store/base/layout'
import { Grid } from '@/components/store/base/grid'
import { Box } from '@/components/store/base/box'
import { StudentProfileSummary } from '@/components/store/advanced/student-profile-summary'
import { StudentProfileForm } from '@/components/store/advanced/student-profile-form'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { User } from 'lucide-react'

interface TrainerStudentProfileSectionProps {
    studentId: string
    student: any
}

export function TrainerStudentProfileSection({ studentId, student }: TrainerStudentProfileSectionProps) {
    return (
        <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
            <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Icon icon={User} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                        <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>Perfil & Dados Gerais</Font>
                    </Inline>
                    <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>Consulte e edite as informações cadastrais, contatos e dados gerais de perfil do aluno.</Font>
                </Stack>
            </Stack>
            <Grid mdCols={12} gap={STORE_TOKENS.SPACING.SECTION} fullWidth>
                <Box mdColSpan={4}>
                    <StudentProfileSummary
                        name={student.full_name}
                        email={student.email}
                        avatarUrl={student.avatar_url}
                        userId={studentId}
                    />
                </Box>
                <Box mdColSpan={8}>
                    <StudentProfileForm userId={studentId} profile={student} />
                </Box>
            </Grid>
        </Stack>
    )
}
