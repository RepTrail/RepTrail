import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getQueryClient } from '@/lib/get-query-client'
import { actions, HydrationBoundary, dehydrate } from '@/lib/dal'
import { QUERY_KEYS } from '@/lib/query-keys'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { StudentProfileSectionContent } from '@/components/store/sections/student-profile-section-content'

export const revalidate = 0

export const metadata = {
    title: 'Meu Perfil | RepTrail'
}

export default async function StudentProfilePage() {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')
    if (!userId) redirect('/auth/login')

    const queryClient = getQueryClient()

    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.student.details(userId),
            queryFn: () => actions.getStudentProfile(userId)
        }),
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.profile.trainer(userId),
            queryFn: () => actions.getStudentTrainer(userId)
        })
    ])

    return (
        <RegistryMain
            title="MEU PERFIL"
            subtitle="Configurações da conta e dados físicos."
            icon="User"
            contextLabel="Conta & Segurança"
            showTabs={false}
        >
            <HydrationBoundary state={dehydrate(queryClient)}>
                <StudentProfileSectionContent userId={userId} />
            </HydrationBoundary>
        </RegistryMain>
    )
}
