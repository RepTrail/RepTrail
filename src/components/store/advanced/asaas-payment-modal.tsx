'use client'

import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/store/advanced/modal'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Input } from '@/components/store/base/input'
import {
    CreditCard,
    User,
    ShieldCheck,
    CheckCircle2,
    Calendar,
    MapPin,
    Hash,
    Loader2,
    QrCode
} from 'lucide-react'
import { SegmentedSwitch } from '@/components/store/intermediary/segmented-switch'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { actions } from '@/lib/dal'
import { useToast } from '@/components/store/hooks/use-toast'

interface AsaasPaymentModalProps {
    isOpen: boolean
    onClose: () => void
    tier: 'on_demand' | 'auto_training'
    currentCpf?: string
    currentName?: string
    monthlyTotal: number
    userId?: string
    plan_id?: string
    plan_slug?: string
}

type Step = 'info' | 'payment' | 'card_details'

export function AsaasPaymentModal({
    isOpen,
    onClose,
    tier,
    currentCpf,
    currentName,
    monthlyTotal,
    userId,
    plan_id,
    plan_slug
}: AsaasPaymentModalProps) {
    const [billingType, setBillingType] = useState<'CREDIT_CARD' | 'PIX'>('CREDIT_CARD')
    const [cpf, setCpf] = useState(currentCpf || '')
    const [fullName, setFullName] = useState(currentName || '')
    const [isProcessing, setIsProcessing] = useState(false)
    const [cardData, setCardData] = useState({
        number: '',
        holder: '',
        expiry: '',
        cvv: '',
        postalCode: '',
        addressNumber: ''
    })
    const [fetchingName, setFetchingName] = useState(false)
    const [pixData, setPixData] = useState<{ encodedImage: string, payload: string } | null>(null)
    const { toast } = useToast()

    // Masking Utilities
    const maskCpfCnpj = (v: string) => {
        const c = v.replace(/\D/g, '')
        if (c.length <= 11) {
            return c.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').substring(0, 14);
        }
        return c.replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d{1,2})/, '$1-$2').substring(0, 18);
    }

    const maskCardNumber = (v: string) => v.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().substring(0, 19)
    const maskExpiry = (v: string) => v.replace(/\D/g, '').replace(/(\d{2})/, '$1/').substring(0, 5)
    const maskCep = (v: string) => v.replace(/\D/g, '').replace(/(\d{5})/, '$1-').substring(0, 9)

    const validateCpfCnpj = (val: string) => {
        const clean = val.replace(/\D/g, '')
        return clean.length === 11 || clean.length === 14 
    }

    // Auto-fetch name from Asaas
    useEffect(() => {
        const clean = cpf.replace(/\D/g, '')
        if (clean.length === 11 || clean.length === 14) {
            if (!fullName || fullName.trim().split(' ').length < 2) {
                const timer = setTimeout(async () => {
                    setFetchingName(true)
                    try {
                        const res = await actions.searchAsaasCustomer(clean)
                        if (res.success && res.name) {
                            setFullName(res.name)
                        }
                    } catch (err) {
                        console.error(`[ASAAS] Error:`, err)
                    } finally {
                        setFetchingName(false)
                    }
                }, 800)
                return () => clearTimeout(timer)
            }
        }
    }, [cpf])

    const handleSubscribe = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        
        if (!validateCpfCnpj(cpf)) {
            toast({ variant: 'destructive', title: 'Documento inválido', description: 'Insira um CPF ou CNPJ válido.' })
            return
        }
        if (fullName.trim().split(' ').length < 2) {
            toast({ variant: 'destructive', title: 'Nome incompleto', description: 'Por favor, insira seu nome completo.' })
            return
        }
        if (billingType === 'CREDIT_CARD') {
            if (cardData.number.replace(/\s/g, '').length < 15) {
                toast({ variant: 'destructive', title: 'Cartão inválido', description: 'Insira um número de cartão válido.' })
                return
            }
            if (cardData.expiry.length < 5) {
                toast({ variant: 'destructive', title: 'Validade inválida', description: 'Insira uma validade válida.' })
                return
            }
            if (cardData.cvv.length < 3) {
                toast({ variant: 'destructive', title: 'CVV inválido', description: 'Insira um CVV válido.' })
                return
            }
        }

        setIsProcessing(true)
        toast({ title: "Processando...", description: "Estamos preparando sua assinatura segura." })

        try {
            const [month, year] = cardData.expiry.split('/')
            const fullYear = `20${year}`

            const res = await actions.createAsaasSubscription(
                tier,
                billingType,
                cpf.replace(/\D/g, ''),
                fullName.trim(),
                billingType === 'CREDIT_CARD' ? {
                    holderName: cardData.holder,
                    number: cardData.number.replace(/\s/g, ''),
                    expiryMonth: month,
                    expiryYear: fullYear,
                    ccv: cardData.cvv,
                    postalCode: cardData.postalCode.replace(/\D/g, ''),
                    addressNumber: cardData.addressNumber
                } : undefined,
                plan_id
            )

            if (res.success) {
                if (billingType === 'PIX') {
                    if (res.pixQrCode) {
                        setPixData(res.pixQrCode)
                        return
                    } else {
                        toast({ variant: 'destructive', title: 'Aviso', description: 'Sua assinatura foi processada, mas houve um atraso na geração do QR Code do PIX. Verifique seu e-mail ou aguarde alguns minutos.' })
                    }
                } else {
                    toast({ title: 'Sucesso!', description: 'Sua assinatura foi processada com êxito.' })
                }
                
                onClose()
                const target = tier === 'auto_training' ? '/dashboard/student' : '/dashboard/trainer'
                window.location.href = target
            } else {
                throw new Error(res.error || 'Erro ao processar o pagamento.')
            }
        } catch (err: any) {
            toast({
                variant: 'destructive',
                title: 'Erro no Pagamento',
                description: err.message || 'Ocorreu um erro ao processar a assinatura.'
            })
        } finally {
            setIsProcessing(false)
        }
    }

    if (pixData) {
        return (
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="Pague via PIX"
                subtitle="Escaneie o QR Code abaixo ou copie a chave"
                icon={QrCode}
                variant="emerald"
                hideCancel
                confirmLabel="Já paguei, ir para o painel"
                onConfirm={() => {
                    const target = tier === 'auto_training' ? '/dashboard/student' : '/dashboard/trainer'
                    window.location.href = target
                }}
            >
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER} align="center">
                    <img src={`data:image/png;base64,${pixData.encodedImage}`} alt="QR Code PIX" style={{ width: 250, height: 250, borderRadius: 8 }} />
                    <Input 
                        label="CHAVE PIX (COPIA E COLA)" 
                        value={pixData.payload} 
                        readOnly 
                        icon={<QrCode size={16} />} 
                        onClick={(e: any) => {
                            e.target.select()
                            navigator.clipboard.writeText(pixData.payload)
                            toast({ title: 'Copiado!', description: 'Chave PIX copiada para a área de transferência.' })
                        }}
                    />
                </Stack>
            </Modal>
        )
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Finalizar Assinatura"
            subtitle={tier === 'auto_training' ? 'Plano Aluno Auto-Treino' : 'Plano Trainer On-Demand'}
            icon={ShieldCheck}
            variant="emerald"
            hideCancel
            confirmLabel="Assinar Agora"
            onConfirm={handleSubscribe}
            isLoading={isProcessing}
        >
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                {/* Total Summary */}
                <Box padding={STORE_TOKENS.PADDING.CONTAINER} bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.SUBTLE} border borderColor={STORE_TOKENS.COLORS.DIVIDER.SUBTLE} rounded={STORE_TOKENS.RADIUS.SYSTEM}>
                    <Stack align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Font
                            variant="sub-tiny"
                            weight="black"
                            uppercase
                            {...{
                                color: "zinc-500",
                            }}>Total a Investir</Font>
                        <Font
                            variant="h3"
                            {...{
                                color: "white",
                            }}>R$ {monthlyTotal.toFixed(2).replace('.', ',')}</Font>
                        <Font
                            variant="tiny"
                            weight="black"
                            uppercase
                            italic
                            {...{
                                color: "emerald",
                            }}>Assinatura Mensal Recorrente</Font>
                    </Stack>
                </Box>

                <SegmentedSwitch
                    options={[
                        { id: 'CREDIT_CARD', label: 'Cartão de Crédito', icon: CreditCard, activeVariant: 'outline-emerald' },
                        { id: 'PIX', label: 'PIX', icon: QrCode, activeVariant: 'outline-emerald' }
                    ]}
                    activeId={billingType}
                    onSelect={(id) => setBillingType(id as 'CREDIT_CARD' | 'PIX')}
                />

                {/* Identification */}
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Input
                        label="DOCUMENTO (CPF OU CNPJ)"
                        icon={<Hash size={16} />}
                        value={cpf}
                        onChange={(e) => setCpf(maskCpfCnpj(e.target.value))}
                        placeholder="000.000.000-00"
                    />

                    <Input
                        label="NOME COMPLETO"
                        icon={fetchingName ? <Icon icon={Loader2} size="sm" spin /> : <User size={16} />}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Seu nome conforme o documento"
                    />
                </Stack>



                {billingType === 'CREDIT_CARD' && (
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Input
                            label="NÚMERO DO CARTÃO"
                            icon={<CreditCard size={16} />}
                            value={cardData.number}
                            onChange={(e) => setCardData(d => ({ ...d, number: maskCardNumber(e.target.value) }))}
                            placeholder="0000 0000 0000 0000"
                        />

                        <Input
                            label="NOME NO CARTÃO"
                            icon={<User size={16} />}
                            value={cardData.holder}
                            onChange={(e) => setCardData(d => ({ ...d, holder: e.target.value.toUpperCase() }))}
                            placeholder="NOME COMO IMPRESSO"
                        />

                        <Stack direction="row" gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Input
                                label="VALIDADE"
                                icon={<Calendar size={16} />}
                                value={cardData.expiry}
                                onChange={(e) => setCardData(d => ({ ...d, expiry: maskExpiry(e.target.value) }))}
                                placeholder="MM/AA"
                                flex1
                            />
                            <Input
                                label="CVV"
                                icon={<ShieldCheck size={16} />}
                                value={cardData.cvv}
                                onChange={(e) => setCardData(d => ({ ...d, cvv: e.target.value.replace(/\D/g, '').substring(0, 4) }))}
                                placeholder="000"
                                flex1
                            />
                        </Stack>

                        <Stack direction="row" gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Input
                                label="CEP"
                                icon={<MapPin size={16} />}
                                value={cardData.postalCode}
                                onChange={(e) => setCardData(d => ({ ...d, postalCode: maskCep(e.target.value) }))}
                                placeholder="00000-000"
                                flex1
                            />
                            <Input
                                label="Nº"
                                icon={<Hash size={16} />}
                                value={cardData.addressNumber}
                                onChange={(e) => setCardData(d => ({ ...d, addressNumber: e.target.value }))}
                                placeholder="Ex: 123"
                                flex1
                            />
                        </Stack>
                    </Stack>
                )}

                <Stack direction="row" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT} padding={STORE_TOKENS.PADDING.ELEMENT}>
                    <Icon icon={CheckCircle2} size="xs" color={STORE_TOKENS.COLORS.SUCCESS} />
                    <Font
                        variant="sub-tiny"
                        weight="black"
                        uppercase
                        tracking="widest"
                        {...{
                            color: "zinc-500",
                        }}>Ambiente 100% Seguro</Font>
                </Stack>
            </Stack>
        </Modal>
    );
}
