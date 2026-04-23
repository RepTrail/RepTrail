import { getDietDetails } from "@/actions/diet-actions"
import { notFound } from "next/navigation"
import { createClient } from '@/lib/supabase/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { QUERY_KEYS } from '@/lib/query-keys'
import { StudentDietDetailClient } from "@/components/feature/student/diet-detail-client"

export default async function StudentDietEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return notFound()

    const { data: profile } = await supabase
        .from('profiles')
        .select('auto_training_status')
        .eq('id', user.id)
        .single()

    const isAutoTrainingActive = profile?.auto_training_status === 'active' || profile?.auto_training_status === 'trial'
    if (!isAutoTrainingActive) return notFound()

    const queryClient = getQueryClient()

    // 1. Prefetch Diet Details
    await queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.diets.detail(id),
        queryFn: () => getDietDetails(id)
    })

    const diet = queryClient.getQueryData(QUERY_KEYS.diets.detail(id))
    if (!diet) return notFound()

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 py-8" suppressHydrationWarning>
                <StudentDietDetailClient 
                    dietId={id} 
                    userId={user.id} 
                    initialData={diet} 
                />
            </div>
        </HydrationBoundary>
    )
}
