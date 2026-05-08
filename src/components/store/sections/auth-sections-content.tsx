'use client'

import React from 'react'
import { RegistrySection } from '../advanced/registry-section'
import { Stack } from '../base/stack'
import { Grid } from '../base/grid'
import { ShieldCheck } from 'lucide-react'
import { AuthLoginForm } from './auth-login-form'
import { AuthSignUpForm } from './auth-signup-form'
import { AuthAffiliateSignUpForm } from './auth-affiliate-signup-form'
import { AuthForgotPasswordForm } from './auth-forgot-password-form'

export function AuthSectionsContent({ id }: { id?: string }) {
    return (
        <RegistrySection 
            id={id}
            title="Autenticação" 
            subtitle="Formulários de acesso e cadastro padronizados."
            icon={ShieldCheck}
        >
            <Stack direction="row" gap={12.5} justify="between" align="start" width="full" className="overflow-x-auto pb-10">
                <Stack gap={5} align="center" width="full" className="max-w-[400px]">
                    <AuthLoginForm />
                </Stack>
                <Stack gap={5} align="center" width="full" className="max-w-[400px]">
                    <AuthSignUpForm />
                </Stack>
                <Stack gap={5} align="center" width="full" className="max-w-[400px]">
                    <AuthAffiliateSignUpForm />
                </Stack>
                <Stack gap={5} align="center" width="full" className="max-w-[400px]">
                    <AuthForgotPasswordForm />
                </Stack>
            </Stack>
        </RegistrySection>
    )
}
