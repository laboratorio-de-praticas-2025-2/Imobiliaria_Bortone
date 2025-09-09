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


export const metadata = {
  title: "Imobiliária Bortone",
  description: "A sua imobiliária de confiança",
  applicationName: "Imobiliária Bortone",
  generator: "Next.js",
  keywords: [
    "imobiliária",
    "imóveis",
    "comprar casa",
    "alugar apartamento",
    "corretor",
    "financiamento imobiliário",
  ],
  authors: [{ name: "Imobiliária Bortone" }],
  creator: "Imobiliária Bortone",
  publisher: "Imobiliária Bortone",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      maxVideoPreview: -1,
      maxImagePreview: "large",
      maxSnippet: -1,
    },
  },
  openGraph: {
    title: "Imobiliária Bortone",
    description: "A sua imobiliária de confiança",
    siteName: "Imobiliária Bortone",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Imobiliária Bortone",
    description: "A sua imobiliária de confiança",
  },
  icons: {
    icon: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Imobiliária Bortone",
  },
  formatDetection: {
    telephone: true,
    email: false,
    address: false,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0b2a4a",
  colorScheme: "light",
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <head>
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
            "url": "/",
            "logo": "/favicon.ico"
          }
        `}</Script>

        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
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
