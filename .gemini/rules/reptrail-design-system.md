# RepTrail Design System — Single Source of Truth

> **PRIORIDADE MÁXIMA.** Todas as skills, agentes e tasks devem obedecer este documento.
> Em caso de conflito entre uma task e estas regras, **as regras vencem**.
> Qualquer violação deve ser tratada como **erro arquitetural**, não como aviso.

---

## Princípio Fundamental

> **"Qualquer refatoração deve preservar integralmente o resultado visual e comportamental existente."**

Toda alteração deve obedecer esta hierarquia inviolável:

1. **Zero Visual Drift** — aparência idêntica antes e depois
2. **Zero Behavioral Drift** — comportamento idêntico antes e depois
3. **Menor Diff Possível** — mínima alteração de código para atingir conformidade
4. **Máxima Conformidade Arquitetural** — 100% aderência às regras abaixo

---

## 1. Arquitetura de Pastas (`src/components/store`)

A estrutura segue Atomic Design rigoroso, com quatro camadas de complexidade:

| Camada | Descrição | Exemplos |
|---|---|---|
| **base** | Primitivos visuais. Única camada com `className` e Tailwind. | `Font`, `Box`, `Grid`, `Stack`, `Img`, `Icon`, `Input`, `Button`, `Span`, `Badge` |
| **intermediary** | Moléculas funcionais criadas pela combinação de componentes `base`. | `LabeledInput`, `MetricItem`, `IconButton` |
| **advanced** | Organismos complexos com lógica de negócio e múltiplas responsabilidades. | `RegistryMain`, `RegistrySection`, `StatCard`, `WorkoutCard` |
| **sections** | Blocos de conteúdo funcionais para montagem de páginas. | `BrandingContent`, `ColorPaletteContent`, `DashboardContent` |

---

## 2. Restrição de Estilização (Rigor Tailwind & Props)

- **`className`** é permitido **EXCLUSIVAMENTE** dentro da camada `base`.
- Componentes `intermediary`, `advanced`, `sections` e `page.tsx` **não podem** usar `className` ou estilos manuais.
- Devem ser construídos exclusivamente via composição de componentes `base` e props semânticas.

### Governança de Props — Bloqueio Fora de `base`

É terminantemente proibido o uso de props que definam:

- Espaçamentos manuais (padding, margin, gap numérico arbitrário)
- Dimensões (width, height, minWidth fixos)
- Estética arbitrária (radius, shadows, colors não encapsulados)
- Alinhamento absoluto (self-align, absolute offsets manuais)

**Props permitidas em camadas superiores:** apenas **Conteúdo** (labels, icons), **Comportamento** (onClick, states) e **Estrutura Semântica** (variants).

---

## 3. Governança de Layout (Main & Sections)

### RegistryMain (Advanced)

- Toda `page.tsx` deve ser envolvida por um `RegistryMain`.
- **Props obrigatórias:** `title`, `subtitle`, `icon`.
- **Filhos diretos:** apenas componentes `RegistrySection`. Nada mais.

### RegistrySection (Advanced)

- Todo conteúdo visível deve estar dentro de uma `RegistrySection`.
- **Props obrigatórias:** `title`.
- **Props opcionais:** `description`, `icon`.
- **Proibido:** renderizar outro `RegistryMain` ou `RegistrySection` dentro de si.

---

## 4. Hierarquia de Aninhamento (Nesting Matrix)

```
page.tsx
  └── RegistryMain (único filho permitido)
      └── RegistrySection[] (únicos filhos do Main)
          └── Advanced | Intermediary | Base
              └── Intermediary | Base
                  └── Base (folha — único lugar com className)
```

Qualquer violação desta hierarquia é um **HARD FAIL**.

---

## 5. Exemplo de Árvore de Renderização

```tsx
Page (Design System)
└── RegistryMain (title="Design System", ...)
    └── RegistrySection (title="Logo Assets", ...)
        └── AssetExporter (Advanced)
            ├── ControlGroup (Intermediary)
            │   ├── Label (Base)
            │   └── Input (Base)
            └── ActionButton (Intermediary)
                └── Button (Base)
                    └── Font (Base)
```

---

## 6. Integridade Visual

- O objetivo de qualquer refatoração é **estrutural**.
- O resultado visual final deve ser **idêntico** ao estado anterior.
- Preservar obrigatoriamente: cores, arredondamentos, sombras, espaçamentos, responsividade e acessibilidade.

---

## 7. Border Radius — Core Tokens

| Token | Valor | Uso |
|---|---|---|
| `rounded-[5px]` | 5px | Padrão de todos os componentes |
| `rounded-full` | 9999px | **Exclusivo** para pill variants / botões circulares |

**PROIBIDO em Badges:** `rounded-full`. Badges **sempre** usam `rounded-[5px]`.

**PROIBIDO em geral:** `rounded-sm`, `rounded`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl`.

---

## 8. Grades e Espaçamentos (Rhythm)

O espaçamento deve ser controlado **exclusivamente** via `gap` no container pai.

| Token | Valor | Uso |
|---|---|---|
| `gap="section"` | 100px Desktop / 50px Mobile | Entre seções verticais |
| `gap="title-content"` | 50px Desktop / 30px Mobile | Título para conteúdo de seção |
| `gap={12.5}` | 50px | Logo para navegação (Sidebar) |
| `gap={12}` | 48px | Espaçamento generoso entre grupos |
| `gap={5}` | 20px | Entre itens irmãos |
| `gap={2.5}` | 10px | Entre ícone e texto |
| `gap={1}` | 4px | Micro-espaçamento |
| `gap={0}` | 0px | Reset / separadores |

**PROIBIDOS:** `gap={2}`, `gap={3}`, `gap={4}`, `gap={6}`, `gap={8}`, `gap={10}`, `gap={16}`, `gap={24}` e qualquer outro valor não listado acima.

---

## 9. Padding — Core Tokens

| Token | Valor | Uso |
|---|---|---|
| `padding={5}` | 20px | **Padrão universal** de containers |
| `padding={12}` | 48px | EmptyState e containers desktop de alta fidelidade |
| `padding={2.5}` | 10px | Sub-elementos minúsculos, tiny pills |
| `padding={1}` | 4px | Botões circulares mínimos |
| `padding={0}` | 0px | Reset |

**PROIBIDOS:** `padding={3}`, `padding={4}`, `padding={6}`, `padding={8}`, `p-6`, `p-8`, qualquer valor não listado.

---

## 10. Tipografia

Hierarquia baseada em variantes semânticas do componente `Font`:

| Variante | Uso |
|---|---|
| `heading` | Títulos. Usa `title-italic` por padrão. |
| `body` | Texto padrão de leitura. |
| `description` | Texto de apoio (`text-sm`). |
| `auxiliary` | Metadados (10px), caixa mista. |
| `sub-tiny` | Metadados em caixa alta para detalhes extremos. |

**Proibido:** tipografia arbitrária fora das variantes do componente `Font`.

---

## 11. Biblioteca de Componentes (Checklist)

Componentes que devem seguir rigorosamente os padrões da `store`:

`StatCard` · `ListRow` · `Badge` · `InputField` · `CustomSelect` · `NumberPicker` · `DigitalTicket` · `MiniChart` · `DrawTimer` · `Horizontal Scroll Badges` · `Ergonomic Action Bar` · `Grid & Row Actions` · `Close Action`

---

## 12. Responsividade & Layout

- **Sidebar:** oculta em `< lg`. Deve ter `height="screen"`.
- **MobileNav:** menu flutuante no rodapé em mobile.
- **Safe Area:** `py-25` no `RegistryMain` em mobile para compensar cabeçalho fixo e nav flutuante. Exceção oficial via `className` documentada no ESLint.

---

## 13. Proibições Absolutas

- **NUNCA** usar margens: `mt`, `mb`, `ml`, `mr`, `mx`, `my`. Use sempre `gap`.
- **NUNCA** usar padding direcional: `pt`, `pb`, `pl`, `pr`, `px`, `py`. Exceto exceções documentadas.
- **NUNCA** usar `rounded-md`, `rounded-lg` ou qualquer radius padrão. Apenas `rounded-[5px]` ou `rounded-full` (pills).
- **NUNCA** usar `p-6` ou `p-8`. Padrão é `padding={5}`.
- **NUNCA** definir cores arbitrárias via prop `color` ou `bg` fora da camada `base`.
- **NUNCA** usar `self-align` ou `absolute` para corrigir falhas de layout do pai.
- **NUNCA** usar `bg-black` absoluto. Use `bg-zinc-950` ou `bg-zinc-900`.
- **NUNCA** usar componentes fora de `src/components/store`.
- **NUNCA** usar um componente que não tenha sido previamente catalogado em `/design-system`.

**Exceções oficiais (ESLint):** `py-20` (safe area), `z-[1000]` (depth), `focus-within:z-[1000]` (context), `px-5` (input padding), efeitos de fundo de alta fidelidade em `advanced`.

---

## 14. Governança de Bordas e Separadores

- **Bordas direcionais PROIBIDAS:** `border-t`, `border-b`, `border-l`, `border-r`.
- **Borda permitida:** somente `border` (aplicada nos 4 lados).
- **Separadores:** usar `Box` com `h-[1px]` (horizontal) ou `w-[1px]` (vertical).

**Fórmula de sucesso:**
```tsx
[Item A] + [Gap 10px] + [Separador 1px] + [Gap 10px] + [Item B]

<Stack direction="row" gap={0}>
  <ConteúdoA />
  <Box paddingX={2.5}>
    <Box bg="white/10" className="h-full w-[1px]" />
  </Box>
  <ConteúdoB />
</Stack>
```

---

## 15. Governança de Largura (Dynamic Widths)

**PROIBIDO:** larguras fixas em pixels ou tokens numéricos (`width="72"`, `width="64"`, `width="320px"`).

**OBRIGATÓRIO:** larguras dinâmicas ou proporcionais:

| Tipo | Valores permitidos |
|---|---|
| Tokens | `full`, `screen`, `1/2`, `2/3`, `1/4`, `auto` |
| Unidades | `%`, `vw`, `fit-content` |

**Exceção:** componentes `base` de ícones ou avatares pequenos podem ter dimensões fixas internas.

---

## 16. Governança de Altura (Implicit Height)

**PROIBIDO:** `height` com valores fixos (`height="14"`, `height="50px"`, `height="500"`).

**OBRIGATÓRIO:** altura resultante de:

- **Padding** interno
- **`flex-1`** — expande para preencher o pai

**Permitido apenas:** `height="full"` e `height="screen"` para containers de layout.

---

## 17. Anti-Patterns (Bloqueios de Arquitetura)

| Anti-pattern | Problema | Solução |
|---|---|---|
| **The "Box" Bypass** | Usar `<Box p="6" rounded="lg">` para evitar criar intermediary | Crie o `intermediary` legítimo |
| **Prop Drilling de Estilo** | Passar `padding`/`color` por intermediários | Encapsule em variante semântica no `base` |
| **Ghost Spacing** | `<Box height="5" />` para criar espaço | Use `gap` no container pai |
| **Inline Badge** | `<Box><Font>Status</Font></Box>` | Use `<Badge variant="...">` |
| **Margin Escape** | `<Component className="mt-4">` | Use `gap` do `Stack` pai |
| **Width Fixo** | `width="64"` em `intermediary` | Use `auto` ou deixe o pai controlar |

---

## 18. Governança de Variantes e Props (Predictability)

- **Nomenclatura semântica:** variantes descrevem função, não cor. `variant="danger"`, não `variant="red"`.
- **Previsibilidade visual:** um componente deve se comportar da mesma forma independente do contexto.
- **Composição obrigatória:** em `sections`, é proibido compor manualmente um componente que já existe na biblioteca (ex: não monte um `Badge` usando `Box` + `Font`).

---

## 19. Processo de Desenvolvimento

1. **Catalogação Primeiro:** todo novo componente ou variação deve ser implementado e documentado em `src/app/design-system/page.tsx` **antes** de ser usado em qualquer outra parte do sistema.
2. **Exclusividade:** a pasta `store` é a única fonte de verdade para UI. Componentes legados fora dela devem ser migrados ou substituídos.

---

# HARD FAIL CONDITIONS

A task deve **falhar imediatamente** ao encontrar qualquer uma das situações abaixo. Não continuar, não corrigir silenciosamente — **reportar e parar**.

## Estrutura

- Componente fora de `src/components/store`
- Import de componente legado fora da `store`
- Componente usado sem catalogação prévia em `/design-system`
- `page.tsx` renderizando algo diferente de `RegistryMain`
- `RegistryMain` renderizando algo diferente de `RegistrySection`
- `RegistrySection` renderizando `RegistryMain`
- `RegistrySection` renderizando outra `RegistrySection`

## Styling

- `className` fora da camada `base`
- Tailwind fora da camada `base`
- CSS inline (`style={{}}`)
- Classes arbitrárias fora de `base`

## Espaçamento

Uso de qualquer margem ou padding direcional fora das exceções documentadas:

`mt` · `mb` · `ml` · `mr` · `mx` · `my` · `pt` · `pb` · `pl` · `pr` · `px` · `py`

## Border Radius

Uso de qualquer radius não autorizado:

`rounded-sm` · `rounded` · `rounded-md` · `rounded-lg` · `rounded-xl` · `rounded-2xl` · `rounded-3xl`

Somente permitido: `rounded-[5px]` e `rounded-full` (exclusivo para pills).

## Bordas

Uso de borda direcional:

`border-t` · `border-b` · `border-l` · `border-r`

Somente `border` (4 lados) ou separadores via `Box`.

## Dimensões

- Width fixa de qualquer tipo
- `min-width` fixa
- `max-width` fixa
- `height` fixa

Exceto exceções explicitamente documentadas neste arquivo.

## Cores

- Cores arbitrárias em componentes não-`base`
- `bg-black` absoluto
- Fundos fora da família `zinc`

---

# TOKEN ENFORCEMENT

Os tokens abaixo são **obrigatórios e imutáveis**.

O agente **não deve:**

- Sugerir alternativas
- Criar novos tokens
- Improvisar valores
- Aproximar valores

Se um valor não existir na lista oficial, ele é **inválido**.

## Border Radius Permitidos

```
rounded-[5px]          ← padrão universal
rounded-full           ← exclusivo para pills
```

## Padding Permitido

```
padding={5}    ← padrão
padding={12}   ← EmptyState / desktop alta fidelidade
padding={2.5}  ← tiny pills
padding={1}    ← botões mínimos
padding={0}    ← reset
```

## Gap Permitido

```
gap="section"       ← entre seções verticais
gap="title-content" ← título para conteúdo
gap={12.5}          ← sidebar
gap={12}            ← grupos generosos
gap={5}             ← entre irmãos
gap={2.5}           ← ícone e texto
gap={1}             ← micro
gap={0}             ← reset / separadores
```

## Width Permitida

```
full · screen · auto · fit-content · 1/2 · 2/3 · 1/4 · % · vw
```

## Height Permitida

```
full · screen · flex-1 · altura natural por conteúdo · altura natural por padding
```

## Background Permitido

```
bg-zinc-950  ← containers principais / fundos de página
bg-zinc-900  ← cards e painéis
bg-zinc-800  ← elementos elevados
demais tons zinc conforme hierarquia visual
```

---

# COMPONENT CLASSIFICATION MATRIX

Antes de criar, mover ou refatorar qualquer componente, o agente deve responder internamente:

```
É um primitive visual que encapsula Tailwind/tokens/variantes?
  → BASE

Combina apenas componentes base? Representa uma molécula funcional?
  → INTERMEDIARY

Combina múltiplos intermediaries? Possui lógica relevante? Representa um organismo?
  → ADVANCED

Representa conteúdo de página? É uma área funcional completa?
  → SECTION
```

**Regra de classificação:** nunca usar o nome da pasta atual como critério. Classificar sempre pela **responsabilidade real** do componente.

---

# REFATORAÇÃO OBRIGATÓRIA

Sempre que uma skill de análise ou correção for executada, seguir esta sequência:

1. Analisar arquitetura (camada correta?)
2. Analisar imports (todos corretos?)
3. Analisar tokens (todos autorizados?)
4. Analisar ESLint (sem violações?)
5. Analisar nesting (hierarquia correta?)
6. Analisar design system (componente catalogado?)

Somente após a análise completa:

- Propor correções
- Aplicar correções (uma por vez, aguardando confirmação)

**Resultado esperado obrigatório:**

```
✓ 100% conformidade arquitetural
✓ 0% visual drift
✓ 0% behavioral drift
✓ 100% compatibilidade com ESLint
✓ 100% aderência aos tokens oficiais
```
