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
import { useRegistry } from '@/components/store/advanced/registry-context'
import { Mail, Lock, User, Users, ArrowRight, Phone } from 'lucide-react'
import { translateAuthError } from '@/lib/auth-errors'
import Link from 'next/link'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Modal } from '@/components/store/advanced/modal'
import { SegmentedSwitch } from '@/components/store/intermediary/segmented-switch'
import { STUDENT_TERMS, TRAINER_TERMS } from '@/lib/terms-content'
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
    acceptedTerms = true, setAcceptedTerms,
    onShowTerms,
    onSubmit,
    loading, error,
    syncColor = true
}: AuthSignUpFormProps) {
    const { primaryColor, setPrimaryColor } = useRegistry()
    const [internalRole, setInternalRole] = React.useState<'student' | 'trainer'>('trainer')
    const [showTermsModal, setShowTermsModal] = React.useState(false)

    const activeRole = role || internalRole
    const handleSetRole = (id: string) => {
        const r = id as 'student' | 'trainer'
        if (setRole) setRole(r)
        else setInternalRole(r)
    }

    React.useEffect(() => {
        if (!syncColor) return

        if (activeRole === 'trainer') {
            setPrimaryColor('emerald')
        } else {
            setPrimaryColor('orange')
        }
    }, [activeRole, setPrimaryColor, syncColor])

    return (
        <Surface variant="glass" padding="none" rounded={STORE_TOKENS.RADIUS.SYSTEM} width="full" maxWidth="auth-form">
            <Stack gap="none">
                {/* Header */}
                <Box padding={STORE_TOKENS.PADDING.CONTAINER}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Font variant="h2" align="center">Criar sua <Font variant="h2" color={STORE_TOKENS.COLORS.BRAND}>Conta</Font></Font>
                        <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.MUTED} align="center" uppercase tracking="widest">
                            Preencha os dados para começar
                        </Font>
                    </Stack>
                </Box>

                <Divider color={STORE_TOKENS.COLORS.DIVIDER.SUBTLE} />

                {/* Form Content */}
                <Box padding={STORE_TOKENS.PADDING.CONTAINER}>
                    <form onSubmit={onSubmit || ((e) => e.preventDefault())}>
                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                            {error && (
                                <Surface padding={STORE_TOKENS.PADDING.ELEMENT} rounded={STORE_TOKENS.RADIUS.SYSTEM} display="flex" align="center" bg={STORE_TOKENS.COLORS.ERROR} bgOpacity={10} border="subtle" minHeight={44}>
                                    <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.ERROR} weight="black" uppercase tracking="widest">
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

                            <SegmentedSwitch
                                activeId={activeRole}
                                onSelect={handleSetRole}
                                options={[
                                    { id: 'trainer', label: 'Personal', icon: Users, activeVariant: 'outline-emerald' },
                                    { id: 'student', label: 'Aluno', icon: User, activeVariant: 'outline-orange' },
                                ]}
                            />

                            {/* Terms of Use */}
                            <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                <FormCheckbox
                                    label=""
                                    checked={acceptedTerms}
                                    onChange={setAcceptedTerms}
                                    color={STORE_TOKENS.COLORS.BRAND}
                                />
                                <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="bold" uppercase tracking="widest">
                                    Eu aceito os <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.BRAND} weight="black" cursor="pointer" underline onClick={() => setShowTermsModal(true)}>termos de uso</Font>
                                </Font>
                            </Stack>

                            <Modal
                                isOpen={showTermsModal}
                                onClose={() => setShowTermsModal(false)}
                                title="Termos de Uso"
                                subtitle={activeRole === 'trainer' ? "Contrato de Prestação de Serviços - Trainer" : "Termos de Acompanhamento - Aluno"}
                                icon={ShieldCheck}
                                variant={activeRole === 'trainer' ? 'emerald' : 'orange'}
                                confirmLabel="Entendido"
                                onConfirm={() => {
                                    setAcceptedTerms?.(true)
                                    setShowTermsModal(false)
                                }}
                            >
                                <Box padding={STORE_TOKENS.PADDING.ELEMENT} maxHeight="60vh" overflowY="auto" className="scrollbar-thin scrollbar-thumb-zinc-800">
                                    <Font variant="body" color={STORE_TOKENS.COLORS.TEXT.SECONDARY} whitespace="pre-line">
                                        {activeRole === 'trainer' ? TRAINER_TERMS : STUDENT_TERMS}
                                    </Font>
                                </Box>
                            </Modal>

                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            rounded={STORE_TOKENS.RADIUS.SYSTEM}
                            height="anatomy-item"
                            padding={STORE_TOKENS.PADDING.CONTAINER}
                            disabled={loading}
                        >
                            <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT} align="center" justify="center">
                                <Font variant="label-caps">
                                    {loading ? 'Processando...' : 'Criar minha conta'}
                                </Font>
                                {!loading && <Icon icon={ArrowRight} size="xs" />}
                            </Stack>
                        </Button>
                    </Stack>
                </form>
            </Box>

            <Divider color={STORE_TOKENS.COLORS.DIVIDER.SUBTLE} />

            {/* Footer */}
            <Box padding={STORE_TOKENS.PADDING.CONTAINER} display="flex" align="center" justify="center" bg={STORE_TOKENS.COLORS.BLACK} bgOpacity={STORE_TOKENS.OPACITY.INTERMEDIATE}>
                <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED} align="center" weight="bold" uppercase tracking="widest">
                    Já possui uma conta? <Link href="/auth/login"><Font variant="sub-tiny" color={STORE_TOKENS.COLORS.BRAND} weight="black" cursor="pointer" underline>Fazer login</Font></Link>
                </Font>
            </Box>
        </Stack>
        </Surface >
    )
}
