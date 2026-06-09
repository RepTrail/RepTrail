import { headers } from 'next/headers'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { StudentRegistryHeaderActions } from '@/components/store/advanced/student-registry-header-actions'
import { StudentCardioSection } from '@/components/store/sections/student-cardio-section'

export default async function StudentCardioPage() {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')

    if (!userId) return null

    return (
        <RegistryMain
            title="MEUS CARDIOS"
            subtitle="Acompanhe e registre suas sessões de treinamento aeróbico."
            icon="Flame"
            contextLabel="Condicionamento & Saúde"
            showTabs={false}
            rightElement={<StudentRegistryHeaderActions userId={userId} type="cardio" />}
        >
            <StudentCardioSection userId={userId} />
        </RegistryMain>
    );
}


