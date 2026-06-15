import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import unusedImports from "eslint-plugin-unused-imports";
import importPlugin from "eslint-plugin-import";

export default [
  // ─────────────────────────────────────────────────────────────────────────────
  // BLOCO 0 — Ignores globais
  // ─────────────────────────────────────────────────────────────────────────────
  {
    ignores: [
      "**/.next/**",
      "**/node_modules/**",
      "**/dist/**",
      "**/out/**"
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // BLOCO 1 — Design System: regras de composição e tokens
  // Cobre: components/ (exceto base/), app/, hooks/, lib/, services/
  // NÃO cobre: base/ (tem className liberado), landing/, design-system/
  // ─────────────────────────────────────────────────────────────────────────────
  {
    files: [
      "**/src/**/*.{ts,tsx}"
    ],
    ignores: [
      "**/components/store/base/**",
      "**/components/store/constants/**",
      "**/components/landing/**",
      "**/components/shared/**",
      "**/components/store/base/iphone-mockup.tsx",
      "**/components/store/advanced/student-share-transformation.tsx",
      "**/app/aluno/**",
      "**/app/personal/**",
      "**/app/afiliados/**",
      "**/app/page.tsx",
      "**/app/buscar-personal/**",
      "**/app/design-system/**",
      "**/actions/**",
      // ATUALIZADO: hooks/ foi eliminado — conteúdo migrado para lib/dal/ e components/store/hooks/
      "**/lib/dal/**",
      "**/components/store/hooks/**",
      "**/lib/**",
      "**/services/**",
      "**/types/**"
    ],
    plugins: {
      "@typescript-eslint": ts,
      react: react,
      "react-hooks": reactHooks,
      "unused-imports": unusedImports,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "unused-imports/no-unused-imports": "error",
      "no-restricted-syntax": [
        "error",
        // 1. Prohibit className Usage (Strict Rule 1)
        {
          selector: "JSXAttribute[name.name='className'][value.type='Literal']:not([value.value=/scrollbar|py-20|py-25|z-\\[|grid\\.svg|ambient-light|blur|animate-|min-h-|overflow-hidden|shrink-0|font-mono|ml-auto|border-white\\/10|bg-center|mask-image|bg-transparent|border-0|w-4|h-4|w-5|h-5|w-3\\.5|h-3\\.5|w-full|h-full|active:scale-|outline-none|ring-0|pointer-events-none|bg-gradient-|from-|via-|to-|inset-|group|object-cover|object-contain|-translate-/])",
          message: "className is strictly prohibited outside of 'src/components/store/base/'. Use composition with base components instead. Authorized exceptions: scrollbars, mobile navigation offsets (py-20, py-25), depth layering (z-[1000]), high-fidelity background effects (grids, lights, orbs), standard icons, seamless textareas, and proportional layout wraps."
        },
        // 2. Prohibit Margins (Strict Rule 12)
        {
          selector: "JSXAttribute[name.name=/^(margin|marginX|marginY|marginTop|marginBottom|marginLeft|marginRight|m|mx|my|mt|mb|ml|mr)$/]",
          message: "Manual margins are prohibited. Use <Stack gap={...}> or <Grid gap={...}> for spacing between elements."
        },
        // 3. Prohibit Style Props on non-base components (Strict Rule 15)
        {
          selector: "JSXOpeningElement[name.name!=/[a-z]/]:not(:matches([name.name='Box'], [name.name='Stack'], [name.name='Grid'], [name.name='Font'], [name.name='Button'], [name.name='Input'], [name.name='Icon'], [name.name='Img'], [name.name='Badge'], [name.name='Card'], [name.name='Separator'], [name.name='Logo'], [name.name='FileUpload'], [name.name='FormSwitch'], [name.name='FormSelect'], [name.name='FormCheckbox'], [name.name='Avatar'], [name.name='SidebarLink'], [name.name='Surface'], [name.name='GlassPanel'], [name.name='IconBox'])) > JSXAttribute[name.name=/^(padding|paddingX|paddingY|width|height|minWidth|minHeight|rounded|bg|bgOpacity|hoverBg|hoverBgOpacity|color|border|borderWidth|shadow|inset|top|right|bottom|left|scale|alignSelf|breakAll)$/]",
          message: "Style props (padding, bg, color, width, height, etc.) are only allowed in 'base' components. Non-base components must use semantic variants or composition."
        },
        // 4. Prohibit directional padding/margin in layouts
        {
          selector: "JSXAttribute[name.name=/^(paddingTop|paddingBottom|paddingLeft|paddingRight|px|py|pt|pb|pl|pr)$/]:not([value.type='JSXExpressionContainer']):not([value.value=/sidebar|sidebar-wide/])",
          message: "Directional padding (paddingLeft, paddingTop, etc.) is prohibited in layouts. Use uniform padding={5} or authorized paddingY/paddingX in base components only. Exceptions: sidebar/sidebar-wide tokens and responsive objects."
        },
        // 5. Strict STORE_TOKENS Enforcement
        {
          selector: "JSXAttribute[name.name=/^(gap|rowGap|columnGap|padding|paddingX|paddingY|pt|pb|pl|pr|px|py|rounded|bg|color|hoverBg|borderColor|groupHoverBorderColor|opacity|bgOpacity|borderOpacity|hoverBgOpacity|groupHoverOpacity|zIndex)$/] Literal:not([raw='null']):not([raw='true']):not([raw='false'])",
          message: "Raw string or number literals are strictly prohibited for design system properties. You MUST use STORE_TOKENS from '@/components/store/constants/tokens'."
        },
        // 6. Prohibit inline style Attribute (Strict Rule 2)
        {
          selector: "JSXAttribute[name.name='style']",
          message: "Inline styles (style prop) are strictly prohibited outside of 'src/components/store/base/'. Use base design system components (Box, Stack, Grid) with standard props for layout and styling."
        },
        // 10. Prohibit primitive HTML tags outside base/
        {
          selector: "JSXOpeningElement[name.name=/^(div|span|p|h1|h2|h3|h4|h5|h6|br|strong|em|b|i|ul|li|ol|dl|dt|dd|table|thead|tbody|tfoot|tr|td|th|aside|article|nav|header|footer|main|section|blockquote|pre|code|small|sub|sup|mark|hr|input|label|select|textarea)$/]",
          message: "Primitive HTML tag is prohibited outside 'src/components/store/base/'. Replace with design system components: div/section → Box, span/p/h1-h6/strong → Font, ul/li → Stack, button → Button, input → Input, label → Font, textarea → Textarea, select → FormSelect, hr → Separator."
        },
        // 11. Modal Constraints
        {
          selector: "JSXOpeningElement[name.name='Modal']:not(:has(JSXAttribute[name.name='title']))",
          message: "Modals MUST have a 'title' prop according to the Design System."
        },
        {
          selector: "JSXOpeningElement[name.name='Modal']:not(:has(JSXAttribute[name.name='subtitle']))",
          message: "Modals MUST have a 'subtitle' prop according to the Design System."
        },
        {
          selector: "JSXOpeningElement[name.name='Modal']:not(:has(JSXAttribute[name.name='icon']))",
          message: "Modals MUST have an 'icon' prop according to the Design System."
        },
        // 12. RegistrySection Constraints
        {
          selector: "JSXOpeningElement[name.name='RegistrySection']:has(JSXAttribute[name.name='title']):not(:has(JSXAttribute[name.name='subtitle']))",
          message: "RegistrySections with a 'title' MUST also have a 'subtitle'."
        },
        {
          selector: "JSXOpeningElement[name.name='RegistrySection']:has(JSXAttribute[name.name='title']):not(:has(JSXAttribute[name.name='icon']))",
          message: "RegistrySections with a 'title' MUST also have an 'icon'."
        },
        {
          selector: "JSXOpeningElement[name.name='RegistrySection']:has(JSXAttribute[name.name='subtitle']):not(:has(JSXAttribute[name.name='title']))",
          message: "RegistrySections with a 'subtitle' MUST also have a 'title'."
        },
        {
          selector: "JSXOpeningElement[name.name='RegistrySection']:has(JSXAttribute[name.name='icon']):not(:has(JSXAttribute[name.name='title']))",
          message: "RegistrySections with an 'icon' MUST also have a 'title'."
        },
        // 13. Border and Divider Constraints (2px)
        {
          selector: "JSXAttribute[name.name='borderWidth'][value.expression.value!=2]",
          message: "Toda borda e divisória tem que ser em 2px de espessura."
        },
        {
          selector: "JSXAttribute[name.name='className'][value.value=/(?<!-)border-[13456789]/]",
          message: "Toda borda e divisória tem que ser em 2px de espessura. Não use classes border-* que não sejam 2px (se usar className autorizado)."
        },
        // 14. Empty State Standardization
        {
          selector: "JSXElement:has(> JSXOpeningElement[name.name='Box']):has(> JSXElement JSXOpeningElement[name.name='Font']):has(> JSXElement JSXOpeningElement[name.name=/Icon|[A-Z].*Icon/])",
          message: "Todo local que precise de um empty state deve usar o padrão do design system (<EmptyState />). Nada de versão customizada ou improvisada."
        }
      ],
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // BLOCO 2 — Local-First: proteção da UI contra bypass da DAL
  // Cobre: advanced/, sections/, app/, e hooks de dado (lib/dal/, store/hooks/)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    files: [
      "**/components/store/advanced/**/*.{ts,tsx}",
      "**/components/store/sections/**/*.{ts,tsx}",
      // ATUALIZADO: hooks de UI agora estão em store/hooks/, hooks de dado em lib/dal/
      "**/components/store/hooks/**/*.{ts,tsx}",
      "**/app/**/*.{ts,tsx}"
    ],
    ignores: [
      "**/app/api/**",
      "**/actions/**",
      "**/services/**",
      "**/lib/dal/**",
      "**/lib/supabase/**",
      // ATUALIZADO: use-realtime-sync migrou para lib/dal/ — ignorar lá, não em hooks/
      "**/lib/dal/use-realtime-sync.ts",
      "**/components/store/sections/landing/**"
    ],
    plugins: {
      "@typescript-eslint": ts,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@tanstack/react-query",
              message: "Direct use of react-query is prohibited in UI components. You MUST use hooks exported from `@/lib/dal`."
            },
            {
              name: "@supabase/supabase-js",
              message: "Direct use of Supabase client is prohibited in UI components. All queries and mutations must go through the local-first DAL (`@/lib/dal`)."
            },
            {
              name: "@supabase/ssr",
              message: "Direct use of Supabase client is prohibited in UI components. All queries and mutations must go through the local-first DAL (`@/lib/dal`)."
            }
          ],
          patterns: [
            {
              group: ["**/lib/supabase/**", "@/lib/supabase/**"],
              message: "Direct use of Supabase clients is prohibited in UI components. All queries and mutations must go through the local-first DAL (`@/lib/dal`)."
            },
            {
              group: ["**/lib/api/**", "@/lib/api/**"],
              message: "Direct use of API clients is prohibited in UI components. All queries and mutations must go through the local-first DAL (`@/lib/dal`)."
            },
            {
              group: ["**/lib/server/**", "@/lib/server/**"],
              message: "Direct use of server utilities is prohibited in UI components. All queries and mutations must go through the local-first DAL (`@/lib/dal`)."
            },
            {
              group: ["**/actions/**", "@/actions/**"],
              message: "Direct invocation of Server Actions is prohibited in UI components to ensure offline-first support. Use mutations/actions via local-first DAL (`@/lib/dal`)."
            },
            {
              group: ["**/services/**", "@/services/**"],
              message: "Services são proibidos na UI. Utilize exclusivamente a DAL Local-First."
            }
          ]
        }
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "ImportExpression[source.value=/actions/]",
          message: "Dynamic import of Server Actions is prohibited in UI components to ensure offline-first support. Use actions/mutations via local-first DAL (`@/lib/dal`)."
        },
        {
          selector: "ImportExpression[source.value=/services/]",
          message: "Dynamic import of Services is prohibited in UI components to ensure offline-first support. Use actions/mutations via local-first DAL (`@/lib/dal`)."
        },
        {
          selector: "ImportExpression[source.value=/supabase/]",
          message: "Dynamic import of Supabase is prohibited in UI components to ensure offline-first support. Use actions/mutations via local-first DAL (`@/lib/dal`)."
        }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // BLOCO 3 — Local-First Safe Zone: restringe acesso direto ao Supabase/fetch
  // Fora da safe zone, nada toca o banco diretamente
  // ─────────────────────────────────────────────────────────────────────────────
  {
    files: [
      "**/src/**/*.{ts,tsx}"
    ],
    ignores: [
      "**/lib/dal/**",
      "**/lib/outbox/**",
      "**/lib/sync/**",
      "**/lib/background-sync/**",
      "**/lib/supabase/**",
      "**/app/api/**",
      "**/actions/**",
      "**/services/**",
      "**/components/store/sections/landing/**",
      // ATUALIZADO: use-realtime-sync agora em lib/dal/
      "**/lib/dal/use-realtime-sync.ts",
      "**/lib/asaas.ts",
      "**/lib/meta-capi.ts",
      "**/lib/notifications.ts",
      "**/proxy.ts"
    ],
    plugins: {
      "@typescript-eslint": ts,
    },
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      "no-restricted-syntax": [
        "error",
        // 1. Evitar consultas do Supabase (.from())
        {
          selector: "CallExpression[callee.type='MemberExpression'][callee.object.name=/^(supabase|adminClient)$/][callee.property.name='from']",
          message: "Supabase .from() queries are restricted to the Local-First Safe Zone (dal, outbox, sync, background-sync, supabase)."
        },
        // 2. Evitar chamadas RPC (.rpc())
        {
          selector: "CallExpression[callee.type='MemberExpression'][callee.object.name=/^(supabase|adminClient)$/][callee.property.name='rpc']",
          message: "Supabase RPCs (.rpc) are restricted to the Local-First Safe Zone (dal, outbox, sync, background-sync, supabase)."
        },
        // 3. Evitar canais realtime (.channel())
        {
          selector: "CallExpression[callee.type='MemberExpression'][callee.object.name=/^(supabase|adminClient)$/][callee.property.name='channel']",
          message: "Supabase Realtime channels are restricted to the Local-First Safe Zone (dal, outbox, sync, background-sync, supabase)."
        },
        // 4. Evitar acesso a auth (.auth)
        {
          selector: "MemberExpression[object.name=/^(supabase|adminClient)$/][property.name='auth']",
          message: "Supabase auth is restricted to the Local-First Safe Zone (dal, outbox, sync, background-sync, supabase)."
        },
        // 5. Evitar acesso a storage (.storage)
        {
          selector: "MemberExpression[object.name=/^(supabase|adminClient)$/][property.name='storage']",
          message: "Supabase storage is restricted to the Local-First Safe Zone (dal, outbox, sync, background-sync, supabase)."
        },
        // 6. Evitar chamadas HTTP diretas
        {
          selector: "CallExpression[callee.name='fetch']",
          message: "Direct fetch() calls are restricted to the Local-First Safe Zone (dal, outbox, sync, background-sync)."
        },
        {
          selector: "CallExpression[callee.name='axios']",
          message: "Direct axios() calls are restricted to the Local-First Safe Zone (dal, outbox, sync, background-sync)."
        },
        {
          selector: "MemberExpression[object.name='axios']",
          message: "Direct axios methods are restricted to the Local-First Safe Zone (dal, outbox, sync, background-sync)."
        },
        {
          selector: "CallExpression[callee.name='ky']",
          message: "Direct ky() calls are restricted to the Local-First Safe Zone (dal, outbox, sync, background-sync)."
        },
        {
          selector: "MemberExpression[object.name='ky']",
          message: "Direct ky methods are restricted to the Local-First Safe Zone (dal, outbox, sync, background-sync)."
        }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // BLOCO 4 — page.tsx: só pode renderizar RegistryMain e delegar para Sections
  // ─────────────────────────────────────────────────────────────────────────────
  {
    files: [
      "**/app/**/page.tsx"
    ],
    ignores: [
      "**/app/api/**",
      "**/app/page.tsx",
      "**/app/aluno/**",
      "**/app/personal/**",
      "**/app/afiliados/**"
    ],
    plugins: {
      "@typescript-eslint": ts,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXOpeningElement[name.name=/^(Box|Stack|Font|Grid|Surface|Card|Badge|Icon|IconBox|Button|Input|Img|GlassPanel|Separator|Divider|Avatar|SidebarLink|FormSwitch|FormSelect|FormCheckbox|FileUpload)$/]",
          message: "Base components (Box, Stack, Font, etc) are prohibited directly in page.tsx. The page must only render RegistryMain and delegate content to *Section components."
        }
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/components/store/base/**"],
              message: "Base components cannot be imported in page.tsx. Delegate your layout to a Section component."
            }
          ]
        }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // BLOCO 5 — Qualidade de código: complexidade, tamanho, clareza
  // Cobre: todo src/ exceto gerados, configs e base/ do Design System
  // NOTA: regras aqui são SEM análise de tipos (sem project:true) para
  // manter o lint rápido em todo o codebase. Regras type-aware ficam
  // nos blocos 5b e 9 onde o escopo é menor.
  // ─────────────────────────────────────────────────────────────────────────────
  {
    files: [
      "**/src/**/*.{ts,tsx}"
    ],
    ignores: [
      "**/components/store/base/**",
      "**/components/store/constants/**",
      "**/app/design-system/**",
      "**/types/**",
      "**/*.d.ts"
    ],
    plugins: {
      "@typescript-eslint": ts,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // ── Proibir any explícito ─────────────────────────────────────────────
      // `any` desabilita o type-checker inteiro para aquela variável.
      // Use `unknown` + type guard, ou o tipo correto.
      "@typescript-eslint/no-explicit-any": "warn",

      // ── Proibir asserções de tipo não-nulas (!) ───────────────────────────
      // `data!.name` silencia erros de nullable sem verificar.
      // Prefira optional chaining (`data?.name`) ou guard explícito.
      "@typescript-eslint/no-non-null-assertion": "warn",

      // ── console.log esquecido ─────────────────────────────────────────────
      // Logs de debug não devem chegar ao produção.
      // Use um logger (ex: logger.ts) ou remova antes de commitar.
      // Exceção: console.error e console.warn são permitidos (tratamento de erro).
      "no-console": ["warn", { allow: ["warn", "error"] }],

      // ── Complexidade ciclomática ──────────────────────────────────────────
      // Uma função com muitos caminhos de execução (if/else/switch/ternário)
      // é difícil de testar e manter. Limite: 10.
      // Se ultrapassar: quebre em funções menores ou extraia handlers.
      "complexity": ["warn", { max: 10 }],

      // ── Funções muito longas ──────────────────────────────────────────────
      // Funções com mais de 60 linhas geralmente fazem coisas demais.
      // Quebre em helpers nomeados com responsabilidade única.
      // Exceção: não conta linhas em branco e comentários.
      "max-lines-per-function": ["warn", {
        max: 60,
        skipBlankLines: true,
        skipComments: true,
        IIFEs: true
      }],

      // ── Parâmetros demais numa função ─────────────────────────────────────
      // Mais de 4 parâmetros é sinal de que a função faz coisas demais
      // ou que os parâmetros deveriam ser agrupados em um objeto de opções.
      "max-params": ["warn", { max: 4 }],

      // ── Aninhamento profundo ──────────────────────────────────────────────
      // Mais de 3 níveis de if/for dentro de if/for é difícil de ler.
      // Prefira early returns, extração de funções ou array methods.
      "max-depth": ["warn", { max: 3 }],

      // ── Variáveis declaradas mas nunca usadas ─────────────────────────────
      // Variáveis mortas adicionam ruído e confundem quem lê.
      // Prefixe com _ se for intencional ignorar (ex: `_event`).
      "@typescript-eslint/no-unused-vars": ["warn", {
        vars: "all",
        args: "after-used",
        ignoreRestSiblings: true,
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_"
      }],

      // ── Proibir return desnecessário ──────────────────────────────────────
      // `return undefined` no fim de uma função void é redundante.
      "no-useless-return": "warn",

      // ── Proibir else desnecessário após return ────────────────────────────
      // if (cond) { return x } else { ... } — o else é redundante.
      // Use early return: if (cond) { return x }; ...
      "no-else-return": ["warn", { allowElseIf: false }],

      // ── Proibir operador ternário aninhado ────────────────────────────────
      // a ? b : c ? d : e é ilegível. Use if/else ou extração de variável.
      "no-nested-ternary": "off",

      // ── Proibir await dentro de loop ──────────────────────────────────────
      // await dentro de for/while executa sequencialmente (lento).
      // Use Promise.all() para paralelizar ou refatore o loop.
      "no-await-in-loop": "warn",
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // BLOCO 5b — Floating promises: escopo reduzido com análise de tipos
  // no-floating-promises exige project:true (type-aware linting).
  // Limitado a actions/ e services/ — onde promises soltas causam mais dano
  // e o custo de análise de tipos é justificado pelo escopo menor.
  // ─────────────────────────────────────────────────────────────────────────────
  {
    files: [
      "**/actions/**/*.{ts,tsx}",
      "**/services/**/*.{ts,tsx}"
    ],
    plugins: {
      "@typescript-eslint": ts,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
        // tsconfigRootDir garante que o tsconfig é resolvido relativo ao projeto,
        // não ao diretório de trabalho do processo do ESLint
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // ── Floating promises em actions e services ───────────────────────────
      // Uma promise não tratada aqui significa uma mutation que falha
      // silenciosamente sem o usuário saber.
      // Sempre use: await, .then().catch(), ou void (se intencional fire-and-forget).
      "@typescript-eslint/no-floating-promises": "warn",
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // BLOCO 6 — Arquitetura de camadas: quem pode importar quem
  // CAT-8 do mutation-audit: Actions gordas e Services bypassando a DAL
  // ─────────────────────────────────────────────────────────────────────────────
  {
    files: [
      "**/actions/**/*.{ts,tsx}"
    ],
    plugins: {
      "@typescript-eslint": ts,
    },
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      // ── Actions devem ser finas: máx 80 linhas por arquivo ────────────────
      // Se uma action está crescendo além disso, a lógica de negócio deve
      // ser extraída para um Service em src/services/.
      // Actions são thin controllers — recebem input, chamam service, retornam.
      "max-lines": ["warn", {
        max: 80,
        skipBlankLines: true,
        skipComments: true
      }],

      // ── Actions não importam outras Actions ───────────────────────────────
      // Actions chamam Services ou a DAL. Nunca chamam outras Actions.
      // Composição de lógica deve acontecer em Services.
      "no-restricted-imports": [
        "warn",
        {
          patterns: [
            {
              group: ["@/actions/**", "**/actions/**"],
              message: "Actions não devem importar outras Actions. Extraia a lógica compartilhada para um Service em `@/services/`."
            }
          ]
        }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // BLOCO 7 — Services: regras de camada de negócio
  // ─────────────────────────────────────────────────────────────────────────────
  {
    files: [
      "**/services/**/*.{ts,tsx}"
    ],
    plugins: {
      "@typescript-eslint": ts,
    },
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      // ── Services não importam de actions/ ────────────────────────────────
      // A camada de serviço é abaixo de actions na hierarquia.
      // Services → DAL → Supabase. Nunca Services → Actions.
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/actions/**", "**/actions/**"],
              message: "Services não podem importar Actions. A hierarquia é: Actions → Services → DAL. Inverta a dependência."
            },
            // ── Services não importam componentes de UI ───────────────────
            // Lógica de negócio não deve conhecer a UI.
            {
              group: ["@/components/**", "**/components/**"],
              message: "Services não podem importar componentes de UI. Separe a lógica de apresentação da lógica de negócio."
            }
          ]
        }
      ],

      // ── Services não devem ser arquivos imensos ────────────────────────
      // Um Service com 300+ linhas provavelmente tem responsabilidades demais.
      // Quebre em sub-services ou helpers nomeados.
      "max-lines": ["warn", {
        max: 200,
        skipBlankLines: true,
        skipComments: true
      }],
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // BLOCO 8 — React Hooks: regras para hooks customizados
  // Cobre: lib/dal/ (hooks de dado) e components/store/hooks/ (hooks de UI)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    files: [
      "**/lib/dal/**/*.{ts,tsx}",
      "**/components/store/hooks/**/*.{ts,tsx}"
    ],
    plugins: {
      "@typescript-eslint": ts,
      "react-hooks": reactHooks,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // ── Regras dos React Hooks ────────────────────────────────────────────
      // Detecta: hooks chamados fora de componentes/hooks, deps faltando
      // em useEffect/useCallback/useMemo, e ordem condicional de hooks.
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // ── Hooks de dado (lib/dal/) não importam componentes ────────────────
      // A DAL é infraestrutura — não pode depender da UI.
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/components/**", "**/components/**"],
              message: "Hooks da DAL (`lib/dal/`) não podem importar componentes de UI. A DAL é infraestrutura agnóstica de apresentação."
            }
          ]
        }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // BLOCO 9 — TypeScript estrito para DAL e Services (sem type-aware)
  // any e non-null como erro — não precisam de análise de tipos para funcionar
  // ─────────────────────────────────────────────────────────────────────────────
  {
    files: [
      "**/lib/dal/**/*.{ts,tsx}",
      "**/services/**/*.{ts,tsx}"
    ],
    plugins: {
      "@typescript-eslint": ts,
    },
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      // ── any é erro (não warning) na DAL e Services ────────────────────────
      // Na camada de dados, `any` esconde bugs de schema que causam crashes
      // em produção. Aqui é erro, não aviso.
      "@typescript-eslint/no-explicit-any": "error",

      // ── Asserção não-nula é erro na DAL ───────────────────────────────────
      // data! na DAL vai causar crash em produção quando o dado não existir.
      // Use optional chaining ou guard explícito.
      "@typescript-eslint/no-non-null-assertion": "error",
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // BLOCO 9b — Floating promises como ERRO na DAL (type-aware, escopo mínimo)
  // Separado do bloco 9 porque no-floating-promises exige project:true.
  // Escopo reduzido = análise de tipos só onde mais importa = lint rápido.
  // ─────────────────────────────────────────────────────────────────────────────
  {
    files: [
      "**/lib/dal/**/*.{ts,tsx}"
    ],
    plugins: {
      "@typescript-eslint": ts,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // ── Floating promises são ERRO na DAL ─────────────────────────────────
      // Uma sync ou mutation que falha silenciosamente corrompe o IndexedDB
      // sem nenhum feedback para o usuário ou para o sistema de retry.
      // Na DAL não existe "fire-and-forget acidental" — seja explícito com void.
      "@typescript-eslint/no-floating-promises": "error",
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // BLOCO 10 — UI Components Line Limits and Supabase Any exceptions
  // ─────────────────────────────────────────────────────────────────────────────
  {
    files: [
      "**/components/store/sections/**/*.{ts,tsx}",
      "**/components/store/intermediary/**/*.{ts,tsx}",
      "**/components/store/advanced/**/*.{ts,tsx}"
    ],
    ignores: [
      "**/components/store/sections/landing/**"
    ],
    rules: {
      "max-lines-per-function": ["warn", {
        max: 120,
        skipBlankLines: true,
        skipComments: true,
        IIFEs: true
      }]
    }
  },
  {
    files: [
      "**/components/store/sections/landing/**/*.{ts,tsx}"
    ],
    rules: {
      "max-lines-per-function": "off"
    }
  },
  {
    files: [
      "**/lib/supabase/**/*.{ts,tsx}"
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off"
    }
  }
];
