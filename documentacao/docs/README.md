# Documentação — Módulo: Publicidade

> **Escopo:** documentação *APENAS* do módulo Publicidade (CMS publicidades). Descreve arquitetura, endpoints (propostos), fluxos de dados, procedimentos de instalação, execução e testes.

---

## Sumário

1. [Visão Geral](#visão-geral)
2. [Estado Atual do Módulo](#estado-atual-do-módulo)
3. [Requisitos e Objetivos](#requisitos-e-objetivos)
4. [Arquitetura proposta](#arquitetura-proposta)
5. [Modelos de dados](#modelos-de-dados)
6. [Endpoints (API REST) — especificação](#endpoints-api---especificação)
7. [Fluxos de dados e sequência de operações](#fluxos-de-dados-e-sequência-de-operações)
8. [Integração com front-end atual](#integração-com-front-end-atual)
9. [Procedimentos de instalação e execução](#procedimentos-de-instalação-e-execução)
10. [Procedimentos de testes](#procedimentos-de-testes)

---

## Visão Geral

O módulo **Publicidade** é responsável por gerenciar anúncios que aparecem no front-end do produto (ex.: imagens de capa, título, corpo, link). Ele é exposto no painel de administração (CMS) para criação, edição, listagem e remoção de publicidades.

Esta documentação cobre:
- O estado atual (front-end com dados mockados).
- Uma API backend REST recomendada (endpoints, payloads, erros).
- Fluxos de dados (upload de imagem, publicação, listagem paginada).
- Como instalar, executar e testar (front-end mock + instruções para backend sugerido).

> Observação: o repositório contém componentes React/Next (front-end) com uma versão mock (arquivo `front-end/src/mock/publicidades.js`). Não há implementação de backend para persistência neste ZIP — a seção de endpoints abaixo é a especificação recomendada para implementação.

---

## Estado Atual do Módulo

Arquivos relevantes encontrados no repositório:

- `front-end/src/app/admin/cms-publicidades/page.js` — lista de publicidades no CMS (usa mock).
- `front-end/src/app/admin/cms-publicidades/criar/page.js` — formulário para criar uma publicidade (usa componentes de formulário e upload, mas atualmente usa mock/local state).
- `front-end/src/app/admin/cms-publicidades/editar/[id]/page.js` — formulário de edição.
- `front-end/src/mock/publicidades.js` — array mock de objetos de publicidade usado para desenvolvimento local.

Conclusão: o front-end está preparado para consumir uma API (componentes de formulário, upload, tabelas e paginação) mas hoje trabalha com dados em memória/mock. É necessário implementar o backend para gravação persistente e integração.

---

## Requisitos e Objetivos

### Requisitos mínimos
- CRUD completo para publicidades (Create, Read, Update, Delete).
- Upload seguro de imagens (armazenamento local para dev; S3/Storage para produção).
- Endpoints paginados e filtráveis (por status `ativo`, por `titulo`).
- Permissões/controle de acesso (endpoints protegidos por autenticação JWT).
- Validações de inputs (tamanho título, tipo/size imagem etc).

### Objetivos de manutenção
- Permitir que qualquer dev pegue o módulo e implemente a API seguindo esta especificação.
- Garantir fluxos de testes automatizados (unitários e integração).
- Documentar exemplos de requisições (cURL / Postman).

---

## Arquitetura proposta

Resumo de alto nível:

- **Front-end:** Next.js / React (já presente). Consome API REST.
- **Backend (sugerido):** Node.js + Express (ou NestJS) + Sequelize/TypeORM (ou Prisma) + PostgreSQL.
- **Armazenamento de arquivos:** Local (dev) => `uploads/`; Produção => S3 (ou serviço compatível).
- **Autenticação:** JWT com middleware de proteção para rotas administrativas.
- **Testes:** Jest para unit tests; Supertest para testes de integração das rotas; Postman/Insomnia para collection manual.

Diagrama simples (texto):

```
[Admin CMS - Next.js] <----> [API REST - Node/Express] <----> [Postgres]
                                   |
                                   +--> [Storage (S3 / uploads/)]
```

---

## Modelos de dados

### Publicidade (advertisement)

Campos sugeridos:

- `id` (integer, PK, autoincrement)
- `titulo` (string, 1..150)
- `conteudo` (text)
- `url_imagem` (string, URL pública/relative path)
- `url_destino` (string, opcional — link para onde o clique leva)
- `ativo` (boolean)
- `ordem` (integer, opcional — para ordenação manual)
- `tipo` (string, opcional — ex: `banner`, `card`, `popup`)
- `data_inicio` (datetime, opcional)
- `data_fim` (datetime, opcional)
- `created_at` (datetime)
- `updated_at` (datetime)

Exemplo JSON (response):

```json
{
  "id": 12,
  "titulo": "Apartamento Luxuoso no Centro",
  "conteudo": "Venha conhecer este incrível apartamento com vista panorâmica.",
  "url_imagem": "https://cdn.exemplo.com/publicidades/12-capa.jpg",
  "url_destino": "https://site.exemplo.com/imovel/123",
  "ativo": true,
  "ordem": 1,
  "tipo": "banner",
  "data_inicio": "2025-09-01T00:00:00Z",
  "data_fim": "2025-10-01T00:00:00Z",
  "created_at": "2025-09-01T10:00:00Z",
  "updated_at": "2025-09-02T18:00:00Z"
}
```

---

## Endpoints (API REST) — especificação

> Prefixo base: `/api/publicidades` (ajustável)

### Autenticação
Todos endpoints de administração devem requerer um header `Authorization: Bearer <token>` (JWT). Endpoints públicos de listagem podem ser públicos ou com throttle.

### 1) Listar publicidades (paginado)
- `GET /api/publicidades`
- Query params: `page` (int), `pageSize` (int), `ativo` (boolean), `q` (string de busca), `sort` (ex: `-created_at`)
- Response: `{ data: [..], total: number, page: number, pageSize: number }`

Exemplo cURL:
```bash
curl -X GET "https://api.exemplo.com/api/publicidades?page=1&pageSize=8&ativo=true" \
  -H "Authorization: Bearer $TOKEN"
```

### 2) Recuperar uma publicidade
- `GET /api/publicidades/:id`
- Response: `200` com o objeto publicidade.

### 3) Criar publicidade
- `POST /api/publicidades`
- Body: `multipart/form-data` quando há upload de imagem (campo `url_imagem` como arquivo) ou `application/json` quando `url_imagem` for uma URL.
- Campos obrigatórios: `titulo` (mínimo 1), `conteudo` (opcional), `ativo` (boolean)
- Validações: tamanho máximo imagem (ex: 2MB), tipos permitidos (jpg/jpeg/png/webp/svg)
- Response: `201` com o recurso criado.

Exemplo cURL (multipart):
```bash
curl -X POST "https://api.exemplo.com/api/publicidades" \
  -H "Authorization: Bearer $TOKEN" \
  -F "titulo=Casa com Piscina" \
  -F "conteudo=Casa espaçosa com piscina" \
  -F "url_imagem=@./capa.jpg" \
  -F "ativo=true"
```

### 4) Atualizar publicidade
- `PUT /api/publicidades/:id` ou `PATCH /api/publicidades/:id`
- Permite atualizar campos e trocar imagem (multipart se necessário)
- Response: `200` com o recurso atualizado.

### 5) Deletar publicidade
- `DELETE /api/publicidades/:id`
- Response: `204 No Content` ou `200` com `{ deleted: true }`.

### 6) Upload separado (opcional)
- `POST /api/publicidades/upload` — endpoint de upload que retorna `{ url: <public_url> }`.
- Útil quando o front-end envia a imagem primeiro, recebe URL e depois cria o recurso com `url_imagem` apontando para a URL retornada.

### Respostas de erro padronizadas
- `400` — Bad Request (validação)
- `401` — Unauthorized
- `403` — Forbidden
- `404` — Not Found
- `500` — Internal Server Error

Formato de erro exemplo:
```json
{ "error": "ValidationError", "message": "O campo titulo é obrigatório" }
```

---

## Fluxos de dados e sequência de operações

### Fluxo: Criar publicidade com upload (recomendado)

1. Admin no front-end abre tela "Criar".
2. Usuario preenche `titulo`, `conteudo`, escolhe imagem.
3. O front-end chama `POST /api/publicidades/upload` com `multipart/form-data` (campo `file`).
4. API retorna `{ url: "https://storage/.../capa.jpg" }`.
5. Front-end então chama `POST /api/publicidades` com `application/json` contendo `titulo`, `conteudo`, `url_imagem` (com a URL recebida) e `ativo`.
6. Backend salva registro no banco e responde `201` com o objeto.
7. Front-end redireciona para lista e atualiza o mock/local state.

Alternativa (upload on-create): criar diretamente com `multipart/form-data` para o endpoint `POST /api/publicidades` que aceita arquivo.

### Fluxo: Listagem para o site público

1. Front-end público (site) faz `GET /api/publicidades?ativo=true&page=1&pageSize=8` (possivelmente caching via CDN)
2. Backend retorna lista paginada. Front-end renderiza banners/cards conforme `tipo` e `url_imagem`.

---

## Integração com front-end atual

Atualmente o front-end importa o array `publicidadesMock` de `front-end/src/mock/publicidades.js`.

### Passos para substituir mock pela API

1. Criar serviço HTTP no front-end `front-end/src/services/publicidadesService.js` (ou usar `fetch`/`axios`) com métodos:
   - `listPublicidades({page,pageSize,ativo,q})`
   - `getPublicidade(id)`
   - `createPublicidade(formDataOrJson)`
   - `updatePublicidade(id, payload)`
   - `deletePublicidade(id)`
   - `uploadImagem(file)` (se endpoint separado)

2. Atualizar os componentes em `front-end/src/app/admin/cms-publicidades/*` para chamar esse serviço em vez de usar `publicidadesMock`.

3. Para o ambiente de desenvolvimento rápido, preservar o mock quando `process.env.USE_MOCKS === 'true'`.

Exemplo simples de uma função `listPublicidades` com fetch:

```js
export async function listPublicidades({page=1,pageSize=8,ativo} = {}){
  const params = new URLSearchParams({ page, pageSize });
  if (ativo !== undefined) params.set('ativo', ativo);
  const res = await fetch(`/api/publicidades?${params.toString()}`);
  if (!res.ok) throw new Error('Falha ao buscar publicidades');
  return res.json();
}
```

---

## Procedimentos de instalação e execução

Abaixo há dois fluxos: (A) executar apenas o front-end em modo dev com mocks; (B) executar backend sugerido (Node/Express) localmente + front-end integrando com ele.

### A) Front-end (modo dev com mocks)

**Requisitos:** Node.js 18+, npm ou yarn.

1. `cd front-end`
2. `npm install` (ou `yarn`)
3. Configurar `.env.local` se necessário (ex.: `NEXT_PUBLIC_USE_MOCKS=true`)
4. `npm run dev` (ou `yarn dev`)
5. Acesse `http://localhost:3000` para o site e `http://localhost:3000/admin/...` para o CMS.

> Observação: o repositório já contém os arquivos de páginas admin que usam o mock (`front-end/src/mock/publicidades.js`).

### B) Backend sugerido (Node + Express) — exemplo rápido

**Requisitos:** Node.js 18+, npm/yarn, PostgreSQL local.

1. Criar um novo diretório `backend-publicidade/` (pode ser parte do monorepo).
2. `npm init -y`
3. Instalar dependências sugeridas:
   - `npm i express multer jsonwebtoken bcryptjs cors helmet pg sequelize` (ou `prisma` + `@prisma/client`)
   - `npm i -D jest supertest nodemon sequelize-cli` (dep. dev)
4. Estrutura mínima:
```
backend-publicidade/
  |- src/
     |- index.js
     |- routes/publicidades.js
     |- controllers/publicidadesController.js
     |- models/publicidade.js
     |- middlwares/auth.js
     |- services/storageService.js
  |- uploads/   # dev
  |- .env
```
5. Configurar `.env` (ex):
```
PORT=4000
DATABASE_URL=postgres://user:pass@localhost:5432/db
JWT_SECRET=uma_chave_segura
UPLOAD_DIR=./uploads
```
6. Com tudo pronto: `npm run dev` (rodar com nodemon)
7. Ajustar front-end para `NEXT_PUBLIC_API_URL=http://localhost:4000` e usar o serviço.

---

## Procedimentos de testes

# 🧪 Testes Mockados - Publicidade
 
## 🚩 Passo a passo para rodar os testes
 
> ⚠️ **Atenção:** verifique se você está na branch correta antes de rodar os testes.
 
---
 
### 1️⃣ Instalar dependências
Na branch **`feature/publicidade`**, execute:
 
```bash
npm install
npm install --save-dev jest supertest cross-env
```
 
---
 
### 2️⃣ Ajustar o `package.json`
Certifique-se de que seu `package.json` no **backend** esteja assim:
 
```json
{
  "name": "imobiliaria_bortone",
  "version": "1.0.0",
  "type": "module",
  "description": "Estrutura do projeto...",
  "main": "index.js",
  "directories": {
    "doc": "docs"
  },
  "scripts": {
    "test": "cross-env NODE_OPTIONS=--experimental-vm-modules jest --watchAll=false",
    "dev": "nodemon src/app.js"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/laboratorio-de-praticas-2025-2/Imobiliaria_Bortone.git"
  },
  "license": "ISC",
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^17.2.1",
    "express": "^5.1.0",
    "mysql2": "^3.15.0",
    "nodemon": "^3.1.10",
    "sequelize": "^6.37.7"
  },
  "devDependencies": {
    "cross-env": "^10.0.0",
    "jest": "^30.1.3",
    "supertest": "^7.1.4"
  }
}
```
 
---
 
### 3️⃣ Criar configuração do Jest
Na raiz do **backend**, crie o arquivo **`jest.config.js`**:
 
```js
export default {
  testEnvironment: "node",
  transform: {}
};
```
 
---
 
### 4️⃣ Ajustar o `publicidadeController.js`
O controller foi atualizado para validações e integração com o service mockado.  
👉 Ver código atualizado na pasta `controllers/publicidadeController.js`.
 
---
 
### 5️⃣ Ajustar o `publicidade.test.js`
O arquivo de testes foi configurado para mockar o **service de Publicidade**.  
👉 Ver código atualizado na pasta `tests/publicidade.test.js`.
 
---
 
### 6️⃣ Executar os testes
Com todas as alterações feitas, rode:
 
```bash
npm test
```
 
---
 
### 7️⃣ Resultado esperado
Se tudo estiver configurado corretamente, você verá os testes rodando com sucesso ✅.  
 
Exemplo de saída:
 
```
PASS  src/tests/publicidade.test.js
  Testando rotas de Publicidade com service mockado
    ✓ GET /api/publicidade deve retornar lista de publicidades
    ✓ GET /api/publicidade/:id deve retornar uma publicidade
    ✓ POST /api/publicidade deve criar uma publicidade
    ✓ PUT /api/publicidade/:id deve atualizar uma publicidade
    ✓ DELETE /api/publicidade/:id deve excluir uma publicidade
```

---

*Fim da documentação do módulo Publicidade.*

