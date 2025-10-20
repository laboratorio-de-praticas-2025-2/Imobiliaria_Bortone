# 🚀 Como Visualizar a Documentação

## Opções de Visualização

### 1. 💻 Localmente com MkDocs (Recomendado)

#### Passo 1: Instalar MkDocs

```bash
# Python 3 deve estar instalado
pip install mkdocs mkdocs-material
```

#### Passo 2: Navegar até a pasta de documentação

```bash
cd documentacao/
```

#### Passo 3: Iniciar o servidor local

```bash
mkdocs serve
```

#### Passo 4: Acessar no navegador

```
http://127.0.0.1:8000
```

A documentação será carregada com:
- ✅ Navegação lateral completa
- ✅ Busca integrada
- ✅ Tema Material Design
- ✅ Syntax highlighting
- ✅ Hot reload (atualização automática ao editar)

---

### 2. 📄 Diretamente no GitHub

Acesse os arquivos Markdown diretamente no GitHub:

```
https://github.com/laboratorio-de-praticas-2025-2/Imobiliaria_Bortone/tree/main/documentacao/docs
```

**Documentos principais:**
- [Arquitetura e Infraestrutura](https://github.com/.../ArquiteturaInfraestrutura.md)
- [Componentização Frontend](https://github.com/.../frontend/Componentizacao.md)
- [API FAQ](https://github.com/.../api/FAQ.md)
- [FAQ CMS](https://github.com/.../api/FAQ-CMS.md)

---

### 3. 🌐 Deploy do MkDocs (Opcional)

Se quiser publicar a documentação online:

#### GitHub Pages

```bash
cd documentacao/
mkdocs gh-deploy
```

A documentação ficará disponível em:
```
https://laboratorio-de-praticas-2025-2.github.io/Imobiliaria_Bortone/
```

#### Vercel/Netlify

1. Criar novo projeto apontando para `/documentacao`
2. Build command: `mkdocs build`
3. Publish directory: `site`

---

## 📋 Documentos Criados/Atualizados Recentemente

### 🆕 Novos Documentos

1. **Arquitetura e Infraestrutura**
   - 📁 `docs/ArquiteturaInfraestrutura.md`
   - 📝 Arquitetura completa do sistema (Render + Vercel + Cloudinary)

2. **Componentização Frontend**
   - 📁 `docs/frontend/Componentizacao.md`
   - 📝 Estrutura de componentes e padrões de desenvolvimento

3. **API FAQ**
   - 📁 `docs/api/FAQ.md`
   - 📝 Documentação da API REST de perguntas frequentes

4. **FAQ - Gerenciamento CMS**
   - 📁 `docs/api/FAQ-CMS.md`
   - 📝 Guia completo de CRUD para administradores

5. **Verificação da Documentação**
   - 📁 `docs/VerificacaoDocumentacao.md`
   - 📝 Checklist completo da documentação

### ✏️ Documentos Atualizados

1. **Index**
   - 📁 `docs/index.md`
   - 📝 Adicionados novos links e reorganização

2. **MkDocs Config**
   - 📁 `mkdocs.yml`
   - 📝 Navegação atualizada com novos documentos

---

## 🗂️ Estrutura da Documentação

```
documentacao/
├── mkdocs.yml                          # Configuração principal
├── docs/
│   ├── index.md                        # Página inicial ✨
│   ├── ArquiteturaInfraestrutura.md   # 🆕 Arquitetura completa
│   ├── VerificacaoDocumentacao.md     # 🆕 Verificação
│   │
│   ├── api/
│   │   ├── FAQ.md                     # 🆕 API FAQ
│   │   ├── FAQ-CMS.md                 # 🆕 CMS FAQ
│   │   ├── imagens.md
│   │   ├── BancoDeDados.md
│   │   ├── ChatSuporte.md
│   │   └── ...
│   │
│   ├── frontend/
│   │   ├── Componentizacao.md         # 🆕 Componentes
│   │   ├── NextConfig.md
│   │   └── ...
│   │
│   ├── assets/                         # Imagens e recursos
│   └── stylesheets/                    # Estilos customizados
│
└── site/                               # Build (gerado automaticamente)
```

---

## 🔍 Como Encontrar Informações

### Por Tema

| Preciso de... | Veja... |
|---------------|---------|
| Visão geral do sistema | `index.md` |
| Arquitetura completa | `ArquiteturaInfraestrutura.md` |
| Como componentes funcionam | `frontend/Componentizacao.md` |
| Endpoints de API | `api/[nome-da-api].md` |
| Configuração do Next.js | `frontend/NextConfig.md` |
| Upload de imagens | `CloudinaryArchitecture.md` |
| Chat/WebSocket | `api/ChatSuporte.md` |

### Por Hospedagem

| Plataforma | Documentos Relacionados |
|------------|------------------------|
| **Render (Backend)** | `ArquiteturaInfraestrutura.md`, todas as APIs |
| **Vercel (Frontend)** | `ArquiteturaInfraestrutura.md`, `frontend/*` |
| **Cloudinary (Imagens)** | `CloudinaryArchitecture.md`, `MIGRATION_SUMMARY.md` |
| **AlwaysData (Banco)** | `api/BancoDeDados.md` |

---

## 💡 Dicas de Navegação

### No MkDocs Local

1. **Busca:** Use a barra de busca no topo (atalho: `/`)
2. **Navegação:** Menu lateral expansível
3. **Impressão:** Ctrl+P para imprimir documentos
4. **Mobile:** Interface responsiva para visualização em dispositivos móveis

### No GitHub

1. **Ctrl+K:** Busca rápida de arquivos
2. **T:** Navegar pela árvore de arquivos
3. **L:** Ir para uma linha específica
4. **.** (ponto): Abrir no editor web do GitHub

---

## 🛠️ Comandos Úteis do MkDocs

### Desenvolvimento

```bash
# Iniciar servidor local com reload automático
mkdocs serve

# Iniciar em porta específica
mkdocs serve --dev-addr 127.0.0.1:8001

# Modo verbose (debug)
mkdocs serve --verbose
```

### Build

```bash
# Gerar site estático
mkdocs build

# Gerar e verificar links
mkdocs build --strict

# Limpar build anterior
mkdocs build --clean
```

### Deploy

```bash
# Deploy para GitHub Pages
mkdocs gh-deploy

# Deploy com mensagem customizada
mkdocs gh-deploy -m "Atualização da documentação"
```

---

## 📱 Acesso Rápido - Links Principais

### Para Desenvolvedores

- [Arquitetura e Infraestrutura](./docs/ArquiteturaInfraestrutura.md) ⭐
- [Componentização Frontend](./docs/frontend/Componentizacao.md) ⭐
- [Estrutura de Pastas](./docs/EstruturaDePastas.md)
- [Regras do Repositório](./docs/RegrasGerais.md)

### Para Administradores

- [FAQ - Gerenciamento CMS](./docs/api/FAQ-CMS.md) ⭐
- [Dashboard](./docs/api/dashboard.md)
- [Sistema de Níveis](./docs/UserLevels.md)

### Para Referência Técnica

- [API de Imagens](./docs/api/imagens.md)
- [API FAQ](./docs/api/FAQ.md)
- [Chat/WebSocket](./docs/api/ChatSuporte.md)
- [Banco de Dados](./docs/api/BancoDeDados.md)

---

## ❓ Problemas Comuns

### MkDocs não encontrado

**Erro:** `mkdocs: command not found`

**Solução:**
```bash
pip install mkdocs mkdocs-material
# ou
pip3 install mkdocs mkdocs-material
```

### Porta 8000 em uso

**Erro:** `Address already in use`

**Solução:**
```bash
mkdocs serve --dev-addr 127.0.0.1:8001
```

### Theme não encontrado

**Erro:** `Config value: 'theme'. Error: Unrecognised theme name: 'material'`

**Solução:**
```bash
pip install mkdocs-material
```

---

## 📞 Suporte

Para dúvidas sobre a documentação:

1. **Verifique o documento de verificação:** `VerificacaoDocumentacao.md`
2. **Consulte o índice:** `index.md`
3. **Entre em contato:** Equipe de desenvolvimento

---

## ✅ Checklist de Validação

Antes de usar a documentação, verifique:

- [ ] MkDocs instalado (`mkdocs --version`)
- [ ] Material theme instalado
- [ ] Repositório clonado
- [ ] Navegou até pasta `/documentacao`
- [ ] Servidor iniciado com `mkdocs serve`
- [ ] Navegador aberto em `http://127.0.0.1:8000`

---

**Documentação pronta para uso! 🎉**

Para começar:
```bash
cd documentacao && mkdocs serve
```

Depois acesse: http://127.0.0.1:8000
