'use client'

import { useQuery } from '@/lib/dal'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getStudentRelationship } from '@/lib/dal/remote'
import { WorkoutManagementList } from '@/components/store/advanced/workout-management-list'
import { DietManagementList } from '@/components/store/advanced/diet-management-list'
import { CardioManagementList } from '@/components/store/advanced/cardio-management-list'
import { Stack } from '@/components/store/base/stack'
import { Icon } from '@/components/store/base/icon'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Loader2 } from 'lucide-react'

interface ProtocolContentProps {
    relationshipId: string
    studentId: string
}

export function TrainerStudentWorkoutsContent({ relationshipId, studentId }: ProtocolContentProps) {
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

    const groupedWorkouts = (relationship.student.assigned_workouts || []).reduce((acc: any, curr: any) => {
        const wId = curr.workout?.id
        if (!wId) return acc
        if (!acc[wId]) acc[wId] = { ...curr.workout, assigned_workouts: [] }
        acc[wId].assigned_workouts.push({ day_of_week: curr.day_of_week })
        return acc
    }, {})

    return <WorkoutManagementList userId={studentId} workouts={Object.values(groupedWorkouts)} mode="trainer" />
}

export function TrainerStudentDietsContent({ relationshipId, studentId }: ProtocolContentProps) {
    const { data: relationship, isLoading } = useQuery({
        queryKey: QUERY_KEYS.trainer.studentDetail(relationshipId),
        queryFn: () => getStudentRelationship(relationshipId),
        staleTime: 1000 * 60 * 5,
    })

    if (isLoading || !relationship || !relationship.student) return null

    const groupedDiets = (relationship.student.assigned_diets || []).reduce((acc: any, curr: any) => {
        const dId = curr.diet_id || curr.diet?.id
        if (!dId) return acc
        if (!acc[dId]) acc[dId] = { ...(curr.diet || curr), assigned_diets: [] }
        if (curr.days_of_week) {
            const days = Array.isArray(curr.days_of_week) ? curr.days_of_week : []
            acc[dId].assigned_diets.push(...days.map((d: number) => ({ day_of_week: d })))
        }
        return acc
    }, {})

    return <DietManagementList userId={studentId} diets={Object.values(groupedDiets)} mode="trainer" />
}

export function TrainerStudentCardioContent({ relationshipId, studentId }: ProtocolContentProps) {
    const { data: relationship, isLoading } = useQuery({
        queryKey: QUERY_KEYS.trainer.studentDetail(relationshipId),
        queryFn: () => getStudentRelationship(relationshipId),
        staleTime: 1000 * 60 * 5,
    })

    if (isLoading || !relationship || !relationship.student) return null

    const groupedCardios = (relationship.student.assigned_cardios || []).reduce((acc: any, curr: any) => {
        const cId = curr.cardio_id || curr.id
        if (!cId) return acc
        if (!acc[cId]) acc[cId] = { ...(curr.cardio || curr), assigned_cardios: [] }
        const addDay = (d: number) => {
            if (!acc[cId].assigned_cardios.some((a: any) => a.day_of_week === d)) {
                acc[cId].assigned_cardios.push({ day_of_week: d })
            }
        }
        if (curr.days_of_week && Array.isArray(curr.days_of_week)) curr.days_of_week.forEach(addDay)
        else if (curr.day_of_week !== null && curr.day_of_week !== undefined) addDay(curr.day_of_week)
        return acc
    }, {})

    return <CardioManagementList userId={studentId} cardios={Object.values(groupedCardios)} mode="trainer" />
}
