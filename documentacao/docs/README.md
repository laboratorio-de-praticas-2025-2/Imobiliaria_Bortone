# Documentação Blog - Sistema Imobiliária Bortone

## Visão Geral
O Blog é o espaço do nosso sistema imobiliário para compartilhar artigos, dicas, notícias e novidades do mercado. Ele foi pensado para ser fácil de gerenciar pelo time administrativo e simples de navegar para quem busca informação de qualidade sobre imóveis.

---

## API Endpoints

### **GET /api/blog/posts**
- **O que faz:** Retorna uma lista de posts do blog, podendo filtrar por categoria, tag, busca, página e limite de itens.
- **Método:** `GET`
- **URL:** `/api/blog/posts`

**Filtros opcionais:**
- `categoria`: filtra por categoria (ex: "mercado", "dicas", "noticias")
- `tag`: filtra por tag (ex: "financiamento", "aluguel", "venda")
- `busca`: busca por palavra-chave no título ou conteúdo
- `pagina`: número da página para paginação
- `limite`: quantos itens por página (padrão: 10)

**Exemplo de uso:**
```bash
GET /api/blog/posts?categoria=mercado&tag=financiamento&busca=taxa&pagina=1&limite=5
```

**Resposta de exemplo:**
```json
{
  "total": 25,
  "pagina": 1,
  "limite": 5,
  "itens": [
    {
      "id": 1,
      "titulo": "Como as taxas de juros afetam o mercado imobiliário?",
      "conteudo": "As taxas de juros são um fator crucial...",
      "resumo": "Análise do impacto das taxas de juros no mercado de imóveis",
      "categoria": "mercado",
      "tags": ["financiamento", "juros"],
      "autor": "João Silva",
      "dataPublicacao": "2024-01-15T10:30:00Z",
      "ativo": true
    }
  ]
}
```

**Status:** `200`, `400`, `500`
**Autenticação:** não precisa

---

### **GET /api/blog/posts/:id**
- **O que faz:** Busca um post específico pelo ID.
- **Método:** `GET`
- **URL:** `/api/blog/posts/:id`

**Parâmetros:**
- `id` (obrigatório): ID do post

**Exemplo de uso:**
```bash
GET /api/blog/posts/1
```

**Resposta de exemplo:**
```json
{
  "id": 1,
  "titulo": "Como as taxas de juros afetam o mercado imobiliário?",
  "conteudo": "As taxas de juros são um fator crucial...",
  "resumo": "Análise do impacto das taxas de juros no mercado de imóveis",
  "categoria": "mercado",
  "tags": ["financiamento", "juros"],
  "autor": "João Silva",
  "dataPublicacao": "2024-01-15T10:30:00Z",
  "ativo": true
}
```

**Status:** `200`, `404`, `500`
**Autenticação:** não precisa

---

### **POST /api/blog/posts**
- **O que faz:** Cria um novo post no blog.
- **Método:** `POST`
- **URL:** `/api/blog/posts`

**Body esperado (JSON):**
```json
{
  "titulo": "string (obrigatório)",
  "conteudo": "string (obrigatório)",
  "resumo": "string (obrigatório)",
  "categoria": "string (obrigatório)",
  "tags": "array (opcional)",
  "autor": "string (obrigatório)"
}
```

**Exemplo de uso:**
```bash
POST /api/blog/posts
Content-Type: application/json

{
  "titulo": "Novas tendências no mercado imobiliário em 2024",
  "conteudo": "O mercado imobiliário está passando por transformações...",
  "resumo": "Confira as principais tendências para 2024",
  "categoria": "mercado",
  "tags": ["tendências", "2024"],
  "autor": "Maria Souza"
}
```

**Resposta de exemplo:**
```json
{
  "id": 15,
  "titulo": "Novas tendências no mercado imobiliário em 2024",
  "conteudo": "O mercado imobiliário está passando por transformações...",
  "resumo": "Confira as principais tendências para 2024",
  "categoria": "mercado",
  "tags": ["tendências", "2024"],
  "autor": "Maria Souza",
  "dataPublicacao": "2024-09-13T14:25:00Z",
  "ativo": true
}
```

**Status:** `201`, `400`, `500`
**Autenticação:** precisa ser admin (token)

---

### **PUT /api/blog/posts/:id**
- **O que faz:** Atualiza um post já existente.
- **Método:** `PUT`
- **URL:** `/api/blog/posts/:id`

**Parâmetros:**
- `id` (obrigatório): ID do post

**Body esperado (JSON):**
```json
{
  "titulo": "string (opcional)",
  "conteudo": "string (opcional)",
  "resumo": "string (opcional)",
  "categoria": "string (opcional)",
  "tags": "array (opcional)",
  "autor": "string (opcional)",
  "ativo": "boolean (opcional)"
}
```

**Exemplo de uso:**
```bash
PUT /api/blog/posts/1
Content-Type: application/json

{
  "titulo": "Título atualizado",
  "conteudo": "Conteúdo atualizado...",
  "ativo": true
}
```

**Status:** `200`, `400`, `404`, `500`
**Autenticação:** precisa ser admin (token)

---

### **DELETE /api/blog/posts/:id**
- **O que faz:** Remove um post do blog.
- **Método:** `DELETE`
- **URL:** `/api/blog/posts/:id`

**Parâmetros:**
- `id` (obrigatório): ID do post

**Status:** `204`, `404`, `500`
**Autenticação:** precisa ser admin (token)

---

## Validação dos Dados

### **Validação de Post**
Arquivo: `back-end/src/middleware/blog-validation.js`

- **Título:** obrigatório, entre 10 e 200 caracteres, não pode ser só espaços
- **Conteúdo:** obrigatório, entre 100 e 10.000 caracteres, não pode ser só espaços
- **Resumo:** obrigatório, entre 50 e 500 caracteres, não pode ser só espaços

### **Categorias Permitidas**
- mercado
- dicas
- noticias
- financiamento
- documentacao
- geral

---

## Tratamento de Erros

- **400 - Bad Request:** dados inválidos, campos obrigatórios ausentes, formato incorreto
- **404 - Not Found:** post não encontrado, rota inexistente
- **500 - Internal Server Error:** erro inesperado, falha no banco, erro não tratado

**Exemplo de erro 400:**
```json
{
  "erro": "Dados inválidos",
  "detalhes": [
    "Campo 'titulo' é obrigatório",
    "Campo 'categoria' deve ser um dos valores permitidos"
  ]
}
```

**Exemplo de erro 404:**
```json
{
  "erro": "Post não encontrado",
  "detalhes": "Não foi possível encontrar um post com o ID fornecido"
}
```

**Exemplo de erro 500:**
```json
{
  "erro": "Erro interno do servidor",
  "detalhes": "Ocorreu um erro inesperado. Tente novamente mais tarde."
}
```

---

## Como Usar o Blog no Frontend

### **Acessando o Blog**
- No menu principal do site, clique em **Blog** ou acesse diretamente `/blog`.

### **Lendo um Post**
- Use os filtros de categoria ou tags, ou a busca para encontrar posts.
- Clique no título para abrir o post completo.
- Compartilhe o conteúdo se quiser!

### **Para Administradores**
- Faça login como admin e acesse `/admin/blog`.
- Clique em **Novo Post** para criar um artigo.
- Preencha os campos obrigatórios, selecione categoria e tags, e salve.

---

## Estrutura de Arquivos
```
back-end/src/
├── routes/
│   └── blog.js              # Rotas do blog
├── middleware/
│   └── blog-validation.js   # Validações
├── controllers/
│   └── blog-controller.js   # Lógica de negócio
└── models/
    └── blog-model.js        # Modelo de dados

front-end/src/
├── pages/
│   ├── Blog.js              # Página principal do blog
│   └── BlogPost.js          # Página individual do post
├── components/
│   ├── BlogPostItem.js      # Item individual de post
│   ├── BlogSearch.js        # Componente de busca
│   ├── BlogCategories.js    # Filtro de categorias
│   └── BlogTags.js          # Filtro de tags
└── services/
    └── blog-service.js      # Serviços de API
```

---

Se tiver dúvidas ou quiser contribuir, fale com o time de desenvolvimento!
