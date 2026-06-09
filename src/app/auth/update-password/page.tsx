'use client'

import { RegistryProvider } from '@/components/store/advanced/registry-context'
import { AuthUpdatePasswordSection } from '@/components/store/sections/auth-update-password-section'

export default function UpdatePasswordPage() {
    return (
        <RegistryProvider>
            <AuthUpdatePasswordSection />
        </RegistryProvider>
    );
}
