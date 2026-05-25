'use client'

import React from 'react'
import { RegistrySection } from '@/components/store/advanced/registry-section'
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
        <RegistrySection
            title="Perfil & Dados Gerais"
            subtitle="Consulte e edite as informações cadastrais, contatos e dados gerais de perfil do aluno."
            icon={User}
        >
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
        </RegistrySection>
    )
}
