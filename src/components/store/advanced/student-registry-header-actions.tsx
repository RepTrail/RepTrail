'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getStudentTrainer } from '@/actions/student-actions'
import { Button } from '@/components/store/base/button'
import { Icon } from '@/components/store/base/icon'
import { Stack } from '@/components/store/base/stack'
import { FileUp, Plus, Activity, FlaskConical } from 'lucide-react'
import Link from 'next/link'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { QUERY_KEYS } from '@/lib/query-keys'

export type RegistryActionType = 'workout' | 'cardio' | 'diet' | 'ergogenic'

interface StudentRegistryHeaderActionsProps {
    userId: string
    type: RegistryActionType
}

export function StudentRegistryHeaderActions({ userId, type }: StudentRegistryHeaderActionsProps) {
    const { data: trainerLink } = useQuery({
        queryKey: QUERY_KEYS.profile.trainer(userId),
        queryFn: () => getStudentTrainer(userId),
        staleTime: 1000 * 60 * 5
    })
    
    const isAutoMode = !trainerLink

    if (!isAutoMode) return null

    switch (type) {
        case 'workout':
            return (
                <Stack direction={{ base: 'col', lg: 'row' }} align={{ base: 'stretch', lg: 'center' }} gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                    <Button variant="outline-emerald" asChild shine fullWidth={{ base: true, lg: false }}>
                        <Link href="/dashboard/student/import-pdf">
                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Icon icon={FileUp} size="xs" />
                                <span>Importar PDF</span>
                            </Stack>
                        </Link>
                    </Button>
                    <Button variant="outline-orange" asChild shine fullWidth={{ base: true, lg: false }}>
                        <Link href="/dashboard/student/workouts/new">
                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Icon icon={Plus} size="xs" />
                                <span>Criar Modelo</span>
                            </Stack>
                        </Link>
                    </Button>
                </Stack>
            )
        case 'diet':
            return (
                <Stack direction={{ base: 'col', lg: 'row' }} align={{ base: 'stretch', lg: 'center' }} gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                    <Button variant="outline-emerald" asChild shine fullWidth={{ base: true, lg: false }}>
                        <Link href="/dashboard/student/import-pdf">
                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Icon icon={FileUp} size="xs" />
                                <span>Importar PDF</span>
                            </Stack>
                        </Link>
                    </Button>
                    <Button 
                        variant="outline-primary" 
                        shine 
                        fullWidth={{ base: true, lg: false }}
                        onClick={() => window.dispatchEvent(new CustomEvent('open-diet-action', { detail: { type: 'create_diet' } }))}
                    >
                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Icon icon={Plus} size="xs" />
                            <span>Criar Modelo</span>
                        </Stack>
                    </Button>
                </Stack>
            )
        case 'cardio':
            return (
                <Stack direction={{ base: 'col', lg: 'row' }} align={{ base: 'stretch', lg: 'center' }} gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                    <Button variant="outline-emerald" asChild shine fullWidth={{ base: true, lg: false }}>
                        <Link href="/dashboard/student/import-pdf">
                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Icon icon={FileUp} size="xs" />
                                <span>Importar PDF</span>
                            </Stack>
                        </Link>
                    </Button>
                    <Button 
                        variant="outline-orange" 
                        shine 
                        fullWidth={{ base: true, lg: false }}
                        onClick={() => {
                            window.dispatchEvent(new CustomEvent('open-cardio-action', { detail: { type: 'create_cardio' } }))
                        }}
                    >
                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Icon icon={Plus} size="xs" />
                            <span>Criar Modelo</span>
                        </Stack>
                    </Button>
                </Stack>
            )
        case 'ergogenic':
            return (
                <Stack direction={{ base: 'col', lg: 'row' }} align={{ base: 'stretch', lg: 'center' }} gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                    <Button variant="outline-emerald" asChild shine fullWidth={{ base: true, lg: false }}>
                        <Link href="/dashboard/student/import-pdf">
                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Icon icon={FileUp} size="xs" />
                                <span>Importar PDF</span>
                            </Stack>
                        </Link>
                    </Button>
                    <Button 
                        variant="outline-primary" 
                        shine 
                        fullWidth={{ base: true, lg: false }}
                        onClick={() => {
                            window.dispatchEvent(new CustomEvent('open-ergogenic-action', { detail: { type: 'create_ergogenic' } }))
                        }}
                    >
                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Icon icon={Plus} size="xs" />
                            <span>Adicionar Substância</span>
                        </Stack>
                    </Button>
                </Stack>
            )
        default:
            return null
    }
}
