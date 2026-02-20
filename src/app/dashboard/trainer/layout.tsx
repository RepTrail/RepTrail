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
    const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('role, full_name, avatar_url, plan_tier, elite_until')
        .eq('id', user.id)
        .single()

    // If not a trainer, they shouldn't be here. 
    // We only redirect if we found a profile and it says 'student' or it's missing the trainer role.
    if (!profile || profile.role !== 'trainer') {
        redirect('/dashboard/student')
    }

    const betaTesterMode = await getBetaTesterMode()

    // Check Plan Restriction
    const headerList = await headers()
    const pathname = headerList.get('x-pathname') || ''

    const now = new Date()
    const isEliteTrial = profile?.plan_tier === 'elite' && !!profile?.elite_until
    const isTrialExpired = isEliteTrial && new Date(profile.elite_until) <= now

    if (isTrialExpired) {
        const { processExpiredTrial } = await import('@/actions/trainer-actions')
        await processExpiredTrial(user.id)
        redirect(pathname)
    }

    const hasPlan = !!profile?.plan_tier && profile.plan_tier !== 'none' && !isTrialExpired

    if (!hasPlan && !pathname.includes('/plans')) {
        redirect('/dashboard/trainer/plans')
    }

    // Simplified Layout for Paywall
    if (!hasPlan) {
        return (
            <div className="flex h-screen w-full bg-zinc-950 text-zinc-100 font-sans">
                {/* Minimal Top Header for Paywall */}
                <header className="fixed top-0 left-0 right-0 h-20 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900 z-50 px-6 flex items-center justify-between">
                    <Logo size="md" color="emerald" />
                    <form action={signOutAction}>
                        <Button variant="ghost" className="text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent hover:border-zinc-800 gap-2 font-bold uppercase text-[10px] tracking-widest px-4 h-10 rounded-xl transition-all active:scale-95">
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
            <aside className="hidden md:flex w-72 bg-zinc-900 border-r border-zinc-800 p-6 flex-col justify-between shadow-2xl z-20">
                <div>
                    {/* Logo Container */}
                    <div className="mb-10 flex items-center justify-start px-4">
                        <Link href="/">
                            <Logo size="md" color="emerald" />
                        </Link>
                    </div>

                    <nav className="space-y-2">
                        <NavLink href="/dashboard/trainer" icon={<Home className="w-5 h-5" />}>Visão Geral</NavLink>
                        <NavLink href="/dashboard/trainer/students" icon={<Users className="w-5 h-5" />}>Alunos</NavLink>
                        <NavLink href="/dashboard/trainer/workouts" icon={<Dumbbell className="w-5 h-5" />}>Treinos</NavLink>
                        <NavLink href="/dashboard/trainer/diets" icon={<Utensils className="w-5 h-5" />}>Dietas</NavLink>
                        <NavLink href="/dashboard/trainer/cardio" icon={<Activity className="w-5 h-5" />}>Cardio</NavLink>
                        <NavLink href="/dashboard/trainer/ergogenics" icon={<FlaskConical className="w-5 h-5" />}>Ergogênicos</NavLink>
                        {!betaTesterMode && <NavLink href="/dashboard/trainer/import-pdf" icon={<FileUp className="w-5 h-5" />}>Importar PDF</NavLink>}
                        <NavLink href="/dashboard/trainer/loja" icon={<ShoppingBag className="w-5 h-5" />}>Loja</NavLink>
                        <NavLink href="/dashboard/trainer/plans" icon={<CreditCard className="w-5 h-5" />}>Planos & Assinatura</NavLink>
                        <NavLink href="/dashboard/trainer/ranking" icon={<Trophy className="w-5 h-5" />}>Ranking Geral</NavLink>

                        <div className="border-t border-zinc-800 my-4 pt-4">
                            <div className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Conta</div>
                            <NavLink href="/dashboard/trainer/profile" icon={<User className="w-5 h-5" />}>Meu Perfil</NavLink>
                        </div>
                    </nav>
                </div>

                <div className="border-t border-zinc-800 pt-6">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="relative w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-900 font-bold border border-zinc-300 overflow-hidden">
                            {profile?.avatar_url ? (
                                <Image
                                    src={profile.avatar_url}
                                    alt={profile.full_name || 'User'}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-zinc-200 truncate">{profile?.full_name}</p>
                            <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                        </div>
                    </div>
                    <form action={signOutAction}>
                        <Button variant="outline" className="w-full bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-600 flex items-center gap-2 transition-all">
                            <LogOut className="w-4 h-4" />
                            Sair
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[95vw] h-16 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-2xl z-50 px-2 flex items-center justify-around shadow-2xl shadow-black/50">
                <MobileNavLink href="/dashboard/trainer" icon={<Home className="w-5 h-5" />} />
                <MobileNavLink href="/dashboard/trainer/students" icon={<Users className="w-5 h-5" />} />
                <MobileNavLink href="/dashboard/trainer/loja" icon={<ShoppingBag className="w-5 h-5" />} />
                <MobileNavLink href="/dashboard/trainer/ranking" icon={<Trophy className="w-5 h-5" />} />
                <MobileNavLink href="/dashboard/trainer/profile" icon={<User className="w-5 h-5" />} />
            </nav>

            {/* Mobile Top Header */}
            <MobileHeader role="trainer" hideImportPdf={betaTesterMode} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto pt-24 md:pt-[50px] p-4 pb-32 md:pb-10 md:p-10 bg-zinc-950 text-zinc-100 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

            <TrialWarningPopup eliteUntil={profile?.elite_until} />
        </div>
    )
}

function NavLink({ href, children, icon }: { href: string; children: React.ReactNode; icon?: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-all duration-200 group"
        >
            <span className="group-hover:text-white transition-colors text-zinc-500">{icon}</span>
            <span className="font-medium">{children}</span>
        </Link>
    )
}

function MobileNavLink({ href, icon }: { href: string; icon: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="p-3 text-zinc-500 hover:text-white transition-colors"
        >
            {icon}
        </Link>
    )
}
