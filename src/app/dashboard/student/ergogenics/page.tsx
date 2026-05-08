import { createClient } from '@/lib/supabase/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getStudentErgogenics, getErgogenicLogs } from '@/actions/ergogenics-actions'
import { getStudentProfile, getStudentTrainer } from '@/actions/student-actions'
import { ErgogenicsPageClient } from '@/components/feature/student/ergogenics-page-client'
import { redirect } from 'next/navigation'

export default async function ErgogenicsPage() {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const queryClient = getQueryClient()

    // 1. Prefetch core student data
    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.student.details(user.id),
            queryFn: () => getStudentProfile(user.id)
        }),
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.profile.trainer(user.id),
            queryFn: () => getStudentTrainer(user.id)
        })
    ])

    // Verify if steroid_use is enabled (Data is already prefetched above)
    const profile = queryClient.getQueryData<any>(QUERY_KEYS.student.details(user.id))
    if (!profile?.details?.steroid_use) {
        redirect('/dashboard/student')
    }

    // 2. Prefetch Ergogenics specific data
    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.ergogenics.all(user.id),
            queryFn: () => getStudentErgogenics(user.id)
        }),
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.ergogenics.logs(user.id),
            queryFn: () => getErgogenicLogs(user.id)
        })
    ])

    return (
        <div className=" mx-auto" suppressHydrationWarning>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <ErgogenicsPageClient userId={user.id} />
            </HydrationBoundary>
        </div>
    )
}
