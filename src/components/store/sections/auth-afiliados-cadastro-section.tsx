'use client'

import { Suspense } from 'react'
import { AuthShell } from '@/components/store/advanced/auth-shell'
import { AuthForm } from '@/components/store/advanced/auth-form'
import { RegistryProvider } from '@/components/store/base/registry-context'

export function AuthAfiliadosCadastroSection() {
    return (
        <RegistryProvider defaultColor="amber">
            <AuthShell>
                <Suspense fallback={null}>
                    <AuthForm view="affiliate-signup" />
                </Suspense>
            </AuthShell>
        </RegistryProvider>
    )
}
