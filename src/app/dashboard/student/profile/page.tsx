import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getQueryClient } from '@/lib/get-query-client'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getStudentProfile, getStudentTrainer } from '@/actions/student-actions'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { StudentProfileSectionContent } from '@/components/store/sections/student-profile-section-content'

export const revalidate = 0

export const metadata = {
    title: 'Meu Perfil | RepTrail'
}

export default async function StudentProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const queryClient = getQueryClient()

    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.student.details(user.id),
            queryFn: () => getStudentProfile(user.id)
        }),
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.profile.trainer(user.id),
            queryFn: () => getStudentTrainer(user.id)
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
                <StudentProfileSectionContent userId={user.id} />
            </HydrationBoundary>
        </RegistryMain>
    )
}
