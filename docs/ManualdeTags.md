## Guia de Meta Tags e Integrações — Imobiliária Bortone (Next.js App Router)

Este manual documenta as meta tags, links e integrações de análise e desempenho implementadas neste projeto, onde estão definidas e como estender por página.

### Localização das configurações
- `front-end/src/app/layout.js`: metas globais (SEO, OG/Twitter, robots, Apple Web App, viewport, performance, JSON-LD) e integrações globais do Vercel (`@vercel/analytics` e `@vercel/speed-insights`).

## Metadados globais (layout.js)
- **title**: Imobiliária Bortone
- **description**: A sua imobiliária de confiança
- **applicationName**: Imobiliária Bortone
- **generator**: Next.js
- **keywords**: imobiliária, imóveis, comprar casa, alugar apartamento, corretor, financiamento imobiliário
- **authors / creator / publisher**: Imobiliária Bortone
- **icons.icon**: `/favicon.ico`

### Robots
- **index / follow**: habilitados
- **googleBot**: `maxVideoPreview: -1`, `maxImagePreview: "large"`, `maxSnippet: -1`

### Open Graph (OG)
- **title / description / siteName**: Imobiliária Bortone
- **locale**: `pt_BR`
- **type**: `website`
- Para imagem de compartilhamento, adicionar `openGraph.images` (recomendado 1200x630, JPEG/PNG otimizada), ex.: `/images/slide1.png`.

### Twitter Card
- **card**: `summary_large_image`
- **title / description**: alinhados ao site
- Para imagem, adicionar `twitter.images` (mesma referência do OG).

## Mobile e PWA
- **appleWebApp**: `capable: true`, `statusBarStyle: "default"`, `title: "Imobiliária Bortone"`
- **formatDetection**: `telephone: true`, `email: false`, `address: false`

### Viewport (export viewport)
- `width: device-width`, `initialScale: 1`, `maximumScale: 5`
- `themeColor: #0b2a4a`, `colorScheme: light`, `viewportFit: cover`

## Performance
- **dns-prefetch / preconnect**: `https://maps.googleapis.com`, `https://maps.gstatic.com`
- **preload de fontes locais**:
  - `/fonts/GlacialIndifference-Regular.otf`
  - `/fonts/GlacialIndifference-Bold.otf`
  - `/fonts/LEMONMILK-Medium.otf`
- **Google Maps**: script carregado `beforeInteractive` com `libraries=places` via `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.

## Dados estruturados (JSON-LD)
Incluído como `Organization` no `<head>`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Imobiliária Bortone",
  "url": "/",
  "logo": "/favicon.ico"
}
</script>
```

## Integrações Vercel
- **Analytics (global)**: em `layout.js`.

```javascript
import { Analytics } from "@vercel/analytics/react";

// No body global
<Analytics />
```

- **Speed Insights (global)**: em `layout.js`.

```javascript
import { SpeedInsights } from "@vercel/speed-insights/next";

// No body global
<SpeedInsights />
```

## Como sobrescrever por página (exemplo)
Crie `export const metadata` na página alvo (ex.: `front-end/src/app/blog/[id]/page.js`):

```javascript
export const metadata = {
  title: "Título do post | Imobiliária Bortone",
  description: "Resumo do post",
  openGraph: {
    title: "Título do post | Imobiliária Bortone",
    description: "Resumo do post",
    type: "article",
    images: [
      { url: "/images/slide1.png", width: 1200, height: 630, alt: "Capa" }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Título do post | Imobiliária Bortone",
    description: "Resumo do post",
    images: ["/images/slide1.png"]
  }
};
```

## Boas práticas rápidas
- **OG/Twitter**: use a mesma imagem otimizada (1200x630). Evite SVG para cartões.
- **Canonical**: adicione quando houver URLs duplicadas/parâmetros.
- **Noindex**: use `robots: { index: false, follow: false }` em áreas privadas (ex.: admin).
- **Preload de fontes**: somente para as usadas no first paint; prefira WOFF2 quando disponível.
- **Acessibilidade**: mantenha `<html lang="pt-br">` e verifique contraste de cores.

## Checklist de verificação
- SEO: título, descrição, keywords, OG/Twitter definidos
- Mobile: viewport, theme-color, Apple Web App
- Performance: preconnect/dns-prefetch, preload de fontes necessárias
- Estruturado: JSON-LD Organization
- Métricas: Analytics global, Speed Insights global

## O que cada configuração faz
- **title/description**: título e resumo exibidos no navegador e buscadores.
- **keywords**: lista de palavras-chave; sinal fraco para SEO atual, útil como metadado.
- **applicationName/generator/authors/creator/publisher**: metadados informativos para user agents.
- **icons**: define o favicon padrão do site.
- **robots**: controla indexação/seguimento por buscadores; `googleBot` ajusta limites de preview/snippet.
- **openGraph**: aparência ao compartilhar (Facebook/WhatsApp/LinkedIn); `images` ideal 1200x630.
- **twitter**: cartões no X/Twitter; `summary_large_image` mostra imagem grande.
- **appleWebApp**: habilita comportamento tipo app no iOS (status bar e título).
- **formatDetection**: ativa detecção de telefone clicável em iOS.
- **viewport**: define escala e `themeColor` (cor da UI em mobile) e `viewportFit` (safe areas).
- **dns-prefetch/preconnect**: antecipa resolução e conexão a hosts externos, reduzindo latência.
- **preload de fontes**: prioriza download de fontes críticas evitando FOIT/FOUT.
- **JSON-LD Organization**: indica a entidade dona do site para buscadores.
- **@vercel/analytics**: métricas de uso/rota em produção (privacidade-friendly, zero-config na Vercel).
- **@vercel/speed-insights**: RUM de performance (global para todas as rotas, sem duplicar em páginas).


