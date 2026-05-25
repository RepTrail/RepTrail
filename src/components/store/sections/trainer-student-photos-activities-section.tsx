'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getStudentRelationship } from '@/actions/trainer-actions'
import { getStudentRecentActivities } from '@/actions/log-actions'
import { StudentPublicPhotos } from '@/components/store/advanced/student-public-photos'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { StudentRecentActivities } from '@/components/store/advanced/student-recent-activities'
import { Stack } from '@/components/store/base/stack'
import { Icon } from '@/components/store/base/icon'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Activity, Loader2 } from 'lucide-react'

interface TrainerStudentPhotosActivitiesSectionProps {
    relationshipId: string
    studentId: string
}

export function TrainerStudentPhotosActivitiesSection({
    relationshipId,
    studentId,
}: TrainerStudentPhotosActivitiesSectionProps) {
    const { data: relationship, isLoading: isRelLoading } = useQuery({
        queryKey: QUERY_KEYS.trainer.studentDetail(relationshipId),
        queryFn: () => getStudentRelationship(relationshipId),
        staleTime: 1000 * 60 * 5,
    })

    const { data: recentActivities = [], isLoading: isActLoading } = useQuery({
        queryKey: ['student-recent-activities', studentId],
        queryFn: () => getStudentRecentActivities(studentId, 50),
        staleTime: 1000 * 60 * 5,
    })

    if (isRelLoading || isActLoading || !relationship || !relationship.student) {
        return (
            <Stack align="center" justify="center" padding={STORE_TOKENS.PADDING.SECTION} fullWidth>
                <Icon icon={Loader2} color="primary" size="xl" spin />
            </Stack>
        )
    }

    const student = relationship.student

    return (
        <Stack gap={STORE_TOKENS.SPACING.SECTION} fullWidth>
            <StudentPublicPhotos
                studentId={studentId}
                isOwner={false}
                studentName={student.full_name}
                photos={student.progress_photos || []}
                isStudentView={false}
            />
            <RegistrySection
                title="Atividades Recentes"
                subtitle="Histórico cronológico detalhado das últimas ações e logs de treinamento registrados pelo aluno."
                icon={Activity}
            >
                <StudentRecentActivities activities={recentActivities} />
            </RegistrySection>
        </Stack>
    )
}
