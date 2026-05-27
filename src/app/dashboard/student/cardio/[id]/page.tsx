import { getCardioDetails } from '@/actions/cardio-actions'
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { QUERY_KEYS } from '@/lib/query-keys'
import { CardioBuilderSmart } from "@/components/store/advanced/cardio-builder-smart"
import { RegistryMain } from "@/components/store/advanced/registry-main"
import { headers } from 'next/headers'

interface Props {
    params: Promise<{ id: string }>
}

export default async function StudentCardioDetailPage({ params }: Props) {
    const { id } = await params

    const headerList = await headers()
    const userId = headerList.get('x-user-id')
    if (!userId) redirect('/auth/login')

    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

    const { data: profile } = await supabase
        .from('profiles')
        .select('auto_training_status')
        .eq('id', userId)
        .single()

    const isAutoTrainingActive = profile?.auto_training_status === 'active' || profile?.auto_training_status === 'trial'
    if (!isAutoTrainingActive) return notFound()

    const queryClient = getQueryClient()

    // 1. Prefetch Cardio Details
    await queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.cardio.detail(id),
        queryFn: () => getCardioDetails(id)
    })

    const cardio = queryClient.getQueryData(QUERY_KEYS.cardio.detail(id)) as any
    if (!cardio || cardio.trainer_id !== userId) return notFound()

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <RegistryMain
                title={cardio.name.toUpperCase()}
                subtitle={cardio.description || "Protocolo de Cardio"}
                icon="Flame"
                contextLabel="Condicionamento & Saúde"
                showTabs={false}
                showHeader={false}
            >
                <CardioBuilderSmart 
                    cardio={cardio}
                    backHref="/dashboard/student/cardio"
                    contextLabel="Condicionamento & Saúde"
                    icon="Flame"
                    contextColor="orange"
                />
            </RegistryMain>
        </HydrationBoundary>
    )
}
