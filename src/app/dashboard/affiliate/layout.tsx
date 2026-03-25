import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Home, LogOut, Megaphone, DollarSign, Users, BarChart2, User } from 'lucide-react'
import { signOutAction } from '@/actions/auth-actions'
import { Logo } from '@/components/ui/logo'
import { MobileHeader } from '@/components/layout/mobile-header'
import { UnifiedSidebar } from '@/components/layout/sidebar-unified'

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
            <UnifiedSidebar 
                brandColor="amber"
                logoColor="amber"
                tagline="Programa Afiliados"
                user={{
                    name: profile?.full_name,
                    email: user.email,
                    avatar_url: profile?.avatar_url
                }}
                links={[
                    { href: "/dashboard/affiliate", icon: <Home className="w-5 h-5" />, label: "Visão Geral", exact: true },
                    { href: "/dashboard/affiliate/referrals", icon: <Users className="w-5 h-5" />, label: "Indicados" },
                    { href: "/dashboard/affiliate/earnings", icon: <DollarSign className="w-5 h-5" />, label: "Ganhos" },
                    { href: "/dashboard/affiliate/stats", icon: <BarChart2 className="w-5 h-5" />, label: "Estatísticas" },
                ]}
                extraLinks={profile?.role ? {
                    title: "Também sou",
                    links: [
                        { 
                            href: profile.role === 'trainer' ? "/dashboard/trainer" : "/dashboard/student", 
                            icon: <User className="w-5 h-5" />, 
                            label: profile.role === 'trainer' ? "Dashboard Personal" : "Dashboard Aluno" 
                        }
                    ]
                } : undefined}
                showSettings={false}
            />

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
            className="flex items-center gap-3 pb-4 py-3 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-all duration-200 group"
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
