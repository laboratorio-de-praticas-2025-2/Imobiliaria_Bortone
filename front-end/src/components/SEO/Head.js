import Head from "next/head";

export default function CustomHead({ 
  title = "Imobiliária Bortone",
  description = "A sua imobiliária de confiança",
  keywords = "imobiliária, imóveis, comprar casa, alugar apartamento, corretor, financiamento imobiliário",
  url = "https://imobiliaria-bortone.vercel.app",
  image = "https://imobiliaria-bortone.vercel.app/og-image.jpg",
  type = "website"
}) {
  const fullTitle = title === "Imobiliária Bortone" ? title : `${title} | Imobiliária Bortone`;
  
  return (
    <Head>
      {/* Meta Tags SEO Básico */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="FatecRegistro-20252" />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="Imobiliária Bortone" />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </Head>
  );
}
