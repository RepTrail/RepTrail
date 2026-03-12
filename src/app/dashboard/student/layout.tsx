import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { StudentNav } from '@/components/layout/student-nav'
import { ConditionalMobileNav } from '@/components/layout/conditional-mobile-nav'
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
        supabase.from('profiles').select('role, auto_training_status, auto_training_trial_end').eq('id', user.id).single(),
        supabase.from('student_details').select('id, steroid_use').eq('id', user.id).single(),
        getStudentTrainer(user.id)
    ])

    const profile = profileRes.data
    const details = detailsRes.data

    if (profile?.role === 'trainer') {
        redirect('/dashboard/trainer')
    }

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

    return (
        <div className="flex h-screen w-full bg-zinc-950 text-white selection:bg-emerald-500/30">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-72 bg-zinc-950 border-r border-zinc-900/50 p-6 flex-col justify-between shadow-2xl z-20">
                <div>
                    {/* Logo Container */}
                    <div className="mb-10 flex items-center justify-start px-4">
                        <Link href="/">
                            <Logo size="md" />
                        </Link>
                    </div>

                    <StudentNav hasTrainer={hasTrainer} steroidUse={steroidUse} autoTrainingActive={isAutoTrainingActive} />
                </div>

                <div className="pt-6 border-t border-zinc-800 space-y-4">
                    <form action={signOutAction}>
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 h-12 rounded-xl transition-all group px-4"
                        >
                            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="font-bold uppercase tracking-widest text-[10px]">Sair da Conta</span>
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Mobile Top Header */}
            <MobileHeader role="student" hasTrainer={hasTrainer} steroidUse={steroidUse} autoTrainingActive={isAutoTrainingActive} />

            {/* Main Content Area */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-zinc-950 relative custom-scrollbar">
                {/* Background Glow - Optimized for mobile performance */}
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/10 blur-[80px] rounded-full -mr-32 -mt-32 pointer-events-none gpu-accelerated" />

                <div className="pt-24 md:pt-[50px] px-container-padding pb-32 md:pb-10 relative z-10 page-entry">
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
// Force rebuild 2026-02-25
