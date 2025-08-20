import "./globals.css";

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
