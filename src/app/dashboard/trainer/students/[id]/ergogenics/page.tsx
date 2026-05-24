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
            <div className="p-10 text-center text-zinc-500 font-bold uppercase tracking-widest text-xs">
                Dados não encontrados ou você não tem acesso a este aluno.
            </div>
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
                <div className="animate-pulse space-y-10">
                    <div className="h-8 w-40 bg-zinc-900 rounded-lg" />
                    <div className="h-[120px] bg-zinc-900 rounded-[2.5rem]" />
                    <div className="h-[400px] bg-zinc-900 rounded-[2.5rem]" />
                </div>
            }
        >
            <div suppressHydrationWarning>
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <TrainerStudentErgogenicsShell
                        effectiveStudentId={effectiveStudentId}
                        studentName={studentName}
                        betaTesterMode={betaTesterMode}
                    />
                </HydrationBoundary>
            </div>
        </Suspense>
    )
}
