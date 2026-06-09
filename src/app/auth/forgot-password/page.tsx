'use client'

import { RegistryProvider } from '@/components/store/advanced/registry-context'
import { AuthForgotPasswordSection } from '@/components/store/sections/auth-forgot-password-section'

export default function ForgotPasswordPage() {
    return (
        <RegistryProvider>
            <AuthForgotPasswordSection />
        </RegistryProvider>
    );
}
