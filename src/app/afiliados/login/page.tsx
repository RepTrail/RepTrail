'use client'

import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RegistryProvider } from '@/components/store/advanced/registry-context'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { AuthAfiliadosLoginSection } from '@/components/store/sections/auth-afiliados-login-section'
import { Link2, LogIn } from 'lucide-react'

export default function AffiliadosLoginPage() {
    return (
        <RegistryProvider defaultColor="amber">
            <RegistryMain
                title="Portal do Afiliado"
                subtitle="Gerencie suas indicações e comissões"
                icon={Link2}
                showHeader={false}
            >
                <RegistrySection
                    title="Acesso de Afiliado"
                    subtitle="Entre no seu painel de parceiro."
                    icon={LogIn}
                >
                    <AuthAfiliadosLoginSection />
                </RegistrySection>
            </RegistryMain>
        </RegistryProvider>
    )
}
