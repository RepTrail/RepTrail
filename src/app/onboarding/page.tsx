import { OnboardingForm } from '@/components/onboarding/onboarding-form'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function OnboardingPage() {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    // Check if already completed
    const { data: details } = await supabase
        .from('student_details')
        .select('id')
        .eq('id', user.id)
        .single()

    const role = profile?.role || user.user_metadata?.role
    
    if (role === 'trainer') {
        redirect('/dashboard/trainer')
    }

    if (details) {
        redirect('/dashboard/student')
    }

    const trainerCode = user.user_metadata?.trainer_code || ''

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 py-12 ">
            <div className="w-full max-w-[600px]">
                <OnboardingForm defaultTrainerCode={trainerCode} />
            </div>
        </div>
    )
}
