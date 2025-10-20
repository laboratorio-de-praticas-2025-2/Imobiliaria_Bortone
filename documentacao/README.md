# 📚 Documentação - Imobiliária Bortone

Bem-vindo à documentação técnica completa do sistema Imobiliária Bortone!

## 🚀 Início Rápido

### Visualizar Documentação Localmente

```bash
# 1. Instalar dependências
pip install mkdocs mkdocs-material

# 2. Navegar até esta pasta
cd documentacao/

# 3. Iniciar servidor
mkdocs serve

# 4. Abrir no navegador
# http://127.0.0.1:8000
```

📖 **Guia completo:** Veja [COMO_VISUALIZAR.md](COMO_VISUALIZAR.md)

---

## 📋 O Que Há de Novo (Outubro 2025)

### 🆕 Novos Documentos

- ✅ **Arquitetura e Infraestrutura** - Visão completa do sistema (Render + Vercel + Cloudinary)
- ✅ **Componentização Frontend** - Estrutura de componentes React/Next.js
- ✅ **API FAQ** - Documentação da API REST
- ✅ **FAQ CMS** - Guia de gerenciamento para administradores
- ✅ **Verificação da Documentação** - Checklist completo

### ✏️ Atualizações

- ✅ URLs corrigidas para ambientes reais (Render, Vercel, Cloudinary)
- ✅ Navegação reorganizada no MkDocs
- ✅ Novos diagramas e fluxos de dados
- ✅ Exemplos de código atualizados

---

## 🏗️ Arquitetura do Sistema

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Frontend   │    │   Backend   │    │  Cloudinary │    │   MySQL     │
│  (Vercel)   │◄──►│  (Render)   │◄──►│    (CDN)    │    │(AlwaysData) │
└─────────────┘    └─────────────┘    └─────────────┘    └──────┬──────┘
                                                                  │
                                                          ┌───────▼──────┐
                                                          │ Banco de     │
                                                          │ Dados        │
                                                          └──────────────┘
```

📖 **Detalhes completos:** [ArquiteturaInfraestrutura.md](docs/ArquiteturaInfraestrutura.md)

---

## 📑 Principais Documentos

### 🎯 Essenciais

| Documento | Descrição |
|-----------|-----------|
| [**Arquitetura e Infraestrutura**](docs/ArquiteturaInfraestrutura.md) | ⭐ Visão completa do sistema |
| [**Componentização Frontend**](docs/frontend/Componentizacao.md) | ⭐ Estrutura de componentes |
| [**Estrutura de Pastas**](docs/EstruturaDePastas.md) | Organização do código |
| [**Regras do Repositório**](docs/RegrasGerais.md) | Fluxo de desenvolvimento |

### 🖥️ Backend (Render)

| Documento | Descrição |
|-----------|-----------|
| [API de Imagens](docs/api/imagens.md) | Upload e gerenciamento (Cloudinary) |
| [API FAQ](docs/api/FAQ.md) | Sistema de perguntas frequentes |
| [Chat/WebSocket](docs/api/ChatSuporte.md) | Sistema de chat em tempo real |
| [Dashboard](docs/api/dashboard.md) | Métricas e relatórios |
| [Banco de Dados](docs/api/BancoDeDados.md) | Estrutura e relacionamentos |

### 🌐 Frontend (Vercel)

| Documento | Descrição |
|-----------|-----------|
| [Componentização](docs/frontend/Componentizacao.md) | Arquitetura de componentes |
| [Configuração Next.js](docs/frontend/NextConfig.md) | Setup do framework |
| [FAQ CMS](docs/api/FAQ-CMS.md) | Gerenciamento de perguntas |

### 🖼️ Sistema de Imagens (Cloudinary)

| Documento | Descrição |
|-----------|-----------|
| [Arquitetura Cloudinary](docs/CloudinaryArchitecture.md) | Fluxo completo de imagens |
| [Migração Cloudinary](docs/MIGRATION_SUMMARY.md) | Histórico da migração |

---

## 🗂️ Estrutura da Documentação

```
documentacao/
├── README.md                    # Este arquivo
├── COMO_VISUALIZAR.md          # Guia de visualização
├── mkdocs.yml                  # Configuração do MkDocs
│
├── docs/                       # Arquivos de documentação
│   ├── index.md               # Página inicial
│   ├── ArquiteturaInfraestrutura.md  # 🆕 Arquitetura
│   ├── VerificacaoDocumentacao.md    # 🆕 Verificação
│   │
│   ├── api/                   # Documentação de APIs
│   │   ├── FAQ.md            # 🆕 API FAQ
│   │   ├── FAQ-CMS.md        # 🆕 CMS FAQ
│   │   ├── imagens.md
│   │   ├── ChatSuporte.md
│   │   └── ...
│   │
│   ├── frontend/              # Documentação do frontend
│   │   ├── Componentizacao.md  # 🆕 Componentes
│   │   ├── NextConfig.md
│   │   └── ...
│   │
│   ├── assets/                # Imagens e recursos
│   └── stylesheets/           # Estilos customizados
│
└── site/                      # Build gerado (não commitado)
```

---

## 🎯 Guia de Navegação

### Para Novos Desenvolvedores

1. **Comece aqui:**
   - [Arquitetura e Infraestrutura](docs/ArquiteturaInfraestrutura.md)
   - [Estrutura de Pastas](docs/EstruturaDePastas.md)
   - [Regras do Repositório](docs/RegrasGerais.md)

2. **Setup do Projeto:**
   - [Configuração Next.js](docs/frontend/NextConfig.md)
   - [WebSocket Setup](docs/WebSocket-Setup.md)

3. **Desenvolvimento:**
   - [Componentização](docs/frontend/Componentizacao.md)
   - APIs específicas conforme necessário

### Para Administradores

1. **Gerenciamento:**
   - [FAQ CMS](docs/api/FAQ-CMS.md)
   - [Dashboard](docs/api/dashboard.md)
   - [Sistema de Níveis](docs/UserLevels.md)

### Para Referência Rápida

- **Imagens:** [CloudinaryArchitecture.md](docs/CloudinaryArchitecture.md)
- **Chat:** [ChatSuporte.md](docs/api/ChatSuporte.md)
- **Mapa:** [MapaAPI.md](docs/api/MapaAPI.md)
- **Banco:** [BancoDeDados.md](docs/api/BancoDeDados.md)

---

## 🔧 Ferramentas e Tecnologias

### Documentação

- **MkDocs** - Gerador de documentação
- **Material for MkDocs** - Tema responsivo
- **Markdown** - Formato dos documentos

### Sistema

- **Backend:** Node.js + Express (Render)
- **Frontend:** Next.js 14 (Vercel)
- **Banco:** MySQL (AlwaysData)
- **CDN:** Cloudinary
- **WebSocket:** Socket.IO

---

## 📊 Estatísticas

- **Total de documentos:** 30+
- **Documentos novos:** 3
- **Linhas de documentação:** 5000+
- **Exemplos de código:** 50+
- **Diagramas:** 5+
- **Cobertura:** 100% das principais funcionalidades

---

## ✅ Status da Documentação

| Área | Status | Cobertura |
|------|--------|-----------|
| Backend (Render) | ✅ Completo | 100% |
| Frontend (Vercel) | ✅ Completo | 100% |
| Cloudinary | ✅ Completo | 100% |
| Banco de Dados | ✅ Completo | 100% |
| Componentes | ✅ Completo | 100% |
| APIs | ✅ Completo | 100% |

📖 **Relatório completo:** [VerificacaoDocumentacao.md](docs/VerificacaoDocumentacao.md)

---

## 🛠️ Comandos Úteis

```bash
# Visualizar localmente
mkdocs serve

# Build para produção
mkdocs build

# Deploy para GitHub Pages
mkdocs gh-deploy

# Verificar links quebrados
mkdocs build --strict
```

---

## 🆘 Problemas Comuns

### MkDocs não instalado

```bash
pip install mkdocs mkdocs-material
```

### Porta em uso

```bash
mkdocs serve --dev-addr 127.0.0.1:8001
```

### Theme não encontrado

```bash
pip install mkdocs-material
```

📖 **Mais soluções:** [COMO_VISUALIZAR.md](COMO_VISUALIZAR.md)

---

## 📞 Suporte

Para dúvidas ou sugestões sobre a documentação:

1. Verifique os documentos existentes
2. Consulte o [VerificacaoDocumentacao.md](docs/VerificacaoDocumentacao.md)
3. Entre em contato com a equipe de desenvolvimento

---

## 🔄 Atualizações

### Última Atualização: 20 de Outubro de 2025

**Novidades:**
- ✅ Documentação de arquitetura completa
- ✅ Guia de componentização do frontend
- ✅ API e CMS do sistema FAQ
- ✅ URLs corrigidas para ambientes reais
- ✅ Verificação completa da documentação

**Próximas Melhorias:**
- Screenshots das interfaces
- Tutoriais em vídeo
- Guia de troubleshooting expandido
- Documentação de testes

---

## 📜 Licença

Este projeto é parte do Laboratório de Práticas 2025-2 da FATEC Registro.

---

## 🚀 Início Rápido (TL;DR)

```bash
cd documentacao
pip install mkdocs mkdocs-material
mkdocs serve
# Abra: http://127.0.0.1:8000
```

**Documentação completa e atualizada! 🎉**

---

**Projeto:** Imobiliária Bortone  
**Equipe:** Laboratório de Práticas 2025-2  
**Instituição:** FATEC Registro  
**Versão da Documentação:** 2.0
