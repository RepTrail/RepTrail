import { getStudentDetails } from '@/lib/dal/server'
import { AnamnesisForm } from '@/components/store/advanced/student-anamnesis-form'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AnamnesisPage() {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')
    if (!userId) redirect('/auth/login')

    const details = await getStudentDetails(userId)

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

