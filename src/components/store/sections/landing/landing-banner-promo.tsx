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
import { Zap, ShieldCheck, CheckCircle2, Users, ShieldOff, ArrowRight } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { LandingSection } from '@/components/store/intermediary/landing-section'
import { Surface } from '@/components/store/base/surface'

interface LandingBannerPromoProps {
  role?: 'trainer' | 'student'
  freeLimit?: number
}

export function LandingBannerPromo({ role = 'trainer', freeLimit = 5 }: LandingBannerPromoProps) {
  const { primaryColor: _primaryColor } = useRegistry()

  const config = {
    trainer: {
      badgeText: 'Próximo nível',
      badgeIcon: ShieldCheck,
      title1: 'Qual é o próximo nível',
      titleHighlight: 'da sua consultoria?',
      desc: 'Comece com o plano ideal para o seu momento e tenha a estrutura que os melhores profissionais usam para crescer, reter mais alunos e aumentar o faturamento — sem depender de WhatsApp.',
      ctaText: 'Escolher meu plano agora',
      ctaLink: '/auth/signup',
      ctaEvent: 'Guarantee Start Trainer',
      bullets: [
        'Ativação em menos de 2 minutos',
        'Suporte VIP incluído em todos os planos',
        'Escale de plano quando quiser',
        'Cancele a qualquer momento'
      ],
      circleNumber: 'PRO',
      circleLabel: 'Mais Popular',
      circleIcon: Users
    },
    student: {
      badgeText: 'Módulo Auto-Treino',
      badgeIcon: Zap,
      title1: 'Treine Sozinho,',
      titleHighlight: 'mas com Inteligência.',
      desc: 'Não precisa de um personal agora? Use nossa inteligência para prescrever seus próprios treinos, controlar cargas e acompanhar sua evolução física.',
      ctaText: 'Começar meu período grátis',
      ctaLink: '/auth/signup',
      ctaEvent: 'Auto Train Start',
      bullets: [
        'Treinos com AI',
        'Cálculo de Macros AI',
        'Importação de PDF (AI)',
        'Dietas Inteligentes'
      ],
      circleNumber: '07',
      circleLabel: 'Dias Grátis',
      circleIcon: ShieldOff
    }
  }

  const activeConfig = config[role]

  return (
    <LandingSection>
      <Box width="full" position="relative" zIndex={STORE_TOKENS.Z_INDEX.CONTENT}>
        <Surface
          variant="tonal-primary"
          rounded={STORE_TOKENS.RADIUS.SYSTEM}
          padding={{ base: STORE_TOKENS.PADDING.CONTAINER as any, md: STORE_TOKENS.PADDING.EMPTY_STATE as any }}
          width="full"
        >
          <Grid
            cols={1}
            lgCols={12}
            gap={{ base: STORE_TOKENS.SPACING.CONTAINER as any, md: STORE_TOKENS.SPACING.SECTION as any }}
            align="center"
            width="full"
          >
            {/* Left/Main Column - Content (Colspan 8) */}
            <Box lgColSpan={8} width="full" zIndex={STORE_TOKENS.Z_INDEX.CONTENT}>
              <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} align="start" textAlign="left" fullWidth>

                {/* Header info */}
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                  <Badge label={activeConfig.badgeText} icon={activeConfig.badgeIcon} color={STORE_TOKENS.COLORS.BRAND} variant="solid" />
                  <Font variant="h2" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} uppercase italic>
                    <Font variant="h2" display="inline">{activeConfig.title1} </Font>
                    <Font variant="h2" color={STORE_TOKENS.COLORS.BRAND} uppercase italic display="inline">
                      {activeConfig.titleHighlight}
                    </Font>
                  </Font>
                  <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.SECONDARY}>
                    {activeConfig.desc}
                  </Font>
                </Stack>

                {/* Bullets Grid */}
                <Grid cols={1} mdCols={2} gap={STORE_TOKENS.SPACING.ELEMENT} width="full" padding={STORE_TOKENS.PADDING.NONE}>
                  {activeConfig.bullets.map((bullet, index) => (
                    <Stack key={index} direction="row" gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                      <Icon icon={CheckCircle2} size="sm" color={STORE_TOKENS.COLORS.BRAND} />
                      <Font variant="body-sm" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} uppercase weight="bold" italic>
                        {bullet}
                      </Font>
                    </Stack>
                  ))}
                </Grid>

                {/* CTA Button */}
                <Box width="full" padding={STORE_TOKENS.PADDING.NONE}>
                  <Button
                    asChild
                    onClick={() => fbqEvent('Lead', { content_name: activeConfig.ctaEvent, content_category: 'Landing Page' })}
                    variant="primary"
                    size="lg"
                    padding={STORE_TOKENS.PADDING.CONTAINER}
                    activeScale={95}
                    fullWidth
                    shine
                  >
                    <Link href={activeConfig.ctaLink}>
                      <Box as="span" display="flex" direction={{ base: 'col', md: 'row' }} align="center" gap={STORE_TOKENS.SPACING.ELEMENT} cursor="pointer">
                        <Font variant="body" weight="black" uppercase tracking="wider">{activeConfig.ctaText}</Font>
                        <Icon icon={ArrowRight} size="md" />
                      </Box>
                    </Link>
                  </Button>
                </Box>

              </Stack>
            </Box>

            {/* Right Column - Compliant Metrics Card (Colspan 4) */}
            <Box lgColSpan={4} width="full" align="center" justify="center" zIndex={STORE_TOKENS.Z_INDEX.CONTENT} display={{ base: 'none', lg: 'flex' }}>
              <Surface
                variant="tonal-orange"
                rounded={STORE_TOKENS.RADIUS.FULL}
                padding={STORE_TOKENS.PADDING.CONTAINER}
                width="full"
                aspectRatio="square"
                display="flex"
                align="center"
                justify="center"
              >
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="center" justify="center" fullWidth>
                  <Font
                    variant="hero"
                    color={STORE_TOKENS.COLORS.BRAND}
                    weight="black"
                    align="center"
                    italic
                  >
                    {activeConfig.circleNumber}
                  </Font>
                  <Font
                    variant="label-caps"
                    color={STORE_TOKENS.COLORS.BRAND}
                    align="center"
                    weight="black"
                    tracking="widest"
                  >
                    {activeConfig.circleLabel}
                  </Font>
                </Stack>
              </Surface>
            </Box>

          </Grid>
        </Surface>
      </Box>
    </LandingSection>
  );
}
