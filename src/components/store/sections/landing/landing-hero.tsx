'use client'

import React from 'react'
import Link from 'next/link'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { Font } from '@/components/store/base/font'
import { Button } from '@/components/store/base/button'
import { Badge } from '@/components/store/base/badge'
import { Icon, IconBox } from '@/components/store/base/icon'
import { useRegistry } from '@/components/store/advanced/registry-context'
import { fbqEvent } from '@/lib/meta-pixel'
import { LandingSection } from '@/components/store/advanced/landing-section'
import { 
  ArrowRight, Users, Trophy, Star, ShieldCheck, CheckCircle2, 
  Search, Zap, Smartphone, Dumbbell, PlayCircle, Megaphone, 
  MousePointerClick, DollarSign, TrendingUp 
} from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { IphoneMockup } from '@/components/store/base/iphone-mockup'
import { GlassPanel, Surface } from '@/components/store/base/surface'

interface LandingHeroProps {
  role?: 'trainer' | 'student' | 'affiliate'
}

export function LandingHero({ role = 'trainer' }: LandingHeroProps) {
  const { primaryColor } = useRegistry()

  // Track page view event
  React.useEffect(() => {
    fbqEvent('ViewContent', { 
      content_name: `Hero View - ${role}`, 
      content_category: 'Landing Page' 
    })
  }, [role])

  // Dynamic contents per role
  const config = {
    trainer: {
      badge1: { label: '+500 treinadores ativos', icon: Users, color: STORE_TOKENS.COLORS.BRAND },
      badge2: { label: 'Foco total em Performance', icon: ShieldCheck, color: 'orange' as const },
      title1: 'Transforme sua',
      title2: 'Consultoria.',
      desc: 'Aumente a retenção dos seus alunos e simplifique sua gestão com a plataforma preferida dos profissionais de elite.',
      cta: {
        text: 'Começar Agora',
        link: '/auth/signup',
        event: 'Hero Start Trainer'
      },
      trustSignals: ['Montagem em 2min', 'Grátis até 5 alunos', 'Suporte VIP'],
      mockupType: 'macbook' as const,
      videoSrc: '/Videos/desktop-video.mp4',
      floatingBadge1: { title: 'Faturamento Mensal', value: 'R$ 12.450,00', isPrimary: true },
      floatingBadge2: { title: 'Novos Alunos', value: '+12 hoje', isPrimary: true },
      stats: [
        { label: 'Consultorias Ativas', value: '500+', icon: Trophy },
        { label: 'Treinos Prescritos', value: '100k+', icon: Dumbbell },
        { label: 'Taxa de Retenção', value: '98%', icon: TrendingUp },
        { label: 'Média de Avaliação', value: '4.9/5', icon: Star }
      ]
    },
    student: {
      badge1: { label: 'Sua melhor fase começa Agora', icon: Zap, color: STORE_TOKENS.COLORS.BRAND },
      badge2: { label: 'Experiência Mobile Pro', icon: Smartphone, color: STORE_TOKENS.COLORS.SURFACE },
      title1: 'Treine no seu Ritmo.',
      title2: 'Supere seus Limites.',
      desc: 'Acesse treinos personalizados, acompanhe cada carga e veja sua evolução em tempo real com o player de treino mais avançado do mercado.',
      cta: {
        text: 'Criar Minha Conta',
        link: '/auth/signup',
        event: 'Hero Start Student'
      },
      trustSignals: ['Auto-Treino Inteligente', 'Player Interativo', 'Grátis para Começar'],
      mockupType: 'phone' as const,
      videoSrc: '/Videos/dash-inicial-do-aluno.mp4',
      floatingBadge1: { title: 'Auto Treino', value: 'Intensidade Máxima', isPrimary: true },
      floatingBadge2: { title: 'Auto Treino', value: '7 Dias Grátis', isPrimary: true },
      stats: [
        { label: 'Alunos Ativos', value: '50k+', icon: Trophy },
        { label: 'Treinos Concluídos', value: '1.2M+', icon: Dumbbell },
        { label: 'Check-ins Hoje', value: '4.5k+', icon: Zap },
        { label: 'Nota Média App', value: '4.9/5', icon: Star }
      ]
    },
    affiliate: {
      badge1: { label: 'Programa de Afiliados RepTrail', icon: Megaphone, color: STORE_TOKENS.COLORS.BRAND },
      badge2: null,
      title1: 'Ganhe 10% de tudo',
      title2: 'que indicados gastarem — para sempre!',
      desc: 'Sem limites de comissão. Válido em todos os planos do RepTrail. Transforme sua rede de contatos em uma renda recorrente hoje mesmo.',
      cta: {
        text: 'Quero me tornar afiliado',
        link: '/afiliados/cadastro',
        event: 'Hero Start Affiliate'
      },
      trustSignals: ['Cadastro em menos de 1 minuto', 'Sem custo', 'Sem burocracia'],
      mockupType: 'none' as const,
      videoSrc: '',
      floatingBadge1: null,
      floatingBadge2: null,
      stats: [
        { label: 'Comissão recorrente', value: '10%', icon: DollarSign },
        { label: 'Sem limite de ganhos', value: '∞', icon: Zap },
        { label: 'Validade do cookie', value: '30d', icon: MousePointerClick }
      ]
    }
  }

  const activeConfig = config[role]

  return (
    <LandingSection>
      <Stack gap={STORE_TOKENS.SPACING.SECTION} fullWidth>
          
          {/* Main Content Grid */}
          <Grid 
            cols={1} 
            lgCols={role === 'affiliate' ? 1 : 2} 
            gap={STORE_TOKENS.SPACING.SECTION} 
            align="center"
            width="full"
          >
            {/* Left Content */}
            <Stack align="start" textAlign="left" gap={STORE_TOKENS.SPACING.CONTAINER} order={{ base: 'last', md: 'first' }}>
              {/* Badges Stack */}
              <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT} wrap="wrap" justify="start">
                {activeConfig.badge1 && (
                  <Badge 
                    label={activeConfig.badge1.label} 
                    icon={activeConfig.badge1.icon} 
                    color={activeConfig.badge1.color} 
                    variant="solid" 
                  />
                )}
                {activeConfig.badge2 && (
                  <Badge 
                    label={activeConfig.badge2.label} 
                    icon={activeConfig.badge2.icon} 
                    color={activeConfig.badge2.color} 
                    variant="glass" 
                  />
                )}
              </Stack>

              {/* Typography Heading Stack */}
              <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                <Font variant="h1" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} uppercase italic align="left">
                  <span>{activeConfig.title1} </span>
                  <Font variant="h1" color={STORE_TOKENS.COLORS.BRAND} uppercase italic display="inline">
                    {activeConfig.title2}
                  </Font>
                </Font>

                <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.SECONDARY} align="left">
                  {activeConfig.desc}
                </Font>
              </Stack>

              {/* Actions Stack */}
              <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth align={{ base: 'stretch', md: 'start' }}>
                <Stack direction={{ base: 'col', md: 'row' }} gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth justify="start">
                  <Button
                    asChild
                    onClick={() => fbqEvent('Lead', { content_name: activeConfig.cta.event, content_category: 'Landing Page' })}
                    variant="primary"
                    size="lg"
                    activeScale={95}
                    fullWidth
                    shine
                  >
                    <Link href={activeConfig.cta.link}>
                      <Box as="span" display="flex" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT} cursor="pointer" width="full">
                        <span>{activeConfig.cta.text}</span>
                        <Icon icon={ArrowRight} size="md" />
                      </Box>
                    </Link>
                  </Button>

                  {role === 'student' && (
                    <Button
                      asChild
                      variant="outline-zinc"
                      size="lg"
                      activeScale={95}
                      fullWidth
                    >
                      <a href="#marketplace">
                        <Box as="span" display="flex" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT} cursor="pointer" width="full">
                          <Icon icon={Search} size="md" />
                          <span>Achar um Personal</span>
                        </Box>
                      </a>
                    </Button>
                  )}
                </Stack>

                {/* Trust Signals */}
                <Stack direction={{ base: 'col', md: 'row' }} gap={STORE_TOKENS.SPACING.ELEMENT} wrap="wrap" justify="start" align={{ base: 'start', md: 'center' }}>
                  {activeConfig.trustSignals.map((signal, index) => (
                    <Stack key={index} direction="row" gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                      <Icon icon={CheckCircle2} size="sm" color={STORE_TOKENS.COLORS.BRAND} />
                      <Font variant="label-caps" color={STORE_TOKENS.COLORS.TEXT.SECONDARY}>
                        {signal}
                      </Font>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Stack>

            {/* Right Visual Content (Only for Trainer and Student Roles) */}
            {activeConfig.mockupType !== 'none' && (
              <Box position="relative" group fullWidth align="center" justify="center" order={{ base: 'first', md: 'last' }}>
                
                {/* Macbook Mockup */}
                {activeConfig.mockupType === 'macbook' && (
                  <Box 
                    width="full"
                    position="relative"
                    transition
                  >
                    <Box 
                      position="relative" 
                      bg={STORE_TOKENS.COLORS.BACKGROUND}
                      bgOpacity={STORE_TOKENS.OPACITY.SHELF}
                      border
                      borderColor={STORE_TOKENS.COLORS.BACKGROUND}
                      borderWidth={2}
                      rounded={STORE_TOKENS.RADIUS.SYSTEM} 
                      overflow="hidden"
                      aspectRatio="video"
                      width="full"
                    >
                      {/* Video Player */}
                      <video
                        src={activeConfig.videoSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>
                  </Box>
                )}

                {/* Phone Mockup */}
                {activeConfig.mockupType === 'phone' && (
                  <Box 
                    position="relative"
                    width="full"
                    maxWidth="sm"
                    transition
                  >
                    <IphoneMockup className="w-full">
                      <video
                        src={activeConfig.videoSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </IphoneMockup>
                  </Box>
                )}

                {/* Floating tech badge 1 */}
                {activeConfig.floatingBadge1 && (
                  <Surface 
                    variant={activeConfig.floatingBadge1.isPrimary ? "tonal-primary" : "tonal-zinc"}
                    position="absolute" 
                    top={-12} 
                    left={-16} 
                    padding={STORE_TOKENS.PADDING.ELEMENT} 
                    rounded={STORE_TOKENS.RADIUS.SYSTEM} 
                    shadow="xl"
                  >
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                      <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.SECONDARY} uppercase weight="bold">
                        {activeConfig.floatingBadge1.title}
                      </Font>
                      <Font variant="h3" color={activeConfig.floatingBadge1.isPrimary ? STORE_TOKENS.COLORS.BRAND : STORE_TOKENS.COLORS.TEXT.PRIMARY} weight="black" italic>
                        {activeConfig.floatingBadge1.value}
                      </Font>
                    </Stack>
                  </Surface>
                )}

                {/* Floating tech badge 2 */}
                {activeConfig.floatingBadge2 && (
                  <Surface 
                    variant={activeConfig.floatingBadge2.isPrimary ? "tonal-primary" : "tonal-zinc"}
                    position="absolute" 
                    bottom={-24} 
                    right={-16} 
                    padding={STORE_TOKENS.PADDING.ELEMENT} 
                    rounded={STORE_TOKENS.RADIUS.SYSTEM} 
                    shadow="xl"
                  >
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                      <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.SECONDARY} uppercase weight="bold">
                        {activeConfig.floatingBadge2.title}
                      </Font>
                      <Font variant="h3" color={activeConfig.floatingBadge2.isPrimary ? STORE_TOKENS.COLORS.BRAND : STORE_TOKENS.COLORS.TEXT.PRIMARY} weight="black" italic>
                        {activeConfig.floatingBadge2.value}
                      </Font>
                    </Stack>
                  </Surface>
                )}
              </Box>
            )}
          </Grid>

          {/* Stats Section */}
          <GlassPanel
            width="full" 
            position="relative"
            border="none"
            rounded={STORE_TOKENS.RADIUS.SYSTEM}
            padding={STORE_TOKENS.PADDING.CONTAINER}
            backdropBlur="md"
          >
            <Grid cols={2} lgCols={activeConfig.stats.length as any} gap={STORE_TOKENS.SPACING.CONTAINER} width="full">
              {activeConfig.stats.map((stat, index) => (
                <Stack key={index} align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT} transition>
                  <IconBox icon={stat.icon} variant="primary" size="md" rounded="system" />
                  <Font variant="h3" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} weight="black" align="center" italic>
                    {stat.value}
                  </Font>
                  <Font variant="label-caps" color={STORE_TOKENS.COLORS.TEXT.SECONDARY} align="center">
                    {stat.label}
                  </Font>
                </Stack>
              ))}
            </Grid>
          </GlassPanel>
        </Stack>
    </LandingSection>
  )
}
