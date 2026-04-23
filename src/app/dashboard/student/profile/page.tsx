import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getQueryClient } from '@/lib/get-query-client'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getStudentProfile, getStudentTrainer } from '@/actions/student-actions'
import { StudentProfileClient } from '@/components/feature/student/student-profile-client'

export const revalidate = 0

export default async function StudentProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const queryClient = getQueryClient()

    // Non-blocking background warming
    void queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.student.details(user.id),
        queryFn: () => getStudentProfile(user.id)
    })

    void queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.profile.trainer(user.id),
        queryFn: () => getStudentTrainer(user.id)
    })


    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={null}>
                <StudentProfileClient userId={user.id} />
            </Suspense>
        </HydrationBoundary>
    )
}

