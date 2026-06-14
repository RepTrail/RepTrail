'use client'

import React from 'react'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Badge } from '@/components/store/base/badge'
import { BaseAvatar } from '@/components/store/base/avatar'
import { useRegistry } from '@/components/store/base/registry-context'
import { Star } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { LandingSection } from '@/components/store/intermediary/landing-section'
import { GlassPanel, Surface } from '@/components/store/base/surface'

interface LandingSocialProofProps {
  role?: 'trainer' | 'student' | 'affiliate'
}

export function LandingSocialProof({ role = 'trainer' }: LandingSocialProofProps) {
  const { primaryColor } = useRegistry()

  const config = {
    trainer: {
      badgeText: 'Resultados Reais',
      title1: 'Quem parou de',
      titleHighlight: 'improvisar.',
      subtitle: 'Mais de 500 consultores fitness já trocaram planilhas e WhatsApp pela operação profissional do RepTrail.',
      testimonials: [
        {
          rating: 5,
          quote: 'Antes perdia 3 horas por dia no WhatsApp. Hoje gerencio 120 alunos com o mesmo tempo que usava para 40. O RepTrail me devolveu minha vida.',
          initials: 'RM',
          author: 'Rafael M.',
          location: 'São Paulo • SP',
          metric: '3x mais alunos',
          featured: false
        },
        {
          rating: 5,
          quote: 'Em 6 meses saí de R$ 8k para R$ 22k/mês. Não foi sorte — foi ter um sistema que me deixou focar em resultado, não em administração.',
          initials: 'JP',
          author: 'Júlia P.',
          location: 'Rio de Janeiro • RJ',
          metric: 'R$ 22k/mês',
          featured: true
        },
        {
          rating: 5,
          quote: 'Minha taxa de cancelamento era de 30% ao mês. Com o acompanhamento de evolução do RepTrail, caiu para menos de 2%. Isso representa milhares a mais todo mês.',
          initials: 'MC',
          author: 'Marcelo C.',
          location: 'Curitiba • PR',
          metric: 'Churn −28%',
          featured: false
        },
        {
          rating: 5,
          quote: 'Em 48h migrei todos os meus alunos e templates para o RepTrail. No terceiro dia já estava prescrevendo três vezes mais rápido. Não tem volta.',
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
        },
        {
          rating: 5,
          quote: 'Divulguei no meu grupo de corrida e em duas semanas consegui 15 assinaturas. A taxa de conversão é incrível e o pagamento cai certinho.',
          initials: 'AP',
          author: 'Ana P.',
          location: 'Rio de Janeiro • RJ',
          metric: 'R$ 2.4k /mês',
          featured: false
        },
        {
          rating: 5,
          quote: 'Coloquei o link na bio do meu Instagram focado em vida saudável. Nem preciso vender, o próprio aplicativo se vende. A renda recorrente salva meu fim de mês.',
          initials: 'CG',
          author: 'Carlos G.',
          location: 'Belo Horizonte • MG',
          metric: 'R$ 3.1k /mês',
          featured: false
        },
        {
          rating: 5,
          quote: 'Como dono de academia, indiquei para todos os meus personais. Agora ganho uma porcentagem em cima de tudo que eles movimentam. Sensacional.',
          initials: 'FB',
          author: 'Fernando B.',
          location: 'Curitiba • PR',
          metric: 'R$ 5.2k /mês',
          featured: true
        },
        {
          rating: 5,
          quote: 'Sempre testei outros programas de afiliados, mas nenhum pagava recorrente. Aqui o aluno fica meses na plataforma e eu continuo recebendo. Vale muito a pena!',
          initials: 'LM',
          author: 'Letícia M.',
          location: 'Florianópolis • SC',
          metric: 'R$ 4.5k /mês',
          featured: false
        },
        {
          rating: 5,
          quote: 'Criei um vídeo rápido pro TikTok mostrando o app e coloquei meu link. Viralizou e as comissões não param de chegar no dashboard.',
          initials: 'JL',
          author: 'João L.',
          location: 'Salvador • BA',
          metric: 'R$ 6.8k /mês',
          featured: false
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
              {activeConfig.title1}{' '}
              <Font variant="h2" color={STORE_TOKENS.COLORS.BRAND} uppercase italic display="inline">
                {activeConfig.titleHighlight}
              </Font>
            </Font>
            <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.SECONDARY} align="center">
              {activeConfig.subtitle}
            </Font>
          </Stack>

          {/* Testimonials Grid */}
          <Grid cols={1} mdCols={2} gap={STORE_TOKENS.SPACING.CONTAINER} width="full">
            {activeConfig.testimonials.map((test, idx) => {
              const CardComponent = test.featured ? Surface : GlassPanel
              const cardProps = test.featured ? { variant: "tonal-primary" as const } : {}

              return (
                <CardComponent
                  key={idx}
                  position="relative"
                  padding={STORE_TOKENS.PADDING.CONTAINER}
                  rounded={STORE_TOKENS.RADIUS.SYSTEM}
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
                        <Icon key={i} icon={Star} size="xs" color={STORE_TOKENS.COLORS.BRAND} />
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
                      color={STORE_TOKENS.COLORS.BRAND} 
                      variant={test.featured ? "solid" : "glass"} 
                    />
                  </Box>
                </CardComponent>
              );
            })}
          </Grid>
        </Stack>
    </LandingSection>
  );
}
