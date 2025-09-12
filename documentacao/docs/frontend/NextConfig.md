# Documentação do `next.config.mjs`

Arquivo de configuração do **Next.js** para segurança, caching e cabeçalhos HTTP do frontend.

**Caminho:** `front-end/next.config.mjs`

---

## Visão geral
- Define **cabeçalhos de segurança** para todas as rotas (`source: "/(.*)"`).
- Implementa **Content Security Policy (CSP)** compatível com OpenStreetMap e Vercel Analytics/Speed Insights.
- Ajusta políticas de script em **ambiente de desenvolvimento** para suportar ferramentas de build/debug.
- Configura **caching agressivo** para assets estáticos (`/_next/static`, `/images`, `/fonts`, `favicon`).
- Habilita **formatos de imagem modernos** (`AVIF`, `WebP`) no Next Image.

---

## Ambiente
- `isDev = process.env.NODE_ENV !== "production"`
  - **Dev:** inclui `'unsafe-eval'` em `script-src` (necessário para bundlers/devtools).
  - **Prod:** `'unsafe-eval'` é removido automaticamente.

---

## Cabeçalhos configurados
- `X-Frame-Options: DENY`  
  Bloqueia carregamento em iframes de terceiros (mitiga clickjacking).

- `X-Content-Type-Options: nosniff`  
  Impede MIME sniffing.

- `Referrer-Policy: strict-origin-when-cross-origin`  
  Evita vazamento de URLs completas em navegação cross-site.

- `Permissions-Policy: geolocation=(self), camera=(), microphone=(self), fullscreen=(self), payment=(), usb=(), accelerometer=(), gyroscope=()`  
  Restringe acesso a APIs sensíveis do navegador.

- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`  
  Força HTTPS (habilitar apenas se o domínio já estiver 100% em HTTPS).

- `Cross-Origin-Resource-Policy: same-origin`  
  Bloqueia uso indevido de recursos por outros domínios.

- `Cross-Origin-Opener-Policy: same-origin`  
  Isola contexto de navegação contra ataques cross-origin.

---

## Content Security Policy (CSP)
Diretivas aplicadas (valores separados por `;`):

- `default-src 'self'`  
  Origem padrão restrita.

- `script-src 'self' 'unsafe-inline'`  
  - **Dev:** inclui `'unsafe-eval'`.  
  - **Prod:** `'unsafe-eval'` removido.  
  - ⚠ `'unsafe-inline'` é necessário para JSON-LD inline e scripts gerados pelo Next (revisar no futuro para nonce/hash).

- `style-src 'self' 'unsafe-inline'`  
  Necessário para Ant Design e estilos inline.

- `img-src 'self' data: blob: https://*.tile.openstreetmap.org`  
  Permite imagens locais, data/blob e tiles do OpenStreetMap.

- `font-src 'self' data:`  
  Fontes locais e embutidas via data URI.

- `connect-src 'self' https://vitals.vercel-insights.com`  
  Libera chamadas XHR/fetch para API própria e métricas da Vercel.

- `frame-ancestors 'none'`  
  Impede embelezamento por terceiros (complementa `X-Frame-Options`).

---

## Como adicionar um novo domínio externo
1. Identifique a categoria:
   - Scripts → `script-src`
   - Estilos → `style-src`
   - Imagens → `img-src`
   - Conexões (API/WebSocket) → `connect-src`
   - Fontes → `font-src`
2. Inclua o domínio na diretiva correta.  
   Ex.: CDN de imagens → `img-src ... https://cdn.exemplo.com`
3. Evite curingas (`*`) e protocolos desnecessários.

---

## Cache-Control por rota
- `/_next/static/*`, `/images/*`, `/fonts/*`:  
  `public, max-age=31536000, immutable` (1 ano, seguro para assets versionados).

- `/favicon.ico`:  
  `public, max-age=604800` (1 semana).

---

## Imagens (Next Image)
- `images.formats = ["image/avif", "image/webp"]`  
  Navegadores que não suportam caem em fallback automático para JPEG/PNG.

---

## Boas práticas
- **Prod:** sem `'unsafe-eval'`.  
- Evitar `'unsafe-inline'` em `script-src` (migrar para nonce/hash futuramente).  
- Revisar CSP sempre que integrar novos provedores.  
- Validar cache e cabeçalhos via DevTools ou `curl -I`.

---

## Troubleshooting
- **Erro CSP no console:** conferir diretiva rejeitada e adicionar domínio correto.  
- **Tiles OSM quebrados:** validar `img-src` para `https://*.tile.openstreetmap.org`.  
- **Cabeçalhos faltando:** validar resposta via `curl -I` ou DevTools > Network.

---

## Checklist para Produção
- [ ] HTTPS habilitado e `Strict-Transport-Security` ativo.  
- [ ] `unsafe-eval` ausente.  
- [ ] `unsafe-inline` revisado (migrar para nonce/hash quando possível).  
- [ ] Todos os domínios externos adicionados ao CSP.  
- [ ] Cache-Control validado (`curl -I`).  
- [ ] Testes feitos em múltiplos navegadores.
