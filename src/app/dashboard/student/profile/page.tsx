import { createClient } from '@/lib/supabase/server'
import { getStudentProfile } from '@/actions/student-actions'
import { ShieldCheck } from 'lucide-react'
import { StudentProfileForm } from '@/components/feature/student/student-profile-form'
import { redirect } from 'next/navigation'

export const revalidate = 0

export default async function StudentProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const profile = await getStudentProfile(user.id)

    if (!profile) return null

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
                        Meu Perfil
                    </h1>
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        Configurações da conta e dados físicos
                    </p>
                </div>
            </header>

            <StudentProfileForm profile={profile} />
        </div>
    )
}
