
'use client'

import { AuthUpdatePasswordForm } from '@/components/store/sections/auth-update-password-form'
import { Suspense } from 'react'
import { RegistryProvider } from '@/components/store/advanced/registry-context'
import { AuthShell } from '@/components/store/advanced/auth-shell'
import { Box } from '@/components/store/base/box'

export default function UpdatePasswordPage() {
    return (
        <RegistryProvider>
            <AuthShell>
                <Suspense fallback={<Box opacity={50}>Carregando...</Box>}>
                    <AuthUpdatePasswordForm />
                </Suspense>
            </AuthShell>
        </RegistryProvider>
    )
}
