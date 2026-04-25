import { getTrainerStudents } from '@/actions/trainer-actions'
import { ImportPdfClient } from '@/components/feature/pdf/import-pdf-client'
import { createClient } from '@/lib/supabase/server'

export default async function ImportPdfPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const students = await getTrainerStudents()

    return <ImportPdfClient students={students} userId={user.id} />
}
