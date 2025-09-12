# Guia de Meta Tags e Integrações

Este manual documenta as meta tags, links e integrações de análise e desempenho implementadas neste projeto, onde estão definidas e como estender por página.

--- 

## Localização das configurações

### 1. `src/app/layout.js`  
Define **metadados globais padrão** (SEO, OG/Twitter, robots, Apple Web App, viewport, JSON-LD) e integrações globais do Vercel (`@vercel/analytics`, `@vercel/speed-insights`).

### 2. `src/components/SEO`  
Componente que gera **meta tags dinâmicas** para páginas que exigem títulos, descrições e imagens personalizadas (ex.: imóveis, posts de blog, landing pages).

- Recebe props (`title`, `description`, `image`, etc.).
- Renderiza `<Head>` com OG, Twitter e meta tags customizadas.
- Substitui ou complementa os valores definidos em `layout.js`.

--- 

## Metadados globais (`layout.js`)

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
- **images**: definir `/images/og-default.png` (1200x630, JPEG/PNG otimizado).

### Twitter Card
- **card**: `summary_large_image`  
- **title / description**: iguais ao site  
- **images**: mesmo arquivo do OG

---

## Mobile e PWA

- **appleWebApp**:  
  - `capable: true`  
  - `statusBarStyle: "default"`  
  - `title: "Imobiliária Bortone"`  
- **formatDetection**:  
  - `telephone: true`  
  - `email: false`  
  - `address: false`  

### Viewport
- `width=device-width`  
- `initialScale=1`  
- `maximumScale=5`  
- `themeColor: #0b2a4a`  
- `colorScheme: light`  
- `viewportFit: cover`

---

## Performance

- **dns-prefetch / preconnect**:  
  - `https://maps.googleapis.com`  
  - `https://maps.gstatic.com`  

- **preload de fontes locais**:  
  - `/fonts/GlacialIndifference-Regular.otf`  
  - `/fonts/GlacialIndifference-Bold.otf`  
  - `/fonts/LEMONMILK-Medium.otf`  

> ⚠️ Use preload apenas em fontes críticas para o **first paint**. Prefira WOFF2 quando disponível.

---

## Dados estruturados (JSON-LD)

Incluído em `layout.js` como `Organization`:

```js
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

--- 

## Integrações Vercel


- Analytics (global)

```js
import { Analytics } from "@vercel/analytics/react";
<Analytics />
```

- Speed Insights (global)

```js
import { SpeedInsights } from "@vercel/speed-insights/next";
<SpeedInsights />
```

> Ambos devem ser chamados apenas em layout.js.

--- 

## Metadados dinâmicos com SEO (src/components/SEO)

Use o componente SEO quando precisar sobrescrever/gerar metatags em tempo de execução:

```js
import SEO from "@/components/SEO";

export default function ImovelPage({ params }) {
  const imovel = getImovel(params.id);

  return (
    <>
      <SEO
        title={`${imovel.titulo} | Imobiliária Bortone`}
        description={imovel.descricao}
        image={imovel.capa || "/images/og-default.png"}
      />
      <ConteudoImovel data={imovel} />
    </>
  );
}
```

### O componente deve renderizar:

- <­title> e <­meta name="description">

- OG (og:title, og:description, og:image)

- Twitter (twitter:title, twitter:description, twitter:image)

--- 

## Metadados estáticos por página

Quando a página não precisar de dados dinâmicos, use export const metadata:

```js
export const metadata = {
  title: "Sobre nós | Imobiliária Bortone",
  description: "Conheça a história da Imobiliária Bortone",
  openGraph: {
    title: "Sobre nós | Imobiliária Bortone",
    description: "Conheça a história da Imobiliária Bortone",
    type: "article",
    images: [{ url: "/images/og-sobre.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/og-sobre.png"],
  },
};
```

---

## Boas práticas

- **OG/Twitter**: use sempre a mesma imagem otimizada (1200x630, JPEG/PNG). Evite SVG para cartões.

- **Canonical**: adicione quando houver duplicação de URLs ou parâmetros.

- **Noindex**: em páginas privadas/admin, configure robots: { index: false, follow: false }.


- **Acessibilidade**: Mantenha <­html lang="pt-br"> e verifique contraste de cores adequado.

---

## O que cada configuração faz
- **title/description**: título e resumo exibidos no navegador e buscadores. 

- **keywords**: lista de palavras-chave; sinal fraco para SEO atual, útil como metadado. 

- **applicationName/generator/authors/creator/publisher**: metadados informativos para user agents. 

- **icons**: define o favicon padrão do site. 

- **robots**: controla indexação/seguimento por buscadores; googleBot ajusta limites de preview/snippet. 

- **openGraph**: aparência ao compartilhar (Facebook/WhatsApp/LinkedIn); images ideal 1200x630. 

- **twitter**: cartões no X/Twitter; summary_large_image mostra imagem grande. 

- **appleWebApp**: habilita comportamento tipo app no iOS (status bar e título). 

- **formatDetection**: ativa detecção de telefone clicável em iOS. 

- **viewport**: define escala e themeColor (cor da UI em mobile) e viewportFit (safe areas). 

- **dns-prefetch/preconnect**: antecipa resolução e conexão a hosts externos, reduzindo latência. 

- **preload de fontes**: prioriza download de fontes críticas evitando FOIT/FOUT. 

- **JSON-LD Organization**: indica a entidade dona do site para buscadores. 

- **@vercel/analytics**: métricas de uso/rota em produção (privacidade-friendly, zero-config na Vercel). 

- **@vercel/speed-insights**: RUM de performance (global para todas as rotas, sem duplicar em páginas).