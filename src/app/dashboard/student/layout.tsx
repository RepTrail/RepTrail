import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Dumbbell, Utensils, Activity, User, Home, ShoppingBag, Trophy, Search, UserCheck, Sparkles, LogOut, TrendingUp, ClipboardList, Syringe } from 'lucide-react'
import { StudentNav } from '@/components/layout/student-nav'
import { ConditionalMobileNav } from '@/components/layout/conditional-mobile-nav'
import { UnifiedSidebar } from '@/components/layout/sidebar-unified'
import { signOutAction } from '@/actions/auth-actions'
import { getStudentTrainer } from '@/actions/student-actions'
import { Logo } from '@/components/ui/logo'
import { MobileHeader } from '@/components/layout/mobile-header'
import { SettingsModal } from '@/components/feature/student/settings-modal'
import { NotificationRequestModal } from '@/components/feature/student/notification-request-modal'

export default async function StudentLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    // Fetch profile, details and trainer status in parallel to avoid waterfalls
    const [profileRes, detailsRes, trainerRel] = await Promise.all([
        supabase.from('profiles').select('role, full_name, avatar_url, auto_training_status, auto_training_trial_end').eq('id', user.id).single(),
        supabase.from('student_details').select('id, steroid_use').eq('id', user.id).single(),
        getStudentTrainer(user.id)
    ])

    const profile = profileRes.data
    const details = detailsRes.data

    // Note: Cross-dashboard protection is handled by middleware.
    // Do NOT redirect trainers here — middleware already does it, and doing it
    // in both places creates an infinite redirect loop.

    const now = new Date()
    let isAutoTrainingActive = false;

    if (profile?.auto_training_status === 'active') {
        isAutoTrainingActive = true;
    } else if (profile?.auto_training_status === 'trial' && profile?.auto_training_trial_end) {
        const trialEnd = new Date(profile.auto_training_trial_end)
        if (now <= trialEnd) {
            isAutoTrainingActive = true;
        }
    }

    if (!details) {
        redirect('/onboarding')
    }

    const steroidUse = !!details.steroid_use
    const hasTrainer = !!trainerRel

    const allLinks = [
        { href: '/dashboard/student', icon: <Home className="w-4 h-4" />, label: 'Home', exact: true },
        { href: '/dashboard/student/workouts', icon: <Dumbbell className="w-4 h-4" />, label: 'Meus Treinos', requiresTrainer: true },
        { href: '/dashboard/student/cardio', icon: <Activity className="w-4 h-4" />, label: 'Cardio', requiresTrainer: true },
        { href: '/dashboard/student/diet', icon: <Utensils className="w-4 h-4" />, label: 'Minha Dieta', requiresTrainer: true },
        { href: '/dashboard/student/ergogenics', icon: <Syringe className="w-4 h-4" />, label: 'Ergogênicos', requiresTrainer: true, showOnlyIfSteroidUse: true },
        { href: '/dashboard/student/progress', icon: <TrendingUp className="w-4 h-4" />, label: 'Evolução', requiresTrainer: true },
        { href: '/dashboard/student/import-pdf', icon: <Sparkles className="w-4 h-4" />, label: 'Importar PDF', requiresTrainer: true, hideIfHasTrainer: true },
        { href: '/dashboard/student/anamnese', icon: <ClipboardList className="w-4 h-4" />, label: 'Anamnese' },
        { href: '/buscar-personal', icon: <Search className="w-4 h-4" />, label: 'Buscar Personal', hideIfHasTrainer: true },
        { href: '/dashboard/student/feed', icon: <UserCheck className="w-4 h-4" />, label: 'Feed de Alunos' },
        { href: '/dashboard/student/ranking', icon: <Trophy className="w-4 h-4" />, label: 'Ranking' },
        { href: '/dashboard/student/loja', icon: <ShoppingBag className="w-4 h-4" />, label: 'Loja' },
        { href: '/dashboard/student/meu-personal', icon: <UserCheck className="w-4 h-4" />, label: 'Meu Personal', requiresTrainer: true, showOnlyIfHasTrainer: true },
        { href: '/dashboard/student/profile', icon: <User className="w-4 h-4" />, label: 'Meu Perfil' },
    ]

    const filteredLinks = allLinks.filter((link: any) => {
        if (link.hideIfHasTrainer && hasTrainer) return false
        if (link.showOnlyIfHasTrainer && !hasTrainer) return false
        if (link.showOnlyIfSteroidUse && !steroidUse) return false
        if (link.href === '/buscar-personal' && isAutoTrainingActive) return false
        if (link.requiresTrainer && !hasTrainer && !isAutoTrainingActive) return false
        return true
    })

    return (
        <div className="flex h-screen w-full bg-zinc-950 text-white selection:bg-orange-500/30 font-sans">
            <UnifiedSidebar 
                brandColor="orange"
                logoColor="orange"
                user={{
                    name: profile?.full_name,
                    email: user.email,
                    avatar_url: profile?.avatar_url
                }}
                links={filteredLinks}
                showSettings={true}
            />

            {/* Mobile Top Header */}
            <MobileHeader role="student" hasTrainer={hasTrainer} steroidUse={steroidUse} autoTrainingActive={isAutoTrainingActive} />

            {/* Main Content Area */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-zinc-950 relative custom-scrollbar">
                {/* Background Glow - Optimized for mobile performance */}
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-orange-500/10 blur-[80px] rounded-full -mr-32 -mt-32 pointer-events-none gpu-accelerated" />

                <div className="pt-24 md:pt-[50px] px-5 sm:px-6 md:px-8 pb-32 md:pb-10 relative z-10 page-entry">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>

            {/* Mobile Navigation (Floating Bottom Bar) */}
            <ConditionalMobileNav
                hasTrainer={hasTrainer}
                steroidUse={steroidUse}
                autoTrainingActive={isAutoTrainingActive}
            />

            <SettingsModal hasTrainer={hasTrainer} />
            <NotificationRequestModal />
        </div>
    )
}
// Force rebuild 2026-03-16-v1
