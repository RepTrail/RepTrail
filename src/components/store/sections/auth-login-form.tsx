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
import Link from 'next/link'
import { useRegistry } from '../advanced/registry-context'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { translateAuthError } from '@/lib/auth-errors'

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
}

export function AuthLoginForm({ 
    email, setEmail, 
    password, setPassword, 
    onSubmit, 
    loading, error,
    color = 'emerald',
    syncColor = true
}: AuthLoginFormProps) {
    const { primaryColor, setPrimaryColor } = useRegistry()
    
    React.useEffect(() => {
        if (syncColor) {
            setPrimaryColor(color as any)
        }
    }, [setPrimaryColor, color, syncColor])

    return (
        <Surface variant="glass" padding={0} rounded="system" width="full" maxWidth="auth-form">
            <Stack gap={0}>
                {/* Header */}
                <Box padding={5}>
                    <Stack gap={2.5} align="center">
                        <Font variant="h2" align="center">Entrar no <Font variant="h2" color="primary">Painel</Font></Font>
                        <Font variant="auxiliary" color="zinc-500" align="center" uppercase tracking="widest">
                            Acesse sua conta para continuar
                        </Font>
                    </Stack>
                </Box>

                <Divider color="white/5" />

                {/* Form Content */}
                <Box padding={5}>
                    <form onSubmit={onSubmit || ((e) => e.preventDefault())}>
                        <Stack gap={5}>
                            {error && (
                                <Box padding={2.5} rounded="system" display="flex" align="center" bg="red" bgOpacity={10} border borderColor="red-500/20">
                                    <Font variant="sub-tiny" color="red" weight="black" uppercase tracking="widest">
                                        {translateAuthError(error)}
                                    </Font>
                                </Box>
                            )}

                            <Input 
                                label="Email Profissional" 
                                icon={<Mail size={16} />} 
                                placeholder="exemplo@email.com" 
                                value={email}
                                onChange={(e) => setEmail?.(e.target.value)}
                                required
                            />

                            <Stack gap={2.5}>
                                <Stack direction="row" justify="between" align="center">
                                    <Font variant="auxiliary" color="zinc-500" weight="black" uppercase tracking="widest">
                                        Senha de Acesso
                                    </Font>
                                    <Link href="/auth/forgot-password">
                                        <Font variant="sub-tiny" color="primary" weight="black" uppercase tracking="widest" transition className="cursor-pointer hover:opacity-80">
                                            Esqueci a senha
                                        </Font>
                                    </Link>
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
                                rounded="system" 
                                height="anatomy-item"
                                paddingY={5}
                                disabled={loading}
                            >
                                <Stack direction="row" gap={2.5} align="center" justify="center">
                                    <Font variant="label-caps">
                                        {loading ? 'Processando...' : 'Entrar Agora'}
                                    </Font>
                                    {!loading && <Icon icon={ArrowRight} size="xs" />}
                                </Stack>
                            </Button>
                        </Stack>
                    </form>
                </Box>

                <Divider color="white/5" />

                {/* Footer */}
                <Box padding={5} display="flex" align="center" justify="center" bg="black" bgOpacity={30}>
                    <Font variant="sub-tiny" color="zinc-500" align="center" weight="bold" uppercase tracking="widest">
                        Ainda não é membro? <Link href="/auth/signup" className="contents"><Font variant="sub-tiny" color="primary" weight="black" className="cursor-pointer underline">Cadastre-se grátis</Font></Link>
                    </Font>
                </Box>
            </Stack>
        </Surface>
    )
}
