/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== "production";
const isNetlify = process.env.NETLIFY === "true";

const nextConfig = {
  // Configuração de imagens otimizada para Netlify
  images: {
    // Desativar otimização no Netlify para evitar loops
    unoptimized: isNetlify,
    
    // Formatos suportados
    formats: ["image/avif", "image/webp"],
    
    // Domínios permitidos (método legado, mais compatível)
    domains: [
      'imobiliaria-bortone.onrender.com',
      'localhost',
      '127.0.0.1'
    ],
    
    // Padrões remotos (método moderno)
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
        protocol: 'https',
        hostname: '**.netlify.app'
      },
      {
        protocol: 'http',
        hostname: 'localhost'
      }
    ],
    
    // Configurações de tamanho
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Cache TTL mínimo
    minimumCacheTTL: 60,
    
    // Permitir SVG com cuidado
    dangerouslyAllowSVG: false
  },

  // Headers de segurança e cache
  async headers() {
    const scriptSrc = [
      "script-src 'self' 'unsafe-inline'",
      ...(isDev ? ["'unsafe-eval'"] : []),
    ].join(" ");

    return [
      // Headers gerais de segurança (menos restritivos para imagens)
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              scriptSrc,
              "style-src 'self' 'unsafe-inline'",
              // CSP mais permissivo para imagens
              "img-src 'self' data: blob: https: http:",
              "font-src 'self' data:",
              "connect-src 'self' https://imobiliaria-bortone.onrender.com https://*.onrender.com https://*.netlify.app wss: ws:",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
      
      // Headers específicos para otimizador de imagens Next.js
      {
        source: "/_next/image",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods", 
            value: "GET"
          },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      
      // Cache para imagens estáticas
      {
        source: "/images/:all*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
      
      // Cache para assets Next.js
      {
        source: "/_next/static/:all*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      
      // Cache para fontes
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

  // Configurações do webpack (se necessário)
  webpack: (config) => {
    // Configurações adicionais do webpack podem ir aqui
    return config;
  },

  // Configurações experimentais (se necessário)
  experimental: {
    // Recursos experimentais podem ser habilitados aqui
  },
};

export default nextConfig;
