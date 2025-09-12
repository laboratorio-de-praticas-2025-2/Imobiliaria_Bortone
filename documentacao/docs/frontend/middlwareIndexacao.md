# Middleware: Bloqueio de Indexação - `/admin`
 
 Este documento detalha a configuração do middleware responsável por impedir que motores de busca indexem qualquer rota do diretório /admin do projeto Imobiliária Bortone.

Caminho: `src/middleware.js`

---

## Objetivo

- Evitar que páginas administrativas sejam indexadas.

- Centralizar a aplicação do `X-Robots-Tag` para todas as subrotas de `/admin`.

- Garantir compatibilidade universal para motores de busca.

---

## Fluxo do Middleware

```text
┌─────────────┐
│ Requisição  │
│ HTTP /admin │
└─────┬───────┘
      │
      ▼
┌───────────────┐
│ Middleware    │
│ verifica URL  │
└─────┬─────────┘
      │ startsWith("/admin") ?
      ├───► Sim ─► adiciona header "X-Robots-Tag: noindex, nofollow"
      │
      └───► Não ─► passa requisição normalmente
      │
      ▼
┌─────────────┐
│ Response    │
│ HTTP        │
└─────────────┘
```

---

## Testes

### Teste no PowerShell (Windows)

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/admin/cms-banner" -Method Head | Select-Object -ExpandProperty Headers
```

#### Resposta esperada

```yaml
x-robots-tag: noindex, nofollow
X-Frame-Options: DENY
...
Cache-Control: no-store, must-revalidate

```

- `x-robots-tag` garante que a página não será indexada.

- `Cache-Control: no-store` impede caching permanente.
 
### Teste com curl (Linux/Git Bash/WSL)

```bash
curl -I http://localhost:3000/admin/cms-usuarios
```

#### Exemplo de saída:

```yaml
HTTP/1.1 200 OK
x-robots-tag: noindex, nofollow
X-Frame-Options: DENY
Content-Security-Policy: ...
```

### Teste no navegador

1. Abra DevTools (F12) → aba Network.

2. Acesse uma rota de `/admin`.

3. Clique na requisição → Headers.

4. Confira `x-robots-tag: noindex, nofollow`.

---

## Boas práticas

- Sempre aplicar middleware em diretórios administrativos.

- Revisar novas rotas privadas e incluí-las no `matcher` se necessário.

- Middleware garante bloqueio mesmo se `metadata` não estiver configurada.

- Evite incluir diretórios públicos (`/public`, `/images`) para não bloquear indexação.

--- 

## Exemplos de Retorno

| Rota                   | x-robots-tag      | Cache-Control             | Observação              |
| ---------------------- | ----------------- | ------------------------- | ----------------------- |
| `/admin/cms-banner`    | noindex, nofollow | no-store, must-revalidate | Bloqueio correto        |
| `/admin/cms-usuarios`  | noindex, nofollow | no-store, must-revalidate | Bloqueio correto        |
| `/admin/configuracoes` | noindex, nofollow | no-store, must-revalidate | Bloqueio correto        |
| `/home` (não-admin)    | (não definido)    | normal                    | Sem bloqueio, indexável |
