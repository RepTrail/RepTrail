'use client'

import React from 'react'
import { Stack } from '../base/stack'
import { Surface } from '../base/surface'
import { Font } from '../base/font'
import { Input } from '../base/input'
import { Button } from '../base/button'
import { Icon } from '../base/icon'
import { Box } from '../base/box'
import { Divider } from '../base/layout'
import { Lock, ArrowRight } from 'lucide-react'
import { useRegistry } from '../advanced/registry-context'
import { translateAuthError } from '@/lib/auth-errors'

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
        <Surface variant="glass" padding={0} rounded="system" width="full" maxWidth="auth-form">
            <Stack gap={0}>
                {/* Header */}
                <Box padding={5}>
                    <Stack gap={1} align="center">
                        <Font variant="h2" align="center">Nova <Font variant="h2" color="primary">Senha</Font></Font>
                        <Font variant="auxiliary" color="zinc-500" align="center" uppercase tracking="widest">
                            Defina sua nova credencial de acesso
                        </Font>
                    </Stack>
                </Box>

                <Divider color="white/5" />

                {/* Form Content */}
                <Box padding={5}>
                    <form onSubmit={onSubmit || ((e) => e.preventDefault())}>
                        <Stack gap={5}>
                            {error && (
                                <Box padding={2.5} rounded="system" display="flex" align="center" bg="red" bgOpacity={10} border minHeight={44}>
                                    <Font variant="sub-tiny" color="red" weight="black" uppercase tracking="widest">
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
                                rounded="system" 
                                height="anatomy-item"
                                paddingY={5}
                                disabled={loading || (password !== confirmPassword && confirmPassword !== '')}
                            >
                                <Stack direction="row" gap={2.5} align="center" justify="center">
                                    <Font variant="label-caps">
                                        {loading ? 'Processando...' : 'Atualizar Senha'}
                                    </Font>
                                    {!loading && <Icon icon={ArrowRight} size="xs" />}
                                </Stack>
                            </Button>
                        </Stack>
                    </form>
                </Box>
            </Stack>
        </Surface>
    )
}
