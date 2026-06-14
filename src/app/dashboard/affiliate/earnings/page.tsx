'use client'

import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { AffiliateEarningsWalletContent, AffiliateEarningsHistorySection } from '@/components/store/sections/affiliate-earnings-section'
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
            <RegistrySection
                title="Sua Carteira"
                subtitle="Gestão de saldo e solicitações de saque de comissões."
                icon={Wallet}
            >
                <AffiliateEarningsWalletContent />
            </RegistrySection>
            
            
            <AffiliateEarningsHistorySection />
        </RegistryMain>
    )
}
