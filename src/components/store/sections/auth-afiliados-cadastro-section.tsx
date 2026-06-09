'use client'

import { Suspense } from 'react'
import { AuthShell } from '@/components/store/advanced/auth-shell'
import { AuthForm } from '@/components/store/advanced/auth-form'

export function AuthAfiliadosCadastroSection() {
    return (
        <AuthShell>
            <Suspense fallback={null}>
                <AuthForm view="affiliate-signup" />
            </Suspense>
        </AuthShell>
    )
}
