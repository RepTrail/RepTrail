import { ImportPdfClient } from '@/components/feature/pdf/import-pdf-client'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata = {
    title: 'Importar PDF | RepTrail'
}

export default async function StudentImportPdfPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    return (
        <div className="max-w-4xl mx-auto">
            <ImportPdfClient role="student" userId={user.id} />
        </div>
    )
}
