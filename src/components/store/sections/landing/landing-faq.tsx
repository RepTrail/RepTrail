'use client';
import { STORE_TOKENS } from '@/components/store/constants/tokens';

import React, { useState } from 'react'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Badge } from '@/components/store/base/badge'
import { useRegistry } from '@/components/store/advanced/registry-context'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'
import { LandingSection } from '@/components/store/advanced/landing-section'
import { Surface } from '@/components/store/base/surface'

interface LandingFAQProps {
  role?: 'trainer' | 'student' | 'affiliate'
}

export function LandingFAQ({ role = 'trainer' }: LandingFAQProps) {
  const { primaryColor } = useRegistry()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const config = {
    trainer: {
      badgeText: 'Perguntas Frequentes',
      title1: 'Perguntas',
      titleHighlight: 'Frequentes.',
      subtitle: 'Tudo o que você precisa saber para alavancar com o RepTrail.',
      faqs: [
        {
          question: 'Qual plano é certo para mim?',
          answer: 'Se você está estruturando sua operação com até 10 alunos, o Starter é o ponto de entrada ideal. Para quem já vende consultoria e quer escalar até 30 alunos com recursos avançados (importação de PDF por IA, módulo de ergogênicos), o Pro é o mais popular. O Elite é para consultorias em crescimento acelerado que precisam de alunos ilimitados e infraestrutura sem teto.'
        },
        {
          question: 'Como funciona a prescrição de treinos e dietas?',
          answer: 'O RepTrail tem um motor de prescrição onde você salva seus próprios templates e aplica em segundos. Com o Pro e Elite, você também importa treinos de qualquer PDF via IA — o sistema converte automaticamente para o formato interativo do app, com exercícios, séries, cargas e vídeos.'
        },
        {
          question: 'O aplicativo é gratuito para meus alunos?',
          answer: 'Sim. Seus alunos acessam o aplicativo sem nenhum custo. Eles visualizam treinos, registram execuções, acompanham dieta, evolução física e participam do ranking — tudo pelo app. Você investe no plano, eles usam sem pagar.'
        },
        {
          question: 'Posso cancelar ou mudar de plano?',
          answer: 'Sim, sem burocracia. Você faz upgrade, downgrade ou cancelamento a qualquer momento diretamente no painel, sem fidelidade ou multa.'
        },
        {
          question: 'Como o RepTrail aumenta minha retenção de alunos?',
          answer: 'Alunos que vêem sua evolução ficam. O RepTrail entrega dashboards de progresso com comparativo de fotos, métricas corporais e progressão de cargas. O sistema de ranking gamificado cria engajamento diário. Menos cancelamento = mais receita recorrente sem esforço de recontratar.'
        }
      ]
    },
    student: {
      badgeText: 'FAQ Aluno',
      title1: 'Dúvidas',
      titleHighlight: 'Frequentes.',
      subtitle: 'Tire suas dúvidas sobre como o RepTrail vai acelerar seus resultados.',
      faqs: [
        {
          question: 'O aplicativo é gratuito para alunos?',
          answer: 'Sim, se você for convidado por um personal trainer que já utiliza o RepTrail. Caso queira treinar sozinho, oferecemos o Plano de Auto Treino, que é uma assinatura paga, mas você pode testar todas as funcionalidades por 7 dias grátis sem precisar cadastrar um cartão.'
        },
        {
          question: 'Como funciona o período de 7 dias grátis?',
          answer: 'Ao se cadastrar no módulo de Auto-Treino, você ganha 7 dias para testar todas as funcionalidades do Plano de Auto Treino: geração de treinos por IA, cálculo de macros e importação de PDFs. Não pedimos cartão de crédito para o teste!'
        },
        {
          question: 'Como eu encontro um personal trainer?',
          answer: 'Temos um Marketplace oficial integrado. Você pode buscar por nome, especialidade ou objetivos. Todos os profissionais são verificados pela nossa curadoria para garantir a melhor entrega.'
        },
        {
          question: 'O que é o "Auto-Treino"?',
          answer: 'É o nosso módulo de inteligência artificial para quem quer autonomia. Você pode gerar treinos e dietas automaticamente, calcular seus macros e até importar um treino em PDF que a nossa AI converte instantaneamente para o formato do app.'
        },
        {
          question: 'Minhas fotos de evolução são privadas?',
          answer: 'Sim. Por padrão, suas fotos são visíveis apenas para você e seu personal trainer. Você tem total controle e pode optar por torná-las públicas caso queira aparecer no feed da comunidade ou servir de inspiração na landing page do seu treinador.'
        }
      ]
    },
    affiliate: {
      badgeText: 'Dúvidas Frequentes',
      title1: 'Perguntas &',
      titleHighlight: 'Respostas',
      subtitle: 'Tire suas dúvidas rápidas sobre o funcionamento do nosso programa de afiliados.',
      faqs: [
        {
          question: 'Como funciona a comissão?',
          answer: 'Você recebe 10% de tudo que seus indicados gastarem, de forma recorrente, sem limite de valor. A comissão é registrada automaticamente no seu painel a cada pagamento.'
        },
        {
          question: 'Quanto tempo dura o token do meu link?',
          answer: 'O token é salvo como cookie no navegador e é válido por 30 dias. Qualquer cadastro realizado dentro dessa janela é automaticamente associado a você.'
        },
        {
          question: 'Posso ser afiliado e personal ao mesmo tempo?',
          answer: 'Sim! Ser afiliado é uma função complementar e não interfere no seu acesso como personal ou aluno. Você tem um painel dedicado separado do dashboard principal.'
        },
        {
          question: 'Preciso vender algo diretamente?',
          answer: 'Não! Basta compartilhar seu link único. O sistema cuida de todo o tracking, associação de cadastros e cálculo de comissões automaticamente.'
        },
        {
          question: 'Quando posso sacar meus ganhos?',
          answer: 'Você pode solicitar um saque a partir de R$ 50,00 acumulados na sua carteira, via PIX ou transferência bancária.'
        }
      ]
    }
  }

  const activeConfig = config[role]

  return (
    <LandingSection>
      <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth align="center">

        {/* Header Stack */}
        <Stack align={{ base: 'start', md: 'center' }} gap={STORE_TOKENS.SPACING.CONTAINER} textAlign={{ base: 'left', md: 'center' }} width={{ base: 'full', md: 'half' }} alignSelf="center">
          <Badge label={activeConfig.badgeText} icon={HelpCircle} color={STORE_TOKENS.COLORS.BRAND} variant="solid" />
          <Font variant="h2" color={STORE_TOKENS.COLORS.BRAND} uppercase italic align={{ base: 'left', md: 'center' }}>
            <Font variant="h2" display="inline">{activeConfig.title1} </Font>
            <Font variant="h2" color={STORE_TOKENS.COLORS.BRAND} display="inline">{activeConfig.titleHighlight}</Font>
          </Font>
          <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.SECONDARY} align={{ base: 'left', md: 'center' }}>
            {activeConfig.subtitle}
          </Font>
        </Stack>

        {/* FAQ Accordion list */}
        <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
          {activeConfig.faqs.map((faq, index) => {
            const isOpen = openIndex === index

            return (
              <Surface
                key={index}
                variant="tonal-primary"
                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                width="full"
                overflow="hidden"
                display="flex"
                direction="col"
              >
                {/* Trigger Button */}
                <Box
                  as="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  display="flex"
                  direction={{ base: 'col', md: 'row' }}
                  align="center"
                  justify="between"
                  padding={STORE_TOKENS.PADDING.CONTAINER}
                  width="full"
                  gap={STORE_TOKENS.SPACING.ELEMENT}
                  cursor="pointer"
                  bg={STORE_TOKENS.COLORS.TRANSPARENT}
                >
                  <Font variant="body" color={STORE_TOKENS.COLORS.BRAND} weight="black" uppercase italic>
                    {faq.question}
                  </Font>
                  <Box transition>
                    <Icon icon={isOpen ? ChevronUp : ChevronDown} size="sm" color={STORE_TOKENS.COLORS.BRAND} />
                  </Box>
                </Box>
                {/* Content area */}
                {isOpen && (
                  <Box padding={STORE_TOKENS.PADDING.CONTAINER} border>
                    <Font variant="body-sm" color={STORE_TOKENS.COLORS.TEXT.SECONDARY} weight="medium">
                      {faq.answer}
                    </Font>
                  </Box>
                )}
              </Surface>
            );
          })}
        </Stack>
      </Stack>
    </LandingSection>
  );
}
