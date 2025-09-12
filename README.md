# 🏠 Imobiliária Bortone

A Imobiliária Bortone é uma plataforma digital desenvolvida para conectar pessoas interessados em alugar ou comprar imóveis.
O objetivo é oferecer uma experiência completa: da busca inicial ao agendamento de visitas, passando por recomendações personalizadas e gestão via painel administrativo (CMS).


> Projeto acadêmico desenvolvido pelas turmas da FATEC Registro para o Laboratório de Práticas 2025-2.

---

## ✨ Funcionalidades

- Busca simples e avançada com filtros (preço, localização, tipo).
- Vitrine com detalhes completos e imagens.
- Autenticação (login/cadastro) e gerenciamento via CMS.
- Agendamento de visitas e relatórios para gestores.
- Recomendações de imóveis por perfil e mapa interativo.
- Blog, FAQ, chat e simulador de financiamento/aluguel.

---

## 🧱 Arquitetura

- `back-end/`: API em Node.js/Express (regras e dados, MySQL/Sequelize).
- `front-end/`: Next.js (UI e lógica do cliente).
- `documentacao/`: documentação com MkDocs Material.
- `docker-compose.yml`: orquestração local (quando aplicável).

---

## 🛠️ Tecnologias Utilizadas

### 🎨 Design
![Figma](https://img.shields.io/badge/Figma-0D1117?style=for-the-badge&logo=figma)&nbsp;

### 💻 Frontend
![Next.js](https://img.shields.io/badge/Next.js-0D1117?style=for-the-badge&logo=next.js)&nbsp;
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-0D1117?style=for-the-badge&logo=tailwindcss)&nbsp;
![Axios](https://img.shields.io/badge/Axios-0D1117?style=for-the-badge&logo=axios)&nbsp;

### 🔧 Backend
![Node.js](https://img.shields.io/badge/Node.js-0D1117?style=for-the-badge&logo=node.js)&nbsp;
![Express.js](https://img.shields.io/badge/Express.js-0D1117?style=for-the-badge&logo=express)&nbsp;
![MySQL](https://img.shields.io/badge/MySQL-0D1117?style=for-the-badge&logo=mysql)&nbsp;
![Sequelize](https://img.shields.io/badge/Sequelize-0D1117?style=for-the-badge&logo=sequelize)&nbsp;
![JWT](https://img.shields.io/badge/JWT-0D1117?style=for-the-badge&logo=jsonwebtokens)&nbsp;

### 🚀 DevOps / Infra
![Docker](https://img.shields.io/badge/Docker-0D1117?style=for-the-badge&logo=docker)&nbsp;
![Vercel](https://img.shields.io/badge/Vercel-0D1117?style=for-the-badge&logo=vercel)&nbsp;
![Render](https://img.shields.io/badge/Render-0D1117?style=for-the-badge&logo=render)&nbsp;
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-0D1117?style=for-the-badge&logo=githubactions)&nbsp;
![Debian](https://img.shields.io/badge/Debian-0D1117?style=for-the-badge&logo=debian)&nbsp;

---

## 📦 Requisitos

- Node.js LTS e npm
- MySQL 8+
- Docker e Docker Compose (opcional)

---

## ▶️ Como Executar

### 1) Backend

```bash
cd back-end
npm install
npm run dev
```

### 2) Frontend

```bash
cd front-end
npm install
npm run dev
```

### 3) Via Docker (opcional)

```bash
docker compose up -d --build
```

---

## 🔐 Variáveis de Ambiente (exemplos)

Crie um arquivo `.env` nas pastas do `back-end/` e `front-end/` conforme necessário. Não versione segredos.

Backend (exemplo):

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=senha
DB_NAME=imobiliaria
JWT_SECRET=troque-este-valor
```

---

## ✅ Qualidade

- Commits pequenos e objetivos, em português, modo imperativo.
- Rodar linter e testes localmente antes de abrir PR.
- Seguir as regras em `documentacao/docs/RegrasGerais.md`.

---

## 🧪 Testes

Backend:

```bash
cd back-end
npm test
```

---

## 📚 Documentação

- Documentação local (MkDocs):

```bash
cd documentacao
mkdocs serve
# abra http://127.0.0.1:8000
```

Guias principais:

- [Algoritmo de Recomendação](documentacao/docs/AlgoritmoDeRecomendacao.md)
- [Manual de Tags](documentacao/docs/ManualdeTags.md)
- [Regras Gerais](documentacao/docs/RegrasGerais.md)

---

## 🔗 Links

- Figma: <a href="https://www.figma.com/design/w1ARo0t9N2womJ0ffCi4Wt/Laborat%C3%B3rio-de-Pratica---UX?node-id=0-1&t=41vb1y7A3luaibf8-1" target="_blank" rel="noreferrer">protótipo</a>
- Site: <a href="https://imobiliaria-bortone.vercel.app/" target="_blank" rel="noreferrer">produção</a>

---

## 📝 Licença

Este projeto é distribuído sob a licença indicada no arquivo `LICENSE`.
