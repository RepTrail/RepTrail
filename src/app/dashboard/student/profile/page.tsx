import { createClient } from '@/lib/supabase/server'
import { getStudentProfile, getStudentTrainer } from '@/actions/student-actions'
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
    const trainerRel = await getStudentTrainer(user.id)

    if (!profile) return null

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-500 rounded-xl">
                        <ShieldCheck className="w-5 h-5 text-zinc-950" />
                    </div>
                    <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
                        Meu <span className="text-orange-500">Perfil</span>
                    </h1>
                </div>
                <p className="text-zinc-500 text-sm font-medium max-w-md flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    Configurações da conta e dados físicos
                </p>
            </header>

            <StudentProfileForm profile={profile} hasTrainer={!!trainerRel} />
        </div>
    )
}
