/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== "production";
const nextConfig = {
    images: {
        formats: ["image/avif", "image/webp"],
    },
    async headers() {
        const scriptSrc = [
            "script-src 'self' 'unsafe-inline'",
            ...(isDev ? ["'unsafe-eval'"] : []),
            "https://maps.googleapis.com",
            "https://maps.gstatic.com",
        ].join(" ");

        return [
          // Segurança padrão em todas as rotas
          {
            source: "/(.*)",
            headers: [
              { key: "X-Frame-Options", value: "DENY" },
              { key: "X-Content-Type-Options", value: "nosniff" },
              { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
              { key: "Permissions-Policy", value: "geolocation=(self), camera=(), microphone=(self)" },
              {
                key: "Content-Security-Policy",
                value: [
                  "default-src 'self'",
                  scriptSrc,
                  "style-src 'self' 'unsafe-inline'",
                  "img-src 'self' data: blob: https://*.tile.openstreetmap.org https://maps.googleapis.com https://maps.gstatic.com",
                  "font-src 'self' data:",
                  "connect-src 'self' https://maps.googleapis.com https://maps.gstatic.com https://vitals.vercel-insights.com",
                  "frame-ancestors 'none'",
                ].join("; "),
              },
            ],
          },
          // Cache agressivo para fontes estáticas
          {
            source: "/fonts/:all*",
            headers: [
              { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
            ],
          },
          // Cache agressivo para imagens públicas
          {
            source: "/images/:all*",
            headers: [
              { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
            ],
          },
          {
            source: "/favicon.ico",
            headers: [
              { key: "Cache-Control", value: "public, max-age=604800" },
            ],
          },
          // Cache para assets do Next (geralmente já vem otimizado pela Vercel/Next)
          {
            source: "/_next/static/:all*",
            headers: [
              { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
            ],
          },
        ];
      },
};

export default nextConfig;
