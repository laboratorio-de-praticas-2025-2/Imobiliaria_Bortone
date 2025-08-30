import "@/styles/globals.css";
import '@/styles/login.css';
import '@/styles/map.css';
import "@/styles/home.css";
import "@/styles/imoveis.css";
import "@/styles/blog.css";
import "@/styles/faq.css";
import 'antd/dist/reset.css';
import Script from "next/script";

export const metadata = {
  title: "Imobiliária Bortone",
  description: "A sua imobiliária de confiança",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <head>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
      </head>
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
