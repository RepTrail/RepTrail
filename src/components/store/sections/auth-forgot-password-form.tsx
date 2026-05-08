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
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react'
import { translateAuthError } from '@/lib/auth-errors'

interface AuthForgotPasswordFormProps {
    email?: string
    setEmail?: (value: string) => void
    onSubmit?: (e: React.FormEvent) => void
    loading?: boolean
    error?: string | null
    message?: string | null
}

export function AuthForgotPasswordForm({ 
    email, setEmail, 
    onSubmit, 
    loading, error, message 
}: AuthForgotPasswordFormProps) {
    const { primaryColor } = useRegistry()

    if (message) {
        return (
            <Surface variant="glass" padding={8} rounded="system" width="full" className="max-w-[440px] animate-in fade-in zoom-in duration-500">
                <Stack gap={6} align="center" justify="center">
                    <Icon icon={CheckCircle2} size="lg" color="emerald" className="animate-bounce" />
                    <Stack gap={2} align="center">
                        <Font variant="h2" align="center">Email <Font variant="h2" color="emerald">Enviado</Font></Font>
                        <Font variant="description" align="center" color="zinc-400">
                            {message}
                        </Font>
                    </Stack>
                    <Button asChild variant="outline-zinc" fullWidth rounded="full" className="mt-4">
                        <Link href="/auth/login">
                            <Font variant="label-caps">Voltar ao Login</Font>
                        </Link>
                    </Button>
                </Stack>
            </Surface>
        )
    }

    return (
        <Surface variant="glass" padding={0} rounded="system" width="full" className="max-w-[440px]">
            <Stack gap={0}>
                {/* Header */}
                <Box padding={5} className="border-b border-white/5">
                    <Stack gap={1} align="center">
                        <Font variant="h2" align="center">Recuperar <Font variant="h2" color={primaryColor as any}>Senha</Font></Font>
                        <Font variant="auxiliary" color="zinc-500" align="center" uppercase tracking="widest">
                            Digite seu email para receber o link
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
                                label="Email Cadastrado" 
                                icon={<Mail size={16} />} 
                                placeholder="exemplo@email.com" 
                                value={email}
                                onChange={(e) => setEmail?.(e.target.value)}
                                required
                            />

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
                                        {loading ? 'Processando...' : 'Recuperar Senha'}
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
                        Lembrou a senha? <Link href="/auth/login" className="contents"><Font variant="sub-tiny" color={primaryColor as any} weight="black" className="cursor-pointer underline">Fazer login</Font></Link>
                    </Font>
                </Box>
            </Stack>
        </Surface>
    )
}
