'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getStudentTrainer } from '@/actions/student-actions'
import { Button } from '@/components/store/base/button'
import { Icon } from '@/components/store/base/icon'
import { Stack } from '@/components/store/base/stack'
import { FileUp, Plus, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { QUERY_KEYS } from '@/lib/query-keys'

export type RegistryActionType = 'workout' | 'cardio' | 'diet' | 'ergogenic'

interface StudentRegistryHeaderActionsProps {
    userId: string
    type: RegistryActionType
}

export function StudentRegistryHeaderActions({ userId, type }: StudentRegistryHeaderActionsProps) {
    const router = useRouter()
    const [isPending, startTransition] = React.useTransition()

    const { data: trainerLink } = useQuery({
        queryKey: QUERY_KEYS.profile.trainer(userId),
        queryFn: () => getStudentTrainer(userId),
        staleTime: 1000 * 60 * 5
    })
    
    const isAutoMode = !trainerLink

    const handleCreateWorkout = () => {
        startTransition(async () => {
            try {
                const { createStudentWorkout } = await import('@/actions/student-content-actions')
                const fd = new FormData()
                fd.append('name', 'Novo Treino')
                const res = await createStudentWorkout(fd)
                if (res?.success && res.workoutId) {
                    router.push(`/dashboard/student/workouts/${res.workoutId}`)
                }
            } catch (err) {
                console.error(err)
            }
        })
    }

    const handleCreateDiet = () => {
        startTransition(async () => {
            try {
                const { createStudentDiet } = await import('@/actions/student-content-actions')
                const fd = new FormData()
                fd.append('name', 'Nova Dieta')
                const res = await createStudentDiet(fd)
                if (res?.success && res.dietId) {
                    router.push(`/dashboard/student/diet/${res.dietId}`)
                }
            } catch (err) {
                console.error(err)
            }
        })
    }

    if (!isAutoMode) return null

    switch (type) {
        case 'workout':
            return (
                <Stack direction={{ base: 'col', lg: 'row' }} align={{ base: 'stretch', lg: 'center' }} gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                    <Button variant="outline-emerald" asChild shine fullWidth={{ base: true, lg: false }}>
                        <Link href="/dashboard/student/import-pdf">
                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Icon icon={FileUp} size="xs" />
                                Importar PDF
                            </Stack>
                        </Link>
                    </Button>
                    <Button variant="outline-orange" shine fullWidth={{ base: true, lg: false }} onClick={handleCreateWorkout} disabled={isPending}>
                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            {isPending ? <Icon icon={Loader2} size="xs" color="orange" spin /> : <Icon icon={Plus} size="xs" color="orange" />}
                            {isPending ? 'Criando...' : 'Criar Modelo'}
                        </Stack>
                    </Button>
                </Stack>
            );
        case 'diet':
            return (
                <Stack direction={{ base: 'col', lg: 'row' }} align={{ base: 'stretch', lg: 'center' }} gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                    <Button variant="outline-emerald" asChild shine fullWidth={{ base: true, lg: false }}>
                        <Link href="/dashboard/student/import-pdf">
                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Icon icon={FileUp} size="xs" />
                                Importar PDF
                            </Stack>
                        </Link>
                    </Button>
                    <Button variant="outline-primary" shine fullWidth={{ base: true, lg: false }} onClick={handleCreateDiet} disabled={isPending}>
                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            {isPending ? <Icon icon={Loader2} size="xs" color="primary" spin /> : <Icon icon={Plus} size="xs" color="primary" />}
                            {isPending ? 'Criando...' : 'Criar Modelo'}
                        </Stack>
                    </Button>
                </Stack>
            );
        case 'cardio':
            return (
                <Stack direction={{ base: 'col', lg: 'row' }} align={{ base: 'stretch', lg: 'center' }} gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                    <Button variant="outline-emerald" asChild shine fullWidth={{ base: true, lg: false }}>
                        <Link href="/dashboard/student/import-pdf">
                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Icon icon={FileUp} size="xs" />
                                Importar PDF
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
                            Criar Modelo
                        </Stack>
                    </Button>
                </Stack>
            );
        case 'ergogenic':
            return (
                <Stack direction={{ base: 'col', lg: 'row' }} align={{ base: 'stretch', lg: 'center' }} gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                    <Button variant="outline-emerald" asChild shine fullWidth={{ base: true, lg: false }}>
                        <Link href="/dashboard/student/import-pdf">
                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Icon icon={FileUp} size="xs" />
                                Importar PDF
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
                            Adicionar Substância
                        </Stack>
                    </Button>
                </Stack>
            );
        default:
            return null
    }
}
