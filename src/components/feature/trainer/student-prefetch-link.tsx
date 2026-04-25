'use client'

import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getStudentRelationship } from '@/actions/trainer-actions'
import { getStudentWorkoutHistory, getStudentRecentActivities } from '@/actions/log-actions'
import { getStudentMetricsHistory } from '@/actions/metrics-actions'
import { getStudentAdherenceHistory } from '@/actions/tracking-actions'
import { ReactNode } from 'react'

interface StudentPrefetchLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    relationshipId: string
    studentId: string
    href: string
    children: ReactNode
}

export function StudentPrefetchLink({ 
    relationshipId, 
    studentId, 
    href, 
    children, 
    className,
    ...props
}: StudentPrefetchLinkProps) {
    const queryClient = useQueryClient()

    const handlePrefetch = async () => {
        // Prefetch core relationship and student profile
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.trainer.studentDetail(relationshipId),
            queryFn: () => getStudentRelationship(relationshipId),
            staleTime: 1000 * 60 * 5, // 5 minutes
        })

        // Prefetch history and logs
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.trainer.studentHistory(studentId),
            queryFn: () => getStudentWorkoutHistory(studentId),
            staleTime: 1000 * 60 * 5,
        })

        // Prefetch metrics
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.trainer.studentMetrics(studentId),
            queryFn: () => getStudentMetricsHistory(studentId),
            staleTime: 1000 * 60 * 5,
        })

        // Prefetch adherence (30 days)
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.trainer.studentAdherence(studentId),
            queryFn: () => getStudentAdherenceHistory(studentId, 30),
            staleTime: 1000 * 60 * 5,
        })
    }

    return (
        <Link 
            href={href} 
            className={className}
            onMouseEnter={handlePrefetch}
            onTouchStart={handlePrefetch}
            {...props}
        >
            {children}
        </Link>
    )
}
