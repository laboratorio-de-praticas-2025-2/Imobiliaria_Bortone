#  Funcionalidade de Agendamento de Visitação

## Descrição
Este módulo gerencia o ciclo completo das **solicitações de visita a imóveis**: registra e persiste os pedidos, envia e-mails de confirmação aos clientes e notifica a imobiliária sobre novos agendamentos. É implementado em **Express.js** e integra serviços **SMTP** para o envio transacional de mensagens.

**Escopo deste documento**: cobre apenas o módulo de Agendamentos (API, modelo, validações, segurança, rotas e integração por e-mail).

---

## Sumário

- [1) Objetivo](#1-objetivo)
  - [O que este módulo entrega](#o-que-este-módulo-entrega)
  - [Principais artefatos](#principais-artefatos)
- [2) Segurança & Boas Práticas implementadas](#2-segurança--boas-práticas-implementadas)
- [3) Modelo de Dados (Agendamento)](#3-modelo-de-dados-agendamento)
- [4) Rotas HTTP](#4-rotas-http)
  - [4.1) Integração pública (sem login)](#41-integração-pública-sem-login)
  - [4.2) CRUD autenticado](#42-crud-autenticado)
- [5) Regras de Validação (resumo prático)](#5-regras-de-validação-resumo-prático)
- [6) Variáveis de Ambiente (integração de e-mail)](#6-variáveis-de-ambiente-integração-de-email)
- [7) Fluxos Principais](#7-fluxos-principais)
  - [7.1) Solicitação de Agendamento (pública)](#71-solicitação-de-agendamento-pública)
  - [7.2) Gestão via Dashboard (autenticado)](#72-gestão-via-dashboard-autenticado)
- [8) Exemplos de Requisições (cURL)](#8-exemplos-de-requisições-curl)
- [9) Convenções de Resposta & Erros](#9-convenções-de-resposta--erros)
- [10) Especificação OpenAPI (YAML)](#10-especificação-openapi-yaml)

---

## 1) Objetivo

Estabelecer, de ponta a ponta, o fluxo de solicitações de visita a imóveis incluindo: 
- (a) registro e persistência no banco de dados
- (b) comunicação transacional por e‑mail com o cliente e com a imobiliária
- (c) operações de gestão (CRUD) sob políticas de segurança e controle de acesso.

---

### O que este módulo entrega

- **Registro de agendamentos** e armazenamento em `agendamentos`.
- **Confirmações por e‑mail** para o cliente e **notificação** para a imobiliária.
- **CRUD autenticado** para acompanhamento e conclusão de agendamentos.
- **Envio de notificações de novos imóveis** (suporte ao funil de agendamento).

### Principais artefatos

- **Controller**: `src/controllers/agendamentoController.js`
- **Controller CRUD**: `src/controllers/agendamentoCrudController.js`
- **Service**: `src/services/agendamentoService.js`
- **Model**: `src/models/Agendamento.js`
- **Routes**: `src/routes/agendamentoRoute.js`

---
## 2) Segurança & Boas Práticas implementadas

- **Rate limiting** por IP/rota: até **5 requisições/minuto** (resposta **429** em excesso).
- **Headers de segurança** nas rotas de agendamento:
    - `X-Content-Type-Options: nosniff`
    - `X-Frame-Options: DENY`
    - `X-XSS-Protection: 1; mode=block`
    - `Referrer-Policy: strict-origin-when-cross-origin`
    - `Content-Security-Policy: default-src 'self'`
- **Limite de payload**: JSON até **10MB**; validação adicional no *buffer*.
- **Enforcement de Content-Type**: `POST` deve ser `application/json`.
- **Sanitização** e **validações robustas** de entrada para:
    - Dados de **agendamento** (nome, e‑mail, telefone, imóvel, período etc.).
    - Dados de **e‑mail/attachments** (tamanho, tipo, base64, subject etc.).
- **RBAC** (via `Auth.Authorization`):
    - **Admin (nivel = 0)**: pode listar todos, concluir agendamentos e excluir qualquer um.
    - **Usuário**: CRUD **apenas** dos **seus** agendamentos.

---

## 3) Modelo de Dados (`Agendamento`)

Tabela: **`agendamentos`**

| Campo | Tipo | Obrigatório | Padrão | Descrição |
| --- | --- | --- | --- | --- |
| `id` | INT(11) PK AI | Sim | — | Identificador do agendamento |
| `id_usuario` | INT(11) | Sim | — | FK para usuário criador |
| `data_marcada` | DATETIME | Sim | — | Data/hora marcada para a visita |
| `data_create` | DATETIME | Sim | `NOW()` | Data/hora de criação do registro |
| `id_imovel` | INT(11) | Não | `NULL` | FK opcional para imóvel |
| `mensagem` | TEXT | Não | `NULL` | Observações do cliente |
| `concluido` | TINYINT(1) | Sim | `0` | 0 = pendente; 1 = concluído |

**Associações esperadas** (via Sequelize, definidas no projeto):

- `Agendamento.belongsTo(Usuario, { as: 'usuario', foreignKey: 'id_usuario' })`
- `Agendamento.belongsTo(Imovel, { as: 'imovel', foreignKey: 'id_imovel' })`

---

## 4) Rotas HTTP

Prefixo: **`/agendamentos`**

### 4.1) Integração pública (sem login)

- `POST /agendamentos/schedule`
    
    **Função:** cria (server‑side) um registro de agendamento e envia e‑mails de confirmação (cliente + imobiliária).
    
    **Rate limit:** 5/min por IP.
    
    **Validações:** `name`, `email`, `visitPeriod` obrigatórios; e‑mail válido; limites de tamanho.
    

**Body (exemplo)**

```json
{
  "appointment": {
    "name": "Maria Silva",
    "email": "maria@example.com",
    "phone": "+55 11 99999-0000",
    "propertyAddress": "Rua das Flores, 123 — Centro",
    "propertyId": 42,
    "notes": "Prefiro sábado de manhã.",
    "visitPeriod": "Manhã",
    "date": "2025-10-20",
    "time": "09:30"
  }
}

```

**Responses**

- **200** `application/json` (salvo + e‑mail):

```json
{
  "success": true,
  "message": "Agendamento confirmado, salvo no banco e e-mail enviado com sucesso",
  "data": {
    "agendamento": { "id": 101, "data_marcada": "2025-10-20T09:30:00.000Z", "id_imovel": 42 },
    "email": { "ok": true, "message": "Enviado" }
  }
}

```

- **200** (salvo, mas e‑mail falhou): `"Agendamento salvo com sucesso (email não enviado)"`
- **400** (validação) / **429** (rate limit) / **500** (erro interno)

> Observação: Caso date/time não venham, o sistema define data_marcada = agora + 7 dias.
> 
- `POST /agendamentos/property-notification`
    
    **Função:** envia e‑mail de marketing/alerta de **novo imóvel** (útil no fluxo pós‑agendamento).
    
    **Validações:** `host`, `from`, `to`, e `propertyData.title` obrigatórios; sanitização HTML.
    

**Body (exemplo)**

```json
{
  "host": "smtp.mailtrap.io",
  "from": "no-reply@imobiliaria-bortone.com.br",
  "to": "cliente@example.com",
  "propertyData": {
    "title": "Apto 2D — Centro",
    "address": "Av. Brasil, 500",
    "price": "R$ 420.000",
    "description": "Andar alto, 1 vaga, 68 m²",
    "contactPhone": "+55 11 3333-0000"
  }
}

```

**Resposta 200**: `{ "success": true, "message": "Notificação de imóvel enviada com sucesso" }`

> Utilitário DEV: POST /agendamentos/send — envio de e‑mail genérico (exposto apenas quando NODE_ENV !== 'production').
> 

### 4.2) CRUD autenticado

> Requer Auth.Authorization com req.loggedUser populado e nivel conforme regras.
> 
- `POST /agendamentos/`
    
    **Cria agendamento** do usuário autenticado.
    
    **Body**: `{ "data_marcada": ISODateString, "id_imovel": number?, "mensagem": string? }`
    
- `GET /agendamentos/me`
    
    **Lista paginada** dos agendamentos **do usuário**.
    
    **Query**: `page` (padrão 1), `limit` (padrão 20). Ordena por `data_marcada` ASC.
    
    **Inclui** dados de `usuario` e (se houver) `imovel`.
    
- `GET /agendamentos/`
    
    **Admin only**. Lista **todos** os agendamentos (paginado). Ordena por `data_create` DESC.
    
- `GET /agendamentos/:id`
    
    Retorna **um** agendamento. Se **não** admin, precisa ser **dono**.
    
- `PATCH /agendamentos/:id`
    
    Atualiza `mensagem`/`data_marcada` (dono ou admin). Atualizar `concluido` é **somente admin**.
    
- `DELETE /agendamentos/:id`
    
    Remove agendamento (dono ou admin). Resposta **204** sem corpo.
    

**Erros padrão CRUD**: `401` (não autenticado), `403` (acesso negado), `404` (não encontrado), `500` (erro interno).

---

## 5) Regras de Validação (resumo prático)

### 5.1) Agendamento (entrada pública)

- **Obrigatórios**: `name` (≤120), `email` (RFC+domínio válido, ≤254), `visitPeriod` (≤100)
- **Opcionais** com limites: `phone` (≤20), `propertyAddress` (≤200), `notes` (≤2000), `propertyId` (numérico)
- Fallback `data_marcada`: **agora + 7 dias** quando `date/time` ausentes

### 5.2) E‑mail (quando usado diretamente)

- `subject ≤ 200`, `text ≤ 10000`, `html ≤ 20000`
- **Anexos** (se existirem):
    - Tipos permitidos (ex.: `image/*`, `pdf`, `docx`, `xlsx`, ...)
    - `filename ≤ 255`, base64 válido, tamanho ≤ **10MB**

---

## 6) Variáveis de Ambiente (integração de e‑mail)

> Para SMTP detalhado [Veja documentação Agendamento SMTP](./AgendamentoSMTP.md)
> 

| Variável | Exemplo/Tipo | Obrigatório | Uso |
| --- | --- | --- | --- |
| `SMTP_HOST` | `smtp.mailtrap.io` | **Sim** | Host SMTP para envio |
| `SMTP_PORT` | `587` | Não | Porta (padrão 587) |
| `SMTP_SECURE` | `true/false` | Não | TLS direto |
| `SMTP_USER` | `string` | Não* | Se o servidor exigir AUTH |
| `SMTP_PASS` | `string` | Não* | Se o servidor exigir AUTH |
| `SMTP_HELO` | `localhost` | Não | Identificação EHLO/HELO |
| `MAIL_FROM_EMPRESA` | `no-reply@bortone...` | **Sim** | Remetente dos e‑mails do módulo |
| `MAIL_TO_EMPRESA` | `agendamentos@...` | Não | Destinatário interno padrão |
| `DASH_IMOB_URL` | `https://imobiliaria-bortone.vercel.app` | Não | Base URL para CTAs (imóvel/agendamento) |
- **AUTH** só é tentado quando `SMTP_USER/SMTP_PASS` estão definidos **e** o servidor anuncia `AUTH PLAIN/LOGIN`.

---

## 7) Fluxos Principais

### 7.1) Solicitação de Agendamento (pública)

1. **Cliente** envia `POST /agendamentos/schedule` com `appointment` válido.
2. Passa por **rate limiting**, **validações** e criação/atualização de **Usuário** (por e‑mail).
3. Cria **Agendamento** (com `data_marcada` a partir de `date/time` ou **+7 dias**).
4. Dispara **2 e‑mails**:
    - Cliente: confirmação + link do **imóvel** (CTA)
    - Imobiliária: resumo + CTA para **página do imóvel** (link transformado)
5. Retorna **200** com dados mínimos do agendamento criado.

### 7.2) Gestão via Dashboard (autenticado)

- Usuário acompanha seus agendamentos em `/agendamentos/me` (paginado).
- Admin gerencia tudo em `/agendamentos` (paginado), pode **concluir** ou **excluir**.

---

## 8) Exemplos de Requisições (cURL)

**Agendar (público)**

```bash
curl -X POST https://api.seudominio.com/agendamentos/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "appointment": {
      "name": "Maria Silva",
      "email": "maria@example.com",
      "visitPeriod": "Manhã",
      "propertyId": 42,
      "date": "2025-10-20",
      "time": "09:30"
    }
  }'

```

**Listar (me, autenticado)**

```bash
curl -H "Authorization: Bearer <TOKEN>" \
  "https://api.seudominio.com/agendamentos/me?page=1&limit=20"

```

**Concluir (admin)**

```bash
curl -X PATCH https://api.seudominio.com/agendamentos/101 \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{ "concluido": true }'

```

---

## 9) Convenções de Resposta & Erros

- **200/201**: sucesso com corpo JSON
- **204**: sucesso sem corpo (delete)
- **400**: erro de validação/entrada
- **401**: não autenticado
- **403**: acesso negado (RBAC/dono)
- **404**: recurso não encontrado
- **429**: rate limit
- **500**: erro interno (logs no servidor)


---

## 10) Especificação OpenAPI (YAML)

**Obs.:** Inclui apenas endpoints do **módulo de agendamento**.

```yaml
openapi: 3.0.3
info:
  title: Imobiliária Bortone — Agendamentos API
  version: 1.0.0
servers:
  - url: https://api.seudominio.com
paths:
  /agendamentos/schedule:
    post:
      summary: Recebe solicitação de agendamento e envia confirmações por e-mail
      tags: [Agendamentos]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                appointment:
                  type: object
                  required: [name, email, visitPeriod]
                  properties:
                    name: { type: string, maxLength: 120 }
                    email: { type: string, format: email, maxLength: 254 }
                    phone: { type: string, maxLength: 20 }
                    propertyAddress: { type: string, maxLength: 200 }
                    propertyId: { type: integer }
                    notes: { type: string, maxLength: 2000 }
                    visitPeriod: { type: string, maxLength: 100 }
                    date: { type: string, format: date }
                    time: { type: string, example: "09:30" }
      responses:
        '200':
          description: Agendamento salvo (e e-mail enviado se possível)
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  message: { type: string }
                  data:
                    type: object
                    properties:
                      agendamento:
                        type: object
                        properties:
                          id: { type: integer }
                          data_marcada: { type: string, format: date-time }
                          id_imovel: { type: integer, nullable: true }
                      email:
                        type: object
                        nullable: true
                        properties:
                          ok: { type: boolean }
                          message: { type: string }
        '400': { description: Erro de validação }
        '429': { description: Limite de requisições excedido }
        '500': { description: Erro interno }

  /agendamentos/property-notification:
    post:
      summary: Envia e-mail de notificação de novo imóvel
      tags: [Agendamentos]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [host, from, to, propertyData]
              properties:
                host: { type: string }
                port: { type: integer, minimum: 1, maximum: 65535 }
                secure: { type: boolean }
                user: { type: string }
                pass: { type: string }
                helo: { type: string }
                from: { type: string, format: email }
                to: { type: string, format: email }
                propertyData:
                  type: object
                  required: [title]
                  properties:
                    title: { type: string, maxLength: 200 }
                    address: { type: string, maxLength: 200 }
                    price: { type: string }
                    description: { type: string, maxLength: 2000 }
                    contactPhone: { type: string, maxLength: 20 }
      responses:
        '200': { description: Notificação enviada }
        '400': { description: Erro de validação }
        '500': { description: Erro interno }

  /agendamentos:
    get:
      summary: Lista todos os agendamentos (admin)
      security: [{ bearerAuth: [] }]
      tags: [Agendamentos CRUD]
      parameters:
        - in: query
          name: page
          schema: { type: integer, minimum: 1, default: 1 }
        - in: query
          name: limit
          schema: { type: integer, minimum: 1, maximum: 100, default: 50 }
      responses:
        '200': { description: OK }
        '401': { description: Não autenticado }
        '403': { description: Acesso negado }

    post:
      summary: Cria agendamento do usuário autenticado
      security: [{ bearerAuth: [] }]
      tags: [Agendamentos CRUD]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [data_marcada]
              properties:
                data_marcada: { type: string, format: date-time }
                id_imovel: { type: integer, nullable: true }
                mensagem: { type: string, nullable: true }
      responses:
        '201': { description: Criado }
        '401': { description: Não autenticado }
        '500': { description: Erro interno }

  /agendamentos/me:
    get:
      summary: Lista agendamentos do usuário autenticado
      security: [{ bearerAuth: [] }]
      tags: [Agendamentos CRUD]
      parameters:
        - in: query
          name: page
          schema: { type: integer, minimum: 1, default: 1 }
        - in: query
          name: limit
          schema: { type: integer, minimum: 1, maximum: 100, default: 20 }
      responses:
        '200': { description: OK }
        '401': { description: Não autenticado }

  /agendamentos/{id}:
    get:
      summary: Busca agendamento por ID
      security: [{ bearerAuth: [] }]
      tags: [Agendamentos CRUD]
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: integer }
      responses:
        '200': { description: OK }
        '401': { description: Não autenticado }
        '403': { description: Acesso negado }
        '404': { description: Não encontrado }

    patch:
      summary: Atualiza campos do agendamento
      security: [{ bearerAuth: [] }]
      tags: [Agendamentos CRUD]
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: integer }
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                concluido: { type: boolean, description: "Somente admin" }
                data_marcada: { type: string, format: date-time }
                mensagem: { type: string }
      responses:
        '200': { description: OK }
        '401': { description: Não autenticado }
        '403': { description: Acesso negado }
        '404': { description: Não encontrado }

    delete:
      summary: Remove agendamento
      security: [{ bearerAuth: [] }]
      tags: [Agendamentos CRUD]
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: integer }
      responses:
        '204': { description: Removido }
        '401': { description: Não autenticado }
        '403': { description: Acesso negado }
        '404': { description: Não encontrado }

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

```