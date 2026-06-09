'use client'

import { RegistryProvider } from '@/components/store/advanced/registry-context'
import { AuthAfiliadosCadastroSection } from '@/components/store/sections/auth-afiliados-cadastro-section'

export default function AffiliadosCadastroPage() {
    return (
        <RegistryProvider defaultColor="amber">
            <AuthAfiliadosCadastroSection />
        </RegistryProvider>
    )
}
