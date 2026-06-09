import { getStudentTrainerReview, actions } from '@/lib/dal/server'
import { redirect } from 'next/navigation'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { MeuPersonalSectionContent } from '@/components/store/sections/meu-personal-section-content'
import { headers } from 'next/headers'

export default async function MeuPersonalPage() {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')
    if (!userId) redirect('/auth/login')

    const trainerRel = await actions.getStudentTrainer(userId)
    if (!trainerRel || !trainerRel.trainer) redirect('/dashboard/student/buscar-personal')

    const trainer = trainerRel.trainer

    // Fetch existing review for the student and trainer
    const existingReview = await getStudentTrainerReview(userId, trainer.id)

    return (
        <RegistryMain
            title="MEU PERSONAL"
            subtitle="Seu treinador de confiança. Acompanhe seus protocolos e entre em contato direto."
            icon="UserCheck"
            contextLabel="Relacionamento & Performance"
            showTabs={false}
        >
            <RegistrySection>
                <MeuPersonalSectionContent
                    trainer={trainer}
                    trainerRel={trainerRel}
                    existingReview={existingReview}
                />
            </RegistrySection>
        </RegistryMain>
    )
}
