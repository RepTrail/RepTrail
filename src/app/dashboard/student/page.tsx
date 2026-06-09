import { headers } from 'next/headers'
import { Suspense } from 'react'
import { dehydrate, HydrationBoundary } from '@/lib/dal'
import { actions } from '@/lib/dal/server'
import { StudentMetaPixel } from './meta-pixel'
import { getQueryClient } from '@/lib/get-query-client'
import { QUERY_KEYS } from '@/lib/query-keys'
import { StudentDashboardClient } from '@/components/store/advanced/student-dashboard-client'
import { InactiveTrainerCard } from '@/components/store/advanced/inactive-trainer-card'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { StudentNoPlanSection } from '@/components/store/sections/student-no-plan-section'

export default async function StudentDashboardPage() {
    // ─── OPTIMIZED IDENTITY (0ms) ──────────────────────────────────────────
    const headerList = await headers()
    const userId = headerList.get('x-user-id')

    if (!userId) return null

    return (
        <Suspense fallback={null}>
            <StudentDashboardContent userId={userId} />
        </Suspense>
    )
}

/**
 * ─── DATA COMPONENT (Suspended) ──────────────────────────────────────────
 */
async function StudentDashboardContent({ userId }: { userId: string }) {
    const queryClient = getQueryClient()

    // ─── STAGE 1: CORE PARALLEL FETCH ──────────────────────────────────────────
    // Parallelize basic info + initial assignments to extract IDs
    const [trainerRel, autoTrainingStatus, details, ranking, protocolStatus, todayWorkout, todayCardio] = await Promise.all([
        actions.getStudentTrainer(userId),
        actions.getStudentAutoTrainingStatus(userId),
        actions.getStudentDetails(userId),
        queryClient.fetchQuery({ queryKey: QUERY_KEYS.trainer.ranking(), queryFn: () => actions.getTrainerRanking() }),
        queryClient.fetchQuery({ queryKey: QUERY_KEYS.student.hasProtocol(userId), queryFn: () => actions.checkStudentHasProtocol(userId) }),
        actions.getTodayWorkout(userId),
        actions.getTodayCardio(userId)
    ])

    // Hydrate the initial data into the cache
    if (todayWorkout) {
        queryClient.setQueryData(QUERY_KEYS.workouts.today(userId), todayWorkout)
    }
    if (todayCardio) {
        queryClient.setQueryData(QUERY_KEYS.cardio.today(userId), todayCardio)
    }

    // ─── STAGE 2: CHAINED PARALLEL PREFETCH (ELITE) ───────────────────────────
    // Resolve secondary dependencies using IDs found in STAGE 1
    const workoutIds = (todayWorkout || []).map((w: any) => w.id)
    const cardioIds = (todayCardio || []).map((c: any) => c.id)

    await Promise.all([
        // Workout Chain
        ...workoutIds.flatMap((id: string) => [
            queryClient.prefetchQuery({
                queryKey: QUERY_KEYS.workouts.status(userId, id),
                queryFn: () => import('@/lib/dal/remote').then(m => m.getWorkoutStatus(userId, id))
            }),
            queryClient.prefetchQuery({
                queryKey: QUERY_KEYS.workouts.detail(id),
                queryFn: () => import('@/lib/dal/remote').then(m => m.getWorkoutDetails(id))
            })
        ]),
        workoutIds.length === 0 ? queryClient.setQueryData(QUERY_KEYS.workouts.status(userId, 'no-workout'), { status: 'empty' }) : Promise.resolve(),

        // Cardio Chain
        ...cardioIds.map((id: string) =>
            queryClient.prefetchQuery({
                queryKey: QUERY_KEYS.cardio.detail(id),
                queryFn: () => import('@/lib/dal/remote').then(m => m.getAssignedCardios(userId))
            })
        ),

        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.cardio.logs(userId),
            queryFn: () => actions.getCardioStatus(userId)
        }),

        // Ergogenics Chain
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.ergogenics.logs(userId),
            queryFn: () => actions.getTodayErgogenicLogs(userId)
        }),
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.ergogenics.all(userId),
            queryFn: () => actions.getStudentErgogenics(userId)
        }),

        // Diet Chain (Fix #3: explicit Stage 2 prefetch — eliminates DietCard skeleton)
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.diets.today(userId),
            queryFn: () => actions.getStudentDailyDiet(userId)
        }),

        // Cardio Session (prefetch eliminates CardioPlayer skeleton)
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.cardio.session,
            queryFn: () => import('@/lib/dal/remote').then(m => m.getActiveCardioSession())
        }),

        // Workout Session (Fix for 🚨 UNEXPECTED FETCH)
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.workouts.session,
            queryFn: () => actions.getActiveWorkoutSession()
        }),

        // Metrics & Profile
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.student.metricsSummary(userId),
            queryFn: () => actions.getMetricsSummary(userId)
        }),
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.student.details(userId),
            queryFn: () => actions.getStudentProfile(userId)
        })
    ])

    // Fire and forget background tracking
    actions.ensureDailyTracking(userId).catch(console.error)

    // ─── CASE LOGIC ──────────────────────────────────────────────────────────
    const hasAutoTraining = autoTrainingStatus?.auto_training_status === 'active' ||
        (autoTrainingStatus?.auto_training_status === 'trial' && autoTrainingStatus?.auto_training_trial_used && new Date() <= new Date(autoTrainingStatus?.auto_training_trial_end || Date.now() + 100000))

    const isTrialExpired = autoTrainingStatus?.auto_training_status === 'trial' && autoTrainingStatus?.auto_training_trial_used && new Date() > new Date(autoTrainingStatus?.auto_training_trial_end || Date.now() + 100000)

    const showAutoTrainingModal = !autoTrainingStatus?.saw_auto_training_onboarding_modal && !trainerRel
    const showAnamnesis = details?.body_fat === null || details?.body_fat === undefined

    // ─── UI HANDLERS ─────────────────────────────────────────────────────────

    // Case: Trainer Inactive
    if (trainerRel && trainerRel.trainer.plan_tier === 'none' && !hasAutoTraining) {
        return (
            <HydrationBoundary state={dehydrate(queryClient)}>
                <StudentMetaPixel />
                <InactiveTrainerCard trainerName={trainerRel.trainer.full_name} />
            </HydrationBoundary>
        )
    }

    // Case: No Trainer and No Auto-Training
    if (!trainerRel && !hasAutoTraining) {
        return (
            <HydrationBoundary state={dehydrate(queryClient)}>
                <StudentMetaPixel />
                <RegistryMain
                    title="BEM-VINDO"
                    subtitle="Você ainda não possui um plano ativo no RepTrail."
                    icon="Sparkles"
                    contextLabel="Área do Aluno"
                    showTabs={false}
                >
                    <StudentNoPlanSection ranking={ranking} />
                </RegistryMain>
            </HydrationBoundary>
        )
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <StudentMetaPixel />
            <StudentDashboardClient
                userId={userId}
                trainerRel={trainerRel}
                details={details}
                protocolStatus={protocolStatus}
                showAutoTrainingModal={showAutoTrainingModal}
                showAnamnesis={showAnamnesis}
            />
        </HydrationBoundary>
    )
}
