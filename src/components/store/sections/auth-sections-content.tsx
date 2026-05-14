'use client'

import React from 'react'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { Stack } from '@/components/store/base/stack'
import { ShieldCheck } from 'lucide-react'
import { AuthLoginForm } from '@/components/store/advanced/auth-login-form'
import { AuthSignUpForm } from '@/components/store/advanced/auth-signup-form'
import { AuthAffiliateSignUpForm } from '@/components/store/advanced/auth-affiliate-signup-form'
import { AuthForgotPasswordForm } from '@/components/store/advanced/auth-forgot-password-form'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

export function AuthSectionsContent({ id }: { id?: string }) {
    return (
        <RegistrySection
            id={id}
            title="Autenticação"
            subtitle="Formulários de acesso e cadastro padronizados."
            icon={ShieldCheck}
        >
            <Stack
                direction={{ base: 'col', md: 'row' }}
                gap={STORE_TOKENS.SPACING.EMPTY_STATE}
                justify="between"
                align={{ base: 'stretch', md: 'start' }}
                width="full"
                overflowX='hidden'
            >
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER} align="center" width="full" maxWidth="auth-form">
                    <AuthLoginForm syncColor={false} />
                </Stack>
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER} align="center" width="full" maxWidth="auth-form">
                    <AuthSignUpForm syncColor={false} />
                </Stack>
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER} align="center" width="full" maxWidth="auth-form">
                    <AuthAffiliateSignUpForm syncColor={false} />
                </Stack>
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER} align="center" width="full" maxWidth="auth-form">
                    <AuthForgotPasswordForm syncColor={false} />
                </Stack>
            </Stack>
        </RegistrySection>
    )
}
