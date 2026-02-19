import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Home, LogOut, Megaphone, DollarSign, Users, BarChart2, User } from 'lucide-react'
import { signOutAction } from '@/actions/auth-actions'
import { Logo } from '@/components/ui/logo'
import { MobileHeader } from '@/components/layout/mobile-header'

export default async function AffiliateLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, is_affiliate, role')
        .eq('id', user.id)
        .single()

    // Non-affiliates are allowed through — page.tsx handles activation prompt
    // (only redirect if truly not logged in)

    return (
        <div className="flex h-screen w-full bg-zinc-950 text-zinc-100 font-sans">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-72 bg-zinc-900 border-r border-zinc-800 p-6 flex-col justify-between shadow-2xl z-20">
                <div>
                    <div className="mb-10 flex items-center justify-start px-4">
                        <Link href="/">
                            <Logo size="md" color="amber" />
                        </Link>
                    </div>

                    <div className="px-4 mb-3">
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
                            <Megaphone className="w-3 h-3" /> Programa Afiliados
                        </span>
                    </div>

                    <nav className="space-y-2">
                        <NavLink href="/dashboard/affiliate" icon={<Home className="w-5 h-5" />}>Visão Geral</NavLink>
                        <NavLink href="/dashboard/affiliate/referrals" icon={<Users className="w-5 h-5" />}>Indicados</NavLink>
                        <NavLink href="/dashboard/affiliate/earnings" icon={<DollarSign className="w-5 h-5" />}>Ganhos</NavLink>
                        <NavLink href="/dashboard/affiliate/stats" icon={<BarChart2 className="w-5 h-5" />}>Estatísticas</NavLink>

                        {/* Link to primary dashboard if they also have a role */}
                        {profile?.role === 'trainer' && (
                            <div className="border-t border-zinc-800 my-4 pt-4">
                                <div className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Também sou</div>
                                <NavLink href="/dashboard/trainer" icon={<User className="w-5 h-5" />}>Dashboard Personal</NavLink>
                            </div>
                        )}
                        {profile?.role === 'student' && (
                            <div className="border-t border-zinc-800 my-4 pt-4">
                                <div className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Também sou</div>
                                <NavLink href="/dashboard/student" icon={<User className="w-5 h-5" />}>Dashboard Aluno</NavLink>
                            </div>
                        )}
                    </nav>
                </div>

                <div className="border-t border-zinc-800 pt-6">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="relative w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold border border-amber-500/30 overflow-hidden">
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
                            <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">Afiliado</p>
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
                <MobileNavLink href="/dashboard/affiliate" icon={<Home className="w-5 h-5" />} />
                <MobileNavLink href="/dashboard/affiliate/referrals" icon={<Users className="w-5 h-5" />} />
                <MobileNavLink href="/dashboard/affiliate/earnings" icon={<DollarSign className="w-5 h-5" />} />
                <MobileNavLink href="/dashboard/affiliate/stats" icon={<BarChart2 className="w-5 h-5" />} />
            </nav>

            {/* Mobile Top Header */}
            <MobileHeader role="trainer" hideImportPdf={true} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto pt-24 md:pt-[50px] p-4 pb-32 md:pb-10 md:p-10 bg-zinc-950 text-zinc-100">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}

function NavLink({ href, children, icon }: { href: string; children: React.ReactNode; icon?: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-all duration-200 group"
        >
            <span className="group-hover:text-amber-400 transition-colors text-zinc-500">{icon}</span>
            <span className="font-medium">{children}</span>
        </Link>
    )
}

function MobileNavLink({ href, icon }: { href: string; icon: React.ReactNode }) {
    return (
        <Link href={href} className="p-3 text-zinc-500 hover:text-amber-400 transition-colors">
            {icon}
        </Link>
    )
}
