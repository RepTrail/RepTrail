import { createClient } from '@/lib/supabase/server'
import { getStudentErgogenics, getErgogenicLogs } from '@/actions/ergogenics-actions'
import { redirect } from 'next/navigation'
import { StudentErgogenicsViewWrapper } from '@/components/feature/student/ergogenics-view-wrapper'

export default async function ErgogenicsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

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

    return (
        <div className="space-y-10 pb-10">
            {/* Header */}
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
