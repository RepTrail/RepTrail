import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { AffiliateEarningsSection } from '@/components/store/sections/affiliate-earnings-section'
import { DollarSign, Wallet } from 'lucide-react'

export default function AffiliateEarningsPage() {
    return (
        <RegistryMain
            title="MEUS GANHOS"
            subtitle="Extrato completo de suas comissões e histórico de saques."
            icon={DollarSign}
            contextLabel="Área do Afiliado"
            showTabs={false}
        >
            <RegistrySection title="Painel de Ganhos" subtitle="Controle e visualize seu desempenho como afiliado" icon={Wallet}>
                <AffiliateEarningsSection />
            </RegistrySection>
        </RegistryMain>
    )
}
