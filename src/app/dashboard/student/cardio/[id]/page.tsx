import { getCardioDetails } from '@/actions/cardio-actions'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { QUERY_KEYS } from '@/lib/query-keys'
import { StudentCardioDetailClient } from "@/components/store/features(deprecated)/student-cardio-detail-client"

interface Props {
    params: Promise<{ id: string }>
}

export default async function StudentCardioDetailPage({ params }: Props) {
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

    // 1. Prefetch Cardio Details
    await queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.cardio.detail(id),
        queryFn: () => getCardioDetails(id)
    })

    const cardio = queryClient.getQueryData(QUERY_KEYS.cardio.detail(id))
    if (!cardio || (cardio as any).trainer_id !== user.id) return notFound()

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="max-w-3xl mx-auto py-6 space-y-8">
                <StudentCardioDetailClient 
                    cardioId={id} 
                    userId={user.id} 
                    initialData={cardio} 
                />
            </div>
        </HydrationBoundary>
    )
}
