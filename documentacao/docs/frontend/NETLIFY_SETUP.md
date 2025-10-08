# Deploy no Netlify - Sistema Cloudinary

## 🚀 Configuração Atualizada Pós-Migração

### ⚡ **MUDANÇA IMPORTANTE - Sistema Cloudinary:**
- ❌ ~~Netlify Functions para upload~~ (deprecated)
- ✅ **Upload direto para Cloudinary** (ativo)
- ✅ **Backend recebe apenas URLs** (otimizado)

### Arquivos Configurados:
- ✅ `netlify.toml` - Configuração de build
- ✅ `next.config.mjs` - CSP e webpack configurados
- ✅ `.env.local` - Variáveis Cloudinary
- ⚠️ `netlify/functions/*` - Mantidos apenas para referência

## 📋 Deploy Steps - Sistema Atual

### 1. Verificar Dependências

Execute no terminal do front-end:

```bash
npm install --save-dev @netlify/plugin-nextjs
# Não precisa mais: multiparty (removido com Cloudinary)
```

### ⚡ **CONFIGURAÇÃO CLOUDINARY** (Obrigatório):

**Variáveis de Ambiente - Netlify Dashboard:**
```bash
NEXT_PUBLIC_API_URL = https://imobiliaria-bortone.onrender.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = dajy4w5wi
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET = imobiliaria-bortone-upload
```

### ✅ **CORREÇÕES APLICADAS** (Sistema Atual):
- ✅ Next.js 15.4.7 e App Router totalmente suportados
- ✅ Plugin `@netlify/plugin-nextjs` v5.13.3 funcionando

### 2. Configurar Variáveis de Ambiente no Netlify

**📋 Consulte o arquivo `NETLIFY_ENV_CONFIG.md` para guia completo**

**Resumo rápido:**
1. Acesse [app.netlify.com](https://app.netlify.com)
2. Seu site → **Site settings** → **Environment variables**
3. Adicione as variáveis:

```bash
NEXT_PUBLIC_API_URL=https://seu-backend.onrender.com
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
NODE_VERSION=18
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=sua_chave_aqui
```

**⚠️ IMPORTANTE:** Após adicionar as variáveis, faça um **Trigger deploy** manual.

### 3. Deploy Steps

#### Via GitHub (Recomendado):
1. Commit e push das alterações
2. Conectar repositório no Netlify
3. Deploy automático será ativado

#### Via Netlify CLI:
```bash
# Instalar CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

### 4. Configurações Específicas do Netlify

#### Build Settings:
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Functions directory**: `netlify/functions`

#### Redirects Automáticos:
- ✅ SPA routing configurado
- ✅ API functions em `/.netlify/functions/`
- ✅ Static files otimizados

### 5. Testes Após Deploy

#### URLs para testar:
- Homepage: `https://seu-site.netlify.app`
- Upload API: `https://seu-site.netlify.app/.netlify/functions/upload-image`
- API Backend: Verificar se `NEXT_PUBLIC_API_URL` está acessível

#### Comandos de teste:
```bash
# Testar upload local
curl -X POST http://localhost:8888/.netlify/functions/upload-image \
  -F "image=@test-image.jpg" \
  -F "folder=imoveis"

# Testar delete local  
curl -X DELETE http://localhost:8888/.netlify/functions/delete-image \
  -H "Content-Type: application/json" \
  -d '{"fileName":"test.jpg","folder":"imoveis"}'
```

## 🔧 Configurações Avançadas

### Performance Otimization:
- ✅ Cache headers configurados
- ✅ Static assets otimizados
- ✅ Gzip compression habilitado

### Security Features:
- ✅ CORS configurado
- ✅ Headers de segurança
- ✅ Ambiente de produção isolado

### Monitoring:
- Analytics do Netlify incluído
- Deploy notifications disponíveis
- Build logs automáticos

## 🚨 Troubleshooting

### Problemas Comuns:

#### 1. Build Fails:
```bash
# Verificar Node version
node --version  # Deve ser 18.x

# Limpar cache
rm -rf .next node_modules
npm install
```

#### 2. Functions Not Working:
```bash
# Testar localmente
netlify dev
```

#### 3. Images Not Loading:
- Verificar se `public/images/` existe
- Confirmar paths nas functions
- Testar CORS headers

### Support Resources:
- [Netlify Docs](https://docs.netlify.com/)
- [Next.js on Netlify](https://docs.netlify.com/integrations/frameworks/next-js/)
- [Functions Documentation](https://docs.netlify.com/functions/overview/)

## ✅ Checklist Final

- [ ] Dependências instaladas
- [ ] Variáveis de ambiente configuradas
- [ ] Repositório conectado ao Netlify
- [ ] Build successful
- [ ] Site acessível
- [ ] Upload de imagens funcionando
- [ ] API backend conectada

Após completar estes passos, seu site estará rodando no Netlify com suporte completo a upload de imagens!
