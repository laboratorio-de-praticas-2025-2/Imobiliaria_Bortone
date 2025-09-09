## Documentação do next.config.mjs

Este arquivo descreve as políticas de segurança e cabeçalhos HTTP configurados para o frontend Next.js.

Caminho: `front-end/next.config.mjs`

### Visão geral
- Define cabeçalhos HTTP de segurança para todas as rotas (`source: "/(.*)"`).
- Cria uma Content Security Policy (CSP) compatível com Google Maps, OpenStreetMap e Vercel Analytics/Speed Insights.
- Ajusta fontes de script em ambiente de desenvolvimento para permitir ferramentas de build.
- Configura caching agressivo para assets estáticos: `/_next/static`, `/images`, `/fonts` e `favicon`.
- Habilita formatos de imagem modernos (`AVIF`, `WebP`) no Next Image.

### Ambiente
- `isDev = process.env.NODE_ENV !== "production"`:
  - Em desenvolvimento, adiciona `'unsafe-eval'` em `script-src` (necessário para alguns bundlers/devtools).
  - Em produção, `'unsafe-eval'` é removido automaticamente.

### Cabeçalhos configurados
- `X-Frame-Options: DENY`
  - Impede que o site seja carregado dentro de iframes de terceiros (mitiga clickjacking).

- `X-Content-Type-Options: nosniff`
  - Evita que o navegador tente inferir tipos de conteúdo incorretos (mitiga ataques por MIME sniffing).

- `Referrer-Policy: strict-origin-when-cross-origin`
  - Envia o referer completo em navegação mesma origem e apenas a origem ao navegar para domínios externos (reduz vazamento de URL).

- `Permissions-Policy: geolocation=(self), camera=(), microphone=(self)`
  - Restringe APIs sensíveis do navegador.
  - Geolocalização e microfone permitidos apenas para o próprio site; câmera desabilitada.

### Content Security Policy (CSP)
Diretivas usadas (valores separados por ponto e vírgula):

- `default-src 'self'`
  - Padrão: somente a própria origem.

- `script-src ...`
  - Sempre: `'self' 'unsafe-inline' https://maps.googleapis.com https://maps.gstatic.com`
  - Dev: inclui `'unsafe-eval'` (removido em produção).
  - Observação: `'unsafe-inline'` é necessário para JSON-LD inline e alguns scripts gerados pelo Next.

- `style-src 'self' 'unsafe-inline'`
  - Permite estilos locais e inline (requerido por Ant Design e estilização do Next).

- `img-src 'self' data: blob: https://*.tile.openstreetmap.org https://maps.googleapis.com https://maps.gstatic.com`
  - Permite imagens locais, data/blob, tiles do OpenStreetMap e imagens do Google Maps.

- `font-src 'self' data:`
  - Permite fontes locais e embutidas via data URI.

- `connect-src 'self' https://maps.googleapis.com https://maps.gstatic.com https://vitals.vercel-insights.com`
  - Permite conexões de rede (fetch/XHR) para a própria API, Google Maps e endpoint de métricas da Vercel (Analytics/Speed Insights).

- `frame-ancestors 'none'`
  - Impede que a página seja embelezada por terceiros (complementa `X-Frame-Options`).

### Como adicionar um novo domínio externo
Se for integrar outro serviço (ex.: um CDN de imagens):
1. Identifique a categoria de recurso:
   - Scripts → `script-src`
   - Estilos → `style-src`
   - Imagens → `img-src`
   - Conexões (APIs/WebSockets) → `connect-src`
   - Fontes → `font-src`
2. Adicione o domínio na diretiva correta, por exemplo:
   - Para um CDN de imagens: acrescente `https://cdn.exemplo.com` em `img-src`.
3. Evite adicionar curingas amplos (`*`) ou protocolos não necessários.

### Cache-Control por rota (headers)
- `/_next/static/*`, `/images/*`, `/fonts/*`: `public, max-age=31536000, immutable` (cache por 1 ano em CDN/navegador, seguro para assets versionados).
- `/favicon.ico`: `public, max-age=604800` (1 semana).

### Imagens (Next Image)
- `images.formats = ["image/avif", "image/webp"]`: habilita formatos modernos, reduzindo peso e melhorando LCP.

### Boas práticas
- Produção sem `'unsafe-eval'` (já tratado pelo `isDev`).
- Evite `'unsafe-inline'` em `script-src` se migrar JSON-LD para nonce/hashes (mudança estrutural no `layout.js`).
- Restrinja a chave do Google Maps por referer no Google Cloud.
- Revise a CSP após integrar novos provedores (erro  CSP no console indica diretiva faltante).

### Troubleshooting rápido
- Erros de CSP no console: identifique a diretiva rejeitada e inclua o domínio na categoria correta.
- Mapas não carregam: verifique `script-src`, `connect-src` e restrição da chave por referer.
- Imagens do OpenStreetMap não aparecem: confira `img-src` para `https://*.tile.openstreetmap.org`.


