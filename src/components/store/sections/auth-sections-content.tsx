'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { AuthLoginForm } from '@/components/store/advanced/auth-login-form'
import { AuthSignUpForm } from '@/components/store/advanced/auth-signup-form'
import { AuthForgotPasswordForm } from '@/components/store/advanced/auth-forgot-password-form'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

export function AuthSectionsContent({ id }: { id?: string }) {
    return (
        <Stack id={id} gap={STORE_TOKENS.SPACING.CONTAINER}>
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
                    <AuthSignUpForm role="affiliate" syncColor={false} />
                </Stack>
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER} align="center" width="full" maxWidth="auth-form">
                    <AuthForgotPasswordForm syncColor={false} />
                </Stack>
            </Stack>
        </Stack>
    )
}
