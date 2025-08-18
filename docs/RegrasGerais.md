## Estrutura de diretórios

```bash
/projeto-imobiliario
│
├── backend/                # API em Express.js (regra de negócio e dados)
│   ├── src/
│   │   ├── config/          # Configurações globais (ex: conexão MySQL, variáveis de ambiente)
│   │   ├── models/          # Definição dos modelos de dados (ex: Usuario, Imovel, Agendamento)
│   │   ├── services/        # Lógica de negócio (ex: regras para cadastro, login, agendamento)
│   │   ├── controllers/     # Controladores que recebem requisições e chamam os services
│   │   ├── routes/          # Definição das rotas da API (REST: /users, /imoveis, /agendamentos)
│   │   ├── middlewares/     # Autenticação, autorização, tratamento de erros, logs
│   │   ├── utils/           # Funções auxiliares (gerar token JWT, formatar datas, etc.)
│   │   ├── tests/           # Testes unitários e de integração do backend
│   │   └── app.js           # Configuração principal do Express (carrega rotas, middlewares, DB)
│   │
│   └── package.json         # Dependências e scripts do backend
│
├── frontend/               # Aplicação em Next.js (UI e lógica do cliente)
│   ├── public/              # Arquivos públicos (imagens, favicon, fontes estáticas)
│   ├── src/
│   │   ├── pages/           # Rotas de navegação do Next.js
│   │   │   ├── index.js        # Página inicial (carrossel, header, vitrine)
│   │   │   ├── imoveis/        # Listagem e detalhe de imóveis
│   │   │   ├── auth/           # Páginas de login e cadastro
│   │   │   ├── agendamentos/   # Páginas para visualizar/criar agendamentos
│   │   │   └── admin/          # CMS (usuários, imóveis, anúncios, blog)
│   │   │
│   │   ├── components/      # Componentes reutilizáveis (botões, cards, header, footer)
│   │   ├── layouts/         # Estruturas de layout (layout padrão, layout admin)
│   │   ├── hooks/           # Hooks customizados (ex: useAuth, useFetch)
│   │   ├── context/         # Context API (ex: contexto de autenticação, carrinho, etc.)
│   │   ├── services/        # Comunicação com backend (APIs de imóveis, usuários, agendamentos)
│   │   ├── utils/           # Funções auxiliares do front (formatação, validação)
│   │   ├── styles/          # Estilos globais e módulos CSS/Tailwind
│   │   ├── constants/       # Constantes usadas em várias partes (rotas, configs)
│   │   └── tests/           # Testes de UI e integração do frontend
│   │
│   └── package.json         # Dependências e scripts do frontend
│
├── docker-compose.yml       # Se for usar Docker para rodar backend, frontend e banco
├── .env                     # Variáveis de ambiente (não versionar)
└── README.md                # Documentação do projeto
```

## Explicação rápida de cada parte

### Backend (Express.js)

- config/ → guarda configuração do banco (MySQL), variáveis de ambiente.
- models/ → define tabelas/entidades (Imóvel, Usuário, Agendamento).
- services/ → lógica do negócio (validação, cálculos, regras de agendamento).
- controllers/ → recebem as requisições e repassam para os services.
- routes/ → define os endpoints (/users, /imoveis, etc).
- middlewares/ → autenticação JWT, logs, tratamento de erros.
- utils/ → funções utilitárias (gerar tokens, helpers).
- tests/ → testes do backend (unitários/integrados).

### Frontend (Next.js)

- pages/ → define rotas (home, login, imóveis, agendamento, admin).
- components/ → botões, cards de imóvel, formulários reutilizáveis.
- layouts/ → estrutura de página (menu + conteúdo).
- hooks/ → lógica de React reaproveitável (ex: useAuth).
- context/ → estado global com Context API (ex: autenticação).
- services/ → funções que chamam a API do backend (fetch/axios).
- utils/ → máscaras, validações, helpers.
- styles/ → CSS global ou Tailwind.
- constants/ → strings fixas, rotas e configs.

# Regras de commit

### Branchs

1. main ───► branch de produção (release estável)
2. develop ─► branch de desenvolvimento (integração do que está pronto)
3. feature/* ─► branches de funcionalidades novas
4. hotfix/* ─► branches de correções urgentes na produção

## Detalhamento

1. main
Sempre estável.
Só recebe merges de develop (quando for lançar versão) ou hotfix/*.
Protegida (não se faz commit direto).
2.  develop
Base para integração de features.
Time inteiro cria branches a partir dela.
Antes de ir para main, tudo é testado aqui.
3. feature/*
Criada a partir de develop.
Uma para cada tarefa/funcionalidade.
Exemplo:
feature/auth-login
feature/imoveis-listagem
feature/agendamento-visita 
    
    Quando termina: merge via Pull Request → develop.
    
4. hotfix/*
Criada a partir de main.
Usada só para corrigir bugs urgentes em produção.
Depois de corrigir: merge em main e também em develop (para não perder).

## Regras para commits

### Estrutura da Mensagem

> <tipo>(escopo opcional): descrição curta no imperativo
[corpo opcional explicando o que mudou e por quê][rodapé opcional para issues ou mudanças críticas]
> 

### Tipos Aceitos

- feat: → nova funcionalidade
- fix: → correção de bug
- docs: → mudanças somente em documentação
- style: → ajustes de formatação, espaçamento, ponto e vírgula (sem alterar lógica)
- refactor: → refatoração de código sem mudar o comportamento
- test: → inclusão ou alteração de testes
- chore: → mudanças em dependências, build, configs, scripts
- perf: → melhorias de performance
- ci: → mudanças em pipelines/integração contínua

### Exemplos de Commits Válidos

- feat(auth): adiciona fluxo de login com JWT
- fix(agendamento): corrige cálculo de datas disponíveis
- docs: adiciona instruções de setup do backend
- refactor(frontend): organiza componentes de formulário
- test(backend): cria testes unitários para service de imóveis
- chore: atualiza dependências do Express para última versão
- perf(consulta): melhora tempo de resposta no filtro de imóveis

### Regras de Escrita

1. Sempre em português.
2. Frases curtas (máx. ~72 caracteres).
3. Usar modo imperativo:
✅ adiciona, corrige, remove, implementa
❌ adicionando, corrigido, adicionado
4. Não versionar código quebrado.
5. Commits pequenos e específicos → evite “commitão” genérico.
6. Se o commit fechar uma issue:
feat(agenda): implementa cancelamento de visitas
Fecha #32

### Branches e Commits

1. Nome de branch deve seguir o tipo e contexto: feature/frontend-cadastro-usuario
fix/backend-agendamento-null
2. Não usar “WIP” em commits. Se for rascunho, abrir Pull Request em modo rascunho.