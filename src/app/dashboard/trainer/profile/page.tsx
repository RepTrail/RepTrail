import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getQueryClient } from '@/lib/get-query-client'
import { QUERY_KEYS } from '@/lib/query-keys'
import { actions } from '@/lib/dal/server'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { TrainerProfileSectionContent } from '@/components/store/sections/trainer-profile-section-content'
import { TrainerProfileNotFoundSection } from '@/components/store/sections/trainer-profile-not-found-section'

export const revalidate = 0

export const metadata = {
    title: 'Meu Perfil | RepTrail',
}

export default async function TrainerProfilePage() {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')

    if (!userId) redirect('/auth/login')

    const profile = await actions.getTrainerProfile(userId)
    if (!profile) {
        return (
            <RegistryMain
                title="MEU PERFIL"
                subtitle="Gerencie sua identidade profissional e acompanhe seu progresso na plataforma."
                icon="UserCheck"
                contextLabel="Conta & Segurança"
                showTabs={false}
            >
                <TrainerProfileNotFoundSection />
            </RegistryMain>
        )
    }

    const queryClient = getQueryClient()
    queryClient.setQueryData(QUERY_KEYS.trainer.profile(userId), profile)

    return (
        <RegistryMain
            title="MEU PERFIL"
            subtitle="Gerencie sua identidade profissional e acompanhe seu progresso na plataforma."
            icon="UserCheck"
            contextLabel="Conta & Segurança"
            showTabs={false}
        >
            <TrainerProfileSectionContent userId={userId} profile={profile} />
        </RegistryMain>
    )
}
