'use client'

import React from 'react'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { useRegistry } from '@/components/store/advanced/registry-context'
import { 
  Zap, Layers, BarChart, ShoppingBag, Check, 
  PlayCircle, Camera, Beef, Search, Infinity, 
  TrendingUp, BarChart2, Shield, MessageCircle,
  ShieldCheck, Globe, HeartPulse, MousePointerClick
} from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { LandingSection } from '@/components/store/advanced/landing-section'
import { GlassPanel } from '@/components/store/base/surface'
import { BackgroundIcon } from '@/components/store/base/background-icon'
import { Badge } from '@/components/store/base/badge'

interface LandingAboutProps {
  role?: 'trainer' | 'student' | 'affiliate' | 'trainer-differentials' | 'trainer-authority'
}

export function LandingAbout({ role = 'trainer' }: LandingAboutProps) {
  const { primaryColor } = useRegistry()

  const config = {
    trainer: {
      badgeText: 'O problema que te trava',
      badgeIcon: ShieldCheck,
      title1: 'Pare de improvisar.',
      titleHighlight: 'Comece a operar.',
      desc: 'Planilhas e WhatsApp não escalam. Enquanto você passa horas administrando mensagens, arquivos perdidos e cobranças manuais, outros profissionais estão construindo consultorias estruturadas que crescem sem aumentar a carga de trabalho.',
      features: [
        {
          icon: Layers,
          title: 'Gestão centralizada de alunos',
          description: 'Fim das planilhas e mensagens perdidas. Controle pagamentos, protocolos, renovações e o histórico de cada aluno em um painel único e profissional.',
          bullets: ['CRM de alunos integrado', 'Controle de pagamentos', 'Histórico completo por aluno']
        },
        {
          icon: Zap,
          title: 'Prescrição em segundos',
          description: 'Crie treinos e dietas usando seus próprios templates. Prescrito em segundos, entregue diretamente no app do seu aluno.',
          bullets: ['Templates personalizados', 'Biblioteca 1k+ exercícios', 'Cálculo nutricional automático']
        },
        {
          icon: BarChart,
          title: 'Acompanhamento que retém',
          description: 'Monitore evolução real com fotos, métricas corporais e progressão de cargas. Aluno que vê resultado fica — e vira seu melhor vendedor.',
          bullets: ['Dashboards de evolução', 'Comparativo de fotos', 'Progressão de cargas']
        },
        {
          icon: ShoppingBag,
          title: 'Vitrine que capta alunos',
          description: 'Seu perfil público no marketplace RepTrail. Novos alunos chegam até você, veem seus depoimentos e fecham — sem você depender do orgânico.',
          bullets: ['Perfil público profissional', 'Captação de leads', 'SEO para treinadores']
        }
      ]
    },
    'trainer-differentials': {
      badgeText: 'Diferencial competitivo',
      badgeIcon: Zap,
      title1: 'Enquanto outros usam',
      titleHighlight: 'WhatsApp, você escala.',
      desc: 'A diferença entre um personal freelancer e uma consultoria fitness profissional está na infraestrutura. O RepTrail é essa infraestrutura.',
      features: [
        {
          icon: ShieldCheck,
          title: 'Um sistema. Zero improviso.',
          description: 'Substitua planilha + WhatsApp + PDF + Google Drive por um único ambiente profissional com tudo integrado e centralizado.'
        },
        {
          icon: TrendingUp,
          title: 'Mais alunos. Mesmas horas.',
          description: 'Estrutura pensada para quem quer sair dos 10 alunos e chegar nos 100 sem sacrificar mais tempo ou qualidade.'
        },
        {
          icon: Globe,
          title: 'Sua marca no maior marketplace fitness',
          description: 'Perfil público profissional que coloca você na vitrine de quem está procurando personal trainer agora.'
        },
        {
          icon: Zap,
          title: 'Retenção que vira faturamento',
          description: 'Rankings, metas e dashboard de progresso que criam vício positivo no aluno. Menos cancelamento = mais receita recorrente.'
        }
      ]
    },
    'trainer-authority': {
      badgeText: 'Feito por quem vive o mercado',
      badgeIcon: HeartPulse,
      title1: 'Construído por quem',
      titleHighlight: 'entende suas dores.',
      desc: 'Não somos uma startup de software genérico. O RepTrail foi criado por profissionais que viveram na pele a frustração de gerenciar consultorias no WhatsApp, perder alunos por falta de acompanhamento e trabalhar 60 horas por semana sem conseguir escalar.',
      features: [
        {
          icon: HeartPulse,
          title: 'Zero curva de aprendizado',
          description: 'Interface pensada para quem está na academia, não em frente ao computador. Configure em minutos e comece a prescrever no mesmo dia.'
        },
        {
          icon: Zap,
          title: 'Escala real, não promessa',
          description: 'Estrutura testada por trainers que gerenciam de 10 a 200 alunos com o mesmo esforço. Você cresce, o sistema acompanha.'
        },
        {
          icon: ShieldCheck,
          title: 'Dados que protegem e vendem',
          description: 'Histórico completo de cada aluno armazenado com segurança. Nunca mais perca dados — e use a evolução como prova social para captar novos clientes.'
        }
      ]
    },
    student: {
      badgeText: 'Tecnologia de Elite',
      badgeIcon: PlayCircle,
      title1: 'Treino de',
      titleHighlight: 'Próxima Geração.',
      desc: 'Mais do que um app, somos seu parceiro de evolução. Tenha acesso à tecnologia de elite usada pelos maiores atletas para monitorar cada detalhe do seu progresso.',
      features: [
        {
          icon: PlayCircle,
          title: 'Treinos e Dietas com AI',
          description: 'Gere treinos complexos e planos alimentares personalizados em segundos usando nossa inteligência artificial de elite.',
          bullets: ['Geração via AI', 'Macros Automáticos', 'Personalização Total']
        },
        {
          icon: Camera,
          title: 'Análise de Evolução por AI',
          description: 'Use nossa visão computacional para analisar sua composição corporal e progresso físico automaticamente através de fotos.',
          bullets: ['Análise de Composição', 'Detecção de Progresso', 'Relatórios Inteligentes']
        },
        {
          icon: Beef,
          title: 'Nutrição Inteligente',
          description: 'Ajuste sua dieta em tempo real com nossa IA, que recalcula seus macros baseada no seu gasto calórico diário.',
          bullets: ['Ajuste Dinâmico', 'Sugestões de Refeições', 'Monitoramento de Micronutrientes']
        },
        {
          icon: Search,
          title: 'Marketplace de Treinadores',
          description: 'Encontre o personal trainer ideal para o seu objetivo, seja ele emagrecimento, hipertrofia ou performance.',
          bullets: ['Chat com Treinador', 'Filtro por Especialidade', 'Vagas em Consultorias']
        }
      ]
    },
    affiliate: {
      badgeText: 'Programa de Afiliados',
      badgeIcon: Globe,
      title1: 'Por que se tornar afiliado?',
      titleHighlight: 'Benefícios que fazem sentido',
      desc: 'Participe de um ecossistema sólido e comece a gerar receitas recorrentes hoje mesmo com a sua rede de contatos no mundo fitness.',
      features: [
        {
          icon: Infinity,
          title: 'Ganhos recorrentes e ilimitados',
          description: 'Você não precisa se preocupar com teto de comissão ou regras complicadas. 10% de tudo, para sempre.',
          bullets: ['Recorrência Mensal', 'Sem Teto de Ganhos', 'Carteira Transparente']
        },
        {
          icon: TrendingUp,
          title: 'Funciona em todos os planos',
          description: 'Do plano Start ao Elite, sua comissão incide em qualquer cobrança dos seus indicados na plataforma.',
          bullets: ['Todos os Planos', 'Upgrade de Contas', 'Novas Assinaturas']
        },
        {
          icon: BarChart2,
          title: 'Dashboard exclusivo em tempo real',
          description: 'Acompanhe cliques, cadastros, conversões and ganhos em um painel dedicado e moderno.',
          bullets: ['Métricas em Tempo Real', 'Links Customizados', 'Painel Financeiro']
        },
        {
          icon: Shield,
          title: 'Zero impacto no seu trabalho',
          description: 'Continue usando o RepTrail como personal ou aluno normalmente. Ser afiliado é uma função adicional.',
          bullets: ['Não Interfere no App', 'Acesso Separado', 'Função Adicional']
        },
        {
          icon: MousePointerClick,
          title: 'Tracking automático por cookie',
          description: 'Seu token fica salvo no navegador por 30 dias. Qualquer cadastro nessa janela é atribuído a você.',
          bullets: ['Cookie de 30 dias', 'Atribuição Automática', 'Segurança nos Leads']
        },
        {
          icon: MessageCircle,
          title: 'Monetize seu networking',
          description: 'Cada contato do mundo fitness que você indicar é uma oportunidade de renda extra contínua.',
          bullets: ['Monetização de Contatos', 'Fácil de Compartilhar', 'Renda Extra Recorrente']
        }
      ]
    }
  }

  const activeConfig = config[role]
  const is3Cols = role === 'affiliate' || role === 'trainer-authority'

  return (
    <LandingSection>
      <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth align="center">
          
          {/* Section Header Stack */}
          <Stack align={{ base: 'start', md: 'center' }} gap={STORE_TOKENS.SPACING.CONTAINER} textAlign={{ base: 'left', md: 'center' }} width={{ base: 'full', md: 'half' }} alignSelf="center">
            {activeConfig.badgeText && (
              <Badge label={activeConfig.badgeText} icon={activeConfig.badgeIcon} color={STORE_TOKENS.COLORS.BRAND} variant="solid" />
            )}
            <Font variant="h2" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} uppercase italic align={{ base: 'left', md: 'center' }}>
              <Font variant="h2" display="inline">{activeConfig.title1} </Font>
              <Font variant="h2" color={STORE_TOKENS.COLORS.BRAND} uppercase italic display="inline">
                {activeConfig.titleHighlight}
              </Font>
            </Font>

            <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.SECONDARY} align={{ base: 'left', md: 'center' }}>
              {activeConfig.desc}
            </Font>
          </Stack>

          {/* Features Grid Layout */}
          <Grid cols={1} mdCols={is3Cols ? 3 : 2} gap={STORE_TOKENS.SPACING.CONTAINER} width="full">
            {activeConfig.features.map((feature: any, idx) => (
              <GlassPanel
                key={idx}
                position="relative"
                overflow="hidden"
                group
                padding={STORE_TOKENS.PADDING.CONTAINER}
                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                transition
              >
                {/* Visual Watermark Icon in background */}
                <BackgroundIcon icon={feature.icon} />

                <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
                  {/* Icon Box wrapper */}
                  <Box 
                    padding={STORE_TOKENS.PADDING.ELEMENT} 
                    rounded={STORE_TOKENS.RADIUS.SYSTEM} 
                    bg={STORE_TOKENS.COLORS.BRAND} 
                    bgOpacity={STORE_TOKENS.OPACITY.SUBTLE}
                    align="center" 
                    justify="center"
                    alignSelf="start"
                    zIndex={STORE_TOKENS.Z_INDEX.CONTENT}
                  >
                    <Icon icon={feature.icon} size="sm" color={STORE_TOKENS.COLORS.BRAND} />
                  </Box>

                  <Stack gap={STORE_TOKENS.SPACING.ELEMENT} zIndex={STORE_TOKENS.Z_INDEX.CONTENT}>
                    <Font variant="h4" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} uppercase italic>
                      {feature.title}
                    </Font>

                    <Font variant="body-sm" color={STORE_TOKENS.COLORS.TEXT.MUTED}>
                      {feature.description}
                    </Font>

                  </Stack>

                  {/* Bullet points stack */}
                  {feature.bullets && (
                    <Stack 
                      gap={STORE_TOKENS.SPACING.ELEMENT} 
                      zIndex={STORE_TOKENS.Z_INDEX.CONTENT} 
                      padding={STORE_TOKENS.PADDING.NONE} 
                    >
                      {feature.bullets.map((bullet: string, i: number) => (
                        <Stack key={i} direction="row" gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                          <Icon icon={Check} size="sm" color={STORE_TOKENS.COLORS.BRAND} />
                          <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.SECONDARY}>
                            {bullet}
                          </Font>
                        </Stack>
                      ))}
                    </Stack>
                  )}
                </Stack>
              </GlassPanel>
            ))}
          </Grid>
        </Stack>
    </LandingSection>
  );
}
