import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Home, Users, Dumbbell, Utensils, FileUp, User, LogOut, Trophy, CreditCard, Activity, FlaskConical, ShoppingBag } from 'lucide-react'
import { signOutAction } from '@/actions/auth-actions'
import { Logo } from '@/components/ui/logo'
import { MobileHeader } from '@/components/layout/mobile-header'
import { TrialWarningPopup } from '@/components/layout/trial-warning-popup'
import { TrainerMobileNavLink } from '@/components/layout/trainer-nav'
import { UnifiedSidebar } from '@/components/layout/sidebar-unified'
import { headers } from 'next/headers'
import { getBetaTesterMode } from '@/actions/app-settings-actions'

export default async function TrainerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    // Fetch profile to know the role and plan status
    const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name, avatar_url, plan_tier, elite_until')
        .eq('id', user.id)
        .single()

    // Determine effective role using metadata as the source of truth for the cross-dashboard check.
    // Metadata is set at signup time and is always reliable, while DB role can be corrupted.
    const metaRole = user.user_metadata?.role

    // Auto-fix: if metadata says 'trainer' but DB has wrong/missing role, correct the DB now.
    if (metaRole === 'trainer' && profile?.role !== 'trainer') {
        await supabase.from('profiles').update({ role: 'trainer' }).eq('id', user.id)
    }

    const effectiveRole = metaRole || profile?.role
    if (effectiveRole !== 'trainer') {
        redirect('/dashboard/student')
    }

    const betaTesterMode = await getBetaTesterMode()

    // Check Plan Restriction
    const headerList = await headers()
    const pathname = headerList.get('x-pathname') || ''

    // Paywall Check: If tier is 'none', they MUST be on the plans page
    const hasPlan = !!profile?.plan_tier && profile.plan_tier !== 'none'

    if (!hasPlan && !pathname.includes('/plans')) {
        redirect('/dashboard/trainer/plans')
    }

    // Simplified Layout for Paywall
    if (!hasPlan) {
        return (
            <div className="flex h-screen w-full bg-zinc-950 text-zinc-100 font-sans">
                {/* Minimal Top Header for Paywall */}
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

    return (
        <div className="flex h-screen w-full bg-zinc-950 text-zinc-100 font-sans">
            {/* Desktop Sidebar */}
            <UnifiedSidebar 
                brandColor="emerald"
                logoColor="emerald"
                user={{
                    name: profile?.full_name,
                    email: user.email,
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
                showSettings={false} // Trainer layout doesn't use the custom settings event the same way yet
            />

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[95vw] h-16 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-2xl z-40 px-2 flex items-center justify-around shadow-2xl shadow-black/50">
                <TrainerMobileNavLink href="/dashboard/trainer" icon={<Home className="w-5 h-5" />} exact />
                <TrainerMobileNavLink href="/dashboard/trainer/students" icon={<Users className="w-5 h-5" />} />
                <TrainerMobileNavLink href="/dashboard/trainer/loja" icon={<ShoppingBag className="w-5 h-5" />} />
                <TrainerMobileNavLink href="/dashboard/trainer/ranking" icon={<Trophy className="w-5 h-5" />} />
                <TrainerMobileNavLink href="/dashboard/trainer/profile" icon={<User className="w-5 h-5" />} />
            </nav>

            <MobileHeader role="trainer" hideImportPdf={betaTesterMode} />

            <main className="flex-1 overflow-y-auto pt-24 md:pt-[50px] p-4 pb-32 md:pb-10 md:p-10 bg-zinc-950 text-zinc-100 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

        </div>
    )
}

