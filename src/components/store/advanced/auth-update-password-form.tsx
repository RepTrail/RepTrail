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
import { Lock, ArrowRight } from 'lucide-react'
import { useRegistry } from '@/components/store/advanced/registry-context'
import { translateAuthError } from '@/lib/auth-errors'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface AuthUpdatePasswordFormProps {
    password?: string
    setPassword?: (value: string) => void
    onSubmit?: (e: React.FormEvent) => void
    loading?: boolean
    error?: string | null
    syncColor?: boolean
}

export function AuthUpdatePasswordForm({
    password,
    setPassword,
    onSubmit,
    loading,
    error,
    syncColor = true
}: AuthUpdatePasswordFormProps) {
    const { setPrimaryColor } = useRegistry()
    const [confirmPassword, setConfirmPassword] = React.useState('')

    React.useEffect(() => {
        if (syncColor) {
            setPrimaryColor('emerald')
        }
    }, [setPrimaryColor, syncColor])

    return (
        <Surface variant="glass" padding={STORE_TOKENS.PADDING.NONE} rounded={STORE_TOKENS.RADIUS.SYSTEM} width="full" maxWidth="auth-form">
            <Stack gap={STORE_TOKENS.SPACING.NONE}>
                {/* Header */}
                <Box padding={STORE_TOKENS.PADDING.CONTAINER}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Font variant="h2" align="center">Nova <Font
                            variant="h2"
                            {...{
                                color: STORE_TOKENS.COLORS.BRAND,
                            }}>Senha</Font></Font>
                        <Font
                            variant="auxiliary"
                            align="center"
                            uppercase
                            tracking="widest"
                            {...{
                                color: STORE_TOKENS.COLORS.TEXT.MUTED,
                            }}>
                            Defina sua nova credencial de acesso
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
                                <Box padding={STORE_TOKENS.PADDING.ELEMENT} rounded={STORE_TOKENS.RADIUS.SYSTEM} display="flex" align="center" bg={STORE_TOKENS.COLORS.ERROR} bgOpacity={STORE_TOKENS.OPACITY.SUBTLE} border minHeight={44}>
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
                                </Box>
                            )}

                            <Input
                                label="Nova Senha"
                                type="password"
                                icon={<Lock size={16} />}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword?.(e.target.value)}
                                required
                            />
                            <Input
                                label="Confirmar Senha"
                                type="password"
                                icon={<Lock size={16} />}
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                height="anatomy-item"
                                gap={STORE_TOKENS.SPACING.ELEMENT}
                                disabled={loading || (password !== confirmPassword && confirmPassword !== '')}
                            >
                                <Font variant="label-caps">
                                    {loading ? 'Processando...' : 'Atualizar Senha'}
                                </Font>
                                {!loading && <Icon icon={ArrowRight} size="xs" />}
                            </Button>
                        </Stack>
                    </form>
                </Box>
            </Stack>
        </Surface>
    );
}
