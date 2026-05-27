
'use client';
import { STORE_TOKENS } from '@/components/store/constants/tokens';

import { AuthUpdatePasswordForm } from '@/components/store/advanced/auth-update-password-form'
import { Suspense } from 'react'
import { RegistryProvider } from '@/components/store/advanced/registry-context'
import { AuthShell } from '@/components/store/advanced/auth-shell'
import { Box } from '@/components/store/base/box'

export default function UpdatePasswordPage() {
    return (
        <RegistryProvider>
            <AuthShell>
                <Suspense fallback={<Box opacity={STORE_TOKENS.OPACITY.MODAL}>Carregando...</Box>}>
                    <AuthUpdatePasswordForm />
                </Suspense>
            </AuthShell>
        </RegistryProvider>
    );
}
