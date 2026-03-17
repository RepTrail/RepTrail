import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Home, Users, Dumbbell, Utensils, FileUp, User, LogOut, Trophy, CreditCard } from 'lucide-react'
import { signOutAction } from '@/actions/auth-actions'
import { TermsAcceptanceModal } from '@/components/feature/terms-acceptance-modal'
import { LastSeenTracker } from '@/components/layout/last-seen-tracker'

export default async function DashboardLayout({
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

    // Check if user is a student and if they have completed onboarding
    // to avoid flashing the terms modal before the redirect to /onboarding
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    const effectiveRole = profile?.role || user.user_metadata?.role
    let skipTerms = false

    if (effectiveRole === 'student') {
        const { data: details } = await supabase.from('student_details').select('id').eq('id', user.id).single()
        if (!details) {
            skipTerms = true
        }
    }

    return (
        <div className="min-h-screen w-full bg-zinc-950">
            <LastSeenTracker />
            {!skipTerms && <TermsAcceptanceModal />}
            {children}
        </div>
    )
}

function NavLink({ href, children, icon }: { href: string; children: React.ReactNode; icon?: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 pb-4  py-3 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-all duration-200 group"
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
