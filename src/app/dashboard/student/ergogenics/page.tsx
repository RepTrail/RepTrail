import { createClient } from '@/lib/supabase/server'
import { getStudentErgogenics, getErgogenicLogs } from '@/actions/ergogenics-actions'
import { redirect } from 'next/navigation'
import { StudentErgogenicsViewWrapper } from '@/components/feature/student/ergogenics-view-wrapper'
import { Activity } from 'lucide-react'
import { AutoTrainingErgogenicsManager } from '@/components/feature/student/auto-training-ergogenics-manager'

export default async function ErgogenicsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: trainerRel } = await supabase
        .from('trainer_students')
        .select('trainer_id')
        .eq('student_id', user.id)
        .eq('active', true)
        .maybeSingle()

    const { data: profile } = await supabase
        .from('profiles')
        .select('auto_training_status')
        .eq('id', user.id)
        .single()

    const isAutoTrainingActive = profile?.auto_training_status === 'active' || profile?.auto_training_status === 'trial'

    // Verify if steroid_use is enabled
    const { data: details } = await supabase
        .from('student_details')
        .select('steroid_use')
        .eq('id', user.id)
        .single()

    if (!details?.steroid_use) {
        redirect('/dashboard/student')
    }

    const { data: ergogenics } = await getStudentErgogenics(user.id)
    const { data: logs } = await getErgogenicLogs(user.id)

    // Auto-training (no trainer): CRUD manager view
    if (!trainerRel && isAutoTrainingActive) {
        return (
            <div className="space-y-10 pb-10">
                <AutoTrainingErgogenicsManager ergogenics={ergogenics || []} />
            </div>
        )
    }

    return (
        <div className="space-y-10 pb-10">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-500 rounded-xl">
                    <Activity className="w-5 h-5 text-zinc-950" />
                </div>
                <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
                    Meus <span className="text-orange-500">Ergogênicos</span>
                </h1>
            </div>
            <p className="text-zinc-500 text-sm font-medium max-w-md">
                Acompanhe e registre suas substâncias e dosagens prescritas.
            </p>
            <div className="flex flex-col gap-2 pb-2 border-b border-zinc-800/50">
                <h1 className="text-4xl font-black tracking-tight text-white font-sans italic uppercase flex items-center gap-3">
                    Meu Protocolo
                </h1>
                <p className="text-zinc-500 text-sm font-medium">
                    Acompanhe e registre suas substâncias e dosagens prescritas.
                </p>
            </div>

            <StudentErgogenicsViewWrapper
                studentId={user.id}
                ergogenics={ergogenics || []}
                initialLogs={logs || []}
            />
        </div>
    )
}
