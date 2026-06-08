import { actions, checkAdminSession } from '@/lib/dal/server'
import { AdminPlansListPanel } from '@/components/store/advanced/admin-plans-list-panel'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { AdminPlanModalTrigger } from '@/components/store/advanced/admin-plan-modal-trigger'

export default async function AdminPlansPage() {
    const plans = await actions.getPlansWithStats()
    const { user: adminUser } = await checkAdminSession()

    return (
        <RegistryMain
                    title="Gestão de Planos"
                    subtitle="Gerencie os planos de assinatura disponíveis no sistema."
                    icon="CreditCard"
                    contextLabel="Painel Admin"
                    showTabs={false}
                    rightElement={<AdminPlanModalTrigger />}
                >
                    <RegistrySection>
                        <AdminPlansListPanel plans={plans as any[]} />
                    </RegistrySection>
                </RegistryMain>
    )
}
