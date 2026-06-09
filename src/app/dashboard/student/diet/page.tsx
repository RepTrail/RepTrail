import { headers } from 'next/headers'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { StudentRegistryHeaderActions } from '@/components/store/advanced/student-registry-header-actions'
import { StudentDietSection } from '@/components/store/sections/student-diet-section'

export default async function StudentDietPage() {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')

    if (!userId) return null

    return (
        <RegistryMain
            title="MINHA DIETA"
            subtitle="Gerencie suas refeições, macros e suplementação para maximizar seus resultados."
            icon="Utensils"
            contextLabel="Nutrição & Dieta"
            showTabs={false}
            rightElement={<StudentRegistryHeaderActions userId={userId} type="diet" />}
        >
            <StudentDietSection userId={userId} />
        </RegistryMain>
    )
}
