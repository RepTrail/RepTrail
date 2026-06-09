import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { AffiliateReferralsSection } from '@/components/store/sections/affiliate-referrals-section'
import { Users, UserPlus } from 'lucide-react'

export default function AffiliateReferralsPage() {
    return (
        <RegistryMain
            title="MEUS INDICADOS"
            subtitle="Acompanhe todos os usuários que se cadastraram através do seu link."
            icon={Users}
            contextLabel="Área do Afiliado"
            showTabs={false}
        >
            <RegistrySection title="Painel de Rede" subtitle="Visualize as métricas e a lista da sua rede de indicações" icon={UserPlus}>
                <AffiliateReferralsSection />
            </RegistrySection>
        </RegistryMain>
    )
}
