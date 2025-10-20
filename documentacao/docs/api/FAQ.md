# Documentação FAQ - Sistema Imobiliário Bortone

## Visão Geral

Sistema de Perguntas Frequentes (FAQ) integrado ao projeto imobiliário, permitindo gerenciamento e consulta de dúvidas comuns dos usuários.

---

## API Endpoints

### GET /api/faq

**Descrição:** Lista todas as perguntas frequentes com filtros opcionais.

**Método:** `GET`

**URL:** `/api/faq`

**Parâmetros:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `categoria` | query | Não | Filtrar por categoria (ex: "vendas", "locacao", "financiamento") |
| `busca` | query | Não | Buscar por palavra-chave na pergunta ou resposta |
| `pagina` | query | Não | Número da página para paginação |
| `limite` | query | Não | Número de itens por página (padrão: 10) |

**Exemplo de Requisição:**

```javascript
GET /api/faq?categoria=vendas&busca=documentos&pagina=1&limite=5
```

**Exemplo de Resposta (200):**

```json
{
  "total": 25,
  "pagina": 1,
  "limite": 5,
  "itens": [
    {
      "id": 1,
      "pergunta": "Quais documentos são necessários para compra?",
      "resposta": "Para comprar um imóvel você precisa de: RG, CPF, comprovante de renda...",
      "categoria": "vendas",
      "dataCriacao": "2024-01-15T10:30:00Z",
      "ativo": true
    }
  ]
}
```

**Códigos de Status:** 200, 400, 500

**Autenticação:** Não requer

---

### GET /api/faq/:id

**Descrição:** Busca uma pergunta específica por ID.

**Método:** `GET`

**URL:** `/api/faq/:id`

**Parâmetros:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `id` | path | Sim | ID da pergunta |

**Exemplo de Requisição:**

```javascript
GET /api/faq/1
```

**Exemplo de Resposta (200):**

```json
{
  "id": 1,
  "pergunta": "Quais documentos são necessários para compra?",
  "resposta": "Para comprar um imóvel você precisa de: RG, CPF, comprovante de renda, comprovante de estado civil...",
  "categoria": "vendas",
  "dataCriacao": "2024-01-15T10:30:00Z",
  "ativo": true
}
```

**Códigos de Status:** 200, 404, 500

**Autenticação:** Não requer

---

### POST /api/faq

**Descrição:** Cria uma nova pergunta frequente.

**Método:** `POST`

**URL:** `/api/faq`

**Body (JSON):**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `pergunta` | string | Sim | Texto da pergunta |
| `resposta` | string | Sim | Texto da resposta |
| `categoria` | string | Sim | Categoria da pergunta |

**Exemplo de Requisição:**

```javascript
POST /api/faq
Content-Type: application/json

{
  "pergunta": "Como funciona o financiamento imobiliário?",
  "resposta": "O financiamento imobiliário é um empréstimo específico...",
  "categoria": "financiamento"
}
```

**Exemplo de Resposta (201):**

```json
{
  "id": 15,
  "pergunta": "Como funciona o financiamento imobiliário?",
  "resposta": "O financiamento imobiliário é um empréstimo específico...",
  "categoria": "financiamento",
  "dataCriacao": "2024-09-13T14:25:00Z",
  "ativo": true
}
```

**Códigos de Status:** 201, 400, 500

**Autenticação:** Requer token de administrador

---

### PUT /api/faq/:id

**Descrição:** Atualiza uma pergunta existente.

**Método:** `PUT`

**URL:** `/api/faq/:id`

**Parâmetros:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `id` | path | Sim | ID da pergunta |

**Body (JSON):**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `pergunta` | string | Não | Nova pergunta |
| `resposta` | string | Não | Nova resposta |
| `categoria` | string | Não | Nova categoria |
| `ativo` | boolean | Não | Status ativo/inativo |

**Exemplo de Requisição:**

```javascript
PUT /api/faq/1
Content-Type: application/json

{
  "resposta": "Resposta atualizada com mais detalhes...",
  "ativo": true
}
```

**Códigos de Status:** 200, 400, 404, 500

**Autenticação:** Requer token de administrador

---

### DELETE /api/faq/:id

**Descrição:** Remove uma pergunta frequente.

**Método:** `DELETE`

**URL:** `/api/faq/:id`

**Parâmetros:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `id` | path | Sim | ID da pergunta |

**Códigos de Status:** 204, 404, 500

**Autenticação:** Requer token de administrador

---

## Middleware de Validação

### Validação de Pergunta

**Localização:** `back-end/src/middleware/faq-validation.js`

**Regras:**

- ✅ Campo obrigatório para criação/atualização
- ✅ Mínimo de 10 caracteres
- ✅ Máximo de 500 caracteres
- ✅ Não pode conter apenas espaços em branco

### Validação de Resposta

**Regras:**

- ✅ Campo obrigatório para criação/atualização
- ✅ Mínimo de 20 caracteres
- ✅ Máximo de 2000 caracteres
- ✅ Não pode conter apenas espaços em branco

### Validação de Categoria

**Categorias permitidas:**

- `vendas`
- `locacao` 
- `financiamento`
- `documentacao`
- `visitas`
- `geral`

---

## Tratamento de Erros

### Erro 400 - Bad Request

**Retornado quando:**

- Dados de entrada inválidos
- Campos obrigatórios ausentes
- Formato de dados incorreto

**Exemplo de Resposta:**

```json
{
  "erro": "Dados inválidos",
  "detalhes": [
    "Campo 'pergunta' é obrigatório",
    "Campo 'categoria' deve ser um dos valores permitidos"
  ]
}
```

### Erro 404 - Not Found

**Retornado quando:**

- Pergunta não encontrada pelo ID
- Rota não existente

**Exemplo de Resposta:**

```json
{
  "erro": "Pergunta não encontrada",
  "detalhes": "Não foi possível encontrar uma pergunta com o ID fornecido"
}
```

### Erro 500 - Internal Server Error

**Retornado quando:**

- Erro interno do servidor
- Falha na conexão com banco de dados
- Erro não tratado

**Exemplo de Resposta:**

```json
{
  "erro": "Erro interno do servidor",
  "detalhes": "Ocorreu um erro inesperado. Tente novamente mais tarde."
}
```

---

## Guia de Uso - Frontend

### Como Acessar a Aba FAQ

#### 1. Navegação Principal

- Acesse o menu principal do site
- Clique em "Ajuda" ou "FAQ"
- Você será redirecionado para `/faq`

#### 2. Link Direto

- Use a URL direta do frontend (Vercel): `https://seu-dominio.vercel.app/faq`

### Como Fazer uma Pergunta

#### Para Usuários Comuns:

**1. Buscar Pergunta Existente**

- Use a barra de busca no topo da página
- Digite palavras-chave relacionadas à sua dúvida
- Verifique se sua pergunta já foi respondida

**2. Solicitar Nova Pergunta**

- Se não encontrar resposta, clique em "Enviar Pergunta"
- Preencha o formulário de contato
- Sua pergunta será analisada e pode ser adicionada ao FAQ

#### Para Administradores:

**1. Acesso ao Painel**

- Faça login como administrador
- Acesse `/admin/faq`

**2. Criar Pergunta**

- Clique em "Nova Pergunta"
- Preencha os campos obrigatórios
- Selecione a categoria apropriada
- Salve a pergunta

---

## Estrutura de Arquivos

```
back-end/src/
├── routes/
│   └── faq.js              # Rotas do FAQ
├── middleware/
│   └── faq-validation.js   # Validações
├── controllers/
│   └── faq-controller.js   # Lógica de negócio
└── models/
    └── faq-model.js        # Modelo de dados

front-end/src/
├── pages/
│   └── FAQ.js              # Página principal do FAQ
├── components/
│   ├── FaqItem.js          # Item individual de FAQ
│   ├── FaqSearch.js        # Componente de busca
│   └── FaqCategories.js    # Filtro de categorias
└── services/
    └── faq-service.js      # Serviços de API
```

---

## Notas Adicionais

!!! info "Informação"
    O sistema de FAQ é projetado para ser facilmente expansível. Novas categorias podem ser adicionadas conforme necessário.

!!! warning "Atenção"
    Apenas administradores podem criar, editar ou remover perguntas do FAQ. Usuários comuns têm acesso apenas de leitura.

!!! tip "Dica"
    Use a busca por palavras-chave para encontrar respostas mais rapidamente. O sistema busca tanto nas perguntas quanto nas respostas.
