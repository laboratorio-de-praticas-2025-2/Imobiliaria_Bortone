/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== "production";
const isNetlify = process.env.NETLIFY === "true";

const nextConfig = {
  // Remover output export para usar com Netlify Functions
  
  images: {
    formats: ["image/avif", "image/webp"],
    domains: [
      'imobiliaria-bortone.onrender.com',
      'localhost',
      '127.0.0.1'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imobiliaria-bortone.onrender.com',
        port: '',
        pathname: '/images/**'
      },
      {
        protocol: 'https',
        hostname: '**.onrender.com',
        port: '',
        pathname: '/images/**'
      },
      {
        protocol: 'https',
        hostname: '**.netlify.app'
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000'
      }
    ],
    unoptimized: isNetlify, // Disable optimization on Netlify to prevent issues
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
    // Remove contentSecurityPolicy from here - it conflicts with headers
  },
  async headers() {
    const scriptSrc = [
      "script-src 'self' 'unsafe-inline'",
      ...(isDev ? ["'unsafe-eval'"] : []),
    ].join(" ");

    return [
      // Segurança padrão em todas as rotas
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value:
              "geolocation=(self), camera=(), microphone=(self), fullscreen=(self), payment=(), usb=(), accelerometer=(), gyroscope=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              scriptSrc,
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https: http: https://*.tile.openstreetmap.org https://unpkg.com https://imobiliaria-bortone.onrender.com https://*.onrender.com https://*.netlify.app",
              "font-src 'self' data:",
              "connect-src *",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
      // Cache agressivo para fontes estáticas
      {
        source: "/fonts/:all*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Cache agressivo para imagens públicas
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
          {
            key: "Cross-Origin-Resource-Policy",
            value: "cross-origin",
          },
        ],
      },
      // Headers para otimizador de imagens Next.js
      {
        source: "/_next/image",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "cross-origin",
          },
        ],
      },
      {
        source: "/favicon.ico",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800" },
        ],
      },
      // Cache para assets do Next
      {
        source: "/_next/static/:all*",
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
