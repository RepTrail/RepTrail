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
import { useRegistry } from '@/components/store/base/registry-context'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { translateAuthError } from '@/lib/auth-errors'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface AuthLoginFormProps {
    email?: string
    setEmail?: (value: string) => void
    password?: string
    setPassword?: (value: string) => void
    showPassword?: boolean
    setShowPassword?: (value: boolean) => void
    onSubmit?: (e: React.FormEvent) => void
    loading?: boolean
    error?: string | null
    color?: 'emerald' | 'amber' | 'blue' | 'red' | 'orange'
    syncColor?: boolean
    signupHref?: string
}

export function AuthLoginForm({
    email, setEmail,
    password, setPassword,
    onSubmit,
    loading, error,
    color = 'emerald',
    syncColor = true,
    signupHref = '/auth/signup'
}: AuthLoginFormProps) {
    const { primaryColor, setPrimaryColor } = useRegistry()

    React.useEffect(() => {
        if (syncColor) {
            setPrimaryColor(color as any)
        }
    }, [setPrimaryColor, color, syncColor])

    return (
        <Surface variant="glass" padding={STORE_TOKENS.PADDING.NONE} rounded={STORE_TOKENS.RADIUS.SYSTEM} width="full" maxWidth="auth-form">
            <Stack gap={STORE_TOKENS.SPACING.NONE}>
                {/* Header */}
                <Box padding={STORE_TOKENS.PADDING.CONTAINER}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Font variant="h2" align="center">Entrar no <Font
                            variant="h2"
                            {...{
                                color: STORE_TOKENS.COLORS.BRAND,
                            }}>Painel</Font></Font>
                        <Font
                            variant="auxiliary"
                            align="center"
                            uppercase
                            tracking="widest"
                            {...{
                                color: STORE_TOKENS.COLORS.TEXT.MUTED,
                            }}>
                            Acesse sua conta para continuar
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
                                <Surface 
                                    variant="tonal-red"
                                    padding={STORE_TOKENS.PADDING.ELEMENT} 
                                    rounded={STORE_TOKENS.RADIUS.SYSTEM} 
                                    display="flex" 
                                    align="center" 
                                    minHeight={44}
                                >
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
                                label="Email Profissional"
                                icon={<Mail size={16} />}
                                placeholder="exemplo@email.com"
                                value={email}
                                onChange={(e) => setEmail?.(e.target.value)}
                                required
                            />

                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Stack direction="row" justify="between" align="center">
                                    <Font
                                        variant="auxiliary"
                                        weight="black"
                                        uppercase
                                        tracking="widest"
                                        {...{
                                            color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                        }}>
                                        Senha de Acesso
                                    </Font>
                                </Stack>
                                <Input
                                    type="password"
                                    icon={<Lock size={16} />}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword?.(e.target.value)}
                                    required
                                />
                            </Stack>

                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                disabled={loading}
                                text={loading ? 'Processando...' : 'Entrar Agora'} />
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
                        Ainda não é membro? <Link href={signupHref}><Font
                        variant="sub-tiny"
                        weight="black"
                        cursor="pointer"
                        underline
                        {...{
                            color: STORE_TOKENS.COLORS.BRAND,
                        }}>Cadastre-se grátis</Font></Link>
                    </Font>
                </Box>
            </Stack>
        </Surface>
    );
}
