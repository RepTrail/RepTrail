import { getProfile } from '@/lib/dal/server'
import * as actions from '@/lib/dal/remote'
import { redirect } from 'next/navigation'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { ImportPdfSectionContent } from '@/components/store/sections/import-pdf-section-content'
import { headers } from 'next/headers'


export const metadata = {
    title: 'Importar PDF | RepTrail'
}

export default async function TrainerImportPdfPage() {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')

    if (!userId) redirect('/auth/login')

    const features = await actions.getTrainerPlanFeatures(userId)
    const students = await actions.getTrainerStudents(userId)
    const profile = await getProfile(userId)

    const importLimit = features?.pdf_import_limit ?? null
    const importsUsed = profile?.ai_pdfs_imported_this_month ?? 0

    return (
        <RegistryMain
            title="IMPORTAÇÃO"
            subtitle="Transforme arquivos PDF em treinos e dietas para seus alunos usando IA."
            icon="FileUp"
            contextLabel="Inteligência Artificial"
            showTabs={false}
        >
            <ImportPdfSectionContent 
                role="trainer" 
                userId={userId} 
                students={students} 
                hasImportPdf={features?.has_import_pdf_ai ?? false}
                importLimit={importLimit}
                importsUsed={importsUsed}
            />
        </RegistryMain>
    )
}
