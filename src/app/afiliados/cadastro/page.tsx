'use client'

import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RegistryProvider } from '@/components/store/advanced/registry-context'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { AuthAfiliadosCadastroSection } from '@/components/store/sections/auth-afiliados-cadastro-section'
import { UserPlus } from 'lucide-react'

export default function AffiliadosCadastroPage() {
    return (
        <RegistryProvider defaultColor="amber">
            <RegistryMain
                title="Cadastro de Parceiro"
                subtitle="Torne-se um afiliado RepTrail"
                icon={UserPlus}
                showHeader={false}
            >
                <RegistrySection
                    title="Cadastro de Afiliado"
                    subtitle="Torne-se um parceiro RepTrail."
                    icon={UserPlus}
                >
                    <AuthAfiliadosCadastroSection />
                </RegistrySection>
            </RegistryMain>
        </RegistryProvider>
    )
}
