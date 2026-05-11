import { AuthForm } from '@/components/store/advanced/auth-form'
import { Suspense } from 'react'
import { AuthFormSkeleton } from '@/components/store/advanced/auth-form-skeleton'
import { RegistryProvider } from '@/components/store/advanced/registry-context'
import { AuthShell } from '@/components/store/advanced/auth-shell'

export default function AffiliadosCadastroPage() {
    return (
        <RegistryProvider defaultColor="amber">
            <AuthShell>
                <Suspense fallback={<AuthFormSkeleton />}>
                    <AuthForm view="affiliate-signup" />
                </Suspense>
            </AuthShell>
        </RegistryProvider>
    )
}
