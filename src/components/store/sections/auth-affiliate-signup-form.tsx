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
import { useRegistry } from '../advanced/registry-context'
import { Mail, Lock, User, Megaphone, ArrowRight, Phone } from 'lucide-react'
import { translateAuthError } from '@/lib/auth-errors'
import Link from 'next/link'

interface AuthAffiliateSignUpFormProps {
    fullName?: string
    setFullName?: (value: string) => void
    email?: string
    setEmail?: (value: string) => void
    whatsapp?: string
    setWhatsapp?: (value: string) => void
    password?: string
    setPassword?: (value: string) => void
    onSubmit?: (e: React.FormEvent) => void
    onSignUp?: (e: React.FormEvent) => void
    loading?: boolean
    error?: string | null
}

export function AuthAffiliateSignUpForm({ 
    fullName, setFullName,
    email, setEmail,
    whatsapp, setWhatsapp,
    password, setPassword,
    onSignUp, 
    loading, error 
}: AuthAffiliateSignUpFormProps) {
    const { primaryColor } = useRegistry()

    return (
        <Surface variant="glass" padding={0} rounded="system" width="full" className="max-w-[440px]">
            <Stack gap={0}>
                {/* Header */}
                <Box padding={5} className="border-b border-white/5">
                    <Stack gap={1} align="center">
                        <Font variant="h2" align="center">Seja um <Font variant="h2" color="amber">Afiliado</Font></Font>
                        <Font variant="auxiliary" color="zinc-500" align="center" uppercase tracking="widest">
                            Ganhe 10% por cada indicação
                        </Font>
                    </Stack>
                </Box>

                {/* Form Content */}
                <Box padding={5}>
                    <form onSubmit={onSignUp || ((e) => e.preventDefault())}>
                        <Stack gap={5}>
                            {error && (
                                <Box padding={2.5} rounded="system" display="flex" align="center" className="bg-red-500/10 border border-red-500/20 min-h-[44px]">
                                    <Font variant="sub-tiny" color="red" weight="black" uppercase tracking="widest">
                                        {translateAuthError(error)}
                                    </Font>
                                </Box>
                            )}

                            <Input 
                                label="Seu Nome Completo" 
                                icon={<User size={16} />} 
                                placeholder="Como devemos te chamar?" 
                                value={fullName}
                                onChange={(e) => setFullName?.(e.target.value)}
                                required
                            />

                            <Input 
                                label="Email Profissional" 
                                icon={<Mail size={16} />} 
                                placeholder="exemplo@email.com" 
                                value={email}
                                onChange={(e) => setEmail?.(e.target.value)}
                                required
                            />

                            <Input 
                                label="WhatsApp" 
                                icon={<Phone size={16} />} 
                                placeholder="Ex: 11 99999-9999" 
                                value={whatsapp}
                                onChange={(e) => setWhatsapp?.(e.target.value)}
                                required
                                mask="phone"
                            />

                            <Input 
                                label="Senha de Acesso" 
                                type="password"
                                icon={<Lock size={16} />} 
                                placeholder="••••••••" 
                                value={password}
                                onChange={(e) => setPassword?.(e.target.value)}
                                required
                            />

                            <Button 
                                type="submit"
                                variant="amber" 
                                fullWidth 
                                rounded="full" 
                                className="h-12"
                                disabled={loading}
                            >
                                <Stack direction="row" gap={2.5} align="center" justify="center">
                                    <Font variant="label-caps" color="black">
                                        {loading ? 'Processando...' : 'Criar minha conta'}
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
                        Já possui uma conta? <Link href="/auth/login" className="contents"><Font variant="sub-tiny" color="amber" weight="black" className="cursor-pointer underline">Fazer login</Font></Link>
                    </Font>
                </Box>
            </Stack>
        </Surface>
    )
}
