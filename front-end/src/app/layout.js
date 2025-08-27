import "@/styles/globals.css";
import '@/styles/login.css';
import "@/styles/home.css";
import 'antd/dist/reset.css';
import "@/styles/blog.css";

export const metadata = {
  title: "Imobiliária Bortone",
  description: "A sua imobiliária de confiança",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
