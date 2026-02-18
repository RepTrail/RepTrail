
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    // Check Role in Metadata (fastest check)
    const role = user.user_metadata.role

    if (role === 'trainer') {
        redirect('/dashboard/trainer')
    } else {
        // Default to student
        redirect('/dashboard/student')
    }
}
