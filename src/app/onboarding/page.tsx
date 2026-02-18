import { OnboardingForm } from '@/components/onboarding/onboarding-form'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function OnboardingPage() {
    const supabase = await createClient()
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

    if (details) {
        redirect('/dashboard/student')
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 py-12 px-4">
            <div className="w-full max-w-[600px]">
                <OnboardingForm />
            </div>
        </div>
    )
}
