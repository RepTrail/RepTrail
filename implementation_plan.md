# Sistema de Limites de Plano para Personal Trainers

Este plano visa implementar a restrição de recursos no painel do Personal Trainer de acordo com o seu plano de assinatura (Básico, PRO, Elite, etc.), além de ajustar a lógica de "loja", "selo", "ranking" e "limite de fotos" conforme suas diretrizes.

## User Review Required

> [!IMPORTANT]
> Verifique se as regras descritas abaixo para o limite de fotos (2 por mês por aluno) e o reset do ciclo de faturamento estão alinhados com o seu provedor de pagamentos (Stripe/Asaas). Como a DAL trabalha de forma local-first, precisaremos buscar do Supabase a data do último faturamento para calcular o "mês vigente".

## Open Questions

> [!WARNING]
> 1. Quais são os níveis exatos de planos atuais (ex: Free, Pro, Premium) e quais são os limites numéricos para cada recurso além de fotos (ex: quantidade de alunos cadastrados, acesso a gráficos avançados)?
> 2. O selo (automático por plano) e o ranking (onde todos participam) já estão sendo renderizados corretamente na sua visão, ou precisamos ajustar as seções de `student-profile` e `ranking-section`?
> 3. Como a "loja" é do app e não uma feature exclusiva do plano, todos os personais terão acesso à aba Loja?

## Proposed Changes

### 1. Camada de Dados (DAL)

Iremos criar novos hooks e funções no Local-First DAL para buscar e armazenar o estado do plano do treinador logado, e funções auxiliares para verificar as quotas.

#### [NEW] [src/lib/dal/plan-limits.ts](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/3%20-%20Pessoais/RepTrail/web/src/lib/dal/plan-limits.ts)
- `getTrainerPlanDetails()`: Busca os dados da assinatura do Supabase (nível do plano, data de renovação, etc) e armazena via IndexedDB.
- `usePlanLimits()`: Hook React Query que retorna um objeto simples:
  ```ts
  {
    plan: 'PRO', // ou 'BASIC', 'ELITE',
    features: {
      hasAdvancedAnalytics: true,
      hasCustomBranding: false,
    },
    quotas: {
      maxPhotosPerStudent: 2, // 2 fotos por mês do aluno
      currentCycleStart: '2026-06-01T00:00:00Z',
    }
  }
  ```

### 2. Interface e Restrições (UI)

Bloqueio das ações e ocultação de features premium para quem não tem o plano adequado, renderizando o `EmptyState` padrão de "Plano Insuficiente".

#### [MODIFY] [src/components/store/sections/trainer-student-photos-activities-section.tsx](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/3%20-%20Pessoais/RepTrail/web/src/components/store/sections/trainer-student-photos-activities-section.tsx)
- Integraremos o `usePlanLimits()` para bloquear o upload se o aluno já enviou/recebeu mais de 2 fotos no ciclo de pagamento atual do personal.
- Mostraremos um alerta (ou modal) se tentar ultrapassar o limite.

#### [MODIFY] [src/components/store/sections/meu-personal-section-content.tsx](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/3%20-%20Pessoais/RepTrail/web/src/components/store/sections/meu-personal-section-content.tsx)
- Exibição automática do "selo" do treinador com base nos dados do plano retornados pela DAL.

#### [MODIFY] [src/components/store/sections/admin-loja-section.tsx](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/3%20-%20Pessoais/RepTrail/web/src/components/store/sections/admin-loja-section.tsx) (e relacionados)
- Como a loja é do App e não uma feature de plano, ela ficará livre de travas de assinatura.

### 3. Limpeza de Entendimentos Incorretos
- O "Feed Público" (social) foi discutido e já entendemos que é apenas dos alunos. O personal foca no "Ranking" (onde todos participam livremente).

## Verification Plan

### Manual Verification
- Acessar o painel logado com um Personal no plano Básico e verificar se as travas funcionam.
- Testar o envio de fotos do aluno para garantir que barra ao passar de 2 fotos naquele ciclo de faturamento.
- Conferir se as features globais (loja, ranking) aparecem corretamente para todos independentemente do plano.
