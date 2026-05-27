import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getBetaTesterMode } from '@/actions/app-settings-actions'
import { getStudentRelationship } from '@/actions/trainer-actions'
import { getStudentErgogenics } from '@/actions/ergogenics-actions'
import { getQueryClient } from '@/lib/get-query-client'
import { QUERY_KEYS } from '@/lib/query-keys'
import { TrainerStudentErgogenicsShell } from '@/components/store/advanced/trainer-student-ergogenics-shell'

import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Surface } from '@/components/store/base/surface'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

export const metadata = {
    title: 'Ergogênicos & Ciclos | RepTrail',
}

export default async function StudentErgogenicsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: relationshipId } = await params
    const headerList = await headers()
    const trainerId = headerList.get('x-user-id')

    if (!trainerId) redirect('/auth/login')

    const relationship = await getStudentRelationship(relationshipId)

    if (!relationship) {
        return (
            <Box fullWidth padding={STORE_TOKENS.PADDING.CONTAINER} textAlign="center">
                <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="bold">
                    Dados não encontrados ou você não tem acesso a este aluno.
                </Font>
            </Box>
        )
    }

    const effectiveStudentId = relationship.student_id
    const studentName = relationship.student?.full_name || 'Aluno'

    const [queryClient, betaTesterMode] = await Promise.all([
        (async () => {
            const qc = getQueryClient()
            await qc.prefetchQuery({
                queryKey: QUERY_KEYS.ergogenics.all(effectiveStudentId),
                queryFn: async () => {
                    const res = await getStudentErgogenics(effectiveStudentId)
                    return Array.isArray(res) ? res : []
                },
                staleTime: 1000 * 30,
            })
            return qc
        })(),
        getBetaTesterMode(),
    ])

    return (
        <Suspense
            fallback={
                <Surface animation="pulse" variant="sunken" border="none" gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Box bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.SURFACE} {...{ width: 160, height: 32 }} rounded={STORE_TOKENS.RADIUS.SYSTEM} />
                    <Box bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.SURFACE} height={120} rounded={STORE_TOKENS.RADIUS.SYSTEM} />
                    <Box bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.SURFACE} height={400} rounded={STORE_TOKENS.RADIUS.SYSTEM} />
                </Surface>
            }
        >
            <Box suppressHydrationWarning>
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <TrainerStudentErgogenicsShell
                        effectiveStudentId={effectiveStudentId}
                        studentName={studentName}
                        betaTesterMode={betaTesterMode}
                    />
                </HydrationBoundary>
            </Box>
        </Suspense>
    )
}
