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
      badgeText: 'Sobre o RepTrail',
      badgeIcon: ShieldCheck,
      title1: 'Infraestrutura',
      titleHighlight: 'Professional.',
      desc: 'Não somos apenas um app de treino. Entregamos o ecossistema completo para você profissionalizar sua consultoria e focar no que realmente importa: o resultado do seu aluno.',
      features: [
        {
          icon: Layers,
          title: 'O sistema de gestão de back-office',
          description: 'Elimine a confusão das planilhas and gerencie seus pagamentos, renovações automáticas e CRM de alunos de forma eficiente.',
          bullets: ['Faturamento Mensal', 'Lembretes Automáticos', 'Pipeline de Vendas']
        },
        {
          icon: Zap,
          title: 'Crie treinos personalizados',
          description: 'Crie treinos complexos e dietas personalizadas em segundos, usando seus próprios templates na sua estrutura.',
          bullets: ['Templates Personalizados', 'Cálculo Nutricional', 'Biblioteca 1k+ Exercícios']
        },
        {
          icon: BarChart,
          title: 'Monitore a evolução de seus alunos',
          description: 'Tome decisões baseadas em dados e monitore a evolução real de seus alunos com comparativos de fotos, métricas corporais e carga progressiva.',
          bullets: ['Dashboards de Evolução', 'Relatórios Trimestrais', 'Checkpoint de Resultados']
        },
        {
          icon: ShoppingBag,
          title: 'Aumente suas vendas',
          description: 'Aumente suas vendas e capte novos leads com sua vitrine profissional dentro de nosso marketplace oficial.',
          bullets: ['Página Pública Premium', 'Lead Capture Modal', 'SEO para Treinadores']
        }
      ]
    },
    'trainer-differentials': {
      badgeText: 'Diferenciais',
      badgeIcon: Zap,
      title1: 'Por que o',
      titleHighlight: 'RepTrail?',
      desc: 'Desenvolvido por quem vive o esporte, para quem respira performance.',
      features: [
        {
          icon: ShieldCheck,
          title: 'Sistema Operacional Completo',
          description: 'Substitua planilhas, PDFs e WhatsApp bagunçado por um único ambiente profissional que centraliza toda a gestão.'
        },
        {
          icon: TrendingUp,
          title: 'Escalabilidade Infinita',
          description: 'Estrutura pronta para gerenciar 10, 50 ou 200 alunos com o mesmo esforço e eficiência.'
        },
        {
          icon: Globe,
          title: 'Sua Marca Global',
          description: 'Tenha uma landing page de vendas profissional dentro da plataforma para atrair alunos de qualquer lugar.'
        },
        {
          icon: Zap,
          title: 'Engajamento Viciante',
          description: 'Sistema de ranking e níveis que incentiva a consistência real dos seus alunos, aumentando a retenção.'
        }
      ]
    },
    'trainer-authority': {
      badgeText: 'DNA de Performance',
      badgeIcon: HeartPulse,
      title1: 'Desenvolvido por quem',
      titleHighlight: 'Vive a Performance.',
      desc: 'Não somos apenas desenvolvedores de software. Somos entusiastas do fitness e profissionais que entendem as dores reais de quem trabalha com consultoria. O RepTrail foi criado para resolver a falta de ferramentas profissionais que realmente entregam o que prometem.',
      features: [
        {
          icon: HeartPulse,
          title: 'Foco total no Aluno',
          description: 'Nossa interface foi desenhada para que o aluno nunca queira sair. Retenção é o segredo do lucro.'
        },
        {
          icon: Zap,
          title: 'Escalabilidade Real',
          description: 'Sistemas pensados para quem quer sair dos 10 alunos e chegar nos 1000 sem perder a qualidade.'
        },
        {
          icon: ShieldCheck,
          title: 'Segurança de Dados',
          description: 'Seus dados e os dados dos seus alunos protegidos com tecnologia bancária de ponta.'
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
              <span>{activeConfig.title1} </span>
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
                    bg="primary" 
                    bgOpacity={10}
                    align="center" 
                    justify="center"
                    alignSelf="start"
                    zIndex={STORE_TOKENS.Z_INDEX.CONTENT}
                  >
                    <Icon icon={feature.icon} size="sm" color="primary" />
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
  )
}
