import { useEffect } from 'react';

export const useSEO = ({
  title = "Imobiliária Bortone",
  description = "A sua imobiliária de confiança",
  keywords = "imobiliária, imóveis, comprar casa, alugar apartamento, corretor, financiamento imobiliário",
  url = "https://imobiliaria-bortone.vercel.app",
  image = "https://imobiliaria-bortone.vercel.app/og-image.jpg",
  type = "website"
}) => {
  useEffect(() => {
    const fullTitle = title === "Imobiliária Bortone" ? title : `${title} | Imobiliária Bortone`;
    
    // Atualizar título
    document.title = fullTitle;
    
    // Função para atualizar meta tags
    const updateMetaTag = (selector, content) => {
      let meta = document.querySelector(selector);
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        // Criar meta tag se não existir
        meta = document.createElement('meta');
        if (selector.includes('property=')) {
          meta.setAttribute('property', selector.match(/property="([^"]+)"/)[1]);
        } else {
          meta.setAttribute('name', selector.match(/name="([^"]+)"/)[1]);
        }
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };
    
    // Atualizar meta tags básicas
    updateMetaTag('meta[name="description"]', description);
    updateMetaTag('meta[name="keywords"]', keywords);
    
    // Atualizar Open Graph
    updateMetaTag('meta[property="og:title"]', fullTitle);
    updateMetaTag('meta[property="og:description"]', description);
    updateMetaTag('meta[property="og:url"]', url);
    updateMetaTag('meta[property="og:type"]', type);
    if (image) {
      updateMetaTag('meta[property="og:image"]', image);
    }
    
    // Atualizar Twitter Cards
    updateMetaTag('meta[name="twitter:title"]', fullTitle);
    updateMetaTag('meta[name="twitter:description"]', description);
    if (image) {
      updateMetaTag('meta[name="twitter:image"]', image);
    }
    
  }, [title, description, keywords, url, image, type]);
};
