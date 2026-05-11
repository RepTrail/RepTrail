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
import { FormCheckbox } from '../base/form-checkbox'
import { Modal } from '../advanced/modal'
import { ShieldCheck } from 'lucide-react'
import { AFFILIATE_TERMS } from '@/lib/terms-content'
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
    acceptedTerms?: boolean
    setAcceptedTerms?: (value: boolean) => void
    onSubmit?: (e: React.FormEvent) => void
    loading?: boolean
    error?: string | null
    syncColor?: boolean
}

export function AuthAffiliateSignUpForm({ 
    fullName, setFullName,
    email, setEmail,
    whatsapp, setWhatsapp,
    password, setPassword,
    acceptedTerms = true, setAcceptedTerms,
    onSubmit, 
    loading, error,
    syncColor = true
}: AuthAffiliateSignUpFormProps) {
    const { primaryColor, setPrimaryColor } = useRegistry()
    const [showTermsModal, setShowTermsModal] = React.useState(false)

    React.useEffect(() => {
        if (syncColor) {
            setPrimaryColor('amber')
        }
    }, [setPrimaryColor, syncColor])

    return (
        <Surface variant="glass" padding={0} rounded="system" width="full" maxWidth="auth-form">
            <Stack gap={0}>
                {/* Header */}
                <Box padding={5}>
                    <Stack gap={2.5} align="center">
                        <Font variant="h2" align="center">Seja um <Font variant="h2" color="primary">Afiliado</Font></Font>
                        <Font variant="auxiliary" color="zinc-500" align="center" uppercase tracking="widest">
                            Ganhe 10% por cada indicação
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

                            {/* Terms of Use */}
                            <Stack direction="row" gap={2.5} align="center">
                                <FormCheckbox 
                                    label=""
                                    checked={acceptedTerms} 
                                    onChange={setAcceptedTerms}
                                    color="primary"
                                />
                                <Font variant="sub-tiny" color="zinc-500" weight="bold" uppercase tracking="widest">
                                    Eu aceito os <Font variant="sub-tiny" color="primary" weight="black" className="cursor-pointer underline" onClick={() => setShowTermsModal(true)}>termos de uso</Font>
                                </Font>
                            </Stack>

                            <Modal 
                                isOpen={showTermsModal} 
                                onClose={() => setShowTermsModal(false)}
                                title="Termos de Uso"
                                subtitle="Contrato de Prestação de Serviços - Afiliado"
                                icon={ShieldCheck}
                                variant="orange"
                                confirmLabel="Entendido"
                                onConfirm={() => {
                                    setAcceptedTerms?.(true)
                                    setShowTermsModal(false)
                                }}
                            >
                                <Box padding={2.5} className="max-h-[60vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-zinc-800">
                                    <Font variant="body" color="zinc-400" className="whitespace-pre-wrap leading-relaxed">
                                        {AFFILIATE_TERMS}
                                    </Font>
                                </Box>
                            </Modal>

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
                                        {loading ? 'Processando...' : 'Criar minha conta'}
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
                        Já possui uma conta? <Link href="/afiliados/login" className="contents"><Font variant="sub-tiny" color="primary" weight="black" className="cursor-pointer underline">Fazer login</Font></Link>
                    </Font>
                </Box>
            </Stack>
        </Surface>
    )
}
