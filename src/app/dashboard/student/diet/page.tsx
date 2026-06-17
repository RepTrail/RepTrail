import { headers } from 'next/headers'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { StudentRegistryHeaderActions } from '@/components/store/advanced/student-registry-header-actions'
import { StudentDietSection } from '@/components/store/sections/student-diet-section'
import { PremiumLockOverlay } from '@/components/store/intermediary/premium-lock-overlay'
import * as actions from '@/lib/dal/remote'

export default async function StudentDietPage() {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')

    if (!userId) return null

    const trainerRel = await actions.getStudentTrainer(userId)
    let hasFeature = true
    if (trainerRel?.trainer_id) {
        const features = await actions.getTrainerPlanFeatures(trainerRel.trainer_id)
        hasFeature = features?.has_diets ?? false
    }

    return (
        <RegistryMain
            title="MINHA DIETA"
            subtitle="Gerencie suas refeições, macros e suplementação para maximizar seus resultados."
            icon="Utensils"
            contextLabel="Nutrição & Dieta"
            showTabs={false}
            rightElement={hasFeature ? <StudentRegistryHeaderActions userId={userId} type="diet" /> : null}
        >
            <PremiumLockOverlay 
                variant="area" 
                locked={!hasFeature} 
                title="Módulo de Dietas" 
                description="O plano atual do seu personal trainer não inclui o módulo de dietas."
            >
                {hasFeature && (
                    <StudentDietSection userId={userId} />
                )}
            </PremiumLockOverlay>
        </RegistryMain>
    )
}
