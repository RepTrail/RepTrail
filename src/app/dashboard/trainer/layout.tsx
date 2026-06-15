import { STORE_TOKENS } from '@/components/store/constants/tokens';
import { dehydrate, HydrationBoundary } from '@/lib/dal'
import { getProfile } from '@/lib/dal/server'
import { getPublicPlanPricing, getTrainerProfile, getEffectiveTier } from '@/actions/trainer-actions'
import { getBetaTesterMode } from '@/actions/app-settings-actions'
import { getTrainerPlanFeatures } from '@/actions/plan-features-actions'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getQueryClient } from '@/lib/get-query-client'
import { QUERY_KEYS } from '@/lib/query-keys'
import { TrainerTourManager } from '@/components/store/advanced/trainer-tour-manager'
import { MobileTrainerTourManager } from '@/components/store/advanced/mobile-trainer-tour-manager'
import { DashboardShell } from '@/components/store/advanced/dashboard-shell'
import { RegistryProvider } from '@/components/store/base/registry-context'
import { SettingsModal } from '@/components/store/advanced/student-settings-modal'
export default async function TrainerLayout({ children }: { children: React.ReactNode }) {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')

    if (!userId) redirect('/auth/login')

    const profile = await getProfile(userId)

    if (!profile) redirect('/auth/login')
    if (profile.role !== 'trainer') redirect('/dashboard/student')
    if (!profile.plan_id) redirect('/onboarding/plans')

    const queryClient = getQueryClient()
    await Promise.all([
        queryClient.prefetchQuery({ queryKey: QUERY_KEYS.trainer.profile(userId), queryFn: () => getTrainerProfile(userId) }),
        queryClient.prefetchQuery({ queryKey: QUERY_KEYS.profile.detail(userId), queryFn: () => getTrainerProfile(userId) }),
        queryClient.prefetchQuery({ queryKey: QUERY_KEYS.trainer.effectiveTier(userId), queryFn: () => getEffectiveTier(userId) }),
    ])

    const dehydratedState = dehydrate(queryClient)
    const betaTesterMode = await getBetaTesterMode()
    const features = await getTrainerPlanFeatures(userId)

    const hasWorkouts = features?.has_workouts ?? true
    const hasDiets = features?.has_diets ?? true
    const hasCardio = features?.has_cardio ?? true
    const hasErgogenics = features?.has_ergogenics ?? false
    const hasImportPdf = features?.has_import_pdf_ai ?? false

    const publicPlans = await getPublicPlanPricing()
    const hasPublicPlans = Array.isArray(publicPlans) && publicPlans.length > 0

    const links = [
        { href: '/dashboard/trainer',           label: 'Visão Geral',  icon: 'Home',         exact: true },
        { href: '/dashboard/trainer/students',   label: 'Alunos',       icon: 'Users' },
        { href: '/dashboard/trainer/workouts',   label: 'Treinos',      icon: 'Dumbbell' },
        { href: '/dashboard/trainer/diets',      label: 'Dietas',       icon: 'Utensils' },
        { href: '/dashboard/trainer/cardio',     label: 'Cardio',       icon: 'Activity' },
        { href: '/dashboard/trainer/ergogenics', label: 'Ergogênicos',  icon: 'FlaskConical' },
        { href: '/dashboard/trainer/import-pdf', label: 'Importar PDF', icon: 'FileUp',      hidden: betaTesterMode },
        { href: '/dashboard/trainer/loja',       label: 'Loja',         icon: 'ShoppingBag' },
        { href: '/dashboard/trainer/ranking',    label: 'Ranking',      icon: 'Trophy' },
        { href: '/dashboard/trainer/plans',      label: 'Planos',       icon: 'CreditCard',   hidden: !hasPublicPlans },
        { href: '/dashboard/trainer/profile',    label: 'Meu Perfil',   icon: 'User' },
    ]

    const mobileLinks = [
        { href: '/dashboard/trainer',            label: 'Início',  icon: 'Home',        exact: true },
        { href: '/dashboard/trainer/students',   label: 'Alunos',  icon: 'Users' },
        { href: '/dashboard/trainer/loja',       label: 'Loja',    icon: 'ShoppingBag' },
        { href: '/dashboard/trainer/ranking',    label: 'Ranking', icon: 'Trophy' },
    ]

    return (
        <RegistryProvider defaultColor="emerald">
            <HydrationBoundary state={dehydratedState}>
                <TrainerTourManager userId={userId} />
                <MobileTrainerTourManager userId={userId} />
                <DashboardShell
                    color={STORE_TOKENS.COLORS.SUCCESS}
                    links={links}
                    mobileLinks={mobileLinks}
                    profileHref="/dashboard/trainer/profile"
                    user={{ id: userId, name: profile?.full_name, email: (profile as any)?.email, avatar_url: profile?.avatar_url, isAdmin: profile?.is_admin, isAffiliate: profile?.is_affiliate, role: 'trainer' }}
                >
                    {children}
                </DashboardShell>
                <SettingsModal isTrainer={true} hasTrainer={false} />
            </HydrationBoundary>
        </RegistryProvider>
    );
}
