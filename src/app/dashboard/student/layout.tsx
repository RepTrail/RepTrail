import { Suspense } from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Home, Dumbbell, Utensils, Activity, User, ShoppingBag, Trophy, Search, UserCheck, Sparkles, TrendingUp, ClipboardList, Syringe } from 'lucide-react'
import { StudentGlobalModals } from '@/components/layout/student-global-modals'
import { createClient } from '@/lib/supabase/server'
import { getStudentTrainer } from '@/actions/student-actions'
import { getQueryClient } from '@/lib/get-query-client'
import { QUERY_KEYS } from '@/lib/query-keys'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { DashboardShell } from '@/components/store/advanced/dashboard-shell'
import { RegistryProvider } from '@/components/store/advanced/registry-context'

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')

    if (!userId) redirect('/auth/login')

    const supabase = await createClient()
    const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed, role, full_name, avatar_url, auto_training_status, auto_training_trial_end')
        .eq('id', userId)
        .single()

    if (profile && !profile.onboarding_completed && profile.role === 'student') {
        redirect('/onboarding')
    }

    return (
        <Suspense fallback={<StudentLayoutShell userId={userId} />}>
            <StudentLayoutLoader userId={userId}>
                {children}
            </StudentLayoutLoader>
        </Suspense>
    )
}

// ─── Async loader that builds the nav context ──────────────────────────────────

async function StudentLayoutLoader({ userId, children }: { userId: string; children: React.ReactNode }) {
    const queryClient = getQueryClient()
    const supabase = await createClient()

    const [profileRes, detailsRes, trainerRel] = await Promise.all([
        supabase.from('profiles').select('role, full_name, avatar_url, email, auto_training_status, auto_training_trial_end').eq('id', userId).single(),
        supabase.from('student_details').select('id, steroid_use').eq('id', userId).single(),
        getStudentTrainer(userId),
        queryClient.prefetchQuery({ queryKey: QUERY_KEYS.workouts.session, queryFn: () => import('@/actions/log-actions').then(m => m.getActiveWorkoutSession()) }),
        queryClient.prefetchQuery({ queryKey: QUERY_KEYS.cardio.session, queryFn: () => import('@/actions/cardio-actions').then(m => m.getActiveCardioSession()) }),
        queryClient.prefetchQuery({ queryKey: QUERY_KEYS.student.details(userId), queryFn: () => import('@/actions/student-actions').then(m => m.getStudentProfile(userId)) }),
        queryClient.prefetchQuery({ queryKey: QUERY_KEYS.workouts.all(userId), queryFn: () => import('@/actions/workout-actions').then(m => m.getAssignedWorkouts(userId)) }),
        queryClient.prefetchQuery({ queryKey: QUERY_KEYS.diets.all(userId), queryFn: () => import('@/actions/diet-actions').then(m => m.getAssignedDiets(userId)) }),
        queryClient.prefetchQuery({ queryKey: QUERY_KEYS.ergogenics.all(userId), queryFn: () => import('@/actions/ergogenics-actions').then(m => m.getAssignedErgogenics(userId)) }),
        queryClient.prefetchQuery({ queryKey: QUERY_KEYS.cardio.all(userId), queryFn: () => import('@/actions/cardio-actions').then(m => m.getAssignedCardios(userId)) }),
        queryClient.prefetchQuery({ queryKey: QUERY_KEYS.profile.trainer(userId), queryFn: () => getStudentTrainer(userId) }),
    ])

    const p = profileRes.data
    const details = detailsRes.data
    const hasTrainer = !!trainerRel

    const now = new Date()
    let isAutoTrainingActive = false
    if (p?.auto_training_status === 'active') isAutoTrainingActive = true
    else if (p?.auto_training_status === 'trial' && p?.auto_training_trial_end) {
        if (now <= new Date(p.auto_training_trial_end)) isAutoTrainingActive = true
    }
    const steroidUse = !!details?.steroid_use
    const hasPlan = hasTrainer || isAutoTrainingActive

    const allLinks = [
        { href: '/dashboard/student',              label: 'Home',           icon: 'Home',          exact: true },
        { href: '/dashboard/student/workouts',     label: 'Meus Treinos',   icon: 'Dumbbell',      hidden: !hasPlan },
        { href: '/dashboard/student/cardio',       label: 'Cardio',         icon: 'Activity',      hidden: !hasPlan },
        { href: '/dashboard/student/diet',         label: 'Minha Dieta',    icon: 'Utensils',      hidden: !hasPlan },
        { href: '/dashboard/student/ergogenics',   label: 'Ergogênicos',    icon: 'Syringe',       hidden: !hasPlan || !steroidUse },
        { href: '/dashboard/student/progress',     label: 'Evolução',       icon: 'TrendingUp',    hidden: !hasPlan },
        { href: '/dashboard/student/import-pdf',   label: 'Importar PDF',   icon: 'Sparkles',      hidden: hasTrainer },
        { href: '/dashboard/student/anamnese',     label: 'Anamnese',       icon: 'ClipboardList' },
        { href: '/buscar-personal',                label: 'Buscar Personal', icon: 'Search',       hidden: hasTrainer || isAutoTrainingActive },
        { href: '/dashboard/student/feed',         label: 'Feed de Alunos', icon: 'UserCheck' },
        { href: '/dashboard/student/ranking',      label: 'Ranking',        icon: 'Trophy' },
        { href: '/dashboard/student/loja',         label: 'Loja',           icon: 'ShoppingBag' },
        { href: '/dashboard/student/meu-personal', label: 'Meu Personal',   icon: 'UserCheck',     hidden: !hasTrainer },
    ]

    const mobileLinks = [
        { href: '/dashboard/student',              label: 'Home',    icon: 'Home',       exact: true },
        { href: '/dashboard/student/workouts',     label: 'Treinos', icon: 'Dumbbell',   hidden: !hasPlan },
        { href: '/dashboard/student/cardio',       label: 'Cardio',  icon: 'Activity',   hidden: !hasPlan },
        { href: '/dashboard/student/loja',         label: 'Loja',    icon: 'ShoppingBag' },
    ]

    return (
        <RegistryProvider defaultColor="orange">
            <HydrationBoundary state={dehydrate(queryClient)}>
                <DashboardShell
                    color="orange"
                    links={allLinks}
                    mobileLinks={mobileLinks}
                    profileHref="/dashboard/student/profile"
                    user={{ id: userId, name: p?.full_name, email: (p as any)?.email, avatar_url: p?.avatar_url }}
                >
                    {children}
                </DashboardShell>
                <StudentGlobalModals hasTrainer={hasTrainer} />
            </HydrationBoundary>
        </RegistryProvider>
    )
}

// ─── Skeleton fallback ────────────────────────────────────────────────────────

function StudentLayoutShell({ userId }: { userId: string }) {
    return (
        <div className="flex h-screen w-full bg-zinc-950 text-white">
            <div className="hidden lg:flex w-72 h-screen bg-zinc-900/50 border-r border-zinc-800 animate-pulse" />
            <main className="flex-1 p-10" />
        </div>
    )
}
