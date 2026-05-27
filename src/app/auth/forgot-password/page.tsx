
'use client';
import { STORE_TOKENS } from '@/components/store/constants/tokens';

import { AuthForgotPasswordForm } from '@/components/store/advanced/auth-forgot-password-form'
import { Suspense } from 'react'
import { RegistryProvider } from '@/components/store/advanced/registry-context'
import { AuthShell } from '@/components/store/advanced/auth-shell'
import { Box } from '@/components/store/base/box'

export default function ForgotPasswordPage() {
    return (
        <RegistryProvider>
            <AuthShell>
                <Suspense fallback={<Box opacity={STORE_TOKENS.OPACITY.MODAL}>Carregando...</Box>}>
                    <AuthForgotPasswordForm />
                </Suspense>
            </AuthShell>
        </RegistryProvider>
    );
}
