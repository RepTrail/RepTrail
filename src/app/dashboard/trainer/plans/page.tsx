import { getTrainerTier, getPublicPlanPricing, getTrainerStudents } from '@/actions/trainer-actions'
import { PlansClient } from '@/components/feature/trainer/plans-client'

export default async function TrainerPlansPage() {
    const currentTier = await getTrainerTier() as any
    const pricing = await getPublicPlanPricing()
    const students = await getTrainerStudents()
    const studentCount = students?.length || 0

    return (
        <div className="space-y-10 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-zinc-800/50">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight text-white font-sans italic uppercase">
                        Planos & Assinatura
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium">
                        Escolha o plano ideal para o seu negócio e desbloqueie funcionalidades exclusivas.
                    </p>
                </div>
            </div>

            <PlansClient currentTier={currentTier} pricing={pricing} studentCount={studentCount} />
        </div>
    )
}
