import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getBetaTesterMode } from '@/actions/app-settings-actions'
import { getQueryClient } from '@/lib/get-query-client'
import { QUERY_KEYS } from '@/lib/query-keys'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getEffectiveTier, getTrainerProfile } from '@/actions/trainer-actions'
import { TrainerTourManager } from '@/components/store/advanced/trainer-tour-manager'
import { MobileTrainerTourManager } from '@/components/store/advanced/mobile-trainer-tour-manager'
import { DashboardShell } from '@/components/store/advanced/dashboard-shell'
import { RegistryProvider } from '@/components/store/advanced/registry-context'
import { SettingsModal } from '@/components/store/advanced/student-settings-modal'

export default async function TrainerLayout({ children }: { children: React.ReactNode }) {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')

    if (!userId) redirect('/auth/login')

    const supabase = await createClient()
    
    const { data: profile } = await supabase
        .from('profiles')
        .select('role, plan_tier, full_name, avatar_url, email, is_admin, is_affiliate')
        .eq('id', userId)
        .single()

    if (!profile) redirect('/auth/login')
    if (profile.role !== 'trainer') redirect('/dashboard/student')

    const queryClient = getQueryClient()
    await Promise.all([
        queryClient.prefetchQuery({ queryKey: QUERY_KEYS.trainer.profile(userId), queryFn: () => getTrainerProfile(userId) }),
        queryClient.prefetchQuery({ queryKey: QUERY_KEYS.profile.detail(userId), queryFn: () => getTrainerProfile(userId) }),
        queryClient.prefetchQuery({ queryKey: QUERY_KEYS.trainer.effectiveTier(userId), queryFn: () => getEffectiveTier(userId) }),
    ])

    const dehydratedState = dehydrate(queryClient)
    const betaTesterMode = await getBetaTesterMode()

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
                    color="emerald"
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
    )
}
