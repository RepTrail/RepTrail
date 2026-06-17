import { headers } from 'next/headers'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { StudentRegistryHeaderActions } from '@/components/store/advanced/student-registry-header-actions'
import { StudentCardioSection } from '@/components/store/sections/student-cardio-section'
import { PremiumLockOverlay } from '@/components/store/intermediary/premium-lock-overlay'
import * as actions from '@/lib/dal/remote'

export default async function StudentCardioPage() {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')

    if (!userId) return null

    const trainerRel = await actions.getStudentTrainer(userId)
    let hasFeature = true
    if (trainerRel?.trainer_id) {
        const features = await actions.getTrainerPlanFeatures(trainerRel.trainer_id)
        hasFeature = features?.has_cardio ?? false
    }

    return (
        <RegistryMain
            title="MEUS CARDIOS"
            subtitle="Acompanhe e registre suas sessões de treinamento aeróbico."
            icon="Flame"
            contextLabel="Condicionamento & Saúde"
            showTabs={false}
            rightElement={hasFeature ? <StudentRegistryHeaderActions userId={userId} type="cardio" /> : null}
        >
            <PremiumLockOverlay 
                variant="area" 
                locked={!hasFeature} 
                title="Módulo de Cardios" 
                description="O plano atual do seu personal trainer não inclui o módulo de cardios."
            >
                {hasFeature && (
                    <StudentCardioSection userId={userId} />
                )}
            </PremiumLockOverlay>
        </RegistryMain>
    );
}


