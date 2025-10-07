# Arquitetura de Imagens com Cloudinary

## 📋 Visão Geral

Este documento descreve a arquitetura atual do sistema de imagens, após migração para Cloudinary, explicando o fluxo completo desde upload até exibição.

## 🏗️ Arquitetura do Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   FRONTEND      │    │   CLOUDINARY    │    │   BACKEND       │
│   (Netlify)     │    │   (CDN/Storage) │    │   (Render)      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │ 1. Upload File        │                       │
         ├──────────────────────►│                       │
         │                       │                       │
         │ 2. Return URL         │                       │
         │◄──────────────────────┤                       │
         │                       │                       │
         │ 3. Send URL + Data                            │
         ├───────────────────────────────────────────────►│
         │                       │                       │
         │ 4. Success Response   │                       │
         │◄───────────────────────────────────────────────┤
         │                       │                       │
         │ 5. Display Image      │                       │
         ├──────────────────────►│                       │
         │                       │                       │
```

## 🔄 Fluxo Detalhado

### **Fase 1: Upload (Frontend → Cloudinary)**

```javascript
// 1. Usuário seleciona arquivo
const file = input.files[0];

// 2. Frontend faz upload direto para Cloudinary
const formData = new FormData();
formData.append('file', file);
formData.append('upload_preset', 'imobiliaria-bortone-upload');
formData.append('folder', 'imobiliaria/imoveis');

const response = await fetch(`https://api.cloudinary.com/v1_1/dajy4w5wi/image/upload`, {
  method: 'POST',
  body: formData
});

// 3. Cloudinary retorna dados da imagem
const data = await response.json();
// data.secure_url = "https://res.cloudinary.com/dajy4w5wi/image/upload/v123/imobiliaria/imoveis/abc.jpg"
```

### **Fase 2: Registro (Frontend → Backend)**

```javascript
// 4. Frontend envia dados para backend (apenas URL)
const backendResponse = await axios.post('/api/imagens', {
  url_imagem: data.secure_url,
  imovel_id: imovelId,
  descricao: "Descrição da imagem"
}, {
  headers: {
    'Content-Type': 'application/json'
  }
});

// 5. Backend salva referência no banco de dados
// Tabela: ImagemImovel
// Campos: id, imovel_id, url_imagem, descricao, createdAt, updatedAt
```

### **Fase 3: Exibição (Frontend ← Cloudinary)**

```javascript
// 6. Frontend busca dados do backend
const imagens = await axios.get(`/api/imagens/imovel/${imovelId}`);

// 7. Frontend exibe imagens diretamente do Cloudinary
imagens.data.forEach(imagem => {
  // imagem.url_imagem já é uma URL completa do Cloudinary
  // Exemplo: "https://res.cloudinary.com/dajy4w5wi/image/upload/v123/imobiliaria/imoveis/abc.jpg"
});
```

## 📁 Organização de Pastas

### **No Cloudinary:**
```
dajy4w5wi (Cloud Name)
└── imobiliaria/
    ├── banners/           # Banners do carrossel
    │   ├── banner_1759123456.jpg
    │   └── banner_1759123457.png
    ├── blog/              # Imagens de artigos
    │   ├── blog_1759123456.jpg
    │   └── blog_1759123457.webp
    ├── publicidade/       # Imagens de campanhas
    │   ├── publicidade_1759123456.jpg
    │   └── publicidade_1759123457.png
    └── imoveis/           # Imagens de imóveis
        ├── imovel_123_1759123456.jpg
        ├── imovel_123_1759123457.png
        └── imovel_124_1759123458.jpg
```

### **No Banco de Dados:**
```sql
-- Tabela: ImagemImovel
CREATE TABLE ImagemImovel (
  id INT PRIMARY KEY AUTO_INCREMENT,
  imovel_id INT NOT NULL,
  url_imagem VARCHAR(500) NOT NULL,  -- URL completa do Cloudinary
  descricao TEXT,
  createdAt DATETIME,
  updatedAt DATETIME,
  FOREIGN KEY (imovel_id) REFERENCES Imovel(id)
);

-- Exemplo de dados:
INSERT INTO ImagemImovel VALUES (
  1, 
  123, 
  'https://res.cloudinary.com/dajy4w5wi/image/upload/v1759123456/imobiliaria/imoveis/imovel_123_abc.jpg',
  'Vista frontal do imóvel',
  NOW(),
  NOW()
);
```

## ⚙️ Configurações Técnicas

### **Upload Preset (Cloudinary):**
```yaml
Name: imobiliaria-bortone-upload
Signing Mode: Unsigned
Asset Folder: imobiliaria
Overwrite: false
Return Delete Token: true
Invalidate CDN Cache: true
Quality: auto
Format: auto
Max File Size: 10MB
Allowed Formats: jpg,png,jpeg,webp,gif
```

### **Variáveis de Ambiente:**
```bash
# Frontend (.env.local)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dajy4w5wi
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=imobiliaria-bortone-upload

# Backend (.env)
# Não precisa de configuração Cloudinary
```

### **Headers e CORS:**
```javascript
// Next.js (next.config.mjs)
// CSP configurado para permitir Cloudinary
"img-src 'self' data: blob: https: http:",
"connect-src 'self' https:" + (isDev ? " http://localhost:*" : ""),
```

## 🚀 Serviços Implementados

### **Upload Service (`netlifyUploadService.js`):**

```javascript
// Função universal
export const uploadToNetlify = async (file, options = {}) => {
  const { type = 'imoveis' } = options;
  
  const folderMap = {
    'banners': 'imobiliaria/banners',
    'blog': 'imobiliaria/blog',
    'publicidade': 'imobiliaria/publicidade',
    'imoveis': 'imobiliaria/imoveis'
  };
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', folderMap[type]);
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );
  
  const data = await response.json();
  return data.secure_url;
};

// Funções específicas
export const uploadImovelImage = (file, imovelId, descricao) => 
  uploadToNetlify(file, { type: 'imoveis', imovelId, descricao });

export const uploadBannerImage = (file, descricao, usuarioId) => 
  uploadToNetlify(file, { type: 'banners', descricao, usuarioId });

export const uploadBlogImage = (file, titulo, conteudo, usuarioId) => 
  uploadToNetlify(file, { type: 'blog', titulo, conteudo, usuarioId });

export const uploadPublicidadeImage = (file, titulo, conteudo, usuarioId, ativo) => 
  uploadToNetlify(file, { type: 'publicidade', titulo, conteudo, usuarioId, ativo });
```

## 📊 Métricas e Monitoramento

### **Cloudinary Dashboard:**
- **Storage usado:** Visível no dashboard
- **Bandwidth:** Transferência mensal
- **Transformações:** Otimizações aplicadas
- **Requests:** Número de uploads/downloads

### **Performance:**
- **CDN Global:** ~100ms de latência média
- **Cache:** 31536000s (1 ano) para imagens
- **Compressão:** Automática (quality: auto)
- **Formatos:** WebP/AVIF automáticos quando suportados

### **Custos (Free Tier):**
- **Storage:** 25GB gratuitos
- **Bandwidth:** 25GB/mês gratuito
- **Transformações:** 25,000/mês gratuitas

## 🔒 Segurança

### **Upload Preset Unsigned:**
- ✅ **Vantagem:** Upload direto do frontend
- ✅ **Validação:** Formatos e tamanhos controlados
- ✅ **Pasta restrita:** Apenas `imobiliaria/*`

### **URLs Seguras:**
- ✅ **HTTPS obrigatório:** Todas as URLs são seguras
- ✅ **CDN protegido:** Anti-hotlinking configurável
- ✅ **Versionamento:** URLs únicas previnem cache issues

## 🔄 Migração vs Sistema Anterior

| Aspecto | Sistema Anterior | Sistema Cloudinary |
|---------|------------------|-------------------|
| **Storage** | Local (efêmero) | CDN (permanente) |
| **Performance** | Servidor único | CDN global |
| **Backup** | Manual | Automático |
| **Escalabilidade** | Limitada | Ilimitada |
| **Custos** | Storage do servidor | Free tier generoso |
| **Manutenção** | Alta | Baixa |
| **Deploy** | ❌ Perde arquivos | ✅ Preserva tudo |

## 🛠️ Troubleshooting

### **Upload falha:**
1. Verificar variáveis de ambiente
2. Confirmar upload preset exists
3. Checar formato/tamanho do arquivo
4. Verificar CSP no browser

### **Imagem não carrega:**
1. Verificar URL completa no banco
2. Testar URL diretamente no browser
3. Verificar headers CSP
4. Confirmar status da imagem no Cloudinary

### **Performance lenta:**
1. Verificar transformações automáticas
2. Confirmar cache headers
3. Testar de diferentes localizações
4. Verificar quality/format settings