import { getTrainerStudents, getTrainerProfile, getTrainerRanking } from '@/actions/trainer-actions'
import { createClient } from '@/lib/supabase/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { QUERY_KEYS } from '@/lib/query-keys'
import { TrainerStudentsClient } from '@/components/feature/trainer/trainer-students-client'

export default async function StudentsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const queryClient = getQueryClient()

    // ─── NON-BLOCKING PREFETCHING (0ms Nav) ─────────────────────────────
    queryClient.prefetchQuery({ 
        queryKey: QUERY_KEYS.profile.detail(user.id), 
        queryFn: getTrainerProfile 
    })
    queryClient.prefetchQuery({ 
        queryKey: QUERY_KEYS.trainer.ranking(), 
        queryFn: getTrainerRanking 
    })
    queryClient.prefetchQuery({ 
        queryKey: QUERY_KEYS.trainer.students(user.id), 
        queryFn: getTrainerStudents 
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <TrainerStudentsClient userId={user.id} />
        </HydrationBoundary>
    )
}
