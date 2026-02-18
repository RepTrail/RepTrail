# Deploy no Cloudflare Pages

Este guia explica como fazer o deploy do RepTrail no Cloudflare Pages.

## Pré-requisitos

1. Conta no Cloudflare
2. Repositório Git (GitHub, GitLab ou Bitbucket)
3. Node.js 20+ instalado localmente

## Configuração do Projeto

O projeto já está configurado com:
- `wrangler.toml` - Configuração do Cloudflare Workers/Pages
- `.nvmrc` - Versão do Node.js

## Passos para Deploy

### Opção 1: Deploy via Dashboard do Cloudflare

1. Acesse o [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Vá em **Pages** > **Create a project**
3. Conecte seu repositório Git
4. Configure o build:
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
   - **Root directory**: `web` (se o projeto estiver na pasta web)
   - **Node version**: 20

5. Adicione as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL` - URL do seu projeto Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Chave anônima do Supabase
   - `SUPABASE_SERVICE_ROLE_KEY` - Chave de serviço do Supabase (se necessário)

6. Clique em **Save and Deploy**

### Opção 2: Deploy via Wrangler CLI

1. Instale o Wrangler CLI:
```bash
npm install -g wrangler
```

2. Faça login no Cloudflare:
```bash
wrangler login
```

3. Configure as variáveis de ambiente:
```bash
wrangler pages secret put NEXT_PUBLIC_SUPABASE_URL
wrangler pages secret put NEXT_PUBLIC_SUPABASE_ANON_KEY
wrangler pages secret put SUPABASE_SERVICE_ROLE_KEY
```

4. Faça o build do projeto:
```bash
cd web
npm install
npm run build
```

5. Faça o deploy:
```bash
wrangler pages deploy .next --project-name=reptrail
```

## Configuração de Domínio Customizado

1. No dashboard do Cloudflare Pages, vá em **Custom domains**
2. Adicione seu domínio (ex: `reptrail.com`)
3. Configure o DNS conforme as instruções do Cloudflare

## Variáveis de Ambiente Necessárias

Certifique-se de configurar estas variáveis no Cloudflare Pages:

- `NEXT_PUBLIC_SUPABASE_URL` - URL do projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Chave pública do Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Chave de serviço (apenas se necessário para server actions)

## Troubleshooting

### Erro de Build
- Verifique se todas as dependências estão instaladas
- Certifique-se de que o Node.js versão 20 está sendo usado
- Verifique os logs de build no dashboard do Cloudflare

### Erro de Runtime
- Verifique se todas as variáveis de ambiente estão configuradas
- Verifique os logs de runtime no dashboard do Cloudflare
- Certifique-se de que o Supabase está acessível publicamente

## Notas Importantes

- O Cloudflare Pages suporta Next.js 13+ com App Router
- Certifique-se de que todas as rotas estão configuradas corretamente
- O projeto usa Server Components e Server Actions, que são suportados pelo Cloudflare Pages
