'use client'

import React from 'react'
import Link from 'next/link'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { Font } from '@/components/store/base/font'
import { Button } from '@/components/store/base/button'
import { Icon, IconBox } from '@/components/store/base/icon'
import { Badge } from '@/components/store/base/badge'
import { useRegistry } from '@/components/store/base/registry-context'
import { 
  ShieldCheck, ArrowRight, UserCheck, Sparkles, 
  Smartphone, Dumbbell, Target, Zap, Search, 
  MousePointerClick, DollarSign, Users 
} from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { LandingSection } from '@/components/store/intermediary/landing-section'
import { IphoneMockup } from '@/components/store/base/iphone-mockup'
import { GlassPanel } from '@/components/store/base/surface'
import { YouTubePlayer } from '@/components/store/base/youtube-player'

interface LandingFeaturesProps {
  role?: 'trainer' | 'student' | 'affiliate'
}

export function LandingFeatures({ role = 'trainer' }: LandingFeaturesProps) {
  const { primaryColor: _primaryColor } = useRegistry()

  const config = {
    trainer: {
      badgeText: 'Para Personal Trainers',
      title1: 'Da prescrição à',
      titleHighlight: 'gestão escalável.',
      subtitle: 'Tudo que você precisa para parar de improvisar e começar a operar como uma consultoria profissional — num único sistema integrado.',
      features: [
        { label: 'Importação de PDF por IA', desc: 'Transforme qualquer treino em PDF em protocolo ativo no app em menos de 1 minuto. Incluso no Pro e Elite.', icon: Sparkles, pulse: true },
        { label: 'Gestão de 10 a 200+ alunos', desc: 'Painel centralizado que escala sem aumentar sua carga de trabalho.', icon: UserCheck, pulse: false },
        { label: 'Templates de prescrição relâmpago', desc: 'Salve seus protocolos favoritos e prescriva em segundos, não em horas.', icon: Dumbbell, pulse: false },
        { label: 'Perfil público no marketplace', desc: 'Capte novos alunos sem esforço adicional de marketing.', icon: Search, pulse: false }
      ],
      ctaText: 'Quero minha consultoria estruturada',
      ctaLink: '/auth/signup',
      videoId: 'CPVt1ZB0hrM',
      mockupSide: 'right' as const,
      mockupRotation: 2
    },
    student: {
      badgeText: 'Para Alunos',
      title1: 'A Experiência que',
      titleHighlight: 'Você merece.',
      subtitle: 'Visualize seus treinos, acompanhe sua dieta e monitore sua evolução física com um aplicativo profissional feito para acelerar seus resultados.',
      features: [
        { label: 'Experiência Mobile-First', desc: 'Acesse treinos, dietas e evolução diretamente no celular.', icon: Smartphone, pulse: false },
        { label: 'Histórico de Cargas Reais', desc: 'Acompanhe suas cargas e histórico de evolução nos treinos.', icon: Dumbbell, pulse: false },
        { label: 'Metas de Dieta e Macros', desc: 'Bata suas metas de macronutrientes com planos guiados.', icon: Target, pulse: false },
        { label: 'Ranking Global Gamificado', desc: 'Participe da comunidade e suba no ranking motivacional.', icon: Zap, pulse: true }
      ],
      ctaText: 'Encontrar meu Treinador',
      ctaLink: '#marketplace',
      videoId: 'DioBAZS_2Iw',
      mockupSide: 'left' as const,
      mockupRotation: -2
    },
    affiliate: {
      badgeText: 'Como funciona',
      title1: 'Simples como',
      titleHighlight: '1, 2, 3, 4',
      subtitle: 'Do cadastro ao primeiro pagamento recorrente em pouquíssimos passos.',
      features: [
        { label: 'Crie sua conta', desc: 'Cadastro em menos de 1 minuto. Só nome, email e senha.', icon: Zap, step: '01', pulse: false },
        { label: 'Compartilhe seu link', desc: 'Link exclusivo com seu token. Envie para personal trainers, colegas e grupos fitness.', icon: MousePointerClick, step: '02', pulse: false },
        { label: 'Indicados se cadastram', desc: 'O sistema registra automaticamente quem veio pelo seu link. Cookie válido por 30 dias.', icon: Users, step: '03', pulse: false },
        { label: 'Receba 10% recorrente', desc: 'Cada pagamento dos seus indicados gera 10% pra você. Para sempre, sem limite.', icon: DollarSign, step: '04', pulse: false }
      ],
      ctaText: 'Quero me tornar afiliado agora',
      ctaLink: '/afiliados/cadastro',
      videoId: '',
      mockupSide: 'none' as const,
      mockupRotation: 0
    }
  }

  const activeConfig = config[role]

  if (role === 'affiliate') {
    return (
      <LandingSection>
        <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth align="center">
            {/* Header */}
            <Stack align={{ base: 'start', md: 'center' }} gap={STORE_TOKENS.SPACING.CONTAINER} textAlign={{ base: 'left', md: 'center' }} width={{ base: 'full', md: 'half' }} alignSelf="center">
              <Badge label={activeConfig.badgeText} icon={ShieldCheck} color={STORE_TOKENS.COLORS.BRAND} variant="solid" />
              <Font variant="h2" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} uppercase italic align={{ base: 'left', md: 'center' }}>
                {activeConfig.title1}{' '}
                <Font variant="h2" color={STORE_TOKENS.COLORS.BRAND} uppercase italic display="inline">
                  {activeConfig.titleHighlight}
                </Font>
              </Font>
              <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.SECONDARY} align={{ base: 'left', md: 'center' }}>
                {activeConfig.subtitle}
              </Font>
            </Stack>

            {/* Grid of Steps */}
            <Grid cols={1} mdCols={4} gap={STORE_TOKENS.SPACING.CONTAINER} width="full">
              {activeConfig.features.map((item: any, idx) => (
                <GlassPanel
                  key={idx}
                  position="relative"
                  padding={STORE_TOKENS.PADDING.CONTAINER}
                  rounded={STORE_TOKENS.RADIUS.SYSTEM}
                  group
                  transition
                >
                  <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
                    <Box display="flex" align="start" justify="between" width="full">
                      <IconBox icon={item.icon} variant="primary" size="sm" />
                      <Font variant="label-caps" color={STORE_TOKENS.COLORS.TEXT.SECONDARY} opacity={STORE_TOKENS.OPACITY.SIDEBAR}>
                        {item.step}
                      </Font>
                    </Box>

                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                      <Font variant="body" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} uppercase italic weight="black">
                        {item.label}
                      </Font>
                      <Font variant="body-sm" color={STORE_TOKENS.COLORS.TEXT.MUTED}>
                        {item.desc}
                      </Font>
                    </Stack>
                  </Stack>
                </GlassPanel>
              ))}
            </Grid>

            {/* Final CTA Button */}
            <Box display="flex" justify="center" width="full">
              <Button
                asChild
                variant="primary"
                size="lg"
                activeScale={95}
                shine
              >
                <Link href={activeConfig.ctaLink}>
                  <Box as="span" display="flex" align="center" gap={STORE_TOKENS.SPACING.ELEMENT} cursor="pointer">
                    <Font variant="body" weight="medium">{activeConfig.ctaText}</Font>
                    <Icon icon={ArrowRight} size="md" />
                  </Box>
                </Link>
              </Button>
            </Box>
        </Stack>
      </LandingSection>
    );
  }

  return (
    <LandingSection>
      <Grid cols={1} mdCols={2} gap={STORE_TOKENS.SPACING.SECTION} align="center" width="full">
          
          {/* Left Side: Mockup (If configured on the left) */}
          {activeConfig.mockupSide === 'left' && (
            <Box position="relative" group fullWidth align="center" justify="start" order={{ base: 'first', md: 'none' }}>
              <IphoneMockup>
                <YouTubePlayer videoId={activeConfig.videoId} iframeClassName="w-[135%] h-[105%] max-w-none" />
              </IphoneMockup>
            </Box>
          )}

          {/* Text Content */}
          <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
            {/* Header Stack */}
            <Stack align="start" gap={STORE_TOKENS.SPACING.CONTAINER}>
              <Badge label={activeConfig.badgeText} icon={ShieldCheck} color={STORE_TOKENS.COLORS.BRAND} variant="solid" />
              <Font variant="h2" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} uppercase italic>
                {activeConfig.title1}{' '}
                <Font variant="h2" color={STORE_TOKENS.COLORS.BRAND} uppercase italic display="inline">
                  {activeConfig.titleHighlight}
                </Font>
              </Font>
              <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.SECONDARY}>
                {activeConfig.subtitle}
              </Font>
            </Stack>

            {/* Features Checklist items */}
            <Grid cols={1} mdCols={2} gap={STORE_TOKENS.SPACING.CONTAINER} width="full">
              {activeConfig.features.map((item, idx) => (
                <GlassPanel 
                  key={idx} 
                  display="flex" 
                  align="start" 
                  gap={STORE_TOKENS.SPACING.ELEMENT}
                  padding={STORE_TOKENS.PADDING.ELEMENT}
                  rounded={STORE_TOKENS.RADIUS.SYSTEM}
                  transition
                  cursor="default"
                >
                  <IconBox icon={item.icon} variant="primary" size="sm" />
                  <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Font variant="body" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} uppercase italic weight="black">
                      {item.label}
                    </Font>
                    <Font variant="body-sm" color={STORE_TOKENS.COLORS.TEXT.MUTED}>
                      {item.desc}
                    </Font>
                  </Stack>
                </GlassPanel>
              ))}
            </Grid>

            {/* CTA Button */}
            <Box width="full">
              <Button
                asChild
                variant="primary"
                size="lg"
                activeScale={95}
                fullWidth
                shine
              >
                {activeConfig.ctaLink.startsWith('#') ? (
                  <Link href={activeConfig.ctaLink}>
                    <Box as="span" display="flex" direction={{ base: 'col', md: 'row' }} align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT} cursor="pointer">
                      <Font variant="body" weight="medium">{activeConfig.ctaText}</Font>
                      <Icon icon={ArrowRight} size="md" />
                    </Box>
                  </Link>
                ) : (
                  <Link href={activeConfig.ctaLink}>
                    <Box as="span" display="flex" direction={{ base: 'col', md: 'row' }} align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT} cursor="pointer">
                      <Font variant="body" weight="medium">{activeConfig.ctaText}</Font>
                      <Icon icon={ArrowRight} size="md" />
                    </Box>
                  </Link>
                )}
              </Button>
            </Box>
          </Stack>

          {/* Right Side: Mockup (If configured on the right) */}
          {activeConfig.mockupSide === 'right' && (
            <Box position="relative" group fullWidth align="center" justify="end" order={{ base: 'first', md: 'none' }}>
              <IphoneMockup>
                <YouTubePlayer videoId={activeConfig.videoId} iframeClassName="w-[135%] h-[105%] max-w-none" />
              </IphoneMockup>
            </Box>
          )}

      </Grid>
    </LandingSection>
  )
}
