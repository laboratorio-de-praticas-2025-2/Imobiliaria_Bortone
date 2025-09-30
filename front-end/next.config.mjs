/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== "production";
const isNetlify = process.env.NETLIFY === "true";

const nextConfig = {
  // Configuração simplificada para resolver problemas de 404 e loops
  
  images: {
    // CHAVE: Desabilitar otimização no Netlify para evitar loops infinitos
    unoptimized: true, // Força desabilitação para evitar problemas
    
    formats: ["image/avif", "image/webp"],
    
    // Usar domains (método mais simples e compatível)
    domains: [
      'imobiliaria-bortone.onrender.com',
      'localhost',
      '127.0.0.1'
    ],
    
    // Padrões remotos simplificados
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imobiliaria-bortone.onrender.com'
      },
      {
        protocol: 'https',
        hostname: '**.onrender.com'
      },
      {
        protocol: 'http',
        hostname: 'localhost'
      }
    ],
    
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false
  },
  async headers() {
    return [
      // Headers simplificados para evitar conflitos com imagens
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // CSP mais permissivo para imagens
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'" + (isDev ? " 'unsafe-eval'" : ""),
              "style-src 'self' 'unsafe-inline'",
              // Permitir todas as origens HTTPS para imagens (resolve 404s)
              "img-src 'self' data: blob: https: http:",
              "font-src 'self' data:",
              "connect-src 'self' https:",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
      // Cache apenas para assets estáticos (sem conflitos)
      {
        source: "/_next/static/:all*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/fonts/:all*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
