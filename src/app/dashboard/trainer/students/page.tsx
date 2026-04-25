import { PREFETCH_REGISTRY } from '@/lib/prefetch-registry'
import { createClient } from '@/lib/supabase/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { TrainerStudentsClient } from '@/components/feature/trainer/trainer-students-client'

export default async function StudentsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const queryClient = getQueryClient()

    // ─── NON-BLOCKING PREFETCHING (0ms Nav) ─────────────────────────────
    const configs = PREFETCH_REGISTRY['/dashboard/trainer/students'](user.id)
    await Promise.all(configs.map(c => queryClient.prefetchQuery(c)))

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <TrainerStudentsClient userId={user.id} />
        </HydrationBoundary>
    )
}
