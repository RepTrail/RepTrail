import { getTrainerTier, getTrainerStudents, getTrainerProfile } from '@/actions/trainer-actions'
import { PlansClient } from '@/components/store/features(deprecated)/trainer-plans-client'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { CreditCard } from 'lucide-react'

export default async function TrainerPlansPage() {
    const currentTier = await getTrainerTier() as any
    const students = await getTrainerStudents()
    const studentCount = students?.length || 0
    const profile = await getTrainerProfile()

    return (
        <RegistryMain
            title="PLANO & ASSINATURA"
            subtitle="Grátis até 5 alunos. Cresça sem limites pagando só pelo que usar."
            icon={CreditCard}
            contextLabel="Faturamento & Expansão"
            showTabs={false}
        >
            <PlansClient
                currentTier={currentTier}
                studentCount={studentCount}
                profile={profile}
            />
        </RegistryMain>
    )
}

