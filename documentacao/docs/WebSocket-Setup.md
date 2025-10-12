# Como Rodar o WebSocket - Chat de Suporte

## Passo a Passo

### 1. Configurar Variáveis de Ambiente

Certifique-se de que o arquivo `.env` no backend contém:

```env
# Banco de dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=imobiliaria_bortone

# JWT
JWT_SECRET=sua_chave_secreta_jwt

# Servidor
PORT=8080
NODE_ENV=development
```

### 2. Rodar o Backend (com WebSocket)

```bash
# Ir para a pasta do backend
cd back-end

# Instalar dependências (se necessário)
npm install

# Rodar o servidor
npm start
# ou
npm run dev
```

**O WebSocket roda automaticamente junto com o servidor Express!**

### 3. Rodar o Frontend

```bash
# Em outro terminal, ir para a pasta do frontend
cd front-end

# Instalar dependências (se necessário)
npm install

# Rodar o frontend
npm run dev
```

### 4. Configurar Usuários no Banco

Execute o SQL para definir níveis:

```sql
-- Criar um usuário administrador
UPDATE usuario SET nivel = 0 WHERE email = 'admin@test.com';

-- Verificar usuários
SELECT id, nome, email, nivel FROM usuario;
```

### 5. Testar o Chat

1. **Abra 2 navegadores diferentes** (ou abas anônimas)
2. **Faça login em um com**: `admin@test.com` (será agente - nível 0)
3. **Faça login no outro com**: qualquer usuário comum (será usuário - nível 1)
4. **Abra o chat** em ambos
5. **Envie mensagens** e veja a comunicação funcionando

## URLs de Acesso

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **WebSocket**: ws://localhost:8080/ws (conecta automaticamente)

## Como Verificar se Está Funcionando

### Console do Backend
Você deve ver:
```
Servidor iniciado com sucesso na porta 8080! 🚀
✅ WebSocket conectado
📩 Mensagem recebida: {...}
```

### Console do Frontend (F12)
Você deve ver:
```
🔗 Conectando WebSocket: ws://localhost:8080/ws?token=...
✅ WebSocket conectado
📤 Enviando mensagem: {...}
📩 Mensagem recebida: {...}
```

## Comandos Úteis

```bash
# Backend
cd back-end
npm start          # Rodar em produção
npm run dev        # Rodar em desenvolvimento (com nodemon)

# Frontend  
cd front-end
npm run dev        # Rodar em desenvolvimento
npm run build      # Build para produção
npm start          # Rodar build de produção

# Banco de dados (se usando Docker)
docker-compose up  # Subir banco MySQL
```

## Solução de Problemas

### WebSocket não conecta
1. Verificar se backend está rodando na porta 8080
2. Verificar se não há firewall bloqueando
3. Verificar logs do console (F12)

### Mensagens não chegam
1. Verificar se usuário está logado
2. Verificar se token JWT é válido
3. Verificar logs do backend

### Interface não diferencia agente/usuário
1. Verificar se campo `nivel` está correto no banco
2. Verificar se login retorna o campo `nivel`
3. Verificar localStorage no navegador (F12 > Application > Local Storage)

## Estrutura de Funcionamento

```
Frontend (localhost:3000)
    ↕ WebSocket
Backend (localhost:8080/ws)
    ↕ MySQL
Banco de Dados (usuario.nivel)
```

O WebSocket já está **100% configurado e pronto para usar**! 🚀