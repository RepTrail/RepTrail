'use client'

import { Grid } from '@/components/store/base/grid'
import { Box } from '@/components/store/base/box'
import { UserProfileSummary } from '@/components/store/advanced/user-profile-summary'
import { StudentProfileForm } from '@/components/store/advanced/student-profile-form'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface TrainerStudentProfileSectionProps {
    studentId: string
    student: any
}

export function TrainerStudentProfileSection({ studentId, student }: TrainerStudentProfileSectionProps) {
    return (
        <Grid mdCols={12} gap={STORE_TOKENS.SPACING.SECTION} fullWidth>
        <Box mdColSpan={4}>
            <UserProfileSummary
                type="student"
                name={student?.full_name}
                email={student.email}
                avatarUrl={student.avatar_url}
                userId={studentId}
            />
        </Box>
        <Box mdColSpan={8}>
            <StudentProfileForm userId={studentId} profile={student} />
        </Box>
    </Grid>
    )
}
