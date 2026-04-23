import { Suspense } from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { 
    Dumbbell, Utensils, Activity, User, Home, ShoppingBag, Trophy, 
    Search, UserCheck, Sparkles, TrendingUp, ClipboardList, Syringe 
} from 'lucide-react'
import { ConditionalMobileNav } from '@/components/layout/conditional-mobile-nav'
import { UnifiedSidebar } from '@/components/layout/sidebar-unified'
import { MobileHeader } from '@/components/layout/mobile-header'
import { SettingsModal } from '@/components/feature/student/settings-modal'
import { NotificationRequestModal } from '@/components/feature/student/notification-request-modal'
import { createClient } from '@/lib/supabase/server'
import { getStudentTrainer } from '@/actions/student-actions'

export default async function StudentLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // ─── OPTIMIZED IDENTITY (0ms) ──────────────────────────────────────────
    // Get identity from header set by middleware to avoid Auth network hit
    const headerList = await headers()
    const userId = headerList.get('x-user-id')

    if (!userId) {
        redirect('/auth/login')
    }

    return (
        <div className="flex h-screen w-full bg-zinc-950 text-white selection:bg-orange-500/30 font-sans">
            {/* 
                CORE SHELL 10/10: 
                The layout returns this structure IMMEDIATELY.
                Specific navigation links/profile info are filled in via Suspense.
            */}
            <Suspense fallback={<div className="hidden md:flex w-72 h-screen bg-zinc-900 border-r border-zinc-800 animate-pulse" />}>
                <DashboardSidebarLoader userId={userId} />
            </Suspense>

            <Suspense fallback={<div className="h-16 w-full bg-zinc-950 border-b border-zinc-900 md:hidden animate-pulse" />}>
                <DashboardNavLoader userId={userId} />
            </Suspense>

            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-zinc-950 relative custom-scrollbar">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-orange-500/10 blur-[80px] rounded-full -mr-32 -mt-32 pointer-events-none gpu-accelerated" />

                <div className="pt-24 md:pt-[50px] px-5 sm:px-6 md:px-8 pb-32 md:pb-10 relative z-10 page-entry">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>

            <Suspense fallback={null}>
                <MobileNavLoader userId={userId} />
            </Suspense>

            <SettingsModal hasTrainer={true} /* Modal logic handles its own state */ />
            <NotificationRequestModal />
        </div>
    )
}

/**
 * ─── ASYNCHRONOUS DATA LOADERS (Deferred) ─────────────────────────────
 * These components handle the actual DB hits without blocking the initial shell.
 */

async function DashboardSidebarLoader({ userId }: { userId: string }) {
    const supabase = await createClient()
    
    const [profileRes, detailsRes, trainerRel] = await Promise.all([
        supabase.from('profiles').select('role, full_name, avatar_url, auto_training_status, auto_training_trial_end').eq('id', userId).single(),
        supabase.from('student_details').select('id, steroid_use').eq('id', userId).single(),
        getStudentTrainer(userId)
    ])

    const profile = profileRes.data
    const details = detailsRes.data

    if (!details) redirect('/onboarding')

    const { steroidUse, hasTrainer, isAutoTrainingActive, filteredLinks } = calculateNavContext(profile, details, !!trainerRel)

    return (
        <UnifiedSidebar 
            brandColor="orange"
            logoColor="orange"
            user={{
                id: userId,
                name: profile?.full_name,
                email: '', // Email not needed for sidebar rendering usually, or fetch from auth if critical
                avatar_url: profile?.avatar_url
            }}
            links={filteredLinks}
            showSettings={true}
        />
    )
}

async function DashboardNavLoader({ userId }: { userId: string }) {
    const supabase = await createClient()
    const [profileRes, detailsRes, trainerRel] = await Promise.all([
        supabase.from('profiles').select('role, auto_training_status, auto_training_trial_end').eq('id', userId).single(),
        supabase.from('student_details').select('steroid_use').eq('id', userId).single(),
        getStudentTrainer(userId)
    ])

    const { steroidUse, hasTrainer, isAutoTrainingActive } = calculateNavContext(profileRes.data, detailsRes.data, !!trainerRel)

    return <MobileHeader role="student" hasTrainer={hasTrainer} steroidUse={steroidUse} autoTrainingActive={isAutoTrainingActive} />
}

async function MobileNavLoader({ userId }: { userId: string }) {
    const supabase = await createClient()
    const [profileRes, trainerRel] = await Promise.all([
        supabase.from('profiles').select('role, auto_training_status, auto_training_trial_end').eq('id', userId).single(),
        getStudentTrainer(userId)
    ])

    const { hasTrainer, isAutoTrainingActive } = calculateNavContext(profileRes.data, null, !!trainerRel)

    return <ConditionalMobileNav userId={userId} hasTrainer={hasTrainer} steroidUse={false} autoTrainingActive={isAutoTrainingActive} />
}

/**
 * ─── SHARED NAV LOGIC ──────────────────────────────────────────────────
 */
function calculateNavContext(profile: any, details: any, hasTrainer: boolean) {
    const now = new Date()
    let isAutoTrainingActive = false
    if (profile?.auto_training_status === 'active') isAutoTrainingActive = true
    else if (profile?.auto_training_status === 'trial' && profile?.auto_training_trial_end) {
        if (now <= new Date(profile.auto_training_trial_end)) isAutoTrainingActive = true
    }

    const steroidUse = !!details?.steroid_use

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

    return { steroidUse, hasTrainer, isAutoTrainingActive, filteredLinks }
}
