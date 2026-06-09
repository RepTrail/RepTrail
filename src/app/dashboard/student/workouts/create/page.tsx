import { getProfile } from '@/lib/dal/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { StudentWorkoutCreateSection } from '@/components/store/sections/student-workout-create-section'

export default async function CreateStudentWorkoutPage() {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')
    if (!userId) redirect('/auth/login')

    const profile = await getProfile(userId)

    const isAutoTrainingActive = profile?.auto_training_status === 'active' || profile?.auto_training_status === 'trial'
    if (!isAutoTrainingActive) redirect('/dashboard/student/workouts')

    return (
        <RegistryMain
            title="Criar Treino"
            subtitle="Crie um novo treino personalizado para o seu plano Auto-Training."
            icon="Dumbbell"
            showTabs={false}
            backPath="/dashboard/student/workouts"
        >
            <StudentWorkoutCreateSection />
        </RegistryMain>
    )
}
