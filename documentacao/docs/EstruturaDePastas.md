# Estrutura de diretórios



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