import { getTrainerStudents } from '@/actions/trainer-actions'
import { ImportPdfClient } from '@/components/feature/pdf/import-pdf-client'

export default async function ImportPdfPage() {
    const students = await getTrainerStudents()

    return <ImportPdfClient students={students} />
}
