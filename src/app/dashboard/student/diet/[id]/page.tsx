import { getDietDetails } from "@/actions/diet-actions"
import { notFound, redirect } from "next/navigation"
import { createClient } from '@/lib/supabase/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { QUERY_KEYS } from '@/lib/query-keys'
import { StudentDietDetailClient } from "@/components/store/features(deprecated)/student-diet-detail-client"
import { RegistryMain } from "@/components/store/advanced/registry-main"
import { headers } from "next/headers"

export default async function StudentDietEditPage({ params }: { params: Promise<{ id: string }> }) {
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

    // 1. Prefetch Diet Details
    await queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.diets.detail(id),
        queryFn: () => getDietDetails(id)
    })

    const diet = queryClient.getQueryData(QUERY_KEYS.diets.detail(id)) as any
    if (!diet) return notFound()

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <RegistryMain
                title={`Protocolo Alimentar - ${diet.name}`}
                subtitle={diet.description || "Criador de Dieta Automático"}
                icon="Utensils"
                contextLabel="Dieta & Nutrição"
                showTabs={false}
                showHeader={false}
            >
                <StudentDietDetailClient 
                    dietId={id} 
                    userId={userId} 
                    initialData={diet} 
                />
            </RegistryMain>
        </HydrationBoundary>
    )
}
