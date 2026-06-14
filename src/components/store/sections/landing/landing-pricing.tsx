'use client'

import React from 'react'
import Link from 'next/link'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { Font } from '@/components/store/base/font'
import { Button } from '@/components/store/base/button'
import { Icon } from '@/components/store/base/icon'
import { Badge } from '@/components/store/base/badge'
import { useRegistry } from '@/components/store/base/registry-context'
import { fbqEvent } from '@/lib/meta-pixel'
import { CheckCircle2, Zap, ShieldCheck, Infinity, ArrowRight } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { LandingSection } from '@/components/store/intermediary/landing-section'
import { GlassPanel, Surface } from '@/components/store/base/surface'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Para estruturar sua operação',
    price: 'R$ 29,90',
    period: '/mês',
    icon: Zap,
    features: [
      'Até 10 alunos',
      'Construtor de treinos completo',
      'Planos alimentares',
      'Prescrição de cardio',
      'Perfil público no marketplace',
      'Suporte VIP',
    ],
    cta: 'Começar com o Starter',
    link: '/auth/signup',
    featured: false,
    badge: null,
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Para escalar sua consultoria',
    price: 'R$ 99,90',
    period: '/mês',
    icon: ShieldCheck,
    features: [
      'Até 30 alunos',
      'Tudo do Starter',
      'Módulo de ergogênicos',
      'Importação de PDF por IA ilimitada',
      'Relatórios avançados de evolução',
      'Suporte VIP prioritário',
    ],
    cta: 'Quero o Pro agora',
    link: '/auth/signup',
    featured: true,
    badge: 'Mais popular',
  },
  {
    id: 'elite',
    name: 'Elite',
    tagline: 'Para construir sem limites',
    price: 'R$ 199,90',
    period: '/mês',
    icon: Infinity,
    features: [
      'Alunos ilimitados',
      'Tudo do Pro',
      'Estrutura completa para escalar',
      'Multi-trainer (em breve)',
      'API de integração (em breve)',
      'Suporte VIP dedicado',
    ],
    cta: 'Começar com o Elite',
    link: '/auth/signup',
    featured: false,
    badge: null,
  },
]

export function LandingPricing() {
  const { primaryColor } = useRegistry()

  return (
    <LandingSection>
      <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth align="center">

        {/* Header */}
        <Stack align={{ base: 'start', md: 'center' }} gap={STORE_TOKENS.SPACING.CONTAINER} textAlign={{ base: 'left', md: 'center' }} width={{ base: 'full', md: 'half' }} alignSelf="center">
          <Badge label="Planos" icon={ShieldCheck} color={STORE_TOKENS.COLORS.BRAND} variant="solid" />
          <Font variant="h2" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} uppercase italic align={{ base: 'left', md: 'center' }}>
            <Font variant="h2" display="inline">Escolha o plano do </Font>
            <Font variant="h2" color={STORE_TOKENS.COLORS.BRAND} uppercase italic display="inline">
              seu momento.
            </Font>
          </Font>
          <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.SECONDARY} align={{ base: 'left', md: 'center' }}>
            Cada plano foi criado para um estágio da sua consultoria. Comece onde faz sentido e escale quando estiver pronto.
          </Font>
        </Stack>

        {/* Plans Grid */}
        <Grid cols={1} mdCols={3} gap={STORE_TOKENS.SPACING.CONTAINER} width="full" align="stretch">
          {PLANS.map((plan) => {
            const CardComponent = plan.featured ? Surface : GlassPanel
            const cardProps = plan.featured ? { variant: 'tonal-primary' as const } : {}

            return (
              <CardComponent
                key={plan.id}
                position="relative"
                padding={STORE_TOKENS.PADDING.CONTAINER}
                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                display="flex"
                direction="col"
                justify="between"
                gap={STORE_TOKENS.SPACING.CONTAINER}
                transition
                {...cardProps}
              >
                {/* Popular badge */}
                {plan.badge && (
                  <Box position="absolute" top={-12} right={16} zIndex={STORE_TOKENS.Z_INDEX.OVERLAY}>
                    <Badge label={plan.badge} color={STORE_TOKENS.COLORS.BRAND} variant="solid" />
                  </Box>
                )}

                {/* Plan header */}
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                  <Font variant="h4" color={plan.featured ? STORE_TOKENS.COLORS.BRAND : STORE_TOKENS.COLORS.TEXT.PRIMARY} uppercase italic weight="black">
                    {plan.name}
                  </Font>
                  <Font variant="body-sm" color={STORE_TOKENS.COLORS.TEXT.SECONDARY}>
                    {plan.tagline}
                  </Font>
                </Stack>

                {/* Price */}
                <Stack gap={STORE_TOKENS.SPACING.NONE} align="start">
                  <Box display="flex" align="baseline" gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Font variant="h2" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} weight="black" italic>
                      {plan.price}
                    </Font>
                    <Font variant="body-sm" color={STORE_TOKENS.COLORS.TEXT.MUTED}>
                      {plan.period}
                    </Font>
                  </Box>
                </Stack>

                {/* Features list */}
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT} flex1>
                  {plan.features.map((feature, i) => (
                    <Stack key={i} direction="row" gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                      <Icon icon={CheckCircle2} size="sm" color={STORE_TOKENS.COLORS.BRAND} />
                      <Font variant="body-sm" color={STORE_TOKENS.COLORS.TEXT.SECONDARY}>
                        {feature}
                      </Font>
                    </Stack>
                  ))}
                </Stack>

                {/* CTA */}
                <Button
                  asChild
                  onClick={() => fbqEvent('Lead', { content_name: `Pricing CTA ${plan.name}`, content_category: 'Landing Page' })}
                  variant={plan.featured ? 'primary' : 'outline-zinc'}
                  size="lg"
                  activeScale={95}
                  fullWidth
                  shine={plan.featured}
                >
                  <Link href={plan.link}>
                    <Box as="span" display="flex" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT} cursor="pointer" width="full">
                      <Font variant="body" weight="medium">{plan.cta}</Font>
                      <Icon icon={ArrowRight} size="md" />
                    </Box>
                  </Link>
                </Button>
              </CardComponent>
            )
          })}
        </Grid>

      </Stack>
    </LandingSection>
  )
}
