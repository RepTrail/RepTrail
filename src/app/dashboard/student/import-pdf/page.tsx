import { redirect } from 'next/navigation'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { ImportPdfSectionContent } from '@/components/store/sections/import-pdf-section-content'
import { headers } from 'next/headers'

export const metadata = {
    title: 'Importar PDF | RepTrail'
}

export default async function StudentImportPdfPage() {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')
    if (!userId) redirect('/auth/login')

    return (
        <RegistryMain
            title="IMPORTAÇÃO"
            subtitle="Transforme seus arquivos PDF em treinos e dietas interativos usando nossa tecnologia de IA."
            icon="FileUp"
            contextLabel="Inteligência Artificial"
            showTabs={false}
        >
            <ImportPdfSectionContent role="student" userId={userId} />
        </RegistryMain>
    )
}
