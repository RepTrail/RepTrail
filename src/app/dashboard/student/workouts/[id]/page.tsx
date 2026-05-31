import { actions, dehydrate, HydrationBoundary } from "@/lib/dal"
import { notFound, redirect } from "next/navigation"
import { getQueryClient } from '@/lib/get-query-client'
import { QUERY_KEYS } from '@/lib/query-keys'
import { WorkoutBuilderSmart } from "@/components/store/advanced/workout-builder-smart"
import { RegistryMain } from "@/components/store/advanced/registry-main"
import { headers } from "next/headers"

export default async function StudentWorkoutPage({
    params,
}: {
    params: { id: string }
}) {
    const { id } = await params
    const headerList = await headers()
    const userId = headerList.get('x-user-id')
    if (!userId) redirect('/auth/login')

    const queryClient = getQueryClient()

    // 1. Prefetch Workout Details
    await queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.workouts.detail(id),
        queryFn: () => actions.getWorkoutDetails(id)
    })

    const workout = queryClient.getQueryData(QUERY_KEYS.workouts.detail(id)) as any
    if (!workout) return notFound()

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <RegistryMain
                title={workout.name.toUpperCase()}
                subtitle={workout.description || "Importado via PDF"}
                icon="Dumbbell"
                contextLabel="Treinos & Performance"
                showTabs={false}
                showHeader={false}
            >
                <WorkoutBuilderSmart 
                    workout={workout}
                    backHref="/dashboard/student"
                    canAssign={false}
                    showAssignmentBadge={false}
                    contextLabel="Treinos & Performance"
                    icon="Dumbbell"
                    contextColor="orange"
                />
            </RegistryMain>
        </HydrationBoundary>
    )
}
