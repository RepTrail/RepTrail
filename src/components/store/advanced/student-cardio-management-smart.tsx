'use client'
import { Icon } from '@/components/store/base/icon'
import { Inline } from '@/components/store/base/layout'
import { Font } from '@/components/store/base/font'
import { LayoutDashboard } from 'lucide-react'

import React from 'react'
import { useQuery } from '@/lib/dal'
import { QUERY_KEYS } from '@/lib/query-keys'
import { actions } from '@/lib/dal'
import { useRealtimeSync } from '@/hooks/use-realtime-sync'
import { CardioManagementSectionContent } from '@/components/store/sections/cardio-management-section-content'
import { Stack } from '@/components/store/base/stack'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Grid } from '@/components/store/base/grid'

interface StudentCardioManagementSmartProps {
    userId: string
}

export function StudentCardioManagementSmart({ userId }: StudentCardioManagementSmartProps) {
    // 1. Data Fetching
    const { data: profile } = useQuery({
        queryKey: QUERY_KEYS.student.details(userId),
        queryFn: () => actions.getStudentProfile(userId),
        staleTime: 1000 * 60 * 5
    })

    const { data: trainerLink } = useQuery({
        queryKey: QUERY_KEYS.profile.trainer(userId),
        queryFn: () => actions.getStudentTrainer(userId),
        staleTime: 1000 * 60 * 5
    })

    const { data: assignments = [] } = useQuery({
        queryKey: QUERY_KEYS.cardio.all(userId),
        queryFn: () => actions.getStudentCardioAssignments(userId),
        staleTime: 1000 * 60 * 5
    })

    const isAutoTrainingActive = profile?.auto_training_status === 'active' || profile?.auto_training_status === 'trial'
    const isAutoMode = isAutoTrainingActive

    const { data: libraryCardios = [] } = useQuery({
        queryKey: QUERY_KEYS.cardio.library(userId),
        queryFn: () => actions.getCardioLibrary(userId),
        enabled: isAutoMode,
        staleTime: 1000 * 60 * 5
    })

    // 2. Realtime Sync
    useRealtimeSync({
        table: 'assigned_cardios',
        queryKey: QUERY_KEYS.cardio.all(userId),
        filter: `student_id=eq.${userId}`
    })

    useRealtimeSync({
        table: 'cardios',
        queryKey: QUERY_KEYS.cardio.library(userId),
        filter: `trainer_id=eq.${userId}`
    })

    // 3. Logic: Group assignments and determine display data
    let displayCardios = []
    
    if (isAutoMode) {
        const assignmentsByCardio = assignments.reduce((acc: any, curr: any) => {
            const cId = curr.cardio_id
            if (!cId) return acc
            if (!acc[cId]) acc[cId] = []
            
            if (curr.days_of_week && Array.isArray(curr.days_of_week)) {
                curr.days_of_week.forEach((d: number) => {
                    if (!acc[cId].includes(d)) acc[cId].push(d)
                })
            } else if (curr.day_of_week !== null && curr.day_of_week !== undefined) {
                if (!acc[cId].includes(curr.day_of_week)) acc[cId].push(curr.day_of_week)
            }
            return acc
        }, {})

        displayCardios = libraryCardios.map(c => ({
            ...c,
            assigned_cardios: (assignmentsByCardio[c.id] || []).map((d: number) => ({ day_of_week: d }))
        }))
    } else {
        const grouped = assignments.reduce((acc: any, curr: any) => {
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
        displayCardios = Object.values(grouped)
    }

    return (
        <Grid cols={{ base: 1, md: 12 }} gap={STORE_TOKENS.SPACING.SECTION} fullWidth flex1>
            {/* Cardio Management */}
            <Stack mdColSpan={12} flex1 gap={STORE_TOKENS.SPACING.SECTION}>
                <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
            <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Icon icon={LayoutDashboard} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                        <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>{"Section"}</Font>
                    </Inline>
                    
                </Stack>
            </Stack>
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                    <CardioManagementSectionContent 
                        userId={userId}
                        cardios={displayCardios}
                        mode={isAutoMode ? 'auto' : 'personal'}
                    />
                  </Stack>
        </Stack>
            </Stack>
        </Grid>
    )
}

