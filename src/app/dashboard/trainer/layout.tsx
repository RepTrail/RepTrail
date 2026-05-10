import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { signOutAction } from '@/actions/auth-actions'
import { Logo } from '@/components/ui/logo'
import { headers } from 'next/headers'
import { getBetaTesterMode } from '@/actions/app-settings-actions'
import { getQueryClient } from '@/lib/get-query-client'
import { QUERY_KEYS } from '@/lib/query-keys'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getEffectiveTier, getTrainerProfile, getTrainerRanking } from '@/actions/trainer-actions'
import { TrainerTourManager } from '@/components/feature/trainer/onboarding/trainer-tour-manager'
import { MobileTrainerTourManager } from '@/components/feature/trainer/onboarding/mobile-trainer-tour-manager'
import { DashboardShell } from '@/components/store/advanced/dashboard-shell'
import { RegistryProvider } from '@/components/store/advanced/registry-context'

export default async function TrainerLayout({ children }: { children: React.ReactNode }) {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')

    if (!userId) redirect('/auth/login')

    const supabase = await createClient()
    const { data: profile } = await supabase
        .from('profiles')
        .select('role, plan_tier, full_name, avatar_url, email')
        .eq('id', userId)
        .single()

    if (profile?.role !== 'trainer') redirect('/dashboard/student')

    const hasPlan = !!profile?.plan_tier && profile.plan_tier !== 'none'
    const pathname = headerList.get('x-pathname') || ''

    if (!hasPlan && !pathname.includes('/plans')) redirect('/dashboard/trainer/plans')

    const queryClient = getQueryClient()
    await Promise.all([
        queryClient.prefetchQuery({ queryKey: QUERY_KEYS.profile.detail(userId), queryFn: () => getTrainerProfile() }),
        queryClient.prefetchQuery({ queryKey: QUERY_KEYS.trainer.effectiveTier(userId), queryFn: () => getEffectiveTier() }),
        queryClient.prefetchQuery({ queryKey: QUERY_KEYS.trainer.ranking(), queryFn: () => getTrainerRanking() }),
    ])

    const dehydratedState = dehydrate(queryClient)
    const betaTesterMode = await getBetaTesterMode()

    // ─── Paywall layout (no sidebar) ──────────────────────────────────────────
    if (!hasPlan) {
        return (
            <HydrationBoundary state={dehydratedState}>
                <div className="flex h-screen w-full bg-zinc-950 text-zinc-100 font-sans">
                    <header className="fixed top-0 left-0 right-0 h-20 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900 z-40 px-6 flex items-center justify-between">
                        <Logo size="md" color="emerald" />
                        <form action={signOutAction}>
                            <Button variant="ghost" className="text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent hover:border-zinc-800 gap-2 font-bold uppercase text-[10px] tracking-widest h-10 rounded-xl transition-all active:scale-95">
                                <LogOut className="w-4 h-4" /> Sair
                            </Button>
                        </form>
                    </header>
                    <main className="flex-1 overflow-y-auto pt-24 p-6 md:p-12">
                        <div className="max-w-5xl mx-auto md:pt-[100px]">{children}</div>
                    </main>
                </div>
            </HydrationBoundary>
        )
    }

    // ─── Full Dashboard Layout ─────────────────────────────────────────────────
    const links = [
        { href: '/dashboard/trainer',           label: 'Visão Geral',  icon: 'Home',         exact: true },
        { href: '/dashboard/trainer/students',   label: 'Alunos',       icon: 'Users' },
        { href: '/dashboard/trainer/workouts',   label: 'Treinos',      icon: 'Dumbbell' },
        { href: '/dashboard/trainer/diets',      label: 'Dietas',       icon: 'Utensils' },
        { href: '/dashboard/trainer/cardio',     label: 'Cardio',       icon: 'Activity' },
        { href: '/dashboard/trainer/ergogenics', label: 'Ergogênicos',  icon: 'FlaskConical' },
        { href: '/dashboard/trainer/import-pdf', label: 'Importar PDF', icon: 'FileUp',      hidden: betaTesterMode },
        { href: '/dashboard/trainer/loja',       label: 'Loja',         icon: 'ShoppingBag' },
        { href: '/dashboard/trainer/plans',      label: 'Faturamento',  icon: 'CreditCard' },
        { href: '/dashboard/trainer/ranking',    label: 'Ranking',      icon: 'Trophy' },
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
                    user={{ id: userId, name: profile?.full_name, email: (profile as any)?.email, avatar_url: profile?.avatar_url }}
                >
                    {children}
                </DashboardShell>
            </HydrationBoundary>
        </RegistryProvider>
    )
}
