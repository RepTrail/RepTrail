'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Surface } from '@/components/store/base/surface'
import { Font } from '@/components/store/base/font'
import { Input } from '@/components/store/base/input'
import { Button } from '@/components/store/base/button'
import { Icon } from '@/components/store/base/icon'
import { Box } from '@/components/store/base/box'
import { Divider } from '@/components/store/base/layout'
import Link from 'next/link'
import { useRegistry } from '@/components/store/advanced/registry-context'
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react'
import { translateAuthError } from '@/lib/auth-errors'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface AuthForgotPasswordFormProps {
    email?: string
    setEmail?: (value: string) => void
    onSubmit?: (e: React.FormEvent) => void
    loading?: boolean
    error?: string | null
    message?: string | null
    syncColor?: boolean
}

export function AuthForgotPasswordForm({
    email, setEmail,
    onSubmit,
    loading, error, message,
    syncColor = true
}: AuthForgotPasswordFormProps) {
    const { primaryColor, setPrimaryColor } = useRegistry()

    React.useEffect(() => {
        if (syncColor) {
            setPrimaryColor('emerald')
        }
    }, [setPrimaryColor, syncColor])

    if (message) {
        return (
            <Surface variant="glass" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} width="full" maxWidth="auth-form" animation="in-fade-zoom">
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER} align="center" justify="center">
                    <Icon icon={CheckCircle2} size="lg" color={STORE_TOKENS.COLORS.SUCCESS} animation="bounce" />
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Font variant="h2" align="center">Email <Font
                            variant="h2"
                            {...{
                                color: STORE_TOKENS.COLORS.SUCCESS,
                            }}>Enviado</Font></Font>
                        <Font
                            variant="description"
                            align="center"
                            {...{
                                color: STORE_TOKENS.COLORS.TEXT.SECONDARY,
                            }}>
                            {message}
                        </Font>
                    </Stack>
                    <Button asChild variant="outline-zinc" fullWidth rounded={STORE_TOKENS.RADIUS.SYSTEM}>
                        <Link href="/auth/login">
                            <Font variant="label-caps">Voltar ao Login</Font>
                        </Link>
                    </Button>
                </Stack>
            </Surface>
        );
    }

    return (
        <Surface variant="glass" padding={STORE_TOKENS.PADDING.NONE} rounded={STORE_TOKENS.RADIUS.SYSTEM} width="full" maxWidth="auth-form">
            <Stack gap={STORE_TOKENS.SPACING.NONE}>
                {/* Header */}
                <Box padding={STORE_TOKENS.PADDING.CONTAINER}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Font variant="h2" align="center">Recuperar <Font
                            variant="h2"
                            {...{
                                color: primaryColor as any,
                            }}>Senha</Font></Font>
                        <Font
                            variant="auxiliary"
                            align="center"
                            uppercase
                            tracking="widest"
                            {...{
                                color: STORE_TOKENS.COLORS.TEXT.MUTED,
                            }}>
                            Digite seu email para receber o link
                        </Font>
                    </Stack>
                </Box>

                <Divider
                    {...{
                        color: STORE_TOKENS.COLORS.DIVIDER.SUBTLE,
                    }} />

                {/* Form Content */}
                <Box padding={STORE_TOKENS.PADDING.CONTAINER}>
                    <form onSubmit={onSubmit || ((e) => e.preventDefault())}>
                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                            {error && (
                                <Surface padding={STORE_TOKENS.PADDING.ELEMENT} rounded={STORE_TOKENS.RADIUS.SYSTEM} display="flex" align="center" bg={STORE_TOKENS.COLORS.ERROR} bgOpacity={STORE_TOKENS.OPACITY.SUBTLE} border="subtle" minHeight={44}>
                                    <Font
                                        variant="sub-tiny"
                                        weight="black"
                                        uppercase
                                        tracking="widest"
                                        {...{
                                            color: STORE_TOKENS.COLORS.ERROR,
                                        }}>
                                        {translateAuthError(error)}
                                    </Font>
                                </Surface>
                            )}

                            <Input
                                label="Email Cadastrado"
                                icon={<Mail size={16} />}
                                placeholder="exemplo@email.com"
                                value={email}
                                onChange={(e) => setEmail?.(e.target.value)}
                                required
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                height="anatomy-item"
                                gap={STORE_TOKENS.SPACING.ELEMENT}
                                disabled={loading}
                            >
                                <Font variant="label-caps">
                                    {loading ? 'Processando...' : 'Recuperar Senha'}
                                </Font>
                                {!loading && <Icon icon={ArrowRight} size="xs" />}
                            </Button>
                        </Stack>
                    </form>
                </Box>

                <Divider
                    {...{
                        color: STORE_TOKENS.COLORS.DIVIDER.SUBTLE,
                    }} />

                {/* Footer */}
                <Box padding={STORE_TOKENS.PADDING.CONTAINER} display="flex" align="center" justify="center" bg={STORE_TOKENS.COLORS.BLACK} bgOpacity={STORE_TOKENS.OPACITY.INTERMEDIATE}>
                    <Font
                        variant="sub-tiny"
                        align="center"
                        weight="bold"
                        uppercase
                        tracking="widest"
                        {...{
                            color: STORE_TOKENS.COLORS.TEXT.MUTED,
                        }}>
                        Lembrou a senha? <Link href="/auth/login"><Font
                        variant="sub-tiny"
                        weight="black"
                        cursor="pointer"
                        underline
                        {...{
                            color: STORE_TOKENS.COLORS.BRAND,
                        }}>Fazer login</Font></Link>
                    </Font>
                </Box>
            </Stack>
        </Surface>
    );
}
