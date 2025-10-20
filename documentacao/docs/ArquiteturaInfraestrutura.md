# Arquitetura e Infraestrutura do Sistema

## Visão Geral

Este documento descreve a arquitetura completa do sistema Imobiliária Bortone, detalhando a infraestrutura de hospedagem, fluxo de dados e integração entre os componentes.

---

## 🏗️ Diagrama da Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUÁRIOS                                 │
│                    (Navegador Web)                              │
└────────────────┬────────────────────────┬───────────────────────┘
                 │                        │
                 │                        │
┌────────────────▼──────────┐  ┌─────────▼──────────────────────┐
│                            │  │                                 │
│    FRONTEND (Next.js)      │  │     CDN DE IMAGENS             │
│    📍 Vercel               │  │     📍 Cloudinary              │
│                            │  │                                 │
│  - Interface do Usuário    │  │  - Armazenamento de Imagens    │
│  - Páginas públicas        │  │  - Otimização automática       │
│  - CMS/Admin               │  │  - Transformações dinâmicas    │
│  - Upload direto de imgs   │  │  - CDN global                  │
│                            │  │                                 │
└────────────────┬───────────┘  └────────────────────────────────┘
                 │
                 │ API REST / WebSocket
                 │
┌────────────────▼────────────────────────────────────────────────┐
│                                                                  │
│              BACKEND (Node.js + Express)                        │
│              📍 Render                                          │
│                                                                  │
│  - API REST                                                     │
│  - Autenticação JWT                                             │
│  - WebSocket (Chat)                                             │
│  - Lógica de negócio                                            │
│  - Integração com serviços                                      │
│                                                                  │
└────────────────┬───────────────────────────────────────────────┘
                 │
                 │ SQL Queries
                 │
┌────────────────▼───────────────────────────────────────────────┐
│                                                                 │
│              BANCO DE DADOS (MySQL)                            │
│              📍 AlwaysData                                     │
│                                                                 │
│  - Imóveis                                                     │
│  - Usuários                                                    │
│  - Agendamentos                                                │
│  - Chat/Mensagens                                              │
│  - Blog/FAQ                                                    │
│  - Referências de imagens                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🌐 Ambientes de Hospedagem

### 1. Frontend - Vercel

**Plataforma:** [Vercel](https://vercel.com)

**Tecnologias:**
- Next.js 14 (App Router)
- React 18
- TailwindCSS

**Características:**
- ✅ Deploy automático via GitHub
- ✅ Edge Functions
- ✅ CDN global
- ✅ HTTPS automático
- ✅ Preview deployments para PRs
- ✅ Variáveis de ambiente seguras

**URL de Produção:**
- Principal: `https://seu-dominio.vercel.app`
- Custom domain: `https://www.imobiliariabortone.com.br` (se configurado)

**Estrutura de Rotas:**
```
/                     # Home
/imoveis             # Vitrine de imóveis
/imovel/[id]         # Detalhes do imóvel
/admin               # Painel administrativo (CMS)
/admin/imoveis       # Gerenciar imóveis
/admin/agendamentos  # Gerenciar agendamentos
/admin/faq           # Gerenciar FAQ
/admin/blog          # Gerenciar blog
/faq                 # FAQ público
/blog                # Blog público
/contato             # Formulário de contato
/login               # Autenticação
```

**Variáveis de Ambiente:**
```env
NEXT_PUBLIC_API_URL=https://sua-api.onrender.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dajy4w5wi
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=imobiliaria-bortone-upload
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key
NEXT_PUBLIC_WEBSOCKET_URL=wss://sua-api.onrender.com
```

---

### 2. Backend - Render

**Plataforma:** [Render](https://render.com)

**Tecnologias:**
- Node.js 20+
- Express.js
- Socket.IO (WebSocket)
- Sequelize ORM

**Características:**
- ✅ Deploy automático via GitHub
- ✅ Auto-scaling
- ✅ HTTPS automático
- ✅ WebSocket support
- ✅ Health checks
- ✅ Variáveis de ambiente seguras

**URL de Produção:**
- API: `https://sua-api.onrender.com`
- WebSocket: `wss://sua-api.onrender.com`

**Endpoints Principais:**
```
GET  /api/imoveis              # Listar imóveis
POST /api/imoveis              # Criar imóvel
GET  /api/imoveis/:id          # Detalhes do imóvel
PUT  /api/imoveis/:id          # Atualizar imóvel
DELETE /api/imoveis/:id        # Deletar imóvel

POST /api/auth/login           # Login
POST /api/auth/register        # Registro
POST /api/auth/refresh         # Refresh token

GET  /api/agendamentos         # Listar agendamentos
POST /api/agendamentos         # Criar agendamento

GET  /api/faq                  # Listar FAQs
POST /api/faq                  # Criar FAQ

GET  /api/blog                 # Listar posts
POST /api/blog                 # Criar post

WS   /socket.io                # WebSocket (Chat)
```

**Variáveis de Ambiente:**
```env
DATABASE_URL=mysql://user:pass@host/database
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
PORT=4000
NODE_ENV=production
CLOUDINARY_CLOUD_NAME=dajy4w5wi
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
GOOGLE_MAPS_API_KEY=your-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password
```

**⚠️ Importante - Storage Efêmero:**
- O Render usa storage efêmero (arquivos são perdidos a cada deploy)
- **NUNCA** armazenar uploads localmente no Render
- **SEMPRE** usar Cloudinary para imagens/arquivos

---

### 3. Imagens - Cloudinary

**Plataforma:** [Cloudinary](https://cloudinary.com)

**Características:**
- ✅ CDN global
- ✅ Otimização automática
- ✅ Transformações em tempo real
- ✅ Armazenamento permanente
- ✅ Upload direto do frontend
- ✅ Suporte a vídeos

**Estrutura de Pastas:**
```
cloudinary://
└── imobiliaria/
    ├── imoveis/        # Imagens de imóveis
    ├── banners/        # Banners da home
    ├── blog/           # Imagens do blog
    └── publicidade/    # Imagens publicitárias
```

**Upload Preset:**
- Nome: `imobiliaria-bortone-upload`
- Modo: Unsigned (permite upload sem autenticação backend)
- Transformações: Quality auto, Format auto

**URLs de Exemplo:**
```
https://res.cloudinary.com/dajy4w5wi/image/upload/v1759123456/imobiliaria/imoveis/imovel_123.jpg
https://res.cloudinary.com/dajy4w5wi/image/upload/c_fill,w_800,h_600/imobiliaria/imoveis/imovel_123.jpg
```

**Transformações Comuns:**
```javascript
// Redimensionar mantendo proporção
/c_scale,w_800/

// Crop inteligente
/c_fill,w_800,h_600,g_auto/

// Otimização automática
/q_auto,f_auto/

// Thumbnail
/c_thumb,w_200,h_200/
```

---

### 4. Banco de Dados - AlwaysData

**Plataforma:** [AlwaysData](https://www.alwaysdata.com)

**Tecnologia:** MySQL 8.0

**Características:**
- ✅ Backups automáticos
- ✅ PHPMyAdmin incluído
- ✅ SSL/TLS
- ✅ Conexões remotas
- ✅ Alta disponibilidade

**Acesso:**
- PHPMyAdmin: `https://phpmyadmin.alwaysdata.com/`
- Host: `mysql-host.alwaysdata.net`
- Porta: `3306`
- Database: `imobiliaria_bortone`

**Tabelas Principais:**
```sql
-- Imóveis
imoveis
imagens_imovel
casas
terrenos

-- Usuários
usuarios

-- Agendamentos
agendamentos

-- Blog
blog_posts

-- FAQ
faqs

-- Chat
chat_messages
chat_rooms

-- Sistema
banner_index
publicidade
```

---

## 🔄 Fluxo de Dados

### 1. Upload de Imagem

```
┌──────────┐                ┌──────────┐                ┌──────────┐
│ Frontend │                │Cloudinary│                │ Backend  │
│ (Vercel) │                │          │                │ (Render) │
└────┬─────┘                └────┬─────┘                └────┬─────┘
     │                           │                           │
     │ 1. User selects file      │                           │
     │                           │                           │
     │ 2. Upload to Cloudinary   │                           │
     ├──────────────────────────►│                           │
     │                           │                           │
     │ 3. Return image URL       │                           │
     │◄──────────────────────────┤                           │
     │                           │                           │
     │ 4. Save URL + metadata                                │
     ├───────────────────────────────────────────────────────►│
     │                           │                           │
     │                           │                      5. Store in DB
     │                           │                           │
     │ 6. Success response       │                           │
     │◄───────────────────────────────────────────────────────┤
     │                           │                           │
```

**Detalhes:**
1. Usuário seleciona arquivo no frontend
2. Frontend faz upload direto para Cloudinary (sem passar pelo backend)
3. Cloudinary retorna URL da imagem
4. Frontend envia URL + metadados para o backend
5. Backend salva referência no banco de dados
6. Backend confirma sucesso

**Benefícios:**
- ✅ Reduz carga no backend (Render)
- ✅ Upload mais rápido (direto para CDN)
- ✅ Não depende de storage efêmero
- ✅ Imagens permanecem após deploys

---

### 2. Autenticação

```
┌──────────┐                                    ┌──────────┐
│ Frontend │                                    │ Backend  │
│ (Vercel) │                                    │ (Render) │
└────┬─────┘                                    └────┬─────┘
     │                                               │
     │ 1. POST /api/auth/login                       │
     │   { email, password }                         │
     ├──────────────────────────────────────────────►│
     │                                               │
     │                                          2. Validate
     │                                          3. Generate JWT
     │                                               │
     │ 4. { token, refreshToken, user }              │
     │◄──────────────────────────────────────────────┤
     │                                               │
     │ 5. Store in localStorage/cookies              │
     │                                               │
     │ 6. GET /api/imoveis                           │
     │   Authorization: Bearer {token}               │
     ├──────────────────────────────────────────────►│
     │                                               │
     │                                          7. Verify JWT
     │                                          8. Return data
     │                                               │
     │ 9. Response                                   │
     │◄──────────────────────────────────────────────┤
     │                                               │
```

---

### 3. Chat em Tempo Real

```
┌──────────┐                                    ┌──────────┐
│ Frontend │                                    │ Backend  │
│ (Vercel) │                                    │ (Render) │
└────┬─────┘                                    └────┬─────┘
     │                                               │
     │ 1. Connect WebSocket                          │
     │   wss://api.onrender.com                      │
     ├──────────────────────────────────────────────►│
     │                                               │
     │ 2. Connection established                     │
     │◄──────────────────────────────────────────────┤
     │                                               │
     │ 3. Emit 'message'                             │
     │   { room, text, user }                        │
     ├──────────────────────────────────────────────►│
     │                                               │
     │                                          4. Validate
     │                                          5. Save to DB
     │                                          6. Broadcast
     │                                               │
     │ 7. Receive 'message'                          │
     │   { id, room, text, user, timestamp }         │
     │◄──────────────────────────────────────────────┤
     │                                               │
```

---

## 🔐 Segurança

### Frontend (Vercel)

- ✅ HTTPS obrigatório
- ✅ CORS configurado
- ✅ Content Security Policy
- ✅ XSS protection
- ✅ Variáveis de ambiente públicas prefixadas com `NEXT_PUBLIC_`

### Backend (Render)

- ✅ HTTPS obrigatório
- ✅ Helmet.js para headers de segurança
- ✅ Rate limiting
- ✅ JWT para autenticação
- ✅ Bcrypt para senhas
- ✅ SQL injection protection (Sequelize ORM)
- ✅ Validação de entrada
- ✅ CORS restrito

### Banco de Dados

- ✅ Conexões SSL/TLS
- ✅ Usuários com privilégios limitados
- ✅ Backups automáticos
- ✅ Firewall configurado

### Cloudinary

- ✅ Upload preset seguro
- ✅ Transformações validadas
- ✅ Limite de tamanho de arquivo
- ✅ Moderação de conteúdo (opcional)

---

## 📊 Monitoramento

### Vercel

- Analytics integrado
- Web Vitals
- Log de builds
- Deploy previews

### Render

- Logs em tempo real
- Métricas de CPU/RAM
- Health checks
- Alertas de downtime

### Cloudinary

- Usage dashboard
- Bandwidth monitoring
- Storage limits
- Transformation credits

---

## 🚀 Deploy

### Frontend (Vercel)

**Automático via GitHub:**
```bash
git push origin main
# Vercel detecta e faz deploy automaticamente
```

**Manual via CLI:**
```bash
npm install -g vercel
cd front-end
vercel --prod
```

### Backend (Render)

**Automático via GitHub:**
```bash
git push origin main
# Render detecta e faz deploy automaticamente
```

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
npm start
```

---

## 🔧 Configuração Local

### 1. Clonar Repositório

```bash
git clone https://github.com/laboratorio-de-praticas-2025-2/Imobiliaria_Bortone.git
cd Imobiliaria_Bortone
```

### 2. Configurar Backend

```bash
cd back-end
npm install

# Criar .env
cp .env.example .env
# Editar .env com suas credenciais

npm run dev
```

### 3. Configurar Frontend

```bash
cd front-end
npm install

# Criar .env.local
cp .env.example .env.local
# Editar .env.local com suas credenciais

npm run dev
```

### 4. Acessar Aplicação

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000`

---

## 📦 Dependências Principais

### Frontend

```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "tailwindcss": "^3.0.0",
  "socket.io-client": "^4.0.0",
  "axios": "^1.0.0"
}
```

### Backend

```json
{
  "express": "^4.18.0",
  "sequelize": "^6.35.0",
  "mysql2": "^3.6.0",
  "socket.io": "^4.0.0",
  "jsonwebtoken": "^9.0.0",
  "bcrypt": "^5.1.0",
  "cloudinary": "^1.41.0"
}
```

---

## 🆘 Troubleshooting

### Erro: Imagens não carregam

**Causa:** URL do Cloudinary incorreta ou imagem não existe

**Solução:**
1. Verificar se a imagem existe no Cloudinary
2. Verificar formato da URL
3. Verificar variáveis de ambiente `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`

### Erro: API não responde

**Causa:** Backend (Render) dormindo ou fora do ar

**Solução:**
1. Render free tier dorme após 15min de inatividade
2. Primeira requisição pode demorar ~30s (cold start)
3. Considerar upgrade para plano pago para evitar sleep

### Erro: WebSocket desconecta

**Causa:** Timeout de conexão ou servidor reiniciando

**Solução:**
1. Implementar reconexão automática no frontend
2. Verificar logs do Render
3. Aumentar timeout de ping/pong

### Erro: Upload falha

**Causa:** Upload preset inválido ou credenciais incorretas

**Solução:**
1. Verificar upload preset no Cloudinary
2. Verificar variáveis de ambiente
3. Verificar limite de tamanho de arquivo

---

## 📚 Documentação Relacionada

- [Arquitetura Cloudinary](CloudinaryArchitecture.md)
- [Migração de Imagens](MIGRATION_SUMMARY.md)
- [API de Imagens](api/imagens.md)
- [Componentização Frontend](frontend/Componentizacao.md)
- [WebSocket Setup](WebSocket-Setup.md)

---

## ✅ Checklist de Deploy

### Antes do Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados migrado
- [ ] Cloudinary configurado
- [ ] Testes passando
- [ ] Build local funcionando

### Pós Deploy

- [ ] Health check do backend
- [ ] Frontend carregando corretamente
- [ ] Imagens carregando do Cloudinary
- [ ] WebSocket funcionando
- [ ] Autenticação funcionando
- [ ] Integração com Google Maps

---

**Última atualização:** Outubro 2025
