'use client'

import React from 'react'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Badge } from '@/components/store/base/badge'
import { BaseAvatar } from '@/components/store/base/avatar'
import { useRegistry } from '@/components/store/advanced/registry-context'
import { Star } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { LandingSection } from '@/components/store/advanced/landing-section'
import { GlassPanel, Surface } from '@/components/store/base/surface'

interface LandingSocialProofProps {
  role?: 'trainer' | 'student' | 'affiliate'
}

export function LandingSocialProof({ role = 'trainer' }: LandingSocialProofProps) {
  const { primaryColor } = useRegistry()

  const config = {
    trainer: {
      badgeText: 'Resultados Reais',
      title1: 'O que dizem os',
      titleHighlight: 'Elite.',
      subtitle: 'Junte-se a mais de 500 treinadores que já profissionalizaram sua consultoria.',
      testimonials: [
        {
          rating: 5,
          quote: 'Antes perdia horas no WhatsApp. Com o RepTrail, dobrei minha base para 120 alunos mantendo o suporte impecável.',
          initials: 'RM',
          author: 'Rafael M.',
          location: 'São Paulo • SP',
          metric: '120+ Alunos',
          featured: false
        },
        {
          rating: 5,
          quote: 'O marketplace é um divisor de águas. Hoje faturamos R$ 22k/mês escalando com as automações do app.',
          initials: 'JP',
          author: 'Júlia P.',
          location: 'Rio de Janeiro • RJ',
          metric: 'R$ 22k/mês',
          featured: true
        },
        {
          rating: 5,
          quote: 'A gamificação viciou meus alunos. O engajamento disparou e minha taxa de cancelamento caiu para quase zero.',
          initials: 'MC',
          author: 'Marcelo C.',
          location: 'Curitiba • PR',
          metric: 'Retenção 98%',
          featured: false
        },
        {
          rating: 5,
          quote: 'O setup foi muito rápido. Em 2 dias já estava com todos os meus templates migrados e prescrevendo dietas em segundos.',
          initials: 'BS',
          author: 'Bruno S.',
          location: 'Interior • SP',
          metric: 'Setup em 48h',
          featured: false
        }
      ]
    },
    student: {
      badgeText: 'Resultados Reais',
      title1: 'A Elite que',
      titleHighlight: 'Transformou.',
      subtitle: 'Junte-se a milhares de alunos que saíram da estagnação para a sua melhor versão.',
      testimonials: [
        {
          rating: 5,
          quote: 'Eu sempre desistia no meio do mês. Com o player assistido e a gamificação, finalmente bati 1 ano de treino consistente e perdi 12kg.',
          initials: 'LC',
          author: 'Lucas C.',
          location: 'Curitiba • PR',
          metric: '-12kg Gordura',
          featured: false
        },
        {
          rating: 5,
          quote: 'Encontrei meu personal no marketplace do app. O suporte dele aliado ao app é outro nível. Ganhei 5kg de massa em 3 meses.',
          initials: 'AM',
          author: 'Amanda M.',
          location: 'Belo Horizonte • MG',
          metric: '+5kg Massa Magra',
          featured: true
        },
        {
          rating: 5,
          quote: 'O Auto-Treino me salvou. Viajo muito e não consigo ter personal fixo, mas com o período grátis de 7 dias eu testei o player e me viciei!',
          initials: 'GT',
          author: 'Gustavo T.',
          location: 'Lisboa • PT',
          metric: 'Auto Treino Elite',
          featured: false
        },
        {
          rating: 5,
          quote: 'O diferencial é o dashboard de evolução. Ver minhas métricas e fotos lado a lado me dá um gás absurdo para continuar.',
          initials: 'RV',
          author: 'Ricardo V.',
          location: 'Florianópolis • SC',
          metric: 'Evolução Monitorada',
          featured: false
        }
      ]
    },
    affiliate: {
      badgeText: 'Resultados Reais',
      title1: 'Quem já está',
      titleHighlight: 'Ganhando.',
      subtitle: 'Depoimentos de afiliados que monetizaram sua rede de contatos fitness.',
      testimonials: [
        {
          rating: 5,
          quote: 'Eu comecei indicando meus colegas e, em menos de um mês, já tinha uma renda extra consistente sem esforço. O painel mostra tudo em tempo real.',
          initials: 'MR',
          author: 'Mateus R.',
          location: 'São Paulo • SP',
          metric: 'R$ 1.8k /mês',
          featured: true
        }
      ]
    }
  }

  const activeConfig = config[role]

  return (
    <LandingSection>
      <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth align="center">
          
          {/* Header Stack */}
          <Stack align="center" gap={STORE_TOKENS.SPACING.CONTAINER} textAlign="center" width={{ base: 'full', md: 'half' }} alignSelf="center">
            <Badge label={activeConfig.badgeText} icon={Star} color={STORE_TOKENS.COLORS.BRAND} variant="solid" />
            <Font variant="h2" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} uppercase italic align="center">
              <span>{activeConfig.title1} </span>
              <Font variant="h2" color={STORE_TOKENS.COLORS.BRAND} uppercase italic display="inline">
                {activeConfig.titleHighlight}
              </Font>
            </Font>
            <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.SECONDARY} align="center">
              {activeConfig.subtitle}
            </Font>
          </Stack>

          {/* Testimonials Grid */}
          <Grid cols={1} mdCols={role === 'affiliate' ? 1 : 2} gap={STORE_TOKENS.SPACING.CONTAINER} width="full">
            {activeConfig.testimonials.map((test, idx) => {
              const CardComponent = test.featured ? Surface : GlassPanel
              const cardProps = test.featured ? { variant: "tonal-orange" as const } : {}

              return (
                <CardComponent
                  key={idx}
                  position="relative"
                  padding={STORE_TOKENS.PADDING.CONTAINER}
                  rounded={STORE_TOKENS.RADIUS.SYSTEM}
                  maxWidth={role === 'affiliate' ? 'sm' : 'none'}
                  display="flex"
                  direction="col"
                  justify="between"
                  transition
                  gap={STORE_TOKENS.SPACING.CONTAINER}
                  {...cardProps}
                >
                  <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth zIndex={STORE_TOKENS.Z_INDEX.CONTENT}>
                    {/* Rating Stars */}
                    <Stack direction="row" gap={STORE_TOKENS.SPACING.NONE} align="center">
                      {Array.from({ length: test.rating }).map((_, i) => (
                        <Icon key={i} icon={Star} size="xs" color={test.featured ? "orange" : STORE_TOKENS.COLORS.BRAND} />
                      ))}
                    </Stack>

                    {/* Quote content */}
                    <Font variant="body" color={test.featured ? STORE_TOKENS.COLORS.TEXT.PRIMARY : STORE_TOKENS.COLORS.TEXT.SECONDARY} italic>
                      "{test.quote}"
                    </Font>
                  </Stack>

                  {/* Footer Meta */}
                  <Box 
                    display="flex" 
                    align="center" 
                    justify="between" 
                    width="full" 
                    zIndex={STORE_TOKENS.Z_INDEX.CONTENT}
                  >
                    <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                      <BaseAvatar initials={test.initials} size="md" variant="zinc" />
                      <Stack gap={STORE_TOKENS.SPACING.NONE}>
                        <Font variant="body-sm" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} weight="black" uppercase>
                          {test.author}
                        </Font>
                        <Font variant="tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED} uppercase weight="bold" tracking="wider">
                          {test.location}
                        </Font>
                      </Stack>
                    </Stack>

                    {/* Highlight Metric Badge */}
                    <Badge 
                      label={test.metric} 
                      color={test.featured ? "orange" : "primary"} 
                      variant={test.featured ? "solid" : "glass"} 
                    />
                  </Box>
                </CardComponent>
              )
            })}
          </Grid>
        </Stack>
    </LandingSection>
  )
}
