'use client';
import { useAuthUser, useQuery } from '@/lib/dal'
import { getAdminPayouts } from '@/lib/dal/remote'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { HeartHandshake, Banknote } from 'lucide-react'
import { AdminAffiliatesList } from '@/components/store/advanced/admin-affiliates-list'
import { AdminPayoutsManagementPanel } from '@/components/store/advanced/admin-payouts-management-panel'

export default function AdminAfiliadosPage() {
    const { data: adminUser } = useAuthUser()
    const { data: payoutsData } = useQuery({
        queryKey: ['admin-payouts'],
        queryFn: () => getAdminPayouts()
    })

    const payouts = payoutsData?.data || []

    return (
        <RegistryMain
            title="GESTÃO DE AFILIADOS"
            subtitle="Administração de parceiros comerciais, comissões e indicações."
            icon={HeartHandshake}
            contextLabel="Painel Admin"
            showTabs={false}
        >
            <RegistrySection
                title="Gestão de Parceiros"
                subtitle="Visualize e gerencie todos os afiliados ativos no sistema."
                icon={HeartHandshake}
            >
                <AdminAffiliatesList />
            </RegistrySection>

            <RegistrySection
                title="Solicitações de Saque"
                subtitle="Gestão de pagamentos e transferências para afiliados."
                icon={Banknote}
            >
                <AdminPayoutsManagementPanel initialPayouts={payouts} />
            </RegistrySection>
        </RegistryMain>
    );
}
