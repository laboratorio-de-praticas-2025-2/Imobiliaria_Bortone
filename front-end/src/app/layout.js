// app/layout.js
import "@/styles/globals.css";
import "@/styles/login.css";
import "@/styles/map.css";
import "@/styles/home.css";
import "@/styles/simulacao.css";
import "@/styles/imoveis.css";
import "@/styles/blog.css";
import "@/styles/faq.css";
import "antd/dist/reset.css";
import ChatLauncherClient from "@/components/chat/chatLauncherClient";
import "@/styles/cms.css";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";




export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <head>
        {/* Meta Tags Tradicionais */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#0b2a4a" />
        <meta name="color-scheme" content="light" />
        <meta name="format-detection" content="telephone=yes" />
        
        {/* Meta Tags SEO Básico */}
        <title>Imobiliária Bortone</title>
        <meta name="description" content="A sua imobiliária de confiança" />
        <meta name="keywords" content="imobiliária, imóveis, comprar casa, alugar apartamento, corretor, financiamento imobiliário" />
        <meta name="author" content="Imobiliária Bortone" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="application-name" content="Imobiliária Bortone" />
        <meta name="generator" content="Next.js" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Imobiliária Bortone" />
        <meta property="og:description" content="A sua imobiliária de confiança" />
        <meta property="og:site_name" content="Imobiliária Bortone" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:url" content="https://imobiliaria-bortone.vercel.app" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Imobiliária Bortone" />
        <meta name="twitter:description" content="A sua imobiliária de confiança" />
        
        {/* Apple Web App Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Imobiliária Bortone" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        
        {/* DNS Prefetch & Preconnect para desempenho */}
        <link rel="dns-prefetch" href="//maps.googleapis.com" />
        <link rel="dns-prefetch" href="//maps.gstatic.com" />
        <link rel="preconnect" href="https://maps.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://maps.gstatic.com" crossOrigin="anonymous" />

        {/* Preload de fontes críticas (local) */}
        <link
          rel="preload"
          as="font"
          type="font/otf"
          href="/fonts/GlacialIndifference-Regular.otf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="font"
          type="font/otf"
          href="/fonts/GlacialIndifference-Bold.otf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="font"
          type="font/otf"
          href="/fonts/LEMONMILK-Medium.otf"
          crossOrigin="anonymous"
        />

        {/* Structured Data (JSON-LD) básico para organização */}
        <Script id="ld-json-org" type="application/ld+json" strategy="afterInteractive">{`
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Imobiliária Bortone",
            "url": "https://imobiliaria-bortone.vercel.app",
            "logo": "https://imobiliaria-bortone.vercel.app/favicon.ico"
          }
        `}</Script>
      </head>
      <body className="antialiased">
        {children}
        {/* Client wrapper que controla abrir/fechar */}
        <ChatLauncherClient />
        {/* Analytics Vercel */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
