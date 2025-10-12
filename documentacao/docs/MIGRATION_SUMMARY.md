# Migração de Upload de Imagens para Cloudinary

## Resumo das Mudanças

Este documento descreve as mudanças realizadas para migrar o sistema de upload de imagens do backend (Render) para o frontend com Cloudinary, resolvendo definitivamente o problema de perda de arquivos a cada deploy.

## Problema Original

- O backend hospedado no Render perdia todas as imagens uploadadas a cada deploy
- Uploads eram feitos diretamente para pastas locais do servidor (`uploads/`, `public/images/`)
- Sistema vulnerável a perdas de dados devido ao storage efêmero do Render
- Impossibilidade de manter arquivos entre deploys

## Evolução da Solução

### Primeira Tentativa: Netlify Functions ❌
- **Problema:** Complexidade de parsing multipart/form-data
- **Limitações:** Timeouts, tamanho de arquivos, processamento demorado
- **Resultado:** Abandonada devido à complexidade desnecessária

### Solução Final: Cloudinary Direct Upload ✅

### 1. Integração Direta com Cloudinary

**Serviço Principal: `front-end/src/services/netlifyUploadService.js`**
- Upload direto do frontend para Cloudinary via API REST
- Sem necessidade de Netlify Functions intermediárias
- Suporte a todos os tipos: `banners`, `blog`, `publicidade`, `imoveis`
- Configuração por variáveis de ambiente

**Configuração:**
```javascript
// Upload universal para Cloudinary
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
```

### 2. Funções Específicas por Tipo de Conteúdo

**Arquivo: `front-end/src/services/netlifyUploadService.js`**
- **`uploadImovelImage()`** - Upload de imagens de imóveis
- **`uploadBannerImage()`** - Upload de banners para carrossel
- **`uploadBlogImage()`** - Upload de imagens para artigos do blog
- **`uploadPublicidadeImage()`** - Upload de imagens de publicidade
- **`deleteFromNetlify()`** - Função para deletar imagens (mantida para compatibilidade)

**Características:**
- Upload direto via FormData para Cloudinary
- Organização automática em pastas por tipo
- Transformações automáticas (quality: auto, format: auto)
- URLs seguras com HTTPS

### 3. Páginas CMS Completamente Migradas

**Páginas atualizadas para Cloudinary:**
- `front-end/src/app/admin/cms-banner/criar/page.js` ✅
- `front-end/src/app/admin/cms-banner/editar/[id]/page.js` ✅
- `front-end/src/app/admin/cms-publicidades/criar/page.js` ✅
- `front-end/src/app/admin/cms-publicidades/editar/[id]/page.js` ✅
- `front-end/src/app/admin/cms-publicacoes/criar/page.js` ✅
- `front-end/src/app/admin/cms-publicacoes/editar/[id]/page.js` ✅
- `front-end/src/app/admin/cms-imoveis/criar/page.js` ✅
- `front-end/src/app/admin/cms-imoveis/editar/[id]/page.js` ✅

**Mudanças implementadas:**
- Upload direto para Cloudinary no frontend
- Recebimento de URL segura do Cloudinary
- Envio apenas da URL para o backend via JSON
- Remoção completa de `multipart/form-data`
- Tratamento de erros robusto

### 4. Backend Completamente Limpo

**Controladores atualizados:**
- `back-end/src/controllers/bannerController.js` ✅
- `back-end/src/controllers/blogController.js` ✅
- `back-end/src/controllers/publicidadeController.js` ✅
- `back-end/src/controllers/ImagemImovelController.js` ✅

**Mudanças implementadas:**
- **Multer removido completamente** de todos os controladores
- Controladores recebem apenas `url_imagem` via JSON
- Remoção de todas as referências a `req.file`
- Validação atualizada para aceitar URLs do Cloudinary
- Logs de debug limpos

**Rotas completamente atualizadas:**
- `back-end/src/routes/bannerRoutes.js` ✅
- `back-end/src/routes/blogRoutes.js` ✅
- `back-end/src/routes/publicidadeRoutes.js` ✅
- `back-end/src/routes/imagemImovelRoutes.js` ✅

**Mudanças implementadas:**
- Middleware multer removido de todas as rotas
- Rotas aceitam apenas payloads JSON
- Headers `Content-Type: application/json`
- Remoção de tratamento de upload de arquivos

## Estrutura de Pastas no Cloudinary

```
cloudinary.com/dajy4w5wi/image/upload/
└── imobiliaria/
    ├── banners/           # Banners do carrossel
    ├── blog/              # Imagens de artigos
    ├── publicidade/       # Imagens de publicidade
    └── imoveis/           # Imagens de imóveis
```

## Fluxo de Upload Final

### Antes (Problemático):
1. Frontend → Backend (multipart/form-data)
2. Backend salva arquivo localmente com Multer
3. Backend salva referência no banco de dados
4. ❌ **Deploy = perda de todos os arquivos**

### Primeira Tentativa (Netlify Functions):
1. Frontend → Netlify Function (multipart)
2. Netlify Function processa arquivo
3. Function salva em public/images/
4. ❌ **Complexidade desnecessária, timeouts**

### Solução Final (Cloudinary Direct):
1. **Frontend → Cloudinary** (FormData direto)
2. **Cloudinary retorna URL segura**
3. **Frontend → Backend** (apenas URL via JSON)
4. **Backend salva referência no banco**
5. ✅ **Imagens persistem para sempre no CDN**

## Benefícios da Migração para Cloudinary

### 🚀 **Performance e Disponibilidade**
- ✅ **CDN Global:** Imagens servidas de pontos próximos ao usuário
- ✅ **99.9% Uptime:** Infraestrutura robusta e confiável
- ✅ **Cache Automático:** Otimização automática de cache
- ✅ **Compressão Inteligente:** Quality: auto, Format: auto

### 💾 **Persistência e Backup**
- ✅ **Imagens persistem para sempre** (não dependem de deploys)
- ✅ **Backup automático** gerenciado pelo Cloudinary
- ✅ **Versionamento de imagens** nativo
- ✅ **Redundância geográfica** automática

### ⚡ **Performance do Sistema**
- ✅ **Backend ultrarrápido** (sem processamento de arquivos)
- ✅ **Menos uso de CPU/RAM** no servidor Render
- ✅ **Upload paralelo** (não bloqueia o backend)
- ✅ **Transformações automáticas** (WebP, AVIF, etc.)

### 🔧 **Desenvolvimento e Manutenção**
- ✅ **Código mais limpo** (separação de responsabilidades)
- ✅ **Menos dependências** no backend (sem Multer)
- ✅ **Melhor escalabilidade** (processamento distribuído)
- ✅ **Debugging simplificado** (logs centralizados)

## Compatibilidade

- ✅ APIs do backend mantêm compatibilidade
- ✅ Estrutura do banco de dados inalterada
- ✅ URLs das imagens mantêm formato original
- ✅ Funcionalidades existentes preservadas

## Como Usar o Sistema Atualizado

### 🔧 **Configuração Inicial**

**Variáveis de Ambiente (Frontend):**
```bash
# .env.local
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dajy4w5wi
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=imobiliaria-bortone-upload
```

**Configuração do Upload Preset no Cloudinary:**
- Signing Mode: **Unsigned** ✅
- Asset Folder: **imobiliaria** ✅
- Return Delete Token: **Enabled** ✅
- Invalidate CDN Cache: **Enabled** ✅

### 📤 **Uso nas Páginas CMS**

### Upload de Imagem de Imóvel:
```javascript
import { uploadImovelImage } from '@/services/netlifyUploadService';

try {
  const imageUrl = await uploadImovelImage(file, imovelId, "Descrição da imagem");
  // imageUrl = "https://res.cloudinary.com/dajy4w5wi/image/upload/v123/imobiliaria/imoveis/abc123.jpg"
  
  // Enviar apenas a URL para o backend
  const response = await axios.post('/api/imoveis', {
    ...outrosDados,
    url_imagem: imageUrl
  });
} catch (error) {
  console.error('Erro no upload:', error);
}
```

### Upload de Banner:
```javascript
import { uploadBannerImage } from '@/services/netlifyUploadService';

const imageUrl = await uploadBannerImage(file, "Descrição do banner", usuarioId);
// imageUrl será uma URL completa do Cloudinary
```

### Upload de Blog/Publicidade:
```javascript
import { uploadBlogImage, uploadPublicidadeImage } from '@/services/netlifyUploadService';

// Para blog
const blogImageUrl = await uploadBlogImage(file, "Título do Post", "Conteúdo...", usuarioId);

// Para publicidade
const pubImageUrl = await uploadPublicidadeImage(file, "Título da Campanha", "Descrição...", usuarioId, true);
```

## Status da Migração ✅

### **Desenvolvimento:**
1. ✅ **Configuração Cloudinary** completa
2. ✅ **Serviços de upload** implementados e testados
3. ✅ **Todas as páginas CMS** migradas
4. ✅ **Backend limpo** (sem Multer/req.file)
5. ✅ **Build funcionando** sem erros
6. ✅ **CSP configurado** para desenvolvimento
7. ✅ **Upload/exibição** funcionando localmente

### **Para Deploy em Produção:**
1. 🔄 **Configurar variáveis** no Netlify
2. 🔄 **Deploy e teste** em ambiente de produção
3. 🔄 **Monitorar performance** do Cloudinary
4. 🔄 **Verificar URLs** em todas as páginas

## Especificações Técnicas

### **🌐 Cloudinary**
- **Cloud Name:** `dajy4w5wi`
- **Upload Preset:** `imobiliaria-bortone-upload`
- **Limite por arquivo:** 10MB (configurável)
- **Formatos suportados:** JPG, PNG, JPEG, WebP, GIF
- **Transformações:** Quality: auto, Format: auto

### **📁 Estrutura de URLs**
```
https://res.cloudinary.com/dajy4w5wi/image/upload/v{version}/imobiliaria/{tipo}/{filename}

Exemplos:
- Banner: /imobiliaria/banners/banner_1759123456.jpg
- Blog: /imobiliaria/blog/blog_1759123456.jpg
- Publicidade: /imobiliaria/publicidade/publicidade_1759123456.jpg
- Imóvel: /imobiliaria/imoveis/imovel_123_1759123456.jpg
```

### **⚙️ Configurações do Next.js**
- **Content Security Policy:** Permite localhost:* em desenvolvimento
- **Image Optimization:** Desabilitada (unoptimized: true)
- **Transpile Packages:** Ant Design compatível
- **Webpack:** Configurado para Leaflet e Ant Design

### **🔒 Segurança**
- Upload preset **unsigned** para frontend
- Validação de formatos no Cloudinary
- CSP restritivo em produção
- URLs seguras HTTPS obrigatórias

## Arquivos de Referência (Deprecated)

**Mantidos apenas para referência:**
- `front-end/netlify/functions/upload-image.js` (não usado)
- `front-end/netlify/functions/delete-image.js` (não usado)

**Nota:** As Netlify Functions foram substituídas pelo upload direto ao Cloudinary.