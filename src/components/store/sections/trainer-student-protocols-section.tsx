'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getStudentRelationship } from '@/actions/trainer-actions'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { WorkoutManagementSectionContent } from '@/components/store/sections/workout-management-section-content'
import { DietManagementSectionContent } from '@/components/store/sections/diet-management-section-content'
import { CardioManagementSectionContent } from '@/components/store/sections/cardio-management-section-content'
import { TrainerStudentErgogenicsSmart } from '@/components/store/advanced/trainer-student-ergogenics-smart'
import { TrainerRegistryHeaderActions } from '@/components/store/advanced/trainer-registry-header-actions'
import { Stack } from '@/components/store/base/stack'
import { Icon } from '@/components/store/base/icon'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Dumbbell, Utensils, Activity, Loader2 } from 'lucide-react'

interface TrainerStudentProtocolsSectionProps {
    relationshipId: string
    studentId: string
    trainerId: string
}

export function TrainerStudentProtocolsSection({
    relationshipId,
    studentId,
    trainerId,
}: TrainerStudentProtocolsSectionProps) {
    const { data: relationship, isLoading } = useQuery({
        queryKey: QUERY_KEYS.trainer.studentDetail(relationshipId),
        queryFn: () => getStudentRelationship(relationshipId),
        staleTime: 1000 * 60 * 5,
    })

    if (isLoading || !relationship || !relationship.student) {
        return (
            <Stack align="center" justify="center" padding={STORE_TOKENS.PADDING.SECTION} fullWidth>
                <Icon icon={Loader2} color="primary" size="xl" spin />
            </Stack>
        )
    }

    const student = relationship.student

    // 1. Grouping Workouts
    const groupedWorkouts = (student.assigned_workouts || []).reduce((acc: any, curr: any) => {
        const wId = curr.workout?.id
        if (!wId) return acc
        if (!acc[wId]) {
            acc[wId] = {
                ...curr.workout,
                assigned_workouts: []
            }
        }
        acc[wId].assigned_workouts.push({ day_of_week: curr.day_of_week })
        return acc
    }, {})
    const displayWorkouts = Object.values(groupedWorkouts)

    // 2. Grouping Diets
    const groupedDiets = (student.assigned_diets || []).reduce((acc: any, curr: any) => {
        const dId = curr.diet_id || curr.diet?.id
        if (!dId) return acc
        if (!acc[dId]) {
            acc[dId] = {
                ...(curr.diet || curr),
                assigned_diets: []
            }
        }
        if (curr.days_of_week) {
            const days = Array.isArray(curr.days_of_week) ? curr.days_of_week : []
            acc[dId].assigned_diets.push(...days.map((d: number) => ({ day_of_week: d })))
        }
        return acc
    }, {})
    const displayDiets = Object.values(groupedDiets)

    // 3. Grouping Cardio
    const groupedCardios = (student.assigned_cardios || []).reduce((acc: any, curr: any) => {
        const cId = curr.cardio_id || curr.id
        if (!cId) return acc
        if (!acc[cId]) {
            acc[cId] = {
                ...(curr.cardio || curr),
                assigned_cardios: []
            }
        }
        const addDay = (d: number) => {
            if (!acc[cId].assigned_cardios.some((a: any) => a.day_of_week === d)) {
                acc[cId].assigned_cardios.push({ day_of_week: d })
            }
        }
        if (curr.days_of_week && Array.isArray(curr.days_of_week)) {
            curr.days_of_week.forEach((d: number) => addDay(d))
        } else if (curr.day_of_week !== null && curr.day_of_week !== undefined) {
            addDay(curr.day_of_week)
        }
        return acc
    }, {})
    const displayCardios = Object.values(groupedCardios)

    return (
        <Stack gap={STORE_TOKENS.SPACING.SECTION} fullWidth>
            <RegistrySection
                title="Treinamentos de Força"
                subtitle="Visualize, organize e prescreva os templates de treinamento de força ativos para o aluno."
                icon={Dumbbell}
                rightElement={
                    <TrainerRegistryHeaderActions
                        userId={trainerId}
                        variant="workout"
                        betaTesterMode={false}
                        hideImportPdf={true}
                    />
                }
            >
                <WorkoutManagementSectionContent
                    userId={studentId}
                    workouts={displayWorkouts}
                    mode="trainer"
                />
            </RegistrySection>

            <RegistrySection
                title="Protocolos Alimentares"
                subtitle="Planeje e gerencie as refeições, calorias e macros da rotina alimentar do aluno."
                icon={Utensils}
                rightElement={
                    <TrainerRegistryHeaderActions
                        userId={trainerId}
                        variant="diet"
                        betaTesterMode={false}
                        hideImportPdf={true}
                    />
                }
            >
                <DietManagementSectionContent
                    userId={studentId}
                    diets={displayDiets}
                    mode="trainer"
                />
            </RegistrySection>

            <RegistrySection
                title="Atividades Cardiorrespiratórias"
                subtitle="Defina metas de cardio, frequências semanais e intensidades sugeridas."
                icon={Activity}
                rightElement={
                    <TrainerRegistryHeaderActions
                        userId={trainerId}
                        variant="cardio"
                        betaTesterMode={false}
                        hideImportPdf={true}
                    />
                }
            >
                <CardioManagementSectionContent
                    userId={studentId}
                    cardios={displayCardios}
                    mode="trainer"
                />
            </RegistrySection>

            <TrainerStudentErgogenicsSmart effectiveStudentId={studentId} />
        </Stack>
    )
}
