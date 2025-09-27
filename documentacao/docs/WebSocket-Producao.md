# Configuração WebSocket em Produção

## Problema Identificado

Erro: `WebSocket connection to 'wss://imobiliaria-bortone.onrender.com/' failed: WebSocket is closed before the connection is established.`

## Possíveis Causas e Soluções

### 1. Configuração de CORS no Backend

O backend precisa permitir conexões WebSocket da origem do frontend:

```javascript
// back-end/src/config/websocket.js
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001", 
  "https://imobiliaria-bortone.vercel.app", // ✅ Adicionar URL do Vercel
  "https://seu-dominio-frontend.com" // ✅ Adicionar outros domínios
];
```

### 2. Variáveis de Ambiente

Configurar corretamente a URL da API no frontend:

**Para Vercel (Variables de Ambiente):**
```
NEXT_PUBLIC_API_URL=https://imobiliaria-bortone.onrender.com
```

**Para Render (Environment Variables):**
```
NEXT_PUBLIC_API_URL=https://imobiliaria-bortone.onrender.com
```

### 3. Configuração do Servidor HTTP

Verificar se o servidor está configurado para aceitar upgrade de HTTP para WebSocket:

```javascript
// back-end/src/app.js
const server = http.createServer(app);
initWebSocket(server); // ✅ Correto

// NÃO usar apenas:
// app.listen(PORT) // ❌ Não suporta WebSocket upgrade
```

### 4. Headers de Upgrade

O servidor precisa responder adequadamente ao upgrade request:

```javascript
// back-end/src/config/websocket.js
const wss = new WebSocketServer({ 
  server, // ✅ Usar servidor HTTP
  // Outras configurações...
});
```

### 5. Timeout de Conexão

Aumentar timeout para conexões lentas em produção:

```javascript
// Adicionar timeout no cliente
const connectTimeout = setTimeout(() => {
  if (socket.readyState === WebSocket.CONNECTING) {
    socket.close();
    console.error("Timeout na conexão WebSocket");
  }
}, 10000); // 10 segundos
```

## URLs Corretas por Ambiente

| Ambiente | Frontend URL | Backend URL | WebSocket URL |
|----------|-------------|-------------|---------------|
| Local | http://localhost:3000 | http://localhost:4000 | ws://localhost:4000 |
| Vercel + Render | https://app.vercel.app | https://api.onrender.com | wss://api.onrender.com |
| Render (Fullstack) | https://app.onrender.com | https://app.onrender.com | wss://app.onrender.com |

## Debugging

Para debugar problemas de WebSocket:

1. **Verificar logs do browser**:
   ```javascript
   console.log("🔌 Tentando conectar:", wsUrl);
   ```

2. **Verificar logs do servidor**:
   ```javascript
   console.log("WebSocket connection attempt from:", req.headers.origin);
   ```

3. **Testar com ferramentas**:
   - Browser DevTools > Network > WS
   - `wscat -c wss://sua-url.com`

## Checklist de Deploy

- [ ] Variável `NEXT_PUBLIC_API_URL` configurada
- [ ] CORS configurado para aceitar origem do frontend
- [ ] Servidor HTTP (não apenas Express app) iniciado
- [ ] WebSocketServer anexado ao servidor HTTP
- [ ] Headers de upgrade permitidos
- [ ] Logs de debug ativados

## Solução Implementada

1. ✅ Melhorada detecção automática de ambiente
2. ✅ Adicionado logs detalhados de debug
3. ✅ Implementado backoff exponencial para reconexão
4. ✅ Tratamento robusto de erros
5. ✅ Configuração flexível de URLs por ambiente