'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getStudentChartData } from '@/actions/metrics-actions'
import { getStudentAdherenceHistory } from '@/actions/tracking-actions'
import { StudentPublicMetrics } from '@/components/store/advanced/student-public-metrics'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Stack } from '@/components/store/base/stack'
import { Icon } from '@/components/store/base/icon'
import { Loader2 } from 'lucide-react'

interface TrainerStudentEvolutionSectionProps {
    studentId: string
    studentDetails: any
}

export function TrainerStudentEvolutionSection({
    studentId,
    studentDetails,
}: TrainerStudentEvolutionSectionProps) {
    const { data: chartData, isLoading: isChartLoading } = useQuery({
        queryKey: QUERY_KEYS.trainer.studentChartData(studentId),
        queryFn: () => getStudentChartData(studentId),
        staleTime: 1000 * 60 * 5,
    })

    const { data: adherenceHistory = [], isLoading: isAdherenceLoading } = useQuery({
        queryKey: QUERY_KEYS.trainer.studentAdherence(studentId),
        queryFn: () => getStudentAdherenceHistory(studentId, 30),
        staleTime: 1000 * 60 * 5,
    })

    if (isChartLoading || isAdherenceLoading) {
        return (
            <Stack align="center" justify="center" padding={STORE_TOKENS.PADDING.SECTION} fullWidth>
                <Icon icon={Loader2} color={STORE_TOKENS.COLORS.BRAND} size="xl" spin />
            </Stack>
        );
    }

    return (
        <StudentPublicMetrics
            fullMetrics={{ ...chartData, details: studentDetails }}
            adherenceHistory={adherenceHistory}
            steroidUse={!!studentDetails?.steroid_use}
        />
    )
}
