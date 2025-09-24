# Imobiliária Bortone — Documentação

Bem-vindo à documentação completa do sistema Imobiliária Bortone. Este portal concentra todas as informações técnicas, guias de desenvolvimento e padrões do projeto.

> **Projeto Acadêmico** - Desenvolvido pelas turmas da FATEC Registro para o Laboratório de Práticas 2025-2.

---

## 🚀 Início Rápido

### Para Desenvolvedores
- 📋 [**Regras Gerais do Repositório**](RegrasGerais.md) - Fluxo de desenvolvimento, branches, commits e PRs
- 🏗️ [**Estrutura de Pastas**](EstruturaDePastas.md) - Organização do projeto e arquitetura
- 🔧 [**WebSocket Setup**](WebSocket-Setup.md) - Configuração do sistema de chat em tempo real

### Para Administradores
- 👥 [**Sistema de Níveis de Usuário**](UserLevels.md) - Gerenciamento de permissões no chat
- 🐛 [**Relatório de Correção de Bugs**](ChatSystemBugFixes.md) - Histórico de correções do sistema de chat

---

## 📚 Documentação por Área

### 🎨 Frontend (Next.js)
Documentação completa do frontend em Next.js, incluindo configurações, componentes e boas práticas.

- **[Configurações do Next.js](frontend/NextConfig.md)** - Setup e configuração do framework
- **[Manual de Tags](frontend/ManualdeTags.md)** - Convenções de marcação e componentes
- **[Middleware de Indexação](frontend/middlwareIndexacao.md)** - Sistema de middleware personalizado

### 🔧 Backend & APIs
Documentação técnica das APIs, serviços e funcionalidades do servidor.

#### Core APIs
- **[API de Imóveis](api/imoveis.md)** - Endpoints para gestão de propriedades
- **[API de Imagens](api/imagens.md)** - Upload e gerenciamento de imagens
- **[Dashboard](api/dashboard.md)** - Métricas e relatórios administrativos
- **[Banco de Dados](api/BancoDeDados.md)** - Estrutura e relacionamentos

#### Sistema de Mapa
Funcionalidades geográficas e de localização integradas ao Google Maps.

- **[API de Mapa](api/MapaAPI.md)** - Documentação completa das rotas
- **[Implementação da API](api/MapaImplementacao.md)** - Detalhes técnicos de implementação
- **[Resumo da Integração](api/MapaResumo.md)** - Visão geral e casos de uso

#### Sistema de Chat & Suporte
- **[Chat de Suporte](api/ChatSuporte.md)** - Documentação do sistema de atendimento
- **[WebSocket em Produção](WebSocket-Producao.md)** - Deploy e configuração para produção

#### Algoritmos Inteligentes
- **[Algoritmo de Recomendação](api/AlgoritmoDeRecomendacao.md)** - Sistema de sugestões personalizadas baseado em ML

---

## 🛠️ Configuração do Ambiente

### Executar a Documentação Localmente

1. **Instalar dependências do MkDocs:**
   ```bash
   pip install mkdocs mkdocs-material
   ```

2. **Navegar para a pasta de documentação:**
   ```bash
   cd documentacao/
   ```

3. **Executar o servidor local:**
   ```bash
   mkdocs serve
   ```

4. **Acessar no navegador:**
   ```
   http://127.0.0.1:8000
   ```

### Estrutura da Documentação

```
documentacao/
├── docs/                    # Arquivos Markdown
│   ├── api/                # Documentação das APIs
│   ├── frontend/           # Documentação do frontend
│   ├── assets/            # Recursos estáticos (imagens, ícones)
│   └── stylesheets/       # Estilos customizados
├── mkdocs.yml              # Configuração da navegação
└── README.md               # Guia inicial
```

---

## 🤝 Contribuindo

Encontrou algo desatualizado ou quer contribuir com a documentação?

1. Siga as [**Regras Gerais**](RegrasGerais.md) do repositório
2. Abra uma **issue** descrevendo o problema ou melhoria
3. Crie um **Pull Request** com suas alterações
4. Aguarde a revisão da equipe

---

## 📋 Status da Documentação

| Seção | Status | Última Atualização |
|-------|--------|-------------------|
| Regras Gerais | ✅ Completo | Set 2025 |
| APIs Backend | ✅ Completo | Set 2025 |
| Frontend Next.js | ✅ Completo | Set 2025 |
| Sistema de Chat | ✅ Completo | Set 2025 |
| Mapa/Geolocalização | ✅ Completo | Set 2025 |
| Algoritmos ML | ✅ Completo | Set 2025 |

---

*Para dúvidas específicas, consulte a documentação correspondente ou abra uma issue no repositório.*
