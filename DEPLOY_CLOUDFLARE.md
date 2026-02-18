# Guia de Deploy no Cloudflare Pages

Este guia explica como fazer deploy da aplicação Next.js no Cloudflare Pages.

## Pré-requisitos

1. Conta no Cloudflare
2. Projeto no GitHub/GitLab/Bitbucket
3. Node.js 18+ instalado localmente

## Passo 1: Instalar dependências do Cloudflare

```bash
cd web
npm install --save-dev @opennextjs/cloudflare@latest wrangler@latest
```

## Passo 2: Configurar variáveis de ambiente no Cloudflare

1. Acesse o [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Vá em **Pages** → **Create a project**
3. Conecte seu repositório Git
4. Nas configurações do projeto, vá em **Settings** → **Environment Variables**
5. Adicione as seguintes variáveis:

### Variáveis obrigatórias:

```
NEXT_PUBLIC_SUPABASE_URL=https://xubjlkztymdaggikvzsu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-aqui
GEMINI_API_KEY=sua-gemini-key-aqui
```

### Variáveis opcionais:

```
STRIPE_SECRET_KEY=sua-stripe-key-aqui (se usar Stripe)
```

## Passo 3: Configurar Build Settings

No Cloudflare Pages, configure:

- **Framework preset**: `None` (OpenNext não está na lista de presets)
- **Build command**: `npm run build:cf` (ou `npm run build && npm run build:cf` se necessário)
- **Build output directory**: `.open-next`
- **Root directory**: `web` (se o projeto estiver em uma subpasta)
- **Node version**: `18` ou superior

## Passo 4: Deploy via Git (Recomendado)

1. Faça commit e push das alterações:
   ```bash
   git add .
   git commit -m "Configure Cloudflare Pages deployment"
   git push
   ```

2. O Cloudflare Pages detectará automaticamente o push e fará o build

## Passo 5: Deploy Manual (Opcional)

Se quiser testar localmente antes:

```bash
cd web
npm run build:cf
npx wrangler pages deploy .open-next
```

## Passo 6: Configurar Domínio (Opcional)

1. No Cloudflare Pages, vá em **Custom domains**
2. Adicione seu domínio (ex: `reptrail.com`)
3. Configure os registros DNS conforme instruções do Cloudflare

## Troubleshooting

### Erro: "Module not found"
- Certifique-se de que todas as dependências estão no `package.json`
- Execute `npm install` antes do build

### Erro: "Environment variable not found"
- Verifique se todas as variáveis de ambiente estão configuradas no Cloudflare Pages
- Variáveis devem começar com `NEXT_PUBLIC_` para serem expostas ao cliente

### Erro: "Build timeout"
- Aumente o timeout nas configurações do projeto
- Verifique se não há processos muito lentos no build

### Erro relacionado a Node.js
- Certifique-se de que `compatibility_date` no `wrangler.toml` é `2024-09-23` ou posterior
- Verifique se `nodejs_compat` está nas `compatibility_flags`

### Erro: "@opennextjs/cloudflare not found"
- Execute `npm install --save-dev @opennextjs/cloudflare@latest wrangler@latest`
- Certifique-se de que está usando Node.js 18+ e npm 9+

## Estrutura de Arquivos Importantes

```
web/
├── next.config.ts          # Configuração Next.js
├── wrangler.toml           # Configuração Cloudflare (legado)
├── wrangler.jsonc          # Configuração Cloudflare (OpenNext)
├── open-next.config.ts     # Configuração OpenNext
├── package.json            # Dependências e scripts
└── .env.local              # Variáveis locais (NÃO commitar)
```

## Notas Importantes

1. **NUNCA** commite o arquivo `.env.local` - ele contém secrets
2. Sempre configure as variáveis de ambiente no Cloudflare Dashboard
3. O build pode levar alguns minutos na primeira vez
4. Use `npm run build:cf` para builds locais de teste

## Comandos Úteis

```bash
# Build local para Cloudflare
npm run build:cf

# Preview local
npm run preview

# Deploy manual
npx wrangler pages deploy .open-next

# Ver logs do deploy
npx wrangler pages deployment tail
```
