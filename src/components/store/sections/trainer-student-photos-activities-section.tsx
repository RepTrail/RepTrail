'use client'

import { useQuery } from '@/lib/dal'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getStudentRelationship, getStudentRecentActivities } from '@/lib/dal/remote'
import { StudentPublicPhotos } from '@/components/store/advanced/student-public-photos'
import { StudentRecentActivities } from '@/components/store/advanced/student-recent-activities'
import { Stack } from '@/components/store/base/stack'
import { Icon } from '@/components/store/base/icon'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Loader2 } from 'lucide-react'

interface PhotosContentProps {
    relationshipId: string
    studentId: string
}

export function TrainerStudentPhotosContent({ relationshipId, studentId }: PhotosContentProps) {
    const { data: relationship, isLoading } = useQuery({
        queryKey: QUERY_KEYS.trainer.studentDetail(relationshipId),
        queryFn: () => getStudentRelationship(relationshipId),
        staleTime: 1000 * 60 * 5,
    })

    if (isLoading || !relationship || !relationship.student) {
        return (
            <Stack align="center" justify="center" padding={STORE_TOKENS.PADDING.SECTION} fullWidth>
                <Icon icon={Loader2} color={STORE_TOKENS.COLORS.BRAND} size="xl" spin />
            </Stack>
        );
    }

    const student = relationship.student

    return (
        <StudentPublicPhotos
            studentId={studentId}
            isOwner={false}
            studentName={student?.full_name}
            photos={student.progress_photos || []}
            isStudentView={false}
        />
    )
}

interface ActivitiesContentProps {
    studentId: string
}

export function TrainerStudentRecentActivitiesContent({ studentId }: ActivitiesContentProps) {
    const { data: recentActivities = [], isLoading } = useQuery({
        queryKey: ['student-recent-activities', studentId],
        queryFn: () => getStudentRecentActivities(studentId, 50),
        staleTime: 1000 * 60 * 5,
    })

    if (isLoading) {
        return (
            <Stack align="center" justify="center" padding={STORE_TOKENS.PADDING.SECTION} fullWidth>
                <Icon icon={Loader2} color={STORE_TOKENS.COLORS.BRAND} size="xl" spin />
            </Stack>
        );
    }

    return <StudentRecentActivities activities={recentActivities} />
}
