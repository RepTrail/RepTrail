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
    onLogin?: (data: any) => void
    loading?: boolean
    error?: string | null
}

export function AuthLoginForm({ 
    email, setEmail, 
    password, setPassword, 
    onSubmit, 
    loading, error 
}: AuthLoginFormProps) {
    const { primaryColor } = useRegistry()

    return (
        <Surface variant="glass" padding={0} rounded="system" width="full" className="max-w-[440px]">
            <Stack gap={0}>
                {/* Header */}
                <Box padding={5} className="border-b border-white/5">
                    <Stack gap={1} align="center">
                        <Font variant="h2" align="center">Bem-vindo <Font variant="h2" color={primaryColor as any}>de volta</Font></Font>
                        <Font variant="auxiliary" color="zinc-500" align="center" uppercase tracking="widest">
                            Acesse sua conta para treinar
                        </Font>
                    </Stack>
                </Box>

                {/* Form Content */}
                <Box padding={5}>
                    <form onSubmit={onSubmit || ((e) => e.preventDefault())}>
                        <Stack gap={5}>
                            {error && (
                                <Box padding={2.5} rounded="system" display="flex" align="center" className="bg-red-500/10 border border-red-500/20 min-h-[44px]">
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
                                        <Font variant="sub-tiny" color={primaryColor as any} weight="black" uppercase tracking="widest" className="cursor-pointer hover:opacity-80">
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
                                variant={primaryColor as any} 
                                fullWidth 
                                rounded="full" 
                                className="h-12"
                                disabled={loading}
                            >
                                <Stack direction="row" gap={2.5} align="center" justify="center">
                                    <Font variant="label-caps" color="black">
                                        {loading ? 'Processando...' : 'Entrar Agora'}
                                    </Font>
                                    {!loading && <Icon icon={ArrowRight} size="xs" color="black" />}
                                </Stack>
                            </Button>
                        </Stack>
                    </form>
                </Box>

                <Divider color="white/5" />

                {/* Footer */}
                <Box padding={5} display="flex" align="center" justify="center" className="bg-zinc-950/30">
                    <Font variant="sub-tiny" color="zinc-500" align="center" weight="bold" uppercase tracking="widest">
                        Ainda não é membro? <Link href="/auth/signup" className="contents"><Font variant="sub-tiny" color={primaryColor as any} weight="black" className="cursor-pointer underline">Cadastre-se grátis</Font></Link>
                    </Font>
                </Box>
            </Stack>
        </Surface>
    )
}
