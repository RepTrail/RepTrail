'use client'

import { RegistryProvider } from '@/components/store/advanced/registry-context'
import { AuthAfiliadosLoginSection } from '@/components/store/sections/auth-afiliados-login-section'

export default function AffiliadosLoginPage() {
    return (
        <RegistryProvider defaultColor="amber">
            <AuthAfiliadosLoginSection />
        </RegistryProvider>
    )
}
