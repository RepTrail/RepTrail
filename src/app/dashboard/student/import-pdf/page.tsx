import { ImportPdfClient } from '@/components/feature/pdf/import-pdf-client'

export const metadata = {
    title: 'Importar PDF | RepTrail'
}

export default async function StudentImportPdfPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <ImportPdfClient role="student" />
        </div>
    )
}
