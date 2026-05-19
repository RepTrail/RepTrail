import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { ImportPdfSectionContent } from '@/components/store/sections/import-pdf-section-content'

export const metadata = {
    title: 'Importar PDF | RepTrail'
}

export default async function StudentImportPdfPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    return (
        <RegistryMain
            title="IMPORTAÇÃO"
            subtitle="Transforme seus arquivos PDF em treinos e dietas interativos usando nossa tecnologia de IA."
            icon="FileUp"
            contextLabel="Inteligência Artificial"
            showTabs={false}
        >
            <ImportPdfSectionContent role="student" userId={user.id} />
        </RegistryMain>
    )
}
