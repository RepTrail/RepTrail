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
import { useRegistry } from '@/components/store/advanced/registry-context'
import { Mail, Lock, User, ArrowRight, Phone } from 'lucide-react'
import { translateAuthError } from '@/lib/auth-errors'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { FormCheckbox } from '@/components/store/base/form-checkbox'
import { Modal } from '@/components/store/advanced/modal'
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
        <Surface variant="glass" padding="none" rounded={STORE_TOKENS.RADIUS.SYSTEM} width="full" maxWidth="auth-form">
            <Stack gap="none">
                {/* Header */}
                <Box padding={STORE_TOKENS.PADDING.CONTAINER}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Font variant="h2" align="center">Seja um <Font
                            variant="h2"
                            {...{
                                color: STORE_TOKENS.COLORS.BRAND,
                            }}>Afiliado</Font></Font>
                        <Font
                            variant="auxiliary"
                            align="center"
                            uppercase
                            tracking="widest"
                            {...{
                                color: STORE_TOKENS.COLORS.TEXT.MUTED,
                            }}>
                            Ganhe 10% por cada indicação
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
                                <Surface padding={STORE_TOKENS.PADDING.ELEMENT} rounded={STORE_TOKENS.RADIUS.SYSTEM} display="flex" align="center" bg={STORE_TOKENS.COLORS.ERROR} bgOpacity={10} border="subtle" minHeight={44}>
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
                                label="Seu Nome Completo"
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
                                    Eu aceito os <Font
                                    variant="sub-tiny"
                                    weight="black"
                                    cursor="pointer"
                                    underline
                                    onClick={() => setShowTermsModal(true)}
                                    {...{
                                        color: STORE_TOKENS.COLORS.BRAND,
                                    }}>termos de uso</Font>
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
                                <Box padding="none" maxHeight="60vh" overflowY="auto">
                                    <Font
                                        variant="body"
                                        whitespace="pre-line"
                                        {...{
                                            color: STORE_TOKENS.COLORS.TEXT.SECONDARY,
                                        }}>
                                        {AFFILIATE_TERMS}
                                    </Font>
                                </Box>
                            </Modal>

                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                height="anatomy-item"
                                gap="element"
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
                        Já possui uma conta? <Link href="/afiliados/login"><Font
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
        </Surface>
    );
}
