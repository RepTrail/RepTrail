'use client'

import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RegistryProvider } from '@/components/store/advanced/registry-context'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { AuthForgotPasswordSection } from '@/components/store/sections/auth-forgot-password-section'
import { KeyRound } from 'lucide-react'

export default function ForgotPasswordPage() {
    return (
        <RegistryProvider>
            <RegistryMain
                title="Recuperar Senha"
                subtitle="Recuperação de acesso"
                icon={KeyRound}
                showHeader={false}
            >
                <RegistrySection
                    title="Recuperação de Senha"
                    subtitle="Recupere o acesso à sua conta."
                    icon={KeyRound}
                >
                    <AuthForgotPasswordSection />
                </RegistrySection>
            </RegistryMain>
        </RegistryProvider>
    );
}
