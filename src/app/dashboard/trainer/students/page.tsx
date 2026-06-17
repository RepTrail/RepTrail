import { PREFETCH_REGISTRY } from '@/lib/prefetch-registry'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { StudentSearchInput } from '@/components/store/advanced/student-search-input'
import { TrainerStudentsActionsSection } from '@/components/store/sections/trainer-students-actions-section'
import { TrainerStudentsMetricsSection } from '@/components/store/sections/trainer-students-metrics-section'
import { TrainerStudentsListSection } from '@/components/store/sections/trainer-students-list-section'

export default async function StudentsPage() {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')

    if (!userId) redirect('/auth/login')

    const queryClient = getQueryClient()

    // ─── NON-BLOCKING PREFETCHING (0ms Nav) ─────────────────────────────
    const configs = PREFETCH_REGISTRY['/dashboard/trainer/students'](userId)
    await Promise.all(configs.map(c => queryClient.prefetchQuery(c)))

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <RegistryMain
                title="MEUS ALUNOS"
                subtitle="Gerenciamento básico e financeiro dos seus alunos vinculados."
                icon="Users"
                contextLabel="Área do Personal"
                showTabs={false}
                rightElement={<TrainerStudentsActionsSection userId={userId} />}
            >
                <RegistrySection
                    title="Resumo Financeiro"
                    subtitle="Visão geral dos seus indicadores de desempenho."
                    icon="BarChart3"
                >
                    <TrainerStudentsMetricsSection userId={userId} />
                </RegistrySection>
                <RegistrySection
                    title="Lista da Matrícula"
                    subtitle="Gerencie seus alunos ativos e suas informações."
                    icon="Users"
                    rightElement={<StudentSearchInput />}
                >
                    <TrainerStudentsListSection userId={userId} />
                </RegistrySection>
            </RegistryMain>
        </HydrationBoundary>
    )
}
