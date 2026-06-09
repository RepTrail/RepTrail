'use client'

import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Suspense } from 'react'
import { AuthShell } from '@/components/store/advanced/auth-shell'
import { AuthUpdatePasswordForm } from '@/components/store/advanced/auth-update-password-form'
import { Box } from '@/components/store/base/box'

export function AuthUpdatePasswordSection() {
    return (
        <AuthShell>
            <Suspense fallback={<Box opacity={STORE_TOKENS.OPACITY.MODAL}>Carregando...</Box>}>
                <AuthUpdatePasswordForm />
            </Suspense>
        </AuthShell>
    )
}
