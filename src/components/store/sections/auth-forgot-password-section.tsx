'use client'

import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Suspense } from 'react'
import { AuthShell } from '@/components/store/advanced/auth-shell'
import { AuthForgotPasswordForm } from '@/components/store/advanced/auth-forgot-password-form'
import { Box } from '@/components/store/base/box'

export function AuthForgotPasswordSection() {
    return (
        <AuthShell>
            <Suspense fallback={<Box opacity={STORE_TOKENS.OPACITY.MODAL}>Carregando...</Box>}>
                <AuthForgotPasswordForm />
            </Suspense>
        </AuthShell>
    )
}
