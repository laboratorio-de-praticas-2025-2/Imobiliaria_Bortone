/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === "development" || process.env.NODE_ENV !== "production";
const isVercel = process.env.VERCEL === "1";

console.log("Next.js Config - NODE_ENV:", process.env.NODE_ENV);
console.log("Next.js Config - isDev:", isDev);
console.log("Next.js Config - isVercel:", isVercel);

const nextConfig = {
  // Configuração simplificada para resolver problemas de 404 e loops
  
  // Resolver problemas com Ant Design no Next.js 15
  transpilePackages: ['antd', '@ant-design/icons', '@ant-design/icons-svg'],
  
  // Configuração webpack para corrigir problemas de importação do Ant Design
  webpack: (config, { isServer }) => {
    // Resolver aliases para evitar problemas de módulos não encontrados
    config.resolve.alias = {
      ...config.resolve.alias,
      '@ant-design/icons-svg/es/asn': '@ant-design/icons-svg/lib/asn',
    };
    
    // Excluir imagens do Leaflet do processamento do Next.js Image
    config.module.rules.push({
      test: /node_modules\/leaflet\/dist\/images\/.+\.(png|jpg|jpeg|gif|svg)$/,
      type: 'asset/resource',
    });
    
    return config;
  },
  
  images: {
    // Otimização de imagens habilitada no Vercel (funciona melhor que no Netlify)
    unoptimized: isDev, // Só desabilita em desenvolvimento
    
    formats: ["image/avif", "image/webp"],
    
    // Usar domains para Cloudinary e outros CDNs
    domains: [
      'imobiliaria-bortone.onrender.com',
      'localhost',
      '127.0.0.1',
      'res.cloudinary.com'
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
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com'
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
          // CSP com suporte ao Vercel Live e desenvolvimento
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://*.vercel.live",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https: http: res.cloudinary.com *.cloudinary.com",
              "font-src 'self' data:",
              "connect-src 'self' https: http: ws: wss: http://localhost:* http://127.0.0.1:* https://vercel.live https://*.vercel.live wss://vercel.live wss://*.vercel.live",
              "frame-src 'self' https://vercel.live https://*.vercel.live",
              "frame-ancestors 'self' https://vercel.live https://*.vercel.live",
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