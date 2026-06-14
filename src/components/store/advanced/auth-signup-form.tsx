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
import { FormCheckbox } from '@/components/store/base/form-checkbox'
import { useRegistry } from '@/components/store/base/registry-context'
import { Mail, Lock, User, Users, ArrowRight, Phone } from 'lucide-react'
import { translateAuthError } from '@/lib/auth-errors'
import Link from 'next/link'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Modal } from '@/components/store/advanced/modal'
import { SegmentedSwitch } from '@/components/store/intermediary/segmented-switch'
import { STUDENT_TERMS, TRAINER_TERMS, AFFILIATE_TERMS } from '@/lib/terms-content'
import { PRIVACY_POLICY } from '@/lib/privacy-content'
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
    role?: 'student' | 'trainer' | 'affiliate'
    setRole?: (value: 'student' | 'trainer' | 'affiliate') => void
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
    acceptedTerms = true, setAcceptedTerms,
    onShowTerms,
    onSubmit,
    loading, error,
    syncColor = true
}: AuthSignUpFormProps) {
    const { primaryColor, setPrimaryColor } = useRegistry()
    const [internalRole, setInternalRole] = React.useState<'student' | 'trainer' | 'affiliate'>('trainer')
    const [showTermsModal, setShowTermsModal] = React.useState(false)
    const [showPrivacyModal, setShowPrivacyModal] = React.useState(false)

    const activeRole = role || internalRole
    const handleSetRole = (id: string) => {
        const r = id as 'student' | 'trainer' | 'affiliate'
        if (setRole) setRole(r)
        else setInternalRole(r)
    }

    React.useEffect(() => {
        if (!syncColor) return

        if (activeRole === 'trainer') {
            setPrimaryColor('emerald')
        } else if (activeRole === 'affiliate') {
            setPrimaryColor('amber')
        } else {
            setPrimaryColor('orange')
        }
    }, [activeRole, setPrimaryColor, syncColor])

    return (
        <Surface variant="glass" padding={STORE_TOKENS.PADDING.NONE} rounded={STORE_TOKENS.RADIUS.SYSTEM} width="full" maxWidth="auth-form">
            <Stack gap={STORE_TOKENS.SPACING.NONE}>
                {/* Header */}
                <Box padding={STORE_TOKENS.PADDING.CONTAINER}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Font variant="h2" align="center">
                            {activeRole === 'affiliate' ? 'Seja um ' : 'Criar sua '}
                            <Font
                                variant="h2"
                                {...{
                                    color: STORE_TOKENS.COLORS.BRAND,
                                }}>
                                {activeRole === 'affiliate' ? 'Afiliado' : 'Conta'}
                            </Font>
                        </Font>
                        <Font
                            variant="auxiliary"
                            align="center"
                            uppercase
                            tracking="widest"
                            {...{
                                color: STORE_TOKENS.COLORS.TEXT.MUTED,
                            }}>
                            {activeRole === 'affiliate' ? 'Ganhe 10% por cada indicação' : 'Preencha os dados para começar'}
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
                                label="Nome Completo"
                                icon={<Icon icon={User} size="xs" />}
                                placeholder="Como devemos te chamar?"
                                value={fullName}
                                onChange={(e) => setFullName?.(e.target.value)}
                                required
                            />

                            <Input
                                label="Email Profissional"
                                icon={<Icon icon={Mail} size="xs" />}
                                placeholder="exemplo@email.com"
                                value={email}
                                onChange={(e) => setEmail?.(e.target.value)}
                                required
                            />

                            <Input
                                label="WhatsApp"
                                icon={<Icon icon={Phone} size="xs" />}
                                placeholder="Ex: 11 99999-9999"
                                value={whatsapp}
                                onChange={(e) => setWhatsapp?.(e.target.value)}
                                required
                                mask="phone"
                            />

                            <Input
                                label="Senha de Acesso"
                                type="password"
                                icon={<Icon icon={Lock} size="xs" />}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword?.(e.target.value)}
                                required
                            />

                            {activeRole !== 'affiliate' && (
                                <SegmentedSwitch
                                    activeId={activeRole}
                                    onSelect={handleSetRole}
                                    options={[
                                        { id: 'trainer', label: 'Personal', icon: Users, activeVariant: 'outline-emerald' },
                                        { id: 'student', label: 'Aluno', icon: User, activeVariant: 'outline-orange' },
                                    ]}
                                />
                            )}

                            {/* Terms of Use */}
                            <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                <FormCheckbox
                                    label=""
                                    checked={acceptedTerms}
                                    onChange={setAcceptedTerms}
                                    color={STORE_TOKENS.COLORS.BRAND}
                                />
                                <Font
                                    variant="sub-tiny"
                                    weight="bold"
                                    uppercase
                                    tracking="widest"
                                    {...{
                                        color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                    }}>
                                    Eu aceito os{' '}<Font
                                    variant="sub-tiny"
                                    weight="black"
                                    cursor="pointer"
                                    underline
                                    onClick={() => setShowTermsModal(true)}
                                    {...{
                                        color: STORE_TOKENS.COLORS.BRAND,
                                    }}>termos de uso</Font>{' '}e a{' '}<Font
                                    variant="sub-tiny"
                                    weight="black"
                                    cursor="pointer"
                                    underline
                                    onClick={() => setShowPrivacyModal(true)}
                                    {...{
                                        color: STORE_TOKENS.COLORS.BRAND,
                                    }}>política de privacidade</Font>
                                </Font>
                            </Stack>

                            <Modal
                                isOpen={showTermsModal}
                                onClose={() => setShowTermsModal(false)}
                                title="Termos de Uso"
                                subtitle={activeRole === 'trainer' ? "Contrato de Prestação de Serviços - Trainer" : activeRole === 'affiliate' ? "Contrato de Prestação de Serviços - Afiliado" : "Termos de Acompanhamento - Aluno"}
                                icon={ShieldCheck}
                                variant={activeRole === 'trainer' ? 'emerald' : activeRole === 'affiliate' ? 'orange' : 'orange'}
                                confirmLabel="Entendido"
                                onConfirm={() => {
                                    setAcceptedTerms?.(true)
                                    setShowTermsModal(false)
                                }}
                            >
                                <Box padding={STORE_TOKENS.PADDING.NONE} maxHeight="60vh" overflowY="auto">
                                    <Font
                                        variant="body"
                                        whitespace="pre-line"
                                        {...{
                                            color: STORE_TOKENS.COLORS.TEXT.SECONDARY,
                                        }}>
                                        {activeRole === 'trainer' ? TRAINER_TERMS : activeRole === 'affiliate' ? AFFILIATE_TERMS : STUDENT_TERMS}
                                    </Font>
                                </Box>
                            </Modal>

                            <Modal
                                isOpen={showPrivacyModal}
                                onClose={() => setShowPrivacyModal(false)}
                                title="Política de Privacidade"
                                subtitle="Como tratamos seus dados pessoais (LGPD)"
                                icon={ShieldCheck}
                                variant={activeRole === 'trainer' ? 'emerald' : activeRole === 'affiliate' ? 'emerald' : 'orange'}
                                confirmLabel="Entendido"
                                onConfirm={() => setShowPrivacyModal(false)}
                            >
                                <Box padding={STORE_TOKENS.PADDING.NONE} maxHeight="60vh" overflowY="auto">
                                    <Font
                                        variant="body"
                                        whitespace="pre-line"
                                        {...{
                                            color: STORE_TOKENS.COLORS.TEXT.SECONDARY,
                                        }}>
                                        {PRIVACY_POLICY}
                                    </Font>
                                </Box>
                            </Modal>

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
                                    {loading ? 'Processando...' : 'Criar minha conta'}
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
                        Já possui uma conta? <Link href={activeRole === 'affiliate' ? '/afiliados/login' : '/auth/login'}><Font
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
        </Surface >
    );
}
