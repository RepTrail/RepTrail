import { headers } from 'next/headers'
import { Suspense } from 'react'
import { StudentDietManagementSmart } from '@/components/store/advanced/student-diet-management-smart'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { StudentRegistryHeaderActions } from '@/components/store/advanced/student-registry-header-actions'
import { Box } from '@/components/store/base/box'
import { Surface } from '@/components/store/base/surface'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

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
            <Suspense fallback={
                <Surface animation="pulse" variant="sunken" border="none" gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Box bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.SURFACE} height={500} rounded={STORE_TOKENS.RADIUS.SYSTEM} />
                </Surface>
            }>
                <Box suppressHydrationWarning>
                    <StudentDietManagementSmart userId={userId} />
                </Box>
            </Suspense>
        </RegistryMain>
    )
}
