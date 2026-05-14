import { headers } from 'next/headers'
import { Suspense } from 'react'
import { getStudentTrainer, getStudentDetails, getStudentProfile } from '@/actions/student-actions'
import { getStudentAutoTrainingStatus } from '@/actions/auto-training-actions'
import { getTrainerRanking } from '@/actions/trainer-actions'
import { checkStudentHasProtocol } from '@/actions/ai-protocol-actions'
import { StudentMetaPixel } from './meta-pixel'
import { PodiumCard, RankingRow } from '@/components/store/features(deprecated)/ranking-cards'
import { PREFETCH_REGISTRY } from '@/lib/prefetch-registry'

import { WorkoutCard } from '@/components/store/features(deprecated)/student-workout-card'
import { CardioCard } from '@/components/store/features(deprecated)/student-cardio-card'
import { DietCard } from '@/components/store/features(deprecated)/student-diet-card'
import { ErgogenicsCard } from '@/components/store/features(deprecated)/student-ergogenics-card'
import { AIProtocolEmptyState } from '@/components/store/features(deprecated)/ai-protocol-empty-state'

import { PaymentWarning } from '@/components/store/features(deprecated)/student-payment-warning'
import { StudentDashboardModals } from '@/components/store/features(deprecated)/student-dashboard-modals'
import { AnamnesisForm } from '@/components/store/features(deprecated)/student-anamnesis-form'

import { Activity, Utensils, Dumbbell, Star, Search, Trophy, ArrowRight, Sparkles, Zap, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { ensureDailyTracking } from '@/actions/tracking-actions'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getTodayWorkout, getAssignedWorkouts } from '@/actions/workout-actions'
import { getTodayCardio, getAssignedCardios, getCardioStatus } from '@/actions/cardio-actions'
import { getStudentDailyDiet, getAssignedDiets } from '@/actions/diet-actions'
import { getStudentErgogenics, getTodayErgogenicLogs } from '@/actions/ergogenics-actions'
import { getMetricsSummary } from '@/actions/metrics-actions'
import { getActiveWorkoutSession } from '@/actions/log-actions'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { StudentDashboardClient } from '@/components/store/features(deprecated)/student-dashboard-client'
import { InactiveTrainerCard } from '@/components/store/features(deprecated)/inactive-trainer-card'
import { NoPlanHero } from '@/components/store/features(deprecated)/no-plan-hero'

export default async function StudentDashboardPage() {
    // ─── OPTIMIZED IDENTITY (0ms) ──────────────────────────────────────────
    const headerList = await headers()
    const userId = headerList.get('x-user-id')

    if (!userId) return null

    return (
        <Suspense fallback={<StudentDashboardSkeleton />}>
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
        getStudentTrainer(userId),
        getStudentAutoTrainingStatus(userId),
        getStudentDetails(userId),
        queryClient.fetchQuery({ queryKey: QUERY_KEYS.trainer.ranking(), queryFn: () => getTrainerRanking() }),
        queryClient.fetchQuery({ queryKey: QUERY_KEYS.student.hasProtocol(userId), queryFn: () => checkStudentHasProtocol(userId) }),
        getTodayWorkout(userId),
        getTodayCardio(userId)
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
        ...workoutIds.flatMap(id => [
            queryClient.prefetchQuery({
                queryKey: QUERY_KEYS.workouts.status(userId, id),
                queryFn: () => import('@/actions/log-actions').then(m => m.getWorkoutStatus(userId, id))
            }),
            queryClient.prefetchQuery({
                queryKey: QUERY_KEYS.workouts.detail(id),
                queryFn: () => import('@/actions/workout-actions').then(m => m.getWorkoutDetails(id))
            })
        ]),
        workoutIds.length === 0 ? queryClient.setQueryData(QUERY_KEYS.workouts.status(userId, 'no-workout'), { status: 'empty' }) : Promise.resolve(),

        // Cardio Chain
        ...cardioIds.map(id =>
            queryClient.prefetchQuery({
                queryKey: QUERY_KEYS.cardio.detail(id),
                queryFn: () => import('@/actions/cardio-actions').then(m => m.getAssignedCardios(userId))
            })
        ),

        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.cardio.logs(userId),
            queryFn: () => getCardioStatus(userId)
        }),

        // Ergogenics Chain
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.ergogenics.logs(userId),
            queryFn: () => getTodayErgogenicLogs(userId)
        }),
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.ergogenics.all(userId),
            queryFn: () => getStudentErgogenics(userId)
        }),

        // Diet Chain (Fix #3: explicit Stage 2 prefetch — eliminates DietCard skeleton)
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.diets.today(userId),
            queryFn: () => getStudentDailyDiet(userId)
        }),

        // Cardio Session (prefetch eliminates CardioPlayer skeleton)
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.cardio.session,
            queryFn: () => import('@/actions/cardio-actions').then(m => m.getActiveCardioSession())
        }),

        // Workout Session (Fix for 🚨 UNEXPECTED FETCH)
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.workouts.session,
            queryFn: () => getActiveWorkoutSession()
        }),

        // Metrics & Profile
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.student.metricsSummary(userId),
            queryFn: () => getMetricsSummary(userId)
        }),
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.student.details(userId),
            queryFn: () => getStudentProfile(userId)
        })
    ])

    // Fire and forget background tracking
    ensureDailyTracking(userId).catch(console.error)

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
                <NoPlanHero ranking={ranking} />
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

/**
 * ─── SKELETON (0ms Nav Frame) ──────────────────────────────────────────
 */
function StudentDashboardSkeleton() {
    return (
        <Stack gap={{ base: 12.5, md: 'section' }} className="animate-pulse pb-20">
            <div className="h-12 w-full bg-zinc-900/50 border border-zinc-800/50 rounded-xl" />
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <div className="h-10 w-48 bg-zinc-900 rounded-xl" />
                    <div className="h-4 w-64 bg-zinc-900 rounded-md" />
                </div>
                <div className="h-16 w-32 bg-zinc-900 rounded-xl" />
            </div>
            <Grid gap={{ base: 12.5, md: 'section' }} lgCols={12}>
                <Stack gap={{ base: 12.5, md: 'section' }} className="lg:col-span-8">
                    <div className="h-[280px] bg-zinc-900 rounded-[2.5rem]" />
                    <div className="h-[300px] bg-zinc-900 rounded-[2.5rem]" />
                    <div className="h-[200px] bg-zinc-900 rounded-[2.5rem]" />
                </Stack>
                <div className="lg:col-span-4 h-[600px] bg-zinc-900 rounded-[2.5rem]" />
            </Grid>
        </Stack>
    )
}

