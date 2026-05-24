import { createClient } from '@/lib/supabase/server'
import { getStudentTrainer } from '@/actions/student-actions'
import { redirect } from 'next/navigation'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { MeuPersonalSectionContent } from '@/components/store/sections/meu-personal-section-content'
import { headers } from 'next/headers'

export default async function MeuPersonalPage() {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')
    if (!userId) redirect('/auth/login')

    const supabase = await createClient()

    const trainerRel = await getStudentTrainer(userId)
    if (!trainerRel || !trainerRel.trainer) redirect('/dashboard/student/buscar-personal')

    const trainer = trainerRel.trainer

    // Fetch existing review for the student and trainer
    const { data: existingReview } = await supabase
        .from('trainer_reviews')
        .select('*')
        .eq('student_id', userId)
        .eq('trainer_id', trainer.id)
        .maybeSingle()

    return (
        <RegistryMain
            title="MEU PERSONAL"
            subtitle="Seu treinador de confiança. Acompanhe seus protocolos e entre em contato direto."
            icon="UserCheck"
            contextLabel="Relacionamento & Performance"
            showTabs={false}
        >
            <MeuPersonalSectionContent
                trainer={trainer}
                trainerRel={trainerRel}
                existingReview={existingReview}
            />
        </RegistryMain>
    )
}
