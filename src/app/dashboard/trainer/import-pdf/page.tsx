import { getTrainerStudents } from '@/actions/trainer-actions'
import { ImportPdfClient } from '@/components/store/features(deprecated)/import-pdf-client'
import { createClient } from '@/lib/supabase/server'
import { RegistryMain } from '@/components/store/advanced/registry-main'

export default async function ImportPdfPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const students = await getTrainerStudents()

    return (
        <RegistryMain
            title="IMPORTAÇÃO"
            subtitle="Transforme arquivos PDF em treinos e dietas para seus alunos usando IA."
            icon="FileUp"
            contextLabel="Inteligência Artificial"
            showTabs={false}
        >
            <ImportPdfClient students={students} userId={user.id} />
        </RegistryMain>
    )
}

