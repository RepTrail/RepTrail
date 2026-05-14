import { createClient } from '@/lib/supabase/server'
import { AnamnesisForm } from '@/components/store/features(deprecated)/student-anamnesis-form'
import { ClipboardList } from 'lucide-react'
import { RegistryMain } from '@/components/store/advanced/registry-main'

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
        <RegistryMain
            title="ANAMNESE CORPORAL"
            subtitle="Mantenha seus dados atualizados para cálculos precisos de macros e evolução."
            icon="ClipboardList"
            contextLabel="Métricas & Evolução"
            showTabs={false}
        >
            <AnamnesisForm initialData={details} />
        </RegistryMain>
    )
}

