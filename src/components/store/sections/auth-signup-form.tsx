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
import { FormCheckbox } from '../base/form-checkbox'
import { useRegistry } from '../advanced/registry-context'
import { cn } from '@/lib/utils'
import { Mail, Lock, User, Users, ArrowRight, Phone } from 'lucide-react'
import { translateAuthError } from '@/lib/auth-errors'
import Link from 'next/link'
import { Modal } from '../advanced/modal'
import { ShieldCheck } from 'lucide-react'

interface AuthSignUpFormProps {
    fullName?: string
    setFullName?: (value: string) => void
    email?: string
    setEmail?: (value: string) => void
    whatsapp?: string
    setWhatsapp?: (value: string) => void
    password?: string
    setPassword?: (value: string) => void
    role?: 'student' | 'trainer'
    setRole?: (value: 'student' | 'trainer') => void
    acceptedTerms?: boolean
    setAcceptedTerms?: (value: boolean) => void
    onShowTerms?: () => void
    onSubmit?: (e: React.FormEvent) => void
    onSignUp?: (data: any) => void
    loading?: boolean
    error?: string | null
    syncColor?: boolean
}

export function AuthSignUpForm({ 
    fullName, setFullName,
    email, setEmail,
    whatsapp, setWhatsapp,
    password, setPassword,
    role, setRole,
    acceptedTerms, setAcceptedTerms,
    onShowTerms,
    onSubmit, 
    loading, error,
    syncColor = true 
}: AuthSignUpFormProps) {
    const { primaryColor, setPrimaryColor } = useRegistry()
    const [internalRole, setInternalRole] = React.useState<'student' | 'trainer'>('trainer')
    const [showTermsModal, setShowTermsModal] = React.useState(false)

    const activeRole = role || internalRole
    const handleSetRole = setRole || setInternalRole

    React.useEffect(() => {
        if (!syncColor) return

        if (activeRole === 'trainer') {
            setPrimaryColor('emerald')
        } else {
            setPrimaryColor('orange')
        }
    }, [activeRole, setPrimaryColor, syncColor])

    return (
        <Surface variant="glass" padding={0} rounded="system" width="full" maxWidth="auth-form">
            <Stack gap={0}>
                {/* Header */}
                <Box padding={5}>
                    <Stack gap={2.5} align="center">
                        <Font variant="h2" align="center">Criar sua <Font variant="h2" color="primary">Conta</Font></Font>
                        <Font variant="auxiliary" color="zinc-500" align="center" uppercase tracking="widest">
                            Preencha os dados para começar
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
                                label="Nome Completo" 
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

                            <Stack gap={2.5}>
                                <Font variant="auxiliary" color="zinc-500" weight="black" uppercase tracking="widest" className="ml-1">
                                    Tipo de Perfil
                                </Font>
                                <Stack direction="row" gap={2.5}>
                                    <Button 
                                        type="button"
                                        variant={activeRole === 'student' ? 'primary' : 'outline-zinc'} 
                                        flex1 
                                        rounded="system"
                                        onClick={() => handleSetRole('student')}
                                    >
                                        <Stack direction="row" gap={2.5} align="center" justify="center">
                                            <Icon icon={User} size="xs" color={activeRole === 'student' ? 'black' : 'zinc-500'} />
                                            <Font variant="label-caps" color={activeRole === 'student' ? 'black' : 'zinc-500'}>Aluno</Font>
                                        </Stack>
                                    </Button>
                                    <Button 
                                        type="button"
                                        variant={activeRole === 'trainer' ? 'primary' : 'outline-zinc'} 
                                        flex1 
                                        rounded="system"
                                        onClick={() => handleSetRole('trainer')}
                                    >
                                        <Stack direction="row" gap={2.5} align="center" justify="center">
                                            <Icon icon={Users} size="xs" color={activeRole === 'trainer' ? 'black' : 'zinc-500'} />
                                            <Font variant="label-caps" color={activeRole === 'trainer' ? 'black' : 'zinc-500'}>Personal</Font>
                                        </Stack>
                                    </Button>
                                </Stack>
                            </Stack>

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
                                subtitle="Leia atentamente as regras da plataforma"
                                icon={ShieldCheck}
                                variant={activeRole === 'trainer' ? 'emerald' : 'orange'}
                                confirmLabel="Eu Aceito"
                                onConfirm={() => {
                                    setAcceptedTerms?.(true)
                                    setShowTermsModal(false)
                                }}
                            >
                                <Stack gap={5}>
                                    <Font variant="body" color="zinc-400">
                                        Bem-vindo ao RepTrail. Ao utilizar nossa plataforma, você concorda com as seguintes diretrizes:
                                    </Font>
                                    <Stack gap={2.5}>
                                        <Font variant="label-caps" color="primary">1. Uso da Conta</Font>
                                        <Font variant="sub-tiny" color="zinc-400">
                                            Sua conta é pessoal e intransferível. Você é responsável por manter a segurança de suas credenciais.
                                        </Font>
                                    </Stack>
                                    <Stack gap={2.5}>
                                        <Font variant="label-caps" color="primary">2. Privacidade</Font>
                                        <Font variant="sub-tiny" color="zinc-400">
                                            Respeitamos sua privacidade e protegemos seus dados de acordo com a LGPD.
                                        </Font>
                                    </Stack>
                                    <Stack gap={2.5}>
                                        <Font variant="label-caps" color="primary">3. Conteúdo</Font>
                                        <Font variant="sub-tiny" color="zinc-400">
                                            Todo conteúdo gerado na plataforma deve respeitar as normas éticas e profissionais.
                                        </Font>
                                    </Stack>
                                </Stack>
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
                        Já possui uma conta? <Link href="/auth/login" className="contents"><Font variant="sub-tiny" color="primary" weight="black" className="cursor-pointer underline">Fazer login</Font></Link>
                    </Font>
                </Box>
            </Stack>
        </Surface>
    )
}
