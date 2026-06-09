'use client'

import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RegistryProvider } from '@/components/store/advanced/registry-context'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { AuthUpdatePasswordSection } from '@/components/store/sections/auth-update-password-section'
import { ShieldCheck, KeyRound } from 'lucide-react'

export default function UpdatePasswordPage() {
    return (
        <RegistryProvider>
            <RegistryMain
                title="Atualizar Senha"
                subtitle="Crie uma nova senha segura"
                icon={ShieldCheck}
                showHeader={false}
            >
                <RegistrySection
                    title="Atualização de Senha"
                    subtitle="Defina sua nova senha."
                    icon={KeyRound}
                >
                    <AuthUpdatePasswordSection />
                </RegistrySection>
            </RegistryMain>
        </RegistryProvider>
    );
}
