# Regras Gerais do projeto
Este documento estabelece as diretrizes e padrões a serem seguidos no projeto Laboratório de Práticas 2025/2 - Fatec Registro, visando consistência, organização e qualidade do código.

## Estrutura de diretórios

```bash
/imobiliaria_bortone
│
├── backend/                 # API em Express.js (regras de negócio e dados)
│   ├── src/
│   │   ├── config/          # Configurações globais (conexão MySQL, variáveis de ambiente)
│   │   ├── models/          # Modelos de dados (ex.: usuario.js, imovel.js)
│   │   ├── services/        # Lógica de negócio (ex.: usuarioService.js, imovelService.js)
│   │   ├── controllers/     # Controladores (recebem requisições → services)
│   │   ├── routes/          # Rotas da API (REST: /users, /imoveis, /agendamentos)
│   │   ├── middlewares/     # Autenticação, autorização, tratamento de erros, logs
│   │   ├── utils/           # Funções auxiliares (JWT, formatação de datas, etc.)
│   │   ├── tests/           # Testes unitários e de integração
│   │   └── app.js           # Configuração principal do Express
│   │
│   ├── .env                 # Variáveis de ambiente (não versionar)
│   └── package.json         # Dependências e scripts do backend
│
├── frontend/                # Aplicação em Next.js (UI e lógica do cliente)
│   ├── public/              # Arquivos estáticos (imagens, favicon, fontes)
│   ├── src/
│   │   ├── pages/           # Rotas do Next.js
│   │   │   ├── index.js         # Página inicial (carrossel, header, vitrine)
│   │   │   ├── imoveis/         # Listagem e detalhes de imóveis
│   │   │   ├── auth/            # Login e cadastro
│   │   │   ├── agendamentos/    # Agendamentos (visualizar/criar)
│   │   │   └── admin/           # CMS (usuários, imóveis, anúncios, blog)
│   │   │
│   │   ├── components/      # Componentes reutilizáveis (botões, cards, header, footer)
│   │   ├── layouts/         # Estruturas de layout (padrão, admin)
│   │   ├── hooks/           # Hooks customizados (useAuth, useFetch, etc.)
│   │   ├── context/         # Context API (autenticação, carrinho, etc.)
│   │   ├── services/        # Comunicação com backend (axios/fetch)
│   │   ├── utils/           # Funções auxiliares (validação, formatação, helpers)
│   │   ├── styles/          # Estilos globais (CSS/Tailwind)
│   │   ├── constants/       # Constantes globais (rotas, configs)
│   │   └── tests/           # Testes de UI e integração
│   │
│   └── package.json         # Dependências e scripts do frontend
│
├── documentacao/            # Documentação do projeto
│   ├── docs/                # Páginas em Markdown (regras, guias, APIs, etc.)
│   ├── utils/               # Imagens, ícones e assets de documentação
│   └── mkdocs.yml           # Configuração do MkDocs
│
├── docker-compose.yml       # Orquestração com Docker (backend, frontend, banco de dados)
└── README.md                # Documentação principal (raiz do projeto)

```

--- 

## Fluxo de Desenvolvimento

### Branches

- main → Produção (release estável)
  - Sempre estável.
  - Recebe merges apenas de develop (versões) ou hotfix/*.
  - Protegida contra commits diretos.


- develop → Desenvolvimento
  - Base para integração de novas funcionalidades.
  - Todas as feature/* devem ser criadas a partir dela.
  - Testes obrigatórios antes de mergear em main.

- feature/* → Novas funcionalidades
  - Criadas a partir de develop.
  - Ex.:
    - feature/auth-login
    - feature/imoveis-listagem
  - Finalização via Pull Request para develop.

- hotfix/* → Correções urgentes em produção
  - Criadas a partir de main.
  - também deve ser mergeada em develop.

---

## Regras de Commits

```csharp
<tipo>(escopo opicional): descrição curta no imperativo
[corpo opcional explicando o que mudou e por quê]
[rodapé opcional: issues relacionadas, breaking changes]
```

### Tipos Aceitos

- **feat** → nova funcionalidade

- **fix** → correção de bug

- **docs** → documentação

- **style** → formatação/código (sem alteração de lógica)

- **refactor** → refatoração sem mudar comportamento

- **test** → inclusão/ajuste de testes

- **chore** → dependências, build, configs

- **perf** → melhorias de performance

- **ci** → mudanças em pipelines/CI

### Exemplos

- feat(auth): adiciona fluxo de login com JWT

- fix(agendamento): corrige cálculo de datas disponíveis

- docs: adiciona guia de setup do backend

- refactor(frontend): reorganiza componentes de formulário

- test(backend): cria testes unitários para service de imóveis

- chore: atualiza dependências do Express

- perf(consulta): otimiza filtro de imóveis

### Boas Práticas

- Sempre em português.

- Mensagens curtas (≤72 caracteres).

- Usar modo imperativo:

  - ✅ adiciona, corrige, remove

  - ❌ adicionando, corrigido

- Nunca versionar código quebrado.

- Commits pequenos e específicos (evitar "commitão").

- Se fechar uma issue:

```makefile
feat(agenda): implementa cancelamento de visitas 
Closes #32
```


### Branch Naming

- feature/frontend-cadastro-usuario

- fix/backend-agendamento-null

- Não usar "WIP" em commits (usar Pull Request em rascunho).

---

## Padrões de Documentação

Para garantir que a documentação seja clara e útil, toda a documentação deve ser escrita em Markdown simples, de forma estruturada e profissional, mantida em `documentacao/docs` e publicada via MkDocs.

## 1. Documentação de Código (Inline)

- Funções e classes devem ter JSDoc quando necessário.

Exemplo:

```js
/**
 * Converte valor monetário BRL para centavos.
 * @param {string} valorBRL Ex.: "R$ 1.234,56"
 * @returns {number} Valor em centavos
 */
```

## 2. Documentação de API (em Markdown)

- Criar páginas em `documentacao/docs/api/` por domínio (ex.: `imoveis.md`, `agendamentos.md`).
- Para cada endpoint, documentar em uma subseção com o seguinte modelo:

```md
### GET /api/imoveis

Descrição: Lista imóveis com filtros opcionais.

Método: GET

URL: `/api/imoveis`

Parâmetros:
- query `pagina` (opcional): número da página
- query `cidade` (opcional): nome da cidade

Exemplo de Requisição:

(```js
GET /api/imoveis?pagina=1&cidade=São Paulo
```) <- Remover os parenteses 

Exemplo de Resposta (200):

(```json
{ "total": 120, "itens": [ { "id": 1, "titulo": "Apartamento" } ] }
```) <- Remover os parenteses

Códigos de Status: 200, 400, 404, 500

Autenticação: não requer
```

## 3. Documentação de Componentes (Frontend)

- Para componentes reutilizáveis em `front-end/src/components/`, criar uma página por conjunto quando necessário em `documentacao/docs/frontend/components.md`.
- Em cada componente, incluir: Visão geral, Props (nome, tipo, obrigatório, descrição) e um exemplo mínimo de uso.

## 4. Guias e Tutoriais

- Local: `documentacao/docs/`.
- Estrutura padrão:
  - Introdução (propósito)
  - Pré-requisitos
  - Passo a passo (com `##` e `###`)
  - Exemplos e imagens (em `documentacao/docs/assets/`)
- Referenciar arquivos, diretórios e funções com crase: 
  - ```md 
      `back-end/src/app.js`. 
    ```

## 5. Estilo e Organização no MkDocs

- Títulos iniciam com `#` (um por página) 
- Subseções com `##`/`###`.
- Usar listas para sequências, tabelas quando houver múltiplos campos por item.
- Navegação configurada em `documentacao/mkdocs.yml`; manter nomes curtos e descritivos.

---

📌 **Regra geral**: a documentação deve ser atualizada imediatamente após qualquer alteração relevante no sistema.


**Em caso de dúvida, siga o padrão existente e mantenha a documentação atualizada após cada mudança relevante.**