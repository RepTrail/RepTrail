import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, Users, Dumbbell, Utensils, FileUp, User, LogOut, Trophy, CreditCard, Activity, FlaskConical, ShoppingBag } from 'lucide-react'
import { signOutAction } from '@/actions/auth-actions'
import { Logo } from '@/components/ui/logo'
import { MobileHeader } from '@/components/layout/mobile-header'
import { UnifiedSidebar } from '@/components/layout/sidebar-unified'
import { headers } from 'next/headers'
import { getBetaTesterMode } from '@/actions/app-settings-actions'
import { getQueryClient } from '@/lib/get-query-client'
import { QUERY_KEYS } from '@/lib/query-keys'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getEffectiveTier, getTrainerProfile, getTrainerRanking } from '@/actions/trainer-actions'
import { Suspense } from 'react'
import { TrainerMobileNavLink } from '@/components/layout/trainer-nav'
import { TrainerTourManager } from '@/components/feature/trainer/onboarding/trainer-tour-manager'

export default async function TrainerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')

    if (!userId) {
        redirect('/auth/login')
    }

    const supabase = await createClient()

    // 1. Fetch profile for Paywall and Role check
    const { data: profile } = await supabase
        .from('profiles')
        .select('role, plan_tier')
        .eq('id', userId)
        .single()

    if (profile?.role !== 'trainer') {
        redirect('/dashboard/student')
    }

    const hasPlan = !!profile?.plan_tier && profile.plan_tier !== 'none'
    const pathname = headerList.get('x-pathname') || ''

    if (!hasPlan && !pathname.includes('/plans')) {
        redirect('/dashboard/trainer/plans')
    }

    // 2. Simplified Layout for Paywall
    if (!hasPlan) {
        return (
            <div className="flex h-screen w-full bg-zinc-950 text-zinc-100 font-sans">
                <header className="fixed top-0 left-0 right-0 h-20 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900 z-40 px-6 flex items-center justify-between">
                    <Logo size="md" color="emerald" />
                    <form action={signOutAction}>
                        <Button variant="ghost" className="text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent hover:border-zinc-800 gap-2 font-bold uppercase text-[10px] tracking-widest  h-10 rounded-xl transition-all active:scale-95">
                            <LogOut className="w-4 h-4" /> Sair
                        </Button>
                    </form>
                </header>
                <main className="flex-1 overflow-y-auto pt-24 p-6 md:p-12">
                    <div className="max-w-5xl mx-auto md:pt-[100px]">
                        {children}
                    </div>
                </main>
            </div>
        )
    }

    // 3. Full Layout with Sidebar and Navigation
    return (
        <div className="flex h-screen w-full bg-zinc-950 text-zinc-100 font-sans">
            <TrainerTourManager userId={userId} />
            <Suspense fallback={<div className="hidden md:flex w-72 h-screen bg-zinc-900 border-r border-zinc-800 animate-pulse" />}>
                <DashboardSidebarLoader userId={userId} />
            </Suspense>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[95vw] h-16 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-2xl z-40 px-2 flex items-center justify-around shadow-2xl shadow-black/50">
                <TrainerMobileNavLink href="/dashboard/trainer" icon={<Home className="w-5 h-5" />} exact />
                <TrainerMobileNavLink href="/dashboard/trainer/students" icon={<Users className="w-5 h-5" />} />
                <TrainerMobileNavLink href="/dashboard/trainer/loja" icon={<ShoppingBag className="w-5 h-5" />} />
                <TrainerMobileNavLink href="/dashboard/trainer/ranking" icon={<Trophy className="w-5 h-5" />} />
                <TrainerMobileNavLink href="/dashboard/trainer/profile" icon={<User className="w-5 h-5" />} />
            </nav>

            <Suspense fallback={<div className="h-16 w-full bg-zinc-950 border-b border-zinc-900 md:hidden animate-pulse" />}>
                <DashboardNavLoader />
            </Suspense>

            <main className="flex-1 overflow-y-auto pt-24 md:pt-[50px] p-4 pb-32 md:pb-10 md:p-10 bg-zinc-950 text-zinc-100 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}

async function DashboardSidebarLoader({ userId }: { userId: string }) {
    const queryClient = getQueryClient()
    const supabase = await createClient()

    // ─── ELITE GLOBAL PREFETCH (TRAINER) ──────────────────────────────────
    await Promise.all([
        queryClient.prefetchQuery({ queryKey: QUERY_KEYS.profile.detail(userId), queryFn: () => getTrainerProfile() }),
        queryClient.prefetchQuery({ queryKey: QUERY_KEYS.trainer.effectiveTier(userId), queryFn: () => getEffectiveTier() }),
        queryClient.prefetchQuery({ queryKey: QUERY_KEYS.trainer.ranking(), queryFn: () => getTrainerRanking() }),
    ])

    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', userId)
        .single()

    const betaTesterMode = await getBetaTesterMode()

    const sidebar = (
        <UnifiedSidebar 
            brandColor="emerald"
            logoColor="emerald"
            user={{
                id: userId,
                name: profile?.full_name,
                email: '', 
                avatar_url: profile?.avatar_url
            }}
            links={[
                { href: "/dashboard/trainer", icon: <Home className="w-5 h-5" />, label: "Visão Geral", exact: true },
                { href: "/dashboard/trainer/students", icon: <Users className="w-5 h-5" />, label: "Alunos" },
                { href: "/dashboard/trainer/workouts", icon: <Dumbbell className="w-5 h-5" />, label: "Treinos" },
                { href: "/dashboard/trainer/diets", icon: <Utensils className="w-5 h-5" />, label: "Dietas" },
                { href: "/dashboard/trainer/cardio", icon: <Activity className="w-5 h-5" />, label: "Cardio" },
                { href: "/dashboard/trainer/ergogenics", icon: <FlaskConical className="w-5 h-5" />, label: "Ergogênicos" },
                { href: "/dashboard/trainer/import-pdf", icon: <FileUp className="w-5 h-5" />, label: "Importar PDF", hidden: betaTesterMode },
                { href: "/dashboard/trainer/loja", icon: <ShoppingBag className="w-5 h-5" />, label: "Loja" },
                { href: "/dashboard/trainer/plans", icon: <CreditCard className="w-5 h-5" />, label: "Planos & Assinatura" },
                { href: "/dashboard/trainer/ranking", icon: <Trophy className="w-5 h-5" />, label: "Ranking Geral" },
            ]}
            extraLinks={{
                title: "Conta",
                links: [
                    { href: "/dashboard/trainer/profile", icon: <User className="w-5 h-5" />, label: "Meu Perfil" }
                ]
            }}
            showSettings={false}
        />
    )

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {sidebar}
        </HydrationBoundary>
    )
}

async function DashboardNavLoader() {
    const betaTesterMode = await getBetaTesterMode()
    return <MobileHeader role="trainer" hideImportPdf={betaTesterMode} />
}
