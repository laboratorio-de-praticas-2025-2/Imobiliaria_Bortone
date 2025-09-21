# Chat WebSocket - Implementação Real no Site

## 📋 Resumo da Implementação

Esta implementação integra o sistema de chat WebSocket ao site da Imobiliária Bortone, permitindo comunicação em tempo real entre usuários autenticados e suporte.

## � Funcionalidades Implementadas

### ✅ Chat Integrado ao Site
- **Botão de Chat**: Aparece automaticamente para usuários logados
- **Autenticação Obrigatória**: Apenas usuários autenticados podem usar o chat
- **Interface Responsiva**: Funciona em desktop e mobile
- **Status de Conexão**: Indicador visual de conexão WebSocket

### ✅ Sistema de Autenticação
- **JWT Integration**: Usa tokens do sistema de login existente
- **Níveis de Usuário**: 
  - `0`: Administrador/Agente de suporte
  - `1`: Cliente/Usuário normal
- **Validação Automática**: Verifica autenticação antes de permitir chat

### ✅ Comunicação em Tempo Real
- **WebSocket**: Conexão persistente para mensagens instantâneas
- **Broadcast**: Mensagens entre usuários e agentes
- **Histórico**: Mantém conversas durante a sessão
- **Heartbeat**: Detecta desconexões automáticas

## 🎯 Como Usar o Chat

### Para Usuários (Clientes)
1. **Faça Login**: Acesse `/login` e faça login com suas credenciais
2. **Navegue pelo Site**: O botão de chat aparecerá automaticamente no canto inferior direito
3. **Clique no Chat**: Botão azul com ícone de mensagem
4. **Converse**: Digite suas mensagens e receba respostas em tempo real

### Para Administradores/Agentes
1. **Login como Admin**: Use conta com nível 0 (administrador)
2. **Acesse o Chat**: Mesmo processo dos usuários
3. **Atenda Clientes**: Receba e responda mensagens de clientes conectados
4. **Gerencie Conversas**: Veja status de conexão e histórico

## 🔧 Configuração e Deploy

### Variáveis de Ambiente (Back-end)
```env
JWT_SECRET=seu_jwt_secret_aqui
NODE_ENV=production
# Configurações do banco de dados...
```

### URLs de Produção
- **Front-end**: Configurar URL de produção
- **Back-end**: Configurar URL da API
- **WebSocket**: Ajustar para domínio de produção

### CORS e Segurança
```javascript
const ALLOWED_ORIGINS = [
  "http://localhost:3000",        // Desenvolvimento
  "https://seudominio.com",       // Produção
  // Adicionar outras origens conforme necessário
];
```

## 📡 Estrutura de Comunicação

### Mensagens WebSocket

#### Conexão
```json
{
  "type": "connect",
  "token": "jwt_token",
  "nome": "Nome do Usuário"
}
```

#### Envio de Mensagem
```json
{
  "type": "message",
  "text": "Texto da mensagem",
  "fromUserId": 123
}
```

#### Recebimento de Mensagem
```json
{
  "type": "message",
  "fromUserId": 456,
  "text": "Texto recebido",
  "nome": "Nome do Remetente",
  "timestamp": "2025-09-21T..."
}
```

## 🔐 Sistema de Autenticação

### Dados Salvos no localStorage
- `authToken`: JWT token do usuário
- `userInfo`: Objeto com dados do usuário (id, nome, email, nivel)

### Níveis de Usuário
- `0`: Admin/Agente de suporte
- `1`: Cliente/Usuário normal

## 🐛 Solução de Problemas

### Chat não aparece
1. Verifique se o usuário está logado (localStorage tem `authToken`)
2. Confirme se não está em páginas excluídas (login, cadastro, bem-vindo)
3. Verifique console do navegador para erros

### Chat não conecta
1. Verifique se o back-end está rodando
2. Confirme se o token JWT é válido
3. Verifique variável `NEXT_PUBLIC_API_URL` no front-end

### Mensagens não aparecem
1. Verifique status de conexão no header do chat
2. Confirme se ambos usuários estão conectados
3. Verificar logs do servidor para erros WebSocket

### Erro de CORS
1. Adicione origem do front-end nas `ALLOWED_ORIGINS`
2. Configure corretamente as URLs de produção

## � Páginas Onde o Chat Aparece

### ✅ Chat Habilitado
- Página inicial (`/`)
- Listagem de imóveis (`/imoveis`)
- Detalhes de imóveis
- Mapa (`/mapa`)
- Blog (`/blog`)
- FAQ (`/faq`)
- Simulação (`/simulacao`)
- Área administrativa (para admins)
- Todas as outras páginas do site

### ❌ Chat Desabilitado
- Login (`/login`)
- Cadastro (`/cadastro`) 
- Bem-vindo (`/bem-vindo`)

## 👥 Criando Usuários para Teste

### Cliente Normal (nível 1)
```sql
INSERT INTO usuario (nome, email, senha, nivel) 
VALUES ('João Cliente', 'cliente@teste.com', 'senha_hash', 1);
```

### Administrador/Agente (nível 0)
```sql
INSERT INTO usuario (nome, email, senha, nivel) 
VALUES ('Maria Agente', 'agente@teste.com', 'senha_hash', 0);
```

**Nota**: Use o endpoint `/user/register` para criar usuários via API.

## 📝 Arquivos Principais Modificados

### Back-end
- `src/app.js` - Configuração do servidor HTTP + WebSocket
- `src/config/websocket.js` - Configuração do WebSocket Server
- `src/controllers/chatController.js` - Lógica de chat e autenticação
- `src/services/chatService.js` - Gerenciamento de conexões e mensagens

### Front-end
- `src/app/layout.js` - Carrega ChatWrapper globalmente
- `src/components/chat/chatWrapper.js` - Wrapper com validações
- `src/components/chat/chatLauncherClient.js` - Botão de abrir chat
- `src/components/chat/chatModal.js` - Interface principal do chat
- `src/components/chat/chatButton.js` - Botão flutuante
- `src/components/chat/chatMessage.js` - Componente de mensagem

## ✅ Status da Implementação

- ✅ **WebSocket configurado e funcionando**
- ✅ **Autenticação JWT integrada**
- ✅ **Chat aparece apenas para usuários logados**  
- ✅ **Interface responsiva implementada**
- ✅ **Comunicação em tempo real funcionando**
- ✅ **Tratamento de erros e reconexão**
- ✅ **Integrado ao layout principal do site**
- ✅ **Documentação completa criada**

## 🎉 Pronto para Uso!

O sistema de chat está **totalmente integrado ao site** e pronto para uso em produção. Usuários autenticados verão automaticamente o botão de chat e poderão se comunicar em tempo real com o suporte.