'use client'

import React, { useState, useTransition } from 'react'
import { Surface } from '@/components/store/base/surface'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Box } from '@/components/store/base/box'
import { Button } from '@/components/store/base/button'
import { Badge } from '@/components/store/base/badge'
import { Icon } from '@/components/store/base/icon'
import * as LucideIcons from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Settings, Trash2 } from 'lucide-react'
import { PlanFeatures } from '@/types'
import { AsaasPaymentModal } from '@/components/store/advanced/asaas-payment-modal'
import { Modal } from '@/components/store/advanced/modal'
import { PlanForm } from '@/components/store/advanced/plan-form'
import { actions } from '@/lib/dal'
import { Callout } from '@/components/store/intermediary/callout'
const featureLabels: Partial<Record<keyof PlanFeatures, string>> = {
    has_workouts: 'Construtor de Treinos',
    has_diets: 'Planos Alimentares',
    has_cardio: 'Prescrição de Cardio',
    has_ergogenics: 'Módulo de Ergogênicos',
    has_import_pdf_ai: 'Importação de PDF via IA',
}

interface PlanCardProps {
    plan: any
    isCurrentPlan?: boolean
    adminMode?: boolean
    onToggleActive?: (id: string) => void
    isPending?: boolean
}

export function PlanCard({ plan, isCurrentPlan = false, adminMode = false, onToggleActive, isPending = false }: PlanCardProps) {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isPendingDelete, startDeleteTransition] = useTransition()

    const handleDelete = () => {
        startDeleteTransition(async () => {
            const res = await actions.deletePlan(plan.id)
            if (res?.success) {
                setIsDeleteModalOpen(false)
            } else {
                alert(res?.error || 'Erro ao excluir o plano')
            }
        })
    }
    const features = Array.isArray(plan.plan_features_dynamic) ? plan.plan_features_dynamic[0] : plan.plan_features_dynamic
    const [rawTheme, iconName, badgeText] = (plan.card_theme || 'default').split(':')
    const theme = rawTheme || 'default'
    const SelectedIcon = (LucideIcons as any)[iconName || 'Dumbbell'] || LucideIcons.Dumbbell

    const validColors = ['blue', 'emerald', 'orange', 'amber', 'red']
    const isColorTheme = validColors.includes(theme)
    const surfaceVariant = isColorTheme ? `tonal-${theme}` as any : (theme === 'premium' ? 'tonal-amber' : 'glass')

    const isPremium = theme === 'premium' || theme === 'amber'
    const isHighlighted = theme === 'highlighted' || theme === 'emerald' || theme === 'orange' || theme === 'blue' || theme === 'red'

    const premiumBorder = 'linear-gradient(135deg, #B8860B 0%, #FFD700 50%, #B8860B 100%)'
    const highlightedBorder = STORE_TOKENS.COLORS.BRAND

    const isFree = plan.base_price_cents === 0
    const priceDisplay = isFree ? 'Grátis' : `R$ ${(plan.base_price_cents / 100).toFixed(2).replace('.', ',')}`

    const borderOpacityClasses: Record<string, string> = {
        blue: 'border-blue-500/20',
        emerald: 'border-emerald-500/20',
        orange: 'border-orange-500/20',
        amber: 'border-amber-500/20',
        red: 'border-red-500/20',
        premium: 'border-amber-500/20'
    }
    const dynamicBorderClass = (isPremium || isHighlighted) ? borderOpacityClasses[theme === 'premium' ? 'premium' : theme] : undefined

    return (
        <>
        <Surface
            variant={surfaceVariant}
            padding={STORE_TOKENS.PADDING.CONTAINER}
            rounded={STORE_TOKENS.RADIUS.SYSTEM}
            border={isPremium || isHighlighted ? 'bold' : 'standard'}
            height="full"
            display="flex"
            direction="col"
        >
            <Box position="relative" zIndex={0} fullWidth height="full" display="flex" direction="col" flex1>
                {/* Background Icon */}
                <Box position="absolute" top={0} right={0} opacity={5} pointerEvents="none" zIndex={0}>
                    <SelectedIcon size={120} strokeWidth={1} />
                </Box>

                <Stack gap={STORE_TOKENS.SPACING.CONTAINER} flex1 position="relative" zIndex={10}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="start" textAlign="left">
                        {(isPremium || isHighlighted || badgeText) && !adminMode && (
                            <Box display="flex" justify="start">
                                <Badge
                                    label={badgeText || (isPremium ? "Elite" : "Mais Popular")}
                                    color={isPremium ? "amber" : (isColorTheme ? theme as any : STORE_TOKENS.COLORS.BRAND)}
                                    variant="solid"
                                    size="sm"
                                    icon={SelectedIcon}
                                />
                            </Box>
                        )}
                        {adminMode && (
                            <Box display="flex" justify="start" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Badge
                                    label={plan.is_active ? 'Ativo' : 'Inativo'}
                                    color={plan.is_active ? STORE_TOKENS.COLORS.SUCCESS : STORE_TOKENS.COLORS.WARNING}
                                    variant="solid"
                                    size="sm"
                                />
                                <Badge
                                    label={`${plan.subscribers_count || plan.subscriber_count || 0} assinantes`}
                                    color="zinc"
                                    variant="glass"
                                    size="sm"
                                />
                            </Box>
                        )}
                        <Font variant="h3" weight="black" uppercase italic color={isPremium ? 'amber' : (isColorTheme ? theme as any : 'primary')}>
                            Plano {plan.name}
                        </Font>
                        <Font variant="body-sm" color="zinc-400">
                            {plan?.description}
                        </Font>

                        <Stack align="start">
                            <Font variant="h1" weight="black" color="white">
                                {priceDisplay}
                            </Font>
                        </Stack>
                    </Stack>

                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT} flex1>
                        <Box padding={STORE_TOKENS.PADDING.ELEMENT} border borderColor={STORE_TOKENS.COLORS.DIVIDER.SUBTLE}>
                            <Stack direction="row" justify="between" align="center">
                                <Font variant="body-sm" weight="bold" color="zinc-400">Limite de Alunos</Font>
                                <Font variant="body-sm" weight="bold" color="white">{features?.student_limit ?? 'Ilimitado'}</Font>
                            </Stack>
                        </Box>

                        {plan.slug === 'on_demand' && features?.price_per_student_cents ? (
                            <>
                                <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                    <Icon icon={LucideIcons.CheckCircle2} size="xs" color={STORE_TOKENS.COLORS.SUCCESS} />
                                    <Font variant="body-sm" color="zinc-400">{features.free_students_limit || 0} Alunos Iniciais (Grátis)</Font>
                                </Stack>
                                <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                    <Icon icon={LucideIcons.CheckCircle2} size="xs" color={STORE_TOKENS.COLORS.SUCCESS} />
                                    <Font variant="body-sm" color="zinc-400">R$ {(features.price_per_student_cents / 100).toFixed(2).replace('.', ',')} / aluno excedente</Font>
                                </Stack>
                            </>
                        ) : null}

                        {Object.entries(featureLabels).map(([key, label]) => {
                            const hasFeature = features?.[key as keyof typeof features] === true
                            if (!hasFeature) return null

                            let displayLabel = label
                            if (key === 'has_import_pdf_ai') {
                                const limit = features?.pdf_import_limit
                                displayLabel += ` (${limit === null || limit === undefined ? 'Ilimitado' : `${limit}/mês`})`
                            }

                            return (
                                <Stack key={key} direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                    <Icon icon={LucideIcons.CheckCircle2} size="xs" color={STORE_TOKENS.COLORS.SUCCESS} />
                                    <Font variant="body-sm" color="zinc-400">{displayLabel}</Font>
                                </Stack>
                            )
                        })}

                        {/* Mostrar as não inclusas */}
                        {Object.entries(featureLabels).map(([key, label]) => {
                            const hasFeature = features?.[key as keyof typeof features] === true
                            if (hasFeature) return null
                            return (
                                <Stack key={key} direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT} opacity={50}>
                                    <Icon icon={LucideIcons.X} size="xs" color="red" />
                                    <del><Font variant="body-sm" color="zinc-500">{label}</Font></del>
                                </Stack>
                            )
                        })}
                    </Stack>

                    {adminMode ? (
                        <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT} justify="end" align="center" fullWidth>
                            <Box flex1>
                                <Button
                                    variant="outline-zinc"
                                    fullWidth
                                    onClick={() => onToggleActive?.(plan.id)}
                                    disabled={isPending || isPendingDelete}
                                >
                                    {plan.is_active ? 'Desativar' : 'Ativar'}
                                </Button>
                            </Box>
                            <Box flex1>
                                {plan.onEdit ? (
                                    <Button
                                        variant="outline-blue"
                                        fullWidth
                                        onClick={() => plan.onEdit(plan.id)}
                                        disabled={isPendingDelete}
                                    >
                                        Editar
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline-blue"
                                        fullWidth
                                        onClick={() => setIsEditModalOpen(true)}
                                        disabled={isPendingDelete}
                                    >
                                        Editar
                                    </Button>
                                )}
                            </Box>
                            <Button
                                variant="outline-red"
                                isIconOnly
                                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                onClick={() => setIsDeleteModalOpen(true)}
                                disabled={isPending || isPendingDelete}
                            >
                                <Icon icon={LucideIcons.Trash2} size="sm" />
                            </Button>
                        </Stack>
                    ) : (
                        <Button
                            variant="outline-emerald"
                            fullWidth
                            disabled={isCurrentPlan || isPendingDelete}
                            onClick={() => {
                                if (isCurrentPlan) return
                                if (isFree) {
                                    startDeleteTransition(async () => {
                                        const { assignFreePlan } = await import('@/actions/asaas-actions')
                                        const res = await assignFreePlan(plan.id, plan.slug)
                                        if (res.success) {
                                            window.location.href = '/dashboard/trainer'
                                        } else {
                                            alert(res.error || 'Erro ao assinar o plano.')
                                        }
                                    })
                                } else {
                                    setIsPaymentModalOpen(true)
                                }
                            }}
                        >
                            <Box display="flex" justify="center" align="center" fullWidth>
                                <Font variant="auxiliary" color="emerald">
                                    {isCurrentPlan ? 'Plano Atual' : (isPendingDelete ? 'Assinando...' : 'ASSINAR PLANO')}
                                </Font>
                            </Box>
                        </Button>
                    )}
                </Stack>
            </Box>
        </Surface >

        {
        !isCurrentPlan && !adminMode && (
            <AsaasPaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                tier={plan.slug as any} // mantido para fallback
                plan_id={plan.id}
                plan_slug={plan.slug}
                monthlyTotal={plan.base_price_cents / 100}
            />
        )
    }

    {
        adminMode && (
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title={`Editar Plano - ${plan.name}`}
                subtitle="Altere os dados do plano abaixo."
                icon={Settings}
                confirmType="submit"
                formId="plan-form"
                confirmLabel="Salvar Plano"
            >
                <PlanForm initialData={plan} onSuccess={() => setIsEditModalOpen(false)} />
            </Modal>
        )
    }

    {
        adminMode && (
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Excluir Plano"
                subtitle="Confirme a exclusão do plano"
                icon={Trash2}
                variant="red"
                confirmVariant="outline-red"
                confirmLabel={isPendingDelete ? "Excluindo..." : "Excluir Plano"}
                onConfirm={handleDelete}
                isLoading={isPendingDelete}
            >
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Callout variant="danger" title="Ação Irreversível">
                        Você tem certeza que deseja excluir o plano <Font weight="bold">{plan.name}</Font>? Todos os dados associados serão removidos permanentemente.
                    </Callout>
                    <Font variant="description" color="zinc-400">
                        Esta ação não poderá ser desfeita e impactará todos os assinantes ativos deste plano.
                    </Font>
                </Stack>
            </Modal>
        )
    }
        </>
    )
}
