import { createClient } from '@/lib/supabase/server'
import { AnamnesisForm } from '@/components/feature/student/anamnesis-form'
import { ClipboardList } from 'lucide-react'

export default async function AnamnesisPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: details } = await supabase
        .from('student_details')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="space-y-10 pb-20 animate-in fade-in duration-700">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-500 rounded-xl">
                    <ClipboardList className="w-5 h-5 text-zinc-950" />
                </div>
                <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
                    Anamnese <span className="text-orange-500">Corporal</span>
                </h1>
            </div>
            <p className="text-zinc-500 text-sm font-medium max-w-md">
                Mantenha seus dados atualizados para cálculos precisos de macros e evolução.
            </p>
            <AnamnesisForm initialData={details} />
        </div>
    )
}
