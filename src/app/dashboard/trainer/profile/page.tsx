import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getQueryClient } from '@/lib/get-query-client'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getTrainerProfile } from '@/actions/trainer-actions'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { TrainerProfileSectionContent } from '@/components/store/sections/trainer-profile-section-content'

import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

export const revalidate = 0

export const metadata = {
    title: 'Meu Perfil | RepTrail',
}

export default async function TrainerProfilePage() {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')

    if (!userId) redirect('/auth/login')

    const profile = await getTrainerProfile(userId)
    if (!profile) {
        return (
            <Box fullWidth padding={STORE_TOKENS.PADDING.CONTAINER} textAlign="center">
                <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="bold">
                    Perfil não encontrado.
                </Font>
            </Box>
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
