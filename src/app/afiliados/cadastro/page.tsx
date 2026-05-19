import { AuthForm } from '@/components/store/advanced/auth-form'
import { Suspense } from 'react'

import { RegistryProvider } from '@/components/store/advanced/registry-context'
import { AuthShell } from '@/components/store/advanced/auth-shell'

export default function AffiliadosCadastroPage() {
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
