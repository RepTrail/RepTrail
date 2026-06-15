'use client'

import React from 'react'
import Link from 'next/link'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Button } from '@/components/store/base/button'
import { Icon } from '@/components/store/base/icon'
import { Badge } from '@/components/store/base/badge'
import { useRegistry } from '@/components/store/base/registry-context'
import { fbqEvent } from '@/lib/meta-pixel'
import { ArrowRight, Search, Zap, CheckCircle2, Trophy } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { LandingSection } from '@/components/store/intermediary/landing-section'

interface LandingCTAProps {
  role?: 'trainer' | 'student' | 'affiliate'
}

export function LandingCTA({ role = 'trainer' }: LandingCTAProps) {
  const { primaryColor: _primaryColor } = useRegistry()

  const config = {
    trainer: {
      badgeText: 'Última chance para Evoluir',
      title1: 'O Próximo Nível da',
      titleHighlight: 'Sua Consultoria.',
      desc: 'Não espere mais. Junte-se a treinadores Elite que já escalaram seus resultados com o RepTrail.',
      ctaText: 'Quero transformar minha consultoria',
      ctaLink: '/auth/signup',
      ctaEvent: 'Footer Start Trainer',
      showSearch: false,
      searchText: 'Buscar Personal',
      searchLink: '#marketplace',
      trustSignals: [
        { text: 'Sem fidelidade', icon: CheckCircle2 },
        { text: 'Cancele quando quiser', icon: CheckCircle2 },
        { text: 'Setup Grátis', icon: CheckCircle2 }
      ]
    },
    student: {
      badgeText: 'A Hora de Começar é Agora',
      title1: 'Seu Melhor Físico',
      titleHighlight: 'Começa Aqui.',
      desc: 'Junte-se a milhares de alunos que já transformaram seus treinos com o acompanhamento profissional e a tecnologia do RepTrail.',
      ctaText: 'Criar minha conta grátis',
      ctaLink: '/auth/signup',
      ctaEvent: 'Student Footer Signup',
      showSearch: true,
      searchText: 'Buscar um Treinador',
      searchLink: '#marketplace',
      trustSignals: [
        { text: '7 dias de Auto Treino Grátis', icon: CheckCircle2 },
        { text: 'Ranking Global', icon: Trophy },
        { text: 'Cancele quando quiser', icon: CheckCircle2 }
      ]
    },
    affiliate: {
      badgeText: '🚀 Não espere mais',
      title1: 'Comece a ganhar',
      titleHighlight: 'neste exato momento',
      desc: 'Seu networking no mundo fitness tem valor. O RepTrail só precisa de 1 minuto do seu tempo para transformar isso em renda recorrente.',
      ctaText: 'Criar minha conta de afiliado',
      ctaLink: '/afiliados/cadastro',
      ctaEvent: 'Affiliate Footer Signup',
      showSearch: false,
      searchText: '',
      searchLink: '',
      trustSignals: [
        { text: 'Gratuito', icon: CheckCircle2 },
        { text: 'Sem burocracia', icon: CheckCircle2 },
        { text: 'Saque via PIX', icon: CheckCircle2 }
      ]
    }
  }

  const activeConfig = config[role]

  return (
    <LandingSection>
      <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth align="center">

        {/* Header Stack */}
        <Stack align="center" gap={STORE_TOKENS.SPACING.CONTAINER} textAlign="center" fullWidth>
          <Badge label={activeConfig.badgeText} icon={Zap} color={STORE_TOKENS.COLORS.BRAND} variant="solid" animatePulse />

          <Font variant="h1" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} uppercase italic align="center">
            {activeConfig.title1}{' '}
            <Font variant="h1" color={STORE_TOKENS.COLORS.BRAND} uppercase italic display="inline">
              {activeConfig.titleHighlight}
            </Font>
          </Font>

          <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.SECONDARY} align="center">
            {activeConfig.desc}
          </Font>
        </Stack>

        {/* Action Buttons Stack */}
        <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth align="center" justify="center">
          <Stack direction="col" gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
            <Button
              asChild
              onClick={() => fbqEvent('Lead', { content_name: activeConfig.ctaEvent, content_category: 'Landing Page' })}
              variant="primary"
              size="lg"
              activeScale={95}
              fullWidth
              shine
            >
              <Link href={activeConfig.ctaLink}>
                <Box as="span" display="flex" direction={{ base: 'col', md: 'row' }} align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT} cursor="pointer">
                  <Font variant="body" weight="medium">{activeConfig.ctaText}</Font>
                  <Icon icon={ArrowRight} size="md" />
                </Box>
              </Link>
            </Button>

            {activeConfig.showSearch && (
              <Button
                asChild
                variant="outline-zinc"
                size="lg"
                activeScale={95}
                fullWidth
              >
                <Link href={activeConfig.searchLink}>
                  <Box as="span" display="flex" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT} cursor="pointer">
                    <Icon icon={Search} size="md" />
                    <Font variant="body" weight="medium">{activeConfig.searchText}</Font>
                  </Box>
                </Link>
              </Button>
            )}
          </Stack>

          {/* Trust Signals */}
          <Stack direction={{ base: 'col', md: 'row' }} gap={{ base: STORE_TOKENS.SPACING.ELEMENT as any, md: STORE_TOKENS.SPACING.CONTAINER as any }} wrap="wrap" justify="center" align="center">
            {activeConfig.trustSignals.map((signal, index) => (
              <Stack key={index} direction="row" gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                <Icon icon={signal.icon} size="sm" color={STORE_TOKENS.COLORS.BRAND} />
                <Font variant="label-caps" color={STORE_TOKENS.COLORS.TEXT.SECONDARY}>
                  {signal.text}
                </Font>
              </Stack>
            ))}
          </Stack>
        </Stack>

      </Stack>
    </LandingSection>
  )
}
