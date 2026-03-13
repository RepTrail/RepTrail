import { getTrainerTier, getTrainerStudents, getTrainerProfile } from '@/actions/trainer-actions'
import { PlansClient } from '@/components/feature/trainer/plans-client'

export default async function TrainerPlansPage() {
    const currentTier = await getTrainerTier() as any
    const students = await getTrainerStudents()
    const studentCount = students?.length || 0
    const profile = await getTrainerProfile()

    return (
        <div className="space-y-10 pb-10" suppressHydrationWarning>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-zinc-800/50">
                <div className="space-y-2 sm:space-y-5">
                    <h1 className="text-4xl font-black tracking-tight text-white font-sans italic uppercase">
                        Plano & Assinatura
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium">
                        Grátis até 5 alunos. Cresça sem limites pagando só pelo que usar.
                    </p>
                </div>
            </div>

            <PlansClient
                currentTier={currentTier}
                studentCount={studentCount}
                profile={profile}
            />
        </div>
    )
}
