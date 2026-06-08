'use client'

import React, { useState } from 'react'
import { Surface } from '@/components/store/base/surface'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Box } from '@/components/store/base/box'
import { Button } from '@/components/store/base/button'
import { Badge } from '@/components/store/base/badge'
import { Icon } from '@/components/store/base/icon'
import { CheckCircle2 } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { PlanFeatures } from '@/types'
import { AsaasPaymentModal } from '@/components/store/advanced/asaas-payment-modal'

const featureLabels: Partial<Record<keyof PlanFeatures, string>> = {
    has_ergogenics: 'Módulo de Ergogênicos',
    has_import_pdf_ai: 'Importação de PDF via IA',
    has_public_profile: 'Perfil Público',
    has_public_feed: 'Feed Público',
    has_store: 'Loja de Auto Treino',
    has_ranking: 'Participação no Ranking',
    has_elite_badge: 'Selo Elite',
    has_workouts: 'Construtor de Treinos',
    has_diets: 'Planos Alimentares',
    has_cardio: 'Prescrição de Cardio',
}

interface PlanCardProps {
    plan: any
    isCurrentPlan: boolean
}

export function PlanCard({ plan, isCurrentPlan }: PlanCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const features = Array.isArray(plan.plan_features_dynamic) ? plan.plan_features_dynamic[0] : plan.plan_features_dynamic
    const theme = plan.card_theme || 'default'

    const isPremium = theme === 'premium'
    const isHighlighted = theme === 'highlighted'

    const premiumBorder = 'linear-gradient(135deg, #B8860B 0%, #FFD700 50%, #B8860B 100%)'
    const highlightedBorder = STORE_TOKENS.COLORS.BRAND

    const isFree = plan.base_price_cents === 0
    const priceDisplay = isFree ? 'Grátis' : `R$ ${(plan.base_price_cents / 100).toFixed(2).replace('.', ',')}`

    return (
        <>
            <Box
                position="relative"
                style={{
                    padding: (isPremium || isHighlighted) ? '2px' : '0',
                    background: isPremium ? premiumBorder : (isHighlighted ? highlightedBorder : 'transparent'),
                    borderRadius: STORE_TOKENS.RADIUS.SYSTEM,
                }}
            >
                {isHighlighted && (
                    <Box position="absolute" top="-12px" left="50%" style={{ transform: 'translateX(-50%)', zIndex: 10 }}>
                        <Badge label="Mais Popular" color={STORE_TOKENS.COLORS.BRAND} variant="solid" size="sm" />
                    </Box>
                )}
                {isPremium && (
                    <Box position="absolute" top="-12px" left="50%" style={{ transform: 'translateX(-50%)', zIndex: 10 }}>
                        <Badge label="Elite" color="amber" variant="solid" size="sm" />
                    </Box>
                )}

                <Surface
                    variant="glass"
                    padding={STORE_TOKENS.PADDING.CONTAINER}
                    rounded={STORE_TOKENS.RADIUS.SYSTEM}
                    border={isPremium || isHighlighted ? 'none' : 'standard'}
                    style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER} flex1>
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="center" textAlign="center">
                            <Font variant="h3" weight="black" uppercase italic color={isPremium ? 'emerald' : 'primary'}>
                                {plan.name}
                            </Font>
                            <Font variant="body-sm" color="zinc-400">
                                {plan.description}
                            </Font>

                            <Stack align="center">
                                <Font variant="h1" weight="black" color="white">
                                    {priceDisplay}
                                </Font>
                                {plan.slug === 'on_demand' && features?.price_per_student_cents ? (
                                    <Font variant="tiny" color="zinc-500" uppercase tracking="widest" weight="bold">
                                        + R$ {(features.price_per_student_cents / 100).toFixed(2).replace('.', ',')}/aluno após os {features.free_students_limit || 0} grátis
                                    </Font>
                                ) : null}
                            </Stack>
                        </Stack>

                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT} flex1>
                            <Box padding={STORE_TOKENS.PADDING.ELEMENT}>
                                <Stack direction="row" justify="between" align="center">
                                    <Font variant="body-sm" weight="bold" color="zinc-400">Limite de Alunos</Font>
                                    <Font variant="body-sm" weight="bold" color="white">{features?.student_limit ?? 'Ilimitado'}</Font>
                                </Stack>
                            </Box>

                            {Object.entries(featureLabels).map(([key, label]) => {
                                const hasFeature = features?.[key] === true
                                if (!hasFeature) return null
                                return (
                                    <Stack key={key} direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                        <Icon icon={CheckCircle2} size="xs" color={STORE_TOKENS.COLORS.SUCCESS} />
                                        <Font variant="body-sm" color="zinc-400">{label}</Font>
                                    </Stack>
                                )
                            })}
                        </Stack>

                        <Button
                            variant={isCurrentPlan ? 'outline-zinc' : (isPremium ? 'primary' : 'white')}
                            fullWidth
                            disabled={isCurrentPlan}
                            onClick={() => {
                                if (!isCurrentPlan) setIsModalOpen(true)
                            }}
                        >
                            {isCurrentPlan ? 'Plano Atual' : 'Assinar Plano'}
                        </Button>
                    </Stack>
                </Surface>
            </Box>

            {!isCurrentPlan && (
                <AsaasPaymentModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    tier={plan.slug as any} // mantido para fallback
                    plan_id={plan.id}
                    plan_slug={plan.slug}
                    monthlyTotal={plan.base_price_cents / 100}
                />
            )}
        </>
    )
}
