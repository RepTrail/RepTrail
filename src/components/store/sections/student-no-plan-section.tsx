'use client'

import React from 'react'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Grid } from '@/components/store/base/grid'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Button } from '@/components/store/base/button'
import { Surface } from '@/components/store/base/surface'
import { Inline } from '@/components/store/base/layout'
import { BackgroundIcon } from '@/components/store/base/background-icon'
import { RankingSectionContent } from '@/components/store/sections/ranking-section-content'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Sparkles, ArrowRight, Zap } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { AsaasPaymentModal } from '@/components/store/advanced/asaas-payment-modal'

interface StudentNoPlanSectionProps {
    ranking?: any[]
}

export function StudentNoPlanSection({ ranking }: StudentNoPlanSectionProps) {
    const [isAsaasOpen, setIsAsaasOpen] = useState(false);

    return (
        <RegistryMain
            title="BEM-VINDO"
            subtitle="Você ainda não possui um plano ativo no RepTrail."
            icon={Sparkles}
            contextLabel="Área do Aluno"
            showTabs={false}
        >
            <Stack gap={{ base: STORE_TOKENS.SPACING.EMPTY_STATE as any, md: STORE_TOKENS.SPACING.SECTION }}>
                <Grid cols={{ base: 1, lg: 2 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    {/* Hero Section - Marketplace Entry (Personal Trainer) */}
                    <Surface
                        variant="tonal-emerald"
                        padding={STORE_TOKENS.PADDING.CONTAINER}
                        rounded={STORE_TOKENS.RADIUS.SYSTEM}
                        position="relative"
                        overflow="hidden"
                        border="subtle"
                    >
                        <BackgroundIcon
                            icon={Zap}
                            size="100"
                            opacity={STORE_TOKENS.OPACITY.SUBTLE}
                            {...{
                                width: "auto",
                                height: "auto",
                                top: 0,
                                right: 0,
                            }} />
                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER} justify="center">
                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Font
                                    variant="sub-tiny"
                                    weight="black"
                                    uppercase
                                    tracking="widest"
                                    {...{
                                        color: "emerald",
                                    }}>
                                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                        <Icon icon={Sparkles} size="xs" color={STORE_TOKENS.COLORS.SUCCESS} />
                                        Plataforma Elite
                                    </Inline>
                                </Font>
                                <Font {...STORE_TOKENS.TYPOGRAPHY.HEADING} variant="h1">
                                    Desbloqueie seu
                                </Font>
                                <Font
                                    {...STORE_TOKENS.TYPOGRAPHY.HEADING}
                                    variant="h1"
                                    {...{
                                        color: "emerald",
                                    }}>
                                    Potencial Máximo
                                </Font>
                            </Stack>
                            <Font
                                variant="body"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                }}>
                                Você ainda não possui um personal trainer. Conecte-se com a elite do treinamento físico e receba protocolos 100% personalizados.
                            </Font>
                            <Box padding={STORE_TOKENS.PADDING.NONE}>
                                <Link href="/dashboard/student/buscar-personal">
                                    <Button variant="emerald" size="lg" rounded={STORE_TOKENS.RADIUS.SYSTEM} gap={STORE_TOKENS.SPACING.ELEMENT} transition>
                                        <Font
                                            variant="label-caps"
                                            weight="black"
                                            {...{
                                                color: "black",
                                            }}>Encontrar Personal</Font>
                                        <Icon icon={ArrowRight} size="sm" color={STORE_TOKENS.COLORS.BLACK} />
                                    </Button>
                                </Link>
                            </Box>
                        </Stack>
                    </Surface>
 
                    {/* Auto-Training Promotion */}
                    <Surface
                        variant="tonal-orange"
                        padding={STORE_TOKENS.PADDING.CONTAINER}
                        rounded={STORE_TOKENS.RADIUS.SYSTEM}
                        position="relative"
                        overflow="hidden"
                        border="subtle"
                    >
                        <BackgroundIcon
                            icon={Sparkles}
                            size="100"
                            opacity={STORE_TOKENS.OPACITY.SUBTLE}
                            {...{
                                width: "auto",
                                height: "auto",
                                top: 0,
                                right: 0,
                            }} />
                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER} justify="center">
                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Font
                                    variant="sub-tiny"
                                    weight="black"
                                    uppercase
                                    tracking="widest"
                                    {...{
                                        color: "orange",
                                    }}>
                                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                        <Icon icon={Sparkles} size="xs" color={STORE_TOKENS.COLORS.BRAND} />
                                        Inteligência Artificial
                                    </Inline>
                                </Font>
                                <Font {...STORE_TOKENS.TYPOGRAPHY.HEADING} variant="h1">
                                    Auto-Training com
                                </Font>
                                <Font
                                    {...STORE_TOKENS.TYPOGRAPHY.HEADING}
                                    variant="h1"
                                    {...{
                                        color: "orange",
                                    }}>
                                    RepTrail AI
                                </Font>
                            </Stack>
                            <Font
                                variant="body"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                }}>
                                Protocolos gerados instantaneamente com base na sua rotina, objetivos e equipamentos disponíveis de forma inteligente.
                            </Font>
                            <Box padding={STORE_TOKENS.PADDING.NONE}>
                                <Button variant="orange" size="lg" rounded={STORE_TOKENS.RADIUS.SYSTEM} gap={STORE_TOKENS.SPACING.ELEMENT} transition onClick={() => setIsAsaasOpen(true)}>
                                    <Font
                                        variant="label-caps"
                                        weight="black"
                                        {...{
                                            color: "black",
                                        }}>Ativar por R$ 10,90/mês</Font>
                                    <Icon icon={ArrowRight} size="sm" color={STORE_TOKENS.COLORS.BLACK} />
                                </Button>
                            </Box>
                        </Stack>
                    </Surface>
                </Grid>

                {/* Design System Ranking Section */}
                <RankingSectionContent />
            </Stack>

            <AsaasPaymentModal
                isOpen={isAsaasOpen}
                onClose={() => setIsAsaasOpen(false)}
                tier="auto_training"
                monthlyTotal={10.90}
            />
        </RegistryMain>
    );
}
