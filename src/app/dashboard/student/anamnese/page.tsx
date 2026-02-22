import { createClient } from '@/lib/supabase/server'
import { AnamnesisForm } from '@/components/feature/student/anamnesis-form'

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
            <div className="space-y-2">
                <h1 className="text-4xl font-black tracking-tight text-white font-sans italic uppercase">
                    Anamnese Corporal
                </h1>
                <p className="text-zinc-500 text-sm font-medium">
                    Mantenha seus dados atualizados para cálculos precisos de macros e evolução.
                </p>
            </div>

            <AnamnesisForm initialData={details} />
        </div>
    )
}
