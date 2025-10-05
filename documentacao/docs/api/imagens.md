# Documentação de Imagens API - Sistema Cloudinary

Esta seção descreve os endpoints da API relacionados ao gerenciamento de imagens, **após migração para Cloudinary**.

## 🚨 MIGRAÇÃO IMPORTANTE

**Sistema anterior (DEPRECATED):**
- Upload via backend com Multer
- Armazenamento local no servidor
- Perda de dados a cada deploy

**Sistema atual (ATIVO):**
- Upload direto para Cloudinary no frontend
- Backend recebe apenas URLs
- Persistência permanente no CDN

---

## Endpoints Atualizados

### POST /api/imagens

**⚠️ MÉTODO ATUALIZADO**

Descrição: Cria referência de imagem com URL do Cloudinary (sem upload de arquivo).

Método: POST

URL: `/api/imagens`

**Headers:**
```
Content-Type: application/json
```

**Parâmetros JSON:**
- `url_imagem` (obrigatório): URL completa da imagem no Cloudinary
- `imovel_id` (obrigatório): ID do imóvel ao qual a imagem será associada
- `descricao` (obrigatório): Descrição da imagem

**Exemplo de Requisição:**

```javascript
POST /api/imagens
Content-Type: application/json

{
  "url_imagem": "https://res.cloudinary.com/dajy4w5wi/image/upload/v1759123456/imobiliaria/imoveis/imovel_123_abc.jpg",
  "imovel_id": 1,
  "descricao": "Vista frontal do imóvel"
}
```

**Exemplo de Resposta (201):**

```json
{
  "id": 1,
  "imovel_id": 1,
  "url_imagem": "https://res.cloudinary.com/dajy4w5wi/image/upload/v1759123456/imobiliaria/imoveis/imovel_123_abc.jpg",
  "descricao": "Vista frontal do imóvel",
  "createdAt": "2025-01-01T12:00:00.000Z",
  "updatedAt": "2025-01-01T12:00:00.000Z"
}
```

**Códigos de Status:** 201, 400, 500

**Autenticação:** Não requer

### DELETE /api/imagens/:id

**✅ FUNCIONAMENTO INALTERADO**

Descrição: Exclui uma referência de imagem pelo ID (não deleta do Cloudinary).

Método: DELETE

URL: `/api/imagens/:id`

**Parâmetros:**
- `id` (path, obrigatório): ID da referência de imagem no banco

**Exemplo de Requisição:**

```javascript
DELETE /api/imagens/1
```

**Exemplo de Resposta (200):**

```json
{
  "message": "Imagem excluída com sucesso."
}
```

**⚠️ Nota Importante:**
Esta operação remove apenas a referência do banco de dados. A imagem permanece no Cloudinary. Para deletar do Cloudinary, use a função `deleteFromNetlify()` no frontend.

**Códigos de Status:** 200, 404, 500

**Autenticação:** Não requer

### GET /api/imagens/:id

**✅ FUNCIONAMENTO INALTERADO (URLs atualizadas)**

Descrição: Retorna uma imagem específica pelo ID.

Método: GET

URL: `/api/imagens/:id`

**Parâmetros:**
- `id` (path, obrigatório): ID da imagem a ser recuperada

**Exemplo de Requisição:**

```javascript
GET /api/imagens/1
```

**Exemplo de Resposta (200):**

```json
{
  "id": 1,
  "imovel_id": 1,
  "url_imagem": "https://res.cloudinary.com/dajy4w5wi/image/upload/v1759123456/imobiliaria/imoveis/imovel_123_abc.jpg",
  "descricao": "Vista frontal do imóvel",
  "createdAt": "2025-01-01T12:00:00.000Z",
  "updatedAt": "2025-01-01T12:00:00.000Z"
}
```

**⚡ Mudança:** `url_imagem` agora contém URLs completas do Cloudinary com HTTPS.

**Códigos de Status:** 200, 404, 500

**Autenticação:** Não requer

### GET /api/imagens/imovel/:imovelId

**✅ FUNCIONAMENTO INALTERADO (URLs atualizadas)**

Descrição: Retorna todas as imagens associadas a um imóvel específico.

Método: GET

URL: `/api/imagens/imovel/:imovelId`

**Parâmetros:**
- `imovelId` (path, obrigatório): ID do imóvel para recuperar as imagens

**Exemplo de Requisição:**

```javascript
GET /api/imagens/imovel/1
```

**Exemplo de Resposta (200):**

```json
[
  {
    "id": 1,
    "imovel_id": 1,
    "url_imagem": "https://res.cloudinary.com/dajy4w5wi/image/upload/v1759123456/imobiliaria/imoveis/imovel_1_abc.jpg",
    "descricao": "Vista frontal do imóvel",
    "createdAt": "2025-01-01T12:00:00.000Z",
    "updatedAt": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 2,
    "imovel_id": 1,
    "url_imagem": "https://res.cloudinary.com/dajy4w5wi/image/upload/v1759123456/imobiliaria/imoveis/imovel_1_def.jpg",
    "descricao": "Cozinha do imóvel",
    "createdAt": "2025-01-01T12:00:00.000Z",
    "updatedAt": "2025-01-01T12:00:00.000Z"
  }
]
```

**Códigos de Status:** 200, 404, 500

**Autenticação:** Não requer

---

## 🚀 Fluxo Completo de Upload

### **1. Upload no Frontend (Cloudinary)**

```javascript
// Importar serviço
import { uploadImovelImage } from '@/services/netlifyUploadService';

// Upload direto para Cloudinary
const file = event.target.files[0];
try {
  const cloudinaryUrl = await uploadImovelImage(file, imovelId, "Descrição");
  // cloudinaryUrl = "https://res.cloudinary.com/dajy4w5wi/image/upload/v123/imobiliaria/imoveis/abc.jpg"
} catch (error) {
  console.error('Erro no upload:', error);
}
```

### **2. Criar Referência no Backend**

```javascript
// Enviar apenas URL para o backend
const response = await fetch('/api/imagens', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url_imagem: cloudinaryUrl,
    imovel_id: imovelId,
    descricao: "Descrição da imagem"
  })
});
```

### **3. Exibir Imagem**

```jsx
// Usar URL diretamente do banco (já é completa)
<img 
  src={imagem.url_imagem} 
  alt={imagem.descricao}
  loading="lazy"
/>
```

## 🔧 Configuração Necessária

### **Frontend (.env.local):**
```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dajy4w5wi
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=imobiliaria-bortone-upload
```

### **Backend (.env):**
```bash
# Não precisa de configuração Cloudinary
# Backend só gerencia referências
```

## ⚡ Vantagens do Sistema Atual

- ✅ **Persistência:** Imagens nunca são perdidas
- ✅ **Performance:** CDN global com cache automático
- ✅ **Escalabilidade:** Upload paralelo, backend mais rápido
- ✅ **Transformações:** Otimização automática (WebP, compressão)
- ✅ **Segurança:** URLs HTTPS, validação de formatos
- ✅ **Backup:** Redundância automática do Cloudinary

## 📚 Outros Endpoints Relacionados

- **Banners:** `/api/banners` - Aceita `url_imagem`
- **Blog:** `/api/blog` - Aceita `url_imagem`  
- **Publicidades:** `/api/publicidade` - Aceita `url_imagem`
- **Imóveis:** `/api/imoveis` - Funciona com imagens via relação

Autenticação: não requer
